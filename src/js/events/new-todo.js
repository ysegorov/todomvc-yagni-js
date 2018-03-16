
import { always, call, callMethod, equals, identity, ifElse, isEmpty, omit, pick, pipe, transform, tap } from '@yagni-js/yagni';
import { closest, eventHandler, queryFirst, render, setProp } from '@yagni-js/yagni-dom';

import { debug } from '../logger';
import { todoView } from '../views';
import { serializeTodos } from '../serialize';
import { save } from '../store';


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
    omit('content'),
    todoView
  ])
);

const clearInput = pipe([
  pick('content'),
  queryFirst('[data-js=new-todo]'),
  setProp('value', '')
]);

const updateStore = pipe([
  pick('content'),
  serializeTodos,
  save
]);

const createTodo = pipe([
  pick('matchedElement'),
  transform({
    content: closest('#content'),
    title: callMethod(pick('value'), 'trim'),
    completed: always(false)
  }),
  ifElse(
    pipe([pick('title'), equals('')]),
    always(false),
    pipe([
      tap(renderNewTodo),
      tap(clearInput),
      tap(updateStore)
    ])
  )
]);

const newTodo = ifElse(
  isEnter,
  createTodo,
  identity
);


export const newTodoEventHandler = eventHandler('keypress', '[data-js=new-todo]', newTodo);
