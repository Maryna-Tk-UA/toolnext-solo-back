import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import toolsRoutes from './routes/toolsRoutes.js';
import bookingsRoutes from './routes/bookingsRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import feedbacksRoutes from './routes/feedbacksRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/bookings', bookingsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/feedbacks', feedbacksRoutes);
app.use('/tools', toolsRoutes);
app.use('/users', usersRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
