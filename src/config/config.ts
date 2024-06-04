export const config = {
    stripe: {
        publisherKey: process.env.PUBLISHER_KEY,
        secretKey: process.env.SECRET_KEY,
        webhookSecret: process.env.WEBHOOK_SECRET,
        plans: {
            free: {
                priceId: process.env.FREE_PRICE_ID,
                quota: {
                    TASKS: 5,
                }
            },
            pro: {
                priceId: process.env.PRO_PRICE_ID,
                quota: {
                    TASKS: 100,
                }
            },
        },
    },
};
