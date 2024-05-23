import express from 'express';
import userRoutes from './routes/user.routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', userRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
