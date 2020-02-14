import { db, isUpdated, exists } from '../../utils/db';
import { collectionName } from './model';
import {
  success,
  NotFoundError,
  ExistsError,
  successMessage,
  slugify,
} from 'iyasunday';
import { ObjectId } from 'mongodb';

export async function create(body) {
  if (await exists(collectionName, [{ name: body.name }]))
    throw new ExistsError(body.name + ' already exists');

  body.slug = slugify(body.name);
  let hotel = await db.collection(collectionName).insertOne(body);
  if (hotel.ops.length === 0) throw new Error('Hotel creation failed');
  return {
    success,
    data: hotel.ops[0],
  };
}

export async function update(body) {
  body.updatedAt = new Date();
  const _id = ObjectId(body._id);
  delete body._id;

  if (body.name) {
    const hotelExists = await exists(
      collectionName,
      [{ _id: { $ne: _id } }, { name: body.name }],
      true
    );
    if (hotelExists) throw new ExistsError(body.name + ' already exists');
  }

  const hotel = await db
    .collection(collectionName)
    .findOneAndUpdate({ _id }, { $set: body }, { returnOriginal: false });

  if (!isUpdated(hotel)) throw new NotFoundError('Hotel not found');

  return {
    success,
    data: hotel.value,
  };
}

export async function list() {
  const roomCategories = await db
    .collection(collectionName)
    .find()
    .toArray();
  if (roomCategories.length === 0)
    throw new NotFoundError('No hotel category found');
  return {
    success,
    data: roomCategories,
  };
}

export async function view(_id) {
  const hotel = await db
    .collection(collectionName)
    .findOne({ _id: ObjectId(_id) });
  if (!hotel) throw new NotFoundError('Hotel not found');
  return {
    success,
    data: hotel,
  };
}

export async function remove(_id) {
  const hotel = await db
    .collection(collectionName)
    .deleteOne({ _id: ObjectId(_id) });
  if (!hotel.deletedCount) throw new NotFoundError('Hotel not found');
  return successMessage('Hotel removed');
}
