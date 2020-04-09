import dotEnv from 'dotenv-flow';
dotEnv.config({ default_node_env: 'development' });
import './config/objection';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import imageRoute from 'routes/image';
import apolloServer from './config/apolloServer';
import path from 'path';

const port = process.env.PORT || 3001;
const app = express();
const env = process.env.NODE_ENV || 'development';

// middleware
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Logging of all requests
// app.use(logger);

// GraphQL and routes
apolloServer.applyMiddleware({ app });
app.use('/images', imageRoute);

/* Catch all */
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html'));
});

// START SERVEREN
const server = app.listen(port);

// eslint-disable-next-line no-console
console.log(`Server is live on http://localhost:${port}`);

module.exports = server;
