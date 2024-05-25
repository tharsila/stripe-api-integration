import express from 'express';
import userRoutes from './routes/user.routes';
import stripeRoutes from './routes/stripe.routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', userRoutes);
app.use('/stripe', stripeRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
