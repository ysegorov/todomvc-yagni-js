
import { always, filter, identity, ifElse, isNil, method, not, pick, pipe } from '@yagni-js/yagni';

import { debug } from './logger';
import { storage } from './globals';


const key = 'todos-yagni-js';

const isCompleted = pick('completed');


export const getAll = pipe([
  always(storage),
  pick(key),
  ifElse(
    isNil,
    always([]),
    method(JSON, 'decode')
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
