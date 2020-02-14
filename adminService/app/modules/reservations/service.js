import { db, isUpdated, expectedFields } from '../../utils/db';
import { collectionName, creatableFields } from './model';
import { collectionName as clientCollectionName } from '../client/model';
import { collectionName as roomCollectionName } from '../room/model';
import { success, NotFoundError, ExistsError, successMessage } from 'iyasunday';
import { ObjectId } from 'mongodb';

export async function create(body) {
  let _id;
  try {
    body = expectedFields(creatableFields, body);
    body.clientId = ObjectId(body.clientId);
    body.roomId = ObjectId(body.roomId);
    body.status = 'RESERVED';
    body.createdAt = new Date();

    let [client, room] = await Promise.all([
      db
        .collection(clientCollectionName)
        .findOne({ _id: body.clientId }, { projection: { points: 1 } }),
      db
        .collection(roomCollectionName)
        .findOne(
          { _id: body.roomId },
          { projection: { status: 1, requiredPoints: 1 } }
        ),
    ]);

    if (!client) throw new NotFoundError('Client data not found');
    else if (!room) throw new NotFoundError('Room not found');
    else if (room.status !== 'AVAILABLE')
      throw new ExistsError('Room not available, kindly check other rooms');
    else if (client.points < room.requiredPoints)
      body.status = 'PENDING_APPROVAL';

    if (body.status === 'RESERVED') body.pointUsed = room.requiredPoints;
    const { ops: reservation } = await db
      .collection(collectionName)
      .insertOne(body);
    if (reservation.length === 0)
      throw new Error('Room reservation failed, kindly try again');
    _id = reservation[0]._id;

    let updatedClient;
    if (body.status === 'RESERVED') {
      // Point is deducted only when room is reserved
      updatedClient = await db
        .collection(clientCollectionName)
        .findOneAndUpdate(
          { _id: body.clientId },
          { $inc: { points: -room.requiredPoints } },
          { returnOriginal: false, projection: { points: 1 } }
        );

      if (!isUpdated(updatedClient))
        throw new Error('Client bonus point update failed');
    }

    await db
      .collection(roomCollectionName)
      .updateOne({ _id: body.roomId }, { $set: { status: body.status } });
    /* 
      ==========================================
            SEND EMAIL TO SERVICE OWNER HERE
      ==========================================
    */

    return {
      success,
      data: {
        status: body.status,
        message: 'Reservation successful',
        pointBalance: updatedClient
          ? updatedClient.value.points
          : client.points,
      },
    };
  } catch (err) {
    if (_id)
      await db.collection(collectionName).deleteOne({ _id: ObjectId(_id) });
    throw err;
  }
}

export async function list(query) {
  if (!query) query = {};
  const reservations = await db
    .collection(collectionName)
    .find(query)
    .toArray();
  if (reservations.length === 0)
    throw new NotFoundError('No reservation found');
  return {
    success,
    data: reservations,
  };
}

export async function checkout(params) {
  try {
    const { _id, roomId } = params,
      reservation = await db
        .collection(collectionName)
        .updateOne({ _id: ObjectId(_id) }, { $set: { status: 'CHECKEDOUT' } });

    if (!isUpdated(reservation))
      throw new NotFoundError('Reservation not found');

    const room = await db
      .collection(roomCollectionName)
      .findOneAndUpdate(
        { _id: ObjectId(roomId) },
        { $set: { status: 'AVAILABLE' } }
      );
    if (!isUpdated(room)) throw new NotFoundError('Room not fount');
    return successMessage('Checkout successful');
  } catch (err) {
    throw err;
  }
}
