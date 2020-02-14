import { errorMessage } from 'iyasunday';
import Client from './client';
import Reservation from './reservation';

export default app => {
  app.use(`/clients/`, Client);
  app.use(`/reservations/`, Reservation);

  app.use((err, req, res, next) => {
    if (err) res.status(err.httpStatusCode || 500).json(errorMessage(err));
    else res.status(404).json(errorMessage('Requested route not found'));
  });
};
