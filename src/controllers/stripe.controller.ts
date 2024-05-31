import { config } from '@/config/config';
import { StripeService } from '@/services/stripe.service';
import { Request, Response } from 'express';
import Stripe from 'stripe';

class StripeController {
    constructor(private readonly stripeService: StripeService) {}
    async create(req: Request, res: Response) {
        const userId = req.params.userId;
        
        const checkout = await this.stripeService.createCheckoutSession(userId);
        return res.send(checkout);
    }

    async webhook(req: Request, res: Response) {
        const webhook = await this.stripeService.webhook(req, res);
        return webhook
    }
}

export default StripeController;
