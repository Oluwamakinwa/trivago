import { Router } from 'express';
import * as controller from '../controller/reservation';
const route = new Router();

route.get('/checkout/:_id/:roomId', controller.checkout);
route.get('/room-categories', controller.roomCategory);
route.get('/rooms', controller.roomSearch);
route.post('/', controller.makeReservation);
export default route;
