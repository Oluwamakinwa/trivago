import { errorMessage } from 'iyasunday';
import * as service from './service';

export async function create(req, res) {
  try {
    const roomCategory = await service.create(req.body);
    res.status(200).json(roomCategory);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function update(req, res) {
  try {
    const roomCategory = await service.update(req.body);
    return res.status(200).json(roomCategory);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function list(req, res) {
  try {
    const roomCategory = await service.list(req.query);
    return res.status(200).json(roomCategory);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function view(req, res) {
  try {
    const roomCategory = await service.view(req.params._id);
    return res.status(200).json(roomCategory);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function remove(req, res) {
  try {
    const roomCategory = await service.remove(req.params._id);
    return res.status(200).json(roomCategory);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}
