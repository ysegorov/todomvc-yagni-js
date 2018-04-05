
import { always, call, identity, ifElse, isNil, method, objOf, pick, pickFrom, pipe, result, tap, transform } from '@yagni-js/yagni';
import { addListener, hToDOM, query, renderR } from '@yagni-js/yagni-dom';

import { debug } from './logger';
import { doc } from './globals';
import { store } from './store';
import { appView } from './views';


const urlStoreMap = {
  '': method(store, 'getAll'),
  'active': method(store, 'getActive'),
  'completed': method(store, 'getCompleted')
};


const prepareView = pipe([
  pick(1),
  ifElse(
    isNil,
    always(''),
    identity
  ),
  transform({
    filter: identity,
    items: pipe([
      pickFrom(urlStoreMap),
      result
    ]),
    stats: method(store, 'getStats')
  }),
  appView
]);

const prepareRenderer = pipe([
  always(doc),
  pick('body'),
  query('#content'),
  renderR
]);

export const appHandler = call(
  prepareRenderer,
  prepareView
);
