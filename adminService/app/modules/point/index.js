'use strict';
import { Router } from 'express';
import * as controller from './controller';
import validate from 'express-validation';
import validation from './validation';
import { routeGuard } from '../../utils';

const route = new Router();
route.get('/', routeGuard(), validate(validation.list), controller.list);
route.post('/', routeGuard(), validate(validation.create), controller.create);
export default route;
