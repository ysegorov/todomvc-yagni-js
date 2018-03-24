
import { always, callMethod, callMethod2, filter, identity, ifElse, isNil, method, mutate, not, pick, pipe, tap } from '@yagni-js/yagni';

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
  callMethod(always(storage), 'getItem', storageKey),
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

function createStore() {

  const obj = mutate({}, todosKey, loadFromStorage());

  return {
    getAll: function getAll() {
      return allTodos(obj);
    },
    getActive: function getActive() {
      return activeTodos(obj);
    },
    getCompleted: function getCompleted() {
      return completedTodos(obj);
    },
    getNextId: function getNextId() {
      return nextId(obj);
    },
    addTodo: function addTodo(todo) {
      return add(obj, todo);
    }
  };
}

export const store = createStore();
