import express from 'express';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import stripeRoutes from './routes/stripe.routes';
import stripeWebhookRoutes from './routes/stripe-webhook.routes';

const app = express();
const port = process.env.PORT || 3001;

app.use('/stripe', stripeWebhookRoutes);
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api/', taskRoutes);
app.use('/stripe', stripeRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
