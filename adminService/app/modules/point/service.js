import { db, isUpdated, exists } from '../../utils/db';
import { collectionName } from './model';
import { collectionName as clientCollectionName } from '../client/model';
import { success, NotFoundError, ValidationError } from 'iyasunday';
import { ObjectId } from 'mongodb';

export async function create(body) {
  /* 
    NOTE: MongoDB multi document transaction is not working on my localhost, so I'm managing the transaction manually in the catch block in order to ensure data consistency
  */
  let pointId;
  try {
    body.clientId = ObjectId(body.clientId);
    body.createdAt = new Date();

    if (!(await exists(clientCollectionName, [{ _id: body.clientId }])))
      throw new ValidationError('Supplied client information not valied');

    const { ops: newPoint } = await db
      .collection(collectionName)
      .insertOne(body);
    if (newPoint.length === 0) throw new Error('Point transaction failed');
    pointId = newPoint[0]._id;

    if (body.type == 'debit') body.points = -body.points;
    const updateClientPoint = await db
      .collection(clientCollectionName)
      .findOneAndUpdate(
        { _id: body.clientId },
        { $inc: { points: -body.points } },
        { returnOriginal: false, projection: { points: 1 } }
      );

    if (!isUpdated(updateClientPoint))
      throw new Error('Client point update failed');

    return {
      success,
      data: {
        ...newPoint[0],
        pointBalance: updateClientPoint.value.points,
      },
    };
  } catch (err) {
    if (pointId)
      await db.collection(collectionName).deleteOne({ _id: ObjectId(pointId) });
    throw err;
  }
}

export async function list(query) {
  if (!query) query = {};
  const points = await db
    .collection(collectionName)
    .find(query)
    .toArray();
  if (points.length === 0) throw new NotFoundError('No point category found');
  return {
    success,
    data: points,
  };
}
