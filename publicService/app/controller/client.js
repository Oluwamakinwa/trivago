import { postContent, getContent, errorMessage } from 'iyasunday';

export async function register(req, res) {
  try {
    const client = await postContent({
      url: process.env.PRIVATE_API_URL + '/clients',
      data: req.body,
    });

    res.status(200).json(client);
  } catch (err) {
    res.status(err.httpStatusCode || 500).json(errorMessage(err));
  }
}

export async function profile(req, res) {
  try {
    const client = await getContent({
      url: process.env.PRIVATE_API_URL + '/clients/' + req.params._id,
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
