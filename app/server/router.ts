import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/ping', (_req: Request, res: Response<{ message: string }>) => {
  res.send({ message: 'pong' });
});

export default router;
