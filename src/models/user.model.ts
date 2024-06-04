export interface User {
    id?: string;
    name: string;
    email: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    stripeSubscriptionStatus?: string;
    stripePriceId?: string;
}
