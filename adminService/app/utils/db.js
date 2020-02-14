import { MongoClient, ObjectID } from 'mongodb';

export const client = new MongoClient(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export let db = null;

export async function connect() {
  try {
    await client.connect();
    db = client.db();
  } catch (err) {
    console.log(err);
  }
}

export function caseInsensitive() {
  return { collation: { locale: 'en', strength: 1 } };
}

export function isUpdated(result) {
  if (result.result && result.result.n) return true;
  else if (result.lastErrorObject && result.lastErrorObject.n) return true;
  return false;
}

export function like(node) {
  return { $regex: new RegExp(node, 'i') };
}

export function formatUpdateField(node, data) {
  const fields = {};
  for (let field in data) fields[`${node}.$.${field}`] = data[field];
  return fields;
}

export function expectedFields(allowedFields, data) {
  const fields = {};
  for (let field of allowedFields) if (data[field]) fields[field] = data[field];

  return fields;
}

export async function exists(collectionName, condition = [], strict = false) {
  condition = strict ? { $and: condition } : { $or: condition };
  return await db.collection(collectionName).countDocuments(condition);
}
