
import { always, objOf, pipe } from '@yagni-js/yagni';
import { addListener } from '@yagni-js/yagni-dom';
import { hashRouter, url } from '@yagni-js/yagni-router';

import { debug } from './logger';
import { win } from './globals';
import * as handlers from './handlers';


const urls = [
  url(/^$/, handlers.mainpage),
  url(/^active$/, handlers.active),
  url(/^completed$/, handlers.completed)
];

const router = hashRouter(urls);

const onLoadHandler = pipe([
  always(win),
  objOf('target'),
  router
]);

const onLoad = pipe([
  addListener({event: 'hashchange', handler: router}),
  addListener({event: 'load', handler: onLoadHandler})
]);

export default onLoad(win);
