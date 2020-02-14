import Joi from 'joi';

export default {
  create: {
    body: {
      clientId: Joi.string().required(),
      points: Joi.number().required(),
      type: Joi.string()
        .valid(['credit', 'debit'])
        .required(),
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
