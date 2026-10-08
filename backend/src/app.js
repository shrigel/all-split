import express from 'express';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import healthRouter from './routes/health.routes.js';
import splitRouter from './routes/split.routes.js';
import participantRouter from './routes/participant.routes.js'
import billRouter from './routes/bill.routes.js';
import itemRouter from './routes/item.routes.js'
import itemShareRouter from './routes/itemShare.routes.js';
import adjustmentRouter from './routes/adjustment.route.js';
import settlementRouter from './routes/settlement.route.js';

const app = express();

app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/splits', splitRouter);
app.use('/api', participantRouter);
app.use('/api', billRouter);
app.use('/api', itemRouter);
app.use('/api', itemShareRouter);
app.use('/api', adjustmentRouter);
app.use('/api', settlementRouter);

app.use(notFound);
app.use(errorHandler);

export default app;