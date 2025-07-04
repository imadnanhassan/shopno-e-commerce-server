import express, { Application } from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';

const app: Application = express();

// Middleware
app.use(cors()); 
app.use(express.json());


app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
  res.send('E-commerce Backend API');
});

export default app;

