
import { call, pick, pipe } from '@yagni-js/yagni';
import { queryFirst, renderR } from '@yagni-js/yagni-dom';

import { debug } from '../logger';
import { clearCompletedView, itemsLeftView } from '../views';


export const renderItemsLeft = call(
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

export const renderClearCompleted = call(
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
