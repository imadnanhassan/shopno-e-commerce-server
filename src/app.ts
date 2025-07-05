import express, { Application } from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';
import { notFoundRoute } from './error/notFoundRoute';
import { globalErrorHandler } from './error/globalErrorHandler';
import { apiLimiter } from './middlewares/rateLimit';
import AuthRouter from './modules/auth/auth.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(apiLimiter);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('E-commerce Backend API');
});

app.use('/api/v1/auth', AuthRouter);

// Handle 404
app.use(notFoundRoute);

// Global error handler
app.use(globalErrorHandler);

export default app;
