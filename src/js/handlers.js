
import { always, call, objOf, pick, pipe, tap } from '@yagni-js/yagni';
import { addListener, hToDOM, query, renderR } from '@yagni-js/yagni-dom';

import { debug } from './logger';
import { doc } from './globals';
import * as store from './store';
import { appView } from './views';


export const mainpage = call(
  pipe([always(doc), pick('body'), query('#content'), renderR]),
  pipe([store.getAll, appView])
);

export const active = call(
  pipe([always(doc), pick('body'), query('#content'), renderR]),
  pipe([store.getActive, appView])
);

export const completed = call(
  pipe([always(doc), pick('body'), query('#content'), renderR]),
  pipe([store.getCompleted, appView])
);
