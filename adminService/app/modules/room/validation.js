import Joi from 'joi';
import { STATUS } from './model';

export default {
  create: {
    body: {
      // Room number is a string because some hotels may have parent-child numbering system e.g 140-A, 140-B
      number: Joi.string().required(),
      description: Joi.string().required(),
      roomCategoryId: Joi.string().required(),
      hotelId: Joi.string().required(),
      status: Joi.string()
        .valid(STATUS)
        .default('AVAILABLE'),
      requiredPoints: Joi.number().required(),
    },
  },

  update: {
    body: {
      _id: Joi.string().required(),
      hotelId: Joi.string().required(),
      description: Joi.string(),
      roomCategoryId: Joi.string(),
      status: Joi.string().valid(STATUS),
      requiredPoints: Joi.number(),
    },
  },

  view: {
    params: {
      _id: Joi.string().required(),
    },
  },

  list: {
    query: {
      roomCategoryId: Joi.string(),
      hotelId: Joi.string(),
      number: Joi.string(),
      status: Joi.string().valid(STATUS),
      requiredPoints: Joi.number(),
    },
  },

  remove: {
    params: {
      _id: Joi.string().required(),
    },
  },
};
