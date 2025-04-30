import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { userRouter } from './routes/user.routes';
import { postRouter } from './routes/post.routes';
import { likeRouter } from './routes/like.routes';
import { followRouter } from './routes/follow.routes';
import { feedRouter } from './routes/feed.routes';

const app = express();

// Apply middleware
app.use(express.json({ limit: '1mb' }));
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Social Media Platform API! Server is running successfully.');
});

// Register routes
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/likes', likeRouter);
app.use('/api/follows', followRouter);
app.use('/api/feed', feedRouter);

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;