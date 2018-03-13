
import { always, call, objOf, pick, pipe, tap } from '@yagni-js/yagni';
import { addListener, hToDOM, query, prependTo } from '@yagni-js/yagni-dom';

import { debug } from './logger';
import { doc } from './globals';
import * as store from './store';
import { appView } from './views';


export const mainpage = call(
  pipe([always(doc), pick('body'), prependTo]),
  pipe([store.getAll, appView, hToDOM])
);

export const active = call(
  pipe([always(doc), pick('body'), prependTo]),
  pipe([store.getActive, appView, hToDOM])
);

export const completed = call(
  pipe([always(doc), pick('body'), prependTo]),
  pipe([store.getCompleted, appView, hToDOM])
);
