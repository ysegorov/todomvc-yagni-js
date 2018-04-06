
import { call, merge, objOf, pick, pipe, transform } from '@yagni-js/yagni';
import { getAttr, queryFirst, renderR } from '@yagni-js/yagni-dom';

import { debug } from '../logger';
import { footerView, toggleAllView } from '../views';


export function toInt(num) {
  return parseInt(num, 10);
}

const getFilter = pipe([
  pick('content'),
  queryFirst('[data-js=footer]'),
  getAttr('data-filter'),
  objOf('filter')
]);

export const getAndMergeFilterValue = transform({
  content: pick('content'),
  result: call(
    pipe([
      getFilter,
      merge
    ]),
    pick('result')
  )
});

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

export const renderFooter = render('[data-js=footer]', footerView);
export const renderToggleAll = render('[data-js=toggle-all]', toggleAllView);
