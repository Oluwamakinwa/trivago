import { postContent, getContent, errorMessage } from 'iyasunday';

export async function roomCategory(req, res) {
  try {
    const roomCategories = await getContent({
      url: process.env.PRIVATE_API_URL + '/room-categories',
      headers: {
        authorization: process.env.PUBLIC_API_SECRET,
      },
    });

    res.status(200).json(roomCategories);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function roomSearch(req, res) {
  try {
    let query = '';
    if (req.query) {
      query = '?';
      for (let field in req.query) query += `${field}=${req.query[field]}&`;
    }

    const rooms = await getContent({
      url: process.env.PRIVATE_API_URL + '/rooms' + query,
      headers: {
        authorization: process.env.PUBLIC_API_SECRET,
      },
    });

    res.status(200).json(rooms);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function checkout(req, res) {
  try {
    const { roomId, _id } = req.params,
      client = await getContent({
        url:
          process.env.PRIVATE_API_URL +
          `/reservations/checkout/${_id}/${roomId}`,
        headers: {
          authorization: process.env.PUBLIC_API_SECRET,
        },
      });

    res.status(200).json(client);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function makeReservation(req, res) {
  try {
    const client = await postContent({
      url: process.env.PRIVATE_API_URL + '/reservations',
      data: req.body,
      headers: {
        authorization: process.env.PUBLIC_API_SECRET,
      },
    });

    res.status(200).json(client);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}
