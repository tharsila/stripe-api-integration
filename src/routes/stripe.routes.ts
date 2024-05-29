import StripeController from '@/controllers/stripe.controller';
import { UserRepository } from '@/repositories/user.repository';
import { StripeService } from '@/services/stripe.service';
import { Router } from 'express';

const router = Router();
const userRepository = new UserRepository();
const stripeService = new StripeService(userRepository);
const stripeController = new StripeController(stripeService);

router.post(
    '/checkout/:userId',
    stripeController.create.bind(stripeController)
);

export default router;
