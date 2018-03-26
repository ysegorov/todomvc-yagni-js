
import { always, call, callMethod, callMethod2, concat, filter, identity, ifElse, isEmpty, isNil, method, mutate, not, pick, pipe } from '@yagni-js/yagni';

import { debug } from './logger';
import { storage } from './globals';


const storageKey = 'todos-yagni-js';
const todosKey = '_todos';

const isCompleted = pick('completed');
const getId = pick('id');

function last(arr) {
  return arr[arr.length - 1];
}
const allTodos = pick(todosKey);
const activeTodos = pipe([
  allTodos,
  filter(not(isCompleted))
]);
const completedTodos = pipe([
  allTodos,
  filter(isCompleted)
]);

function addOne(num) {
  return num + 1;
}

const nextId = pipe([
  allTodos,
  ifElse(
    isEmpty,
    always(0),
    pipe([
      last,
      getId,
      addOne
    ])
  )
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


function mutateStore(obj) {
  return function (value) {
    return mutate(obj, todosKey, value);
  };
}
function persistStore(obj) {
  return pipe([
    mutateStore(obj),
    allTodos,
    saveToStorage
  ]);
}

function add(obj) {
  return pipe([
    call(
      pipe([
        always(obj),
        allTodos,
        concat
      ]),
      identity
    ),
    persistStore(obj)
  ]);
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
    addTodo: add(obj)
  };
}

export const store = createStore();
