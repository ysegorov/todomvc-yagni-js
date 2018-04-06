
import { method, pick, pipe, tap, transform } from '@yagni-js/yagni';
import { closest, eventHandler, queryFirst, remove, getProp } from '@yagni-js/yagni-dom';

import { debug } from '../logger';
import { todoView } from '../views';
import { store } from '../store';

import { getAndMergeFilterValue, renderFooter, renderToggleAll, toInt } from './common';


const removeTodoEl = pipe([
  pick('el'),
  remove
]);

const destroyTodo = pipe([
  pick('matchedElement'),
  transform({
    content: closest('#content'),
    el: closest('[data-js=todo]'),
    result: pipe([
      closest('[data-js=todo]'),
      queryFirst('[name=id]'),
      getProp('value'),
      toInt,
      method(store, 'destroyTodo')
    ])
  }),
  pipe([
    tap(removeTodoEl),
    getAndMergeFilterValue,
    tap(renderFooter),
    tap(renderToggleAll)
  ])
]);


export const destroyTodoEventHandler = eventHandler('click', '[data-js=destroy-todo]', destroyTodo);
