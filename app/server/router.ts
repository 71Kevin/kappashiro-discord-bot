import express, { Request, Response, Router } from 'express';

interface PingResponse {
  message: string;
}

class PingController {
  public ping(_: Request, res: Response<PingResponse>): void {
    const response: PingResponse = { message: 'pong' };
    res.send(response);
  }
}

const router: Router = express.Router();
const pingController: PingController = new PingController();

router.get('/ping', pingController.ping.bind(pingController));

export default router;
