import * as express from 'express';
const router = express.Router();

router.get('/ping', (req: any, res: {
    send: (arg0: {
        message: string;
    }) => any;
}) => res.send({
    message: 'pong'
}));

export default router;
