
import { call, ifElse, method, pick, pickPath, pipe, tap, transform } from '@yagni-js/yagni';
import { addClass, closest, eventHandler, getProp, queryFirst, removeClass, renderR } from '@yagni-js/yagni-dom';

import { debug } from '../logger';
import { itemsLeftView, todoView } from '../views';
import { store } from '../store';

import { renderItemsLeft, renderClearCompleted } from './common';


function toInt(num) {
  return parseInt(num, 10);
}

const reRenderTodo = call(
  pipe([
    pick('el'),
    renderR
  ]),
  pipe([
    pickPath(['result', 'todo']),
    todoView
  ])
);

const toggleCompleted = pipe([
  pick('matchedElement'),
  transform({
    content: closest('#content'),
    el: closest('[data-js=todo]'),
    completed: getProp('checked'),
    result: pipe([
      closest('[data-js=todo]'),
      queryFirst('[name=id]'),
      getProp('value'),
      toInt,
      method(store, 'toggleTodoCompleted')
    ])
  }),
  tap(reRenderTodo),
  tap(renderItemsLeft),
  tap(renderClearCompleted)
]);


export const toggleCompletedEventHandler = eventHandler(
  'change',
  '[name=completed]',
  toggleCompleted
);
