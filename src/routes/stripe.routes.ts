
import StripeController from '@/controllers/stripe.controller';
import { Router } from 'express';

const router = Router();

const checkoutController = new StripeController();

router.post(
    '/checkout/:userId',
    checkoutController.create.bind(checkoutController)
);

export default router;
