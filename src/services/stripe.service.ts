// src/services/UserService.ts
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import { stripe } from '@/stripe/stripe';
import { config } from '@/config/config';
import { Request, Response } from 'express';
import Stripe from 'stripe';
/* const userRepository = new UserRepository(); */

export class StripeService {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async getStripeCustomerByEmail(email: string) {
        const customer = await stripe.customers.list({ email });
        return customer.data[0];
    }

    async createStripeCustomer(email: string, name?: string) {
        let customer = await this.getStripeCustomerByEmail(email);
        if (customer) return customer;

        return stripe.customers.create({ email, name });
    }

    handleProcessWebhookCheckout = async (event: Stripe.Checkout.Session) => {
        const clientReferenceId = event.client_reference_id as string;
        const stripeSubscriptionId = event.subscription as string;
        const stripeCustomerId = event.customer as string; // id do cliente dentro do stripe
        const checkoutStatus = event.status;

        if (checkoutStatus !== 'complete') return;
        if (!clientReferenceId || !stripeSubscriptionId || !stripeCustomerId) {
            throw new Error(
                'clientReferenceId, stripeSubscriptionId and stripeCustomerId is required'
            );
        }

        const userExists = await this.userRepository.getById(clientReferenceId);

        if (!userExists) {
            throw new Error('user of clientReferenceId not found');
        }

        await this.userRepository.updateStripeFields(
            userExists.id,
            stripeCustomerId,
            stripeSubscriptionId
        );
    };

    handleProcessWebhookUpdatedSubscription = async (
        event: Stripe.Subscription
    ) => {
        const stripeCustomerId = event.customer as string; // id do cliente dentro do stripe
        const stripeSubscriptionId = event.id as string;
        const stripeSubscriptionStatus = event.status;

        const userExists = await this.userRepository.findByStripeCustomerId(
            stripeCustomerId
        );

        if (!userExists) {
            throw new Error('user of stripeCustomerId not found');
        }

        await this.userRepository.updateStripeFields(
            userExists.id,
            stripeCustomerId,
            stripeSubscriptionId,
            stripeSubscriptionStatus
        );
    };

    async createCheckoutSession(userId: string, userEmail: string) {
        try {
            let customer = await this.createStripeCustomer(userEmail);

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: config.stripe.proPriceID,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                client_reference_id: userId,
                customer: customer.id,
                success_url: 'http://localhost:3001/success.html',
                cancel_url: 'http://localhost:3001/cancel.html',
            });

            return {
                /*  stripeCustomerId: customer.id, */
                url: session.url,
            };
        } catch (error) {
            console.error(error);
        }
    }

    async webhook(req: Request, res: Response) {
        const secretKey = config.stripe.webhookSecret;
        if (!secretKey) {
            console.error('Stripe webhook secret key required');
            throw new Error('Stripe webhook secret key required');
        }

        const signature = req.headers['stripe-signature'] as string;

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                secretKey
            );
        } catch (err) {
            console.error(
                'Webhook signature verification failed:',
                err.message
            );
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    await this.handleProcessWebhookCheckout(event.data.object);
                    break;
                case 'customer.subscription.created':
                    break;
                case 'customer.subscription.updated':
                    await this.handleProcessWebhookUpdatedSubscription(
                        event.data.object
                    );
                    break;
                case 'customer.subscription.deleted':
                    await this.handleProcessWebhookUpdatedSubscription(
                        event.data.object
                    );
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            return res.status(200).send({ received: true });
        } catch (error) {
            console.error('Error processing webhook event:', error);
            throw error;
        }
    }
}
