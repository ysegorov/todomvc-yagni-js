
import { always, callMethod2, filter, identity, ifElse, isNil, method, not, pick, pipe } from '@yagni-js/yagni';

import { debug } from './logger';
import { storage } from './globals';


const key = 'todos-yagni-js';

const isCompleted = pick('completed');


export const getAll = pipe([
  always(key),
  method(storage, 'getItem'),
  ifElse(
    isNil,
    always([]),
    method(JSON, 'parse')
  )
]);

export const getCompleted = pipe([
  getAll,
  filter(isCompleted)
]);

export const getActive = pipe([
  getAll,
  filter(not(isCompleted))
]);

export const save = callMethod2(
  always(storage),
  'setItem',
  key,
  method(JSON, 'stringify')
);
