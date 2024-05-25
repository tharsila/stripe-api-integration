import { createCheckoutSession } from '@/repositories/stripe.repository';
import { Request, Response } from 'express';

class StripeController {
    async create(req: Request, res: Response) {
        const userId = req.params.userId;

        const checkout = await createCheckoutSession(userId);
        console.log(checkout);

        return res.send(checkout);
    }
}

export default StripeController;
