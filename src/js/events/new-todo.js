
import { always, call, callMethod, equals, identity, ifElse, isEmpty, method, objOf, omit, pick, pipe, transform, tap } from '@yagni-js/yagni';
import { closest, eventHandler, queryFirst, render, renderR, setProp } from '@yagni-js/yagni-dom';

import { debug } from '../logger';
import { clearCompletedView, itemsLeftView, todoView } from '../views';
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
    pick('result'),
    todoView
  ])
);

const clearInput = pipe([
  pick('content'),
  queryFirst('[data-js=new-todo]'),
  setProp('value', '')
]);

const renderItemsLeft = call(
  pipe([
    pick('content'),
    queryFirst('[data-js=items-left]'),
    renderR
  ]),
  pipe([
    pick('result'),
    itemsLeftView
  ])
);

const renderClearCompleted = call(
  pipe([
    pick('content'),
    queryFirst('[data-js=clear-completed]'),
    renderR
  ]),
  pipe([
    pick('result'),
    clearCompletedView
  ])
);

const createTodo = pipe([
  pick('matchedElement'),
  transform({
    content: closest('#content'),
    result: pipe([
      callMethod(pick('value'), 'trim'),
      method(store, 'addTodo')
    ])
  }),
  ifElse(
    pipe([pick('result'), equals(false)]),
    always(false),
    pipe([
      tap(clearInput),
      tap(renderNewTodo),
      tap(renderItemsLeft),
      tap(renderClearCompleted)
    ])
  )
]);

const newTodo = ifElse(
  isEnter,
  createTodo,
  identity
);


export const newTodoEventHandler = eventHandler('keypress', '[data-js=new-todo]', newTodo);
