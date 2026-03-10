/* eslint-disable */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
import router from './routes/index';
let options = {
    displayRequestDuration: true,
    explorer: true
};
const corsOptions = {
    origin: ['http://localhost:3000','http://localhost:5000','https://dev.ezbidn.com'],
    credentials: true,
}
dotenv.config();
const app = express();
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    res.setHeader("Origin-Agent-Cluster", "?0");
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(bodyParser.json({
    limit: '150mb'
}));
app.use(fileUpload({ createParentPath: true }));
app.use(express.urlencoded({ extended: true}));
app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
router(app);
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true, parameterLimit: 50000 }))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use('/api-docs', express.static(path.join(__dirname, '../node_modules/swagger-ui-dist')));
app.listen(process.env.PORT, () => {
    console.log(`lisetining on ${process.env.PORT}`);
}) 

