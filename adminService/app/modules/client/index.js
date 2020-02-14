'use strict';
import { Router } from 'express';
import * as controller from './controller';
import validate from 'express-validation';
import validation from './validation';
import { routeGuard } from '../../utils';

const route = new Router();
route.get(
  '/:_id',
  routeGuard(true),
  validate(validation.view),
  controller.view
);
route.get('/', routeGuard(), controller.list);
route.post('/', validate(validation.create), controller.create);
route.patch(
  '/',
  routeGuard(true),
  validate(validation.update),
  controller.update
);
route.delete(
  '/:_id',
  routeGuard(),
  validate(validation.remove),
  controller.remove
);

export default route;
