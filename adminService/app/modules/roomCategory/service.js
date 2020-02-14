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
    throw new ExistsError(body.name + ' already created');

  body.slug = slugify(body.name);
  let roomCategory = await db.collection(collectionName).insertOne(body);
  if (roomCategory.ops.length === 0)
    throw new Error('Room category creation failed');
  return {
    success,
    data: roomCategory.ops[0],
  };
}

export async function update(body) {
  body.updatedAt = new Date();
  const _id = ObjectId(body._id);
  delete body._id;

  const roomCategory = await db
    .collection(collectionName)
    .findOneAndUpdate({ _id }, { $set: body }, { returnOriginal: false });

  if (!isUpdated(roomCategory))
    throw new NotFoundError('Room category not found');

  return {
    success,
    data: roomCategory.value,
  };
}

export async function list() {
  const roomCategories = await db
    .collection(collectionName)
    .find()
    .toArray();
  if (roomCategories.length === 0)
    throw new NotFoundError('No roomCategory category found');
  return {
    success,
    data: roomCategories,
  };
}

export async function view(_id) {
  const roomCategory = await db
    .collection(collectionName)
    .findOne({ _id: ObjectId(_id) });
  if (!roomCategory) throw new NotFoundError('Room category not found');
  return {
    success,
    data: roomCategory,
  };
}

export async function remove(_id) {
  const roomCategory = await db
    .collection(collectionName)
    .deleteOne({ _id: ObjectId(_id) });
  if (!roomCategory.deletedCount)
    throw new NotFoundError('Room category not found');
  return successMessage('Room category removed');
}
