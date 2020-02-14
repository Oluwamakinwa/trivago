import { db, isUpdated, exists, expectedFields } from '../../utils/db';
import { collectionName, updatableFields, creatableFields } from './model';
import { success, NotFoundError, ExistsError, successMessage } from 'iyasunday';
import { ObjectId } from 'mongodb';

export async function create(body) {
  body = expectedFields(creatableFields, body);
  if (await exists(collectionName, [{ email: body.email }]))
    throw new ExistsError(body.name + ' already exists');

  body.points = 0;
  let client = await db.collection(collectionName).insertOne(body);
  if (client.ops.length === 0) throw new Error('Account creation failed');
  return {
    success,
    data: client.ops[0],
  };
}

export async function update(body) {
  const _id = ObjectId(body._id);
  body = expectedFields(updatableFields, body);
  body.updatedAt = new Date();

  if (body.name) {
    const emailExists = await exists(
      collectionName,
      [{ _id: { $ne: _id } }, { email: body.email }],
      true
    );
    if (emailExists) throw new ExistsError(body.name + ' already exists');
  }

  const client = await db
    .collection(collectionName)
    .findOneAndUpdate({ _id }, { $set: body }, { returnOriginal: false });

  if (!isUpdated(client)) throw new NotFoundError('Client not found');

  return {
    success,
    data: client.value,
  };
}

export async function list() {
  const clients = await db
    .collection(collectionName)
    .find()
    .toArray();
  if (clients.length === 0) throw new NotFoundError('No client found');
  return {
    success,
    data: clients,
  };
}

export async function view(_id) {
  const client = await db
    .collection(collectionName)
    .findOne({ _id: ObjectId(_id) });
  if (!client) throw new NotFoundError('Client not found');
  return {
    success,
    data: client,
  };
}

export async function remove(_id) {
  const client = await db
    .collection(collectionName)
    .deleteOne({ _id: ObjectId(_id) });
  if (!client.deletedCount) throw new NotFoundError('Client not found');
  return successMessage('Client removed');
}
