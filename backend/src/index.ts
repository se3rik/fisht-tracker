import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import router from './router/index.js';

import errorMiddleware from '~/middlewares/error-middleware.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
