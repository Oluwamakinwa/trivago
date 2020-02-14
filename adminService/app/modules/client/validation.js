import Joi from 'joi';
import { ROOM_STATUS } from '../../utils/constant';

export default {
  create: {
    body: {
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
    },
  },

  update: {
    body: {
      _id: Joi.string().required(),
      name: Joi.string(),
      email: Joi.string().email(),
    },
  },

  view: {
    params: {
      _id: Joi.string().required(),
    },
  },

  remove: {
    params: {
      _id: Joi.string().required(),
    },
  },
};
