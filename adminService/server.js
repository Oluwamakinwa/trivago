import express from 'express';
import {connect} from './app/utils/db';
import middlewares from './app/route/middleware';
import route from './app/route';

const app = express();

console.log("==========Waiting for db connection============");
connect().then(()=>{
    middlewares(app);
    route(app);
    app.listen(process.env.PORT,(err)=>{
        if(err) throw err;
        console.log(`====== Connection started on ${process.env.PORT} ===========`);
    });
}).catch(err=>console);