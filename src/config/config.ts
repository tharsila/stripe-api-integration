export const config = {
    stripe: {
        publisherKey: process.env.PUBLISHER_KEY,
        secretKey: process.env.SECRET_KEY,
        webhookSecret: process.env.WEBHOOK_SECRET,
        plans: {
            free: {
                freePriceID: process.env.FREE_PRICE_ID,
            },
            pro: {
                proPriceID: process.env.PRO_PRICE_ID,
            },
        },
    },
};
