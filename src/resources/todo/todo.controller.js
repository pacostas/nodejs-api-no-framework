import { crudControllers } from '../../utils/crud.js';
import { TodoValidator } from './todo.schema.js';

const model = {
  collection: 'todo',
  validator: TodoValidator,
};
export default crudControllers(model);
