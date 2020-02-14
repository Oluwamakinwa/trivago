import { errorMessage } from 'iyasunday';
import RoomCategory from '../modules/roomCategory';
import Room from '../modules/room';
import Hotel from '../modules/hotel';
import Client from '../modules/client';
import Point from '../modules/point';
import Reservation from '../modules/reservations';
import { ERROR } from '../utils/constant';

export default app => {
  const apiVersion = '/api/' + process.env.API_VERSION;
  app.use(`${apiVersion}/room-categories/`, RoomCategory);
  app.use(`${apiVersion}/rooms/`, Room);
  app.use(`${apiVersion}/hotels/`, Hotel);
  app.use(`${apiVersion}/clients/`, Client);
  app.use(`${apiVersion}/points/`, Point);
  app.use(`${apiVersion}/reservations/`, Reservation);

  app.use((err, req, res, next) => {
    if (err) {
      let message;
      if (err.errors && err.errors[0].messages[0]) {
        message = err.errors[0].messages[0];
      } else if (err.message) {
        message = err.message;
      } else if (typeof err === 'string') {
        message = err;
      } else {
        message = 'Something went wrong';
      }
      res.status(400).json(errorMessage(message, ERROR.VALIDATION_ERROR));
    } else {
      res.status(404).json(errorMessage('Requested route not found'));
    }
  });
};
