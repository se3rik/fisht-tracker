import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import router from './router/index.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);

app.get('/', (request, response) => {
    response.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
