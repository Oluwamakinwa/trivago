import Joi from 'joi';
import { ROOM_STATUS } from '../../utils/constant';

export default {
  create: {
    body: {
      name: Joi.string().required(),
      address: Joi.string().required(),
    },
  },

  update: {
    body: {
      _id: Joi.string().required(),
      name: Joi.string(),
      address: Joi.string(),
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
