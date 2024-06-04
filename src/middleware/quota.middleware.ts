// src/middlewares/quotaMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '@/repositories/user.repository';
import { TaskRepository } from '@/repositories/task.repository';
import { config } from '@/config/config';
import { stripe } from '@/stripe/stripe';


const userRepository = new UserRepository();

function getPlanByPriceId(priceId: string) {
    const plans = config.stripe.plans;

    const planKey = Object.keys(plans).find(
        (key) => plans[key].priceId === priceId
    );

    const plan = planKey ? plans[planKey] : null;

    if (!plan) {
        throw new Error(`Could not find plan for price: ${priceId}`);
    }

    return {
        name: planKey,
        quota: plan.quota,
    };
}

export const quotaMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req.params;

    try {
        const user = await userRepository.getById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ error: `User ${userId} does not exist` });
        }

        const countUserTasks = await userRepository.countUserTasks(userId);
        const userTaskCount = countUserTasks._count.Tasks;

        const price = await stripe.prices.retrieve(user.stripePriceId);
        const priceId = price.id;
        const plan = getPlanByPriceId(priceId);

        const isProPlan = plan.name === 'pro';
       
        const hasActiveSubscription = !!user.stripeSubscriptionId && user.stripeSubscriptionStatus === 'active';

        
        return
        if (userTaskCount >= plan.quota.TASKS && (!isProPlan || !hasActiveSubscription)) {
            return res
                .status(403)
                .json({
                    error: 'Not quota available. Please upgrade your plan',
                });
        }

        next();
    } catch (error) {
        next(error);
    }
};
