
import { always, call, pick, pipe } from '@yagni-js/yagni';
import { addListener, hToDOM, query, prependTo } from '@yagni-js/yagni-dom';

import { debug } from './logger';
import { win } from './globals';
import { appView } from './views';


const onLoadHandler = call(
  pipe([pick('target'), pick('body'), prependTo]),
  pipe([always({}), appView, hToDOM])
);

const onLoad = addListener({event: 'load', handler: onLoadHandler});

export default onLoad(win);
