
import { always, call, pick, pipe } from '@yagni-js/yagni';
import { addListener, hToDOM, query, prependTo } from '@yagni-js/yagni-dom';

import { debug } from './logger';
import { win } from './globals';
import * as store from './store';
import { appView } from './views';


const onLoadHandler = call(
  pipe([pick('target'), pick('body'), prependTo]),
  pipe([store.getAll, appView, hToDOM])
);

const onLoad = addListener({event: 'load', handler: onLoadHandler});

export default onLoad(win);
