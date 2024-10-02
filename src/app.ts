import express, { Request, Response } from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import userRoutes from './routes/user.route';
import productRoutes from './routes/product.route';
import authRoutes from './routes/auth.route';
import { errorMiddleware } from './middlewares/error.middleware';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import AuthenticationFilter from './middlewares/auth.middleware';
import { config } from './config/config';
import getProducts from './utils/init_data_parser';
import JsonModifier from '../src/utils/json_modifier';

const filter = new AuthenticationFilter();
const app = express();

(async () => {
  const data = await getProducts();
  const jsonManip = new JsonModifier();

  jsonManip.writeDataToJsonFile(data, config.DATA_PATH);
})();

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'A simple API to manage users',
    },
  },
  apis: ['./src/routes/*.route.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.use('/api', productRoutes);
app.use('/api', filter.authFilter,userRoutes);
app.use('/api', authRoutes);

app.use(errorMiddleware);

const httpsOptions: https.ServerOptions = {
  key: fs.readFileSync(path.resolve(__dirname, config.CERT_KEY || 'config/certificates/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, config.CERT_CERT ||'config/certificates/cert.pem')),
};

const port = config.PORT;
https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});

export default app;
