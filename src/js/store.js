
import { always, callMethod2, filter, identity, ifElse, isNil, method, mutate, not, pick, pipe } from '@yagni-js/yagni';

import { debug } from './logger';
import { storage } from './globals';


const storageKey = 'todos-yagni-js';
const todosKey = '_todos';

const isCompleted = pick('completed');
const length = pick('length');

const allTodos = pick(todosKey);
const activeTodos = pipe([
  allTodos,
  filter(not(isCompleted))
]);
const completedTodos = pipe([
  allTodos,
  filter(isCompleted)
]);

const nextId = pipe([
  allTodos,
  length
]);

const loadFromStorage = pipe([
  method(storage, 'getItem'),
  ifElse(
    isNil,
    always([]),
    method(JSON, 'parse')
  )
]);

const saveToStorage = callMethod2(
  always(storage),
  'setItem',
  storageKey,
  method(JSON, 'stringify')
);

function add(obj, todo) {
  const todos = allTodos(obj);
  const subj = mutate(obj, todosKey, todos.concat(todo));
  return saveToStorage(allTodos(subj));
}


const storeProto = {
  getAll: function getAll() {
    //eslint-disable-next-line fp/no-this
    return allTodos(this);
  },
  getActive: function getActive() {
    //eslint-disable-next-line fp/no-this
    return activeTodos(this);
  },
  getCompleted: function getCompleted() {
    //eslint-disable-next-line fp/no-this
    return completedTodos(this);
  },
  getNextId: function getNextId() {
    //eslint-disable-next-line fp/no-this
    return nextId(this);
  },
  addTodo: function addTodo(todo) {
    //eslint-disable-next-line fp/no-this
    return add(this, todo);
  }
};

function createStore() {
  const store = Object.create(storeProto);
  return mutate(store, todosKey, loadFromStorage(storageKey));
}

export const store = createStore();
