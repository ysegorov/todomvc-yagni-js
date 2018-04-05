
import { always, call, callMethod, callMethod2, concat, equals, filter, first, identity, ifElse, isEmpty, isNil, lazy, length, method, mutate, not, objOf, omit, pick, pipe, tap, transform } from '@yagni-js/yagni';

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
    tap(
      pipe([
        allTodos,
        saveToStorage
      ])
    )
  ]);
}


function calcStats(todos) {
  const initial = {
    itemsLeft: 0,
    itemsCompleted: 0,
    itemsOverall: 0
  };

  return todos.reduce(
    function (acc, todo) {
      const itemsLeft = todo.completed ? acc.itemsLeft : acc.itemsLeft + 1;
      const itemsCompleted = todo.completed ? acc.itemsCompleted + 1 : acc.itemsCompleted;
      return {
        itemsLeft: itemsLeft,
        itemsCompleted: itemsCompleted,
        itemsOverall: itemsLeft + itemsCompleted
      };
    },
    initial
  );
}

const getStats = pipe([
  allTodos,
  calcStats
]);


function addTodo(obj) {
  return ifElse(
    equals(''),
    always(false),
    pipe([
      transform({
        title: identity,
        completed: always(false),
        id: lazy(nextId, obj)
      }),
      transform({
        todo: identity,
        stats: pipe([
          call(
            pipe([
              lazy(allTodos, obj),
              concat
            ]),
            identity
          ),
          persistStore(obj),
          getStats
        ])
      })
    ])
  );
}

function mutateCompleted(todo) {
  return mutate(todo, 'completed', !todo.completed);
}

function toggleTodoCompleted(obj) {

  function makeFilter(id) {
    return filter(
      pipe([
        pick('id'),
        equals(id)
      ])
    );
  }

  return pipe([
    call(
      makeFilter,
      lazy(allTodos, obj)
    ),
    first,
    mutateCompleted,
    transform({
      todo: identity,
      stats: pipe([
        lazy(allTodos, obj),
        persistStore(obj),
        getStats
      ])
    })
  ]);
}

function destroyTodo(obj) {

  function makeFilter(id) {
    return filter(
      not(
        pipe([
          pick('id'),
          equals(id)
        ])
      )
    );
  }

  return pipe([
    call(
      makeFilter,
      lazy(allTodos, obj)
    ),
    persistStore(obj),
    getStats,
    objOf('stats')
  ]);
}


function createStore(key, items) {

  const obj = mutate({}, key, items);

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
    getStats: lazy(getStats, obj),
    addTodo: addTodo(obj),
    toggleTodoCompleted: toggleTodoCompleted(obj),
    destroyTodo: destroyTodo(obj)
  };

}

export const store = createStore(todosKey, loadFromStorage());
