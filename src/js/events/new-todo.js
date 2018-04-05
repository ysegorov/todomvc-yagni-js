
import { always, call, callMethod, equals, identity, ifElse, method, pick, pickPath, pipe, transform, tap } from '@yagni-js/yagni';
import { closest, eventHandler, queryFirst, render, setProp } from '@yagni-js/yagni-dom';

import { debug } from '../logger';
import { todoView } from '../views';
import { store } from '../store';

import { renderItemsLeft, renderClearCompleted, renderToggleAll } from './common';


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
    pickPath(['result', 'todo']),
    todoView
  ])
);

const clearInput = pipe([
  pick('content'),
  queryFirst('[data-js=new-todo]'),
  setProp('value', '')
]);

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
      tap(renderClearCompleted),
      tap(renderToggleAll)
    ])
  )
]);

const newTodo = ifElse(
  isEnter,
  createTodo,
  identity
);


export const newTodoEventHandler = eventHandler('keypress', '[data-js=new-todo]', newTodo);
