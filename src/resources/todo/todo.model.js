import Joi from 'joi';

const todoSchema = {
  title: Joi.string().min(3).max(30).required(),
  content: Joi.string().min(3).max(300),
};

export const Todo = Joi.object(todoSchema);
