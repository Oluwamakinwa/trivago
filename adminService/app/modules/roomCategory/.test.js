require('dotenv').config();
const { postContent, getContent, slugify } = require('iyasunday'),
  headers = { authorization: process.env.ADMIN_API_SECRET },
  { lorem } = require('faker');

let _id, updateRoom;

test('create room category', async () => {
  try {
    const roomCategory = {
      name: lorem.word(),
      description: lorem.paragraph(),
    };

    const { success, data } = await postContent({
      url: process.env.API_URL + '/room-categories',
      data: roomCategory,
      headers,
    });

    const expectedFields = ['_id', 'name', 'description'];
    _id = data._id;

    expect(success).toBe(true);
    expect(data).toEqual(expect.objectContaining(roomCategory));
    expect(Object.keys(data)).toEqual(expect.arrayContaining(expectedFields));
  } catch (err) {
    expect(true).toBe(false);
  }
});

test('update room category', async () => {
  try {
    const name = 'Test room category updated';
    updateRoom = {
      _id,
      name,
      slug: slugify(name),
      description: lorem.paragraphs(),
    };

    const { success, data } = await postContent({
      url: process.env.API_URL + '/room-categories',
      data: updateRoom,
      method: 'PATCH',
      headers,
    });

    const expectedFields = ['_id', 'name', 'description'];

    expect(success).toBe(true);
    expect(data).toEqual(expect.objectContaining(updateRoom));
    expect(Object.keys(data)).toEqual(expect.arrayContaining(expectedFields));
  } catch (err) {
    expect(true).toBe(false);
  }
});

test('view a single room category', async () => {
  try {
    const { success, data } = await getContent({
      url: process.env.API_URL + '/room-categories/' + _id,
      headers,
    });

    expect(success).toBe(true);
    expect(data).toEqual(expect.objectContaining(updateRoom));
  } catch (err) {
    expect(err.error).toBe('ENTRY_NOT_FOUND');
  }
});

test('list room categories', async () => {
  try {
    const { success, data } = await getContent({
      url: process.env.API_URL + '/room-categories',
      headers,
    });

    expect(success).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);
  } catch (error) {
    expect(true).toBe(false);
  }
});

test('delete room category', async () => {
  try {
    const { success, message } = await getContent({
      url: process.env.API_URL + '/room-categories/' + _id,
      method: 'DELETE',
      headers,
    });

    expect(success).toBe(true);
    expect(message).toBe('Room category removed');
  } catch (err) {
    expect(err.error).toBe('ENTRY_NOT_FOUND');
  }
});
