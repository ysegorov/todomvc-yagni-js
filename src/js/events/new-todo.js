
import { always, call, callMethod, equals, identity, ifElse, isEmpty, method, objOf, omit, pick, pipe, transform, tap } from '@yagni-js/yagni';
import { closest, eventHandler, queryFirst, render, renderR, setProp } from '@yagni-js/yagni-dom';

import { debug } from '../logger';
import { itemsLeftView, todoView } from '../views';
import { store } from '../store';


const isEnter = pipe([
  pick('originalEvent'),
  pick('code'),
  equals('Enter')
]);

const renderNewTodo = call(
  pipe([
    pick('content'),
    queryFirst('[data-js=todo-list]'),
    render
  ]),
  pipe([
    omit(['content']),
    todoView
  ])
);

const clearInput = pipe([
  pick('content'),
  queryFirst('[data-js=new-todo]'),
  setProp('value', '')
]);

const addTodo = callMethod(always(store), 'addTodo', omit(['content']));
const itemsLeft = pipe([
  method(store, 'getItemsLeft'),
  objOf('itemsLeft')
]);

const renderItemsLeft = call(
  pipe([
    pick('content'),
    queryFirst('[data-js=items-left]'),
    renderR
  ]),
  pipe([
    itemsLeft,
    itemsLeftView
  ])
);

const createTodo = pipe([
  pick('matchedElement'),
  transform({
    content: closest('#content'),
    title: callMethod(pick('value'), 'trim'),
    completed: always(false),
    id: method(store, 'getNextId')
  }),
  ifElse(
    pipe([pick('title'), equals('')]),
    always(false),
    pipe([
      tap(clearInput),
      tap(addTodo),
      tap(renderNewTodo),
      tap(renderItemsLeft)
    ])
  )
]);

const newTodo = ifElse(
  isEnter,
  createTodo,
  identity
);


export const newTodoEventHandler = eventHandler('keypress', '[data-js=new-todo]', newTodo);
