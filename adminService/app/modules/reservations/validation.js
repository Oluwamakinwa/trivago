import Joi from 'joi';

export default {
  create: {
    body: {
      clientId: Joi.string().required(),
      roomId: Joi.string().required(),
    },
  },

  checkout: {
    params: {
      roomId: Joi.string().required(),
      _id: Joi.string().required(),
    },
  },

  list: {
    query: {
      _id: Joi.string(),
      clientId: Joi.string(),
      type: Joi.string(),
    },
  },
};
