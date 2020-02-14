import { errorMessage } from 'iyasunday';
import * as service from './service';

export async function create(req, res) {
  try {
    const point = await service.create(req.body);
    res.status(200).json(point);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function list(req, res) {
  try {
    const point = await service.list(req.query);
    return res.status(200).json(point);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function checkout(req, res) {
  try {
    const room = await service.checkout(req.params);
    return res.status(200).json(room);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}
