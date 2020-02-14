import { Router } from 'express';
import * as controller from '../controller/client';
const route = new Router();

route.post('/', controller.register);
route.get('/:_id', controller.profile);

export default route;
