
import { call, pick, pipe } from '@yagni-js/yagni';
import { queryFirst, renderR } from '@yagni-js/yagni-dom';

import { debug } from '../logger';
import { clearCompletedView, itemsLeftView, toggleAllView } from '../views';


export function toInt(num) {
  return parseInt(num, 10);
}

function render(query, view) {
  return call(
    pipe([
      pick('content'),
      queryFirst(query),
      renderR
    ]),
    pipe([
      pick('result'),
      view
    ])
  );
}

export const renderItemsLeft = render('[data-js=items-left]', itemsLeftView);
export const renderClearCompleted = render('[data-js=clear-completed]', clearCompletedView);
export const renderToggleAll = render('[data-js=toggle-all]', toggleAllView);
