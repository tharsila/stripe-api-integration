import { config } from '@/config/config';
import Stripe from 'stripe';

export const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2024-04-10',
});
