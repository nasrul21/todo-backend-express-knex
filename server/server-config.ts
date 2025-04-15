require('dotenv').config();
import express, {
    NextFunction,
    Request,
    Response,
    type Express,
} from 'express';
import bodyParser from 'body-parser';

const app: Express = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

module.exports = app;
