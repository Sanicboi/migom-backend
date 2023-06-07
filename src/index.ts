import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response, Application } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import * as qr from 'qrcode';

AppDataSource.initialize().then(async () => {

    // create express app
    const app: Application = express();
    app.use(bodyParser.json())


    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as Application)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    // setup express app here

    
    // ...
    app.get('/api/qr/:id', async (req, res) => {
        const code = await qr.toBuffer(`http://${process.env.BASE_URL}/add/${req.params.id}`, {
            errorCorrectionLevel: 'H',
            width: 200,
        });
        res.status(200).type('image/png').end(code);
    });

    app.get('/api/privateqr/:id',async (req, res) => {
        const code = await qr.toBuffer(`http://${process.env.BASE_URL}/private/${req.params.id}`);
        res.status(200).type('image/png').send(code);
    });
    // start express server
    app.listen(80);

    // insert new users for test


}).catch(error => console.log(error))
