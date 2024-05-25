import { config } from '@/config/config';
import { User } from '@/models/user.model';
import Stripe from 'stripe';

export const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2024-04-10',
});

//checkout do stripe bem sucedido deve guardar no banco o id do usuário e o id da assinatura desse usuário

export const createCheckoutSession = async (userId: string) => {
    try {
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
            success_url: 'http://localhost:3001/success.html',
            cancel_url: 'http://localhost:3001/cancel.html',
        });

        return {
            url: session.url,
        };
    } catch (error) {
        console.error(error);
    }
};
