import { db, isUpdated, exists, expectedFields } from '../../utils/db';
import {
  collectionName,
  updatableFields,
  creatableFields,
  filterableFields,
} from './model';
import { success, NotFoundError, ExistsError, successMessage } from 'iyasunday';
import { ObjectId } from 'mongodb';

export async function create(body) {
  body = expectedFields(creatableFields, body);
  body.hotelId = ObjectId(body.hotelId);
  body.roomCategoryId = ObjectId(body.roomCategoryId);
  body.createdAt = new Date();

  const { roomCategoryId, number, hotelId } = body;
  if (
    await exists(
      collectionName,
      [{ roomCategoryId }, { number }, { hotelId }],
      true
    )
  )
    throw new ExistsError(body.number + ' already created');

  let room = await db.collection(collectionName).insertOne(body);
  if (room.ops.length === 0) throw new Error('Room creation failed');
  return {
    success,
    data: room.ops[0],
  };
}

export async function update(body) {
  try {
    const _id = ObjectId(body._id);
    body = expectedFields(updatableFields, body);
    body.updatedAt = new Date();

    if (body.roomCategoryId)
      body.roomCategoryId = ObjectId(body.roomCategoryId);
    const room = await db
      .collection(collectionName)
      .findOneAndUpdate({ _id }, { $set: body }, { returnOriginal: false });

    if (!isUpdated(room)) throw new NotFoundError('Room not found');

    return {
      success,
      data: room.value,
    };
  } catch (err) {
    throw err;
  }
}

export async function list(query) {
  query = query ? expectedFields(filterableFields, query) : {};
  if (query.roomCategoryId)
    query.roomCategoryId = ObjectId(query.roomCategoryId);

  const roomCategories = await db
    .collection(collectionName)
    .find(query)
    .toArray();
  if (roomCategories.length === 0) throw new NotFoundError('No room found');
  return {
    success,
    data: roomCategories,
  };
}

export async function view(_id) {
  const room = await db
    .collection(collectionName)
    .findOne({ _id: ObjectId(_id) });
  if (!room) throw new NotFoundError('Room not found');
  return {
    success,
    data: room,
  };
}

export async function remove(_id) {
  const room = await db
    .collection(collectionName)
    .deleteOne({ _id: ObjectId(_id) });
  if (!room.deletedCount) throw new NotFoundError('Room not found');
  return successMessage('Room removed');
}
