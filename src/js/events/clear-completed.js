
import { map, method, pick, pipe, tap, transform } from '@yagni-js/yagni';
import { closest, eventHandler, query, remove } from '@yagni-js/yagni-dom';

import { debug } from '../logger';
import { itemsLeftView, todoView } from '../views';
import { store } from '../store';

import { getAndMergeFilterValue, renderFooter, renderToggleAll } from './common';


const removeCompletedTodos = pipe([
  pick('content'),
  query('[data-js=todo-list] .completed[data-js=todo]'),
  map(remove)
]);

const clearCompleted = pipe([
  pick('matchedElement'),
  transform({
    content: closest('#content'),
    result: method(store, 'clearCompleted')
  }),
  tap(removeCompletedTodos),
  getAndMergeFilterValue,
  tap(renderFooter),
  tap(renderToggleAll)
]);


export const clearCompletedEventHandler = eventHandler(
  'click',
  '[data-js=clear-completed]',
  clearCompleted
);
