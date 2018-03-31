
import { always, objOf, pick, pipe, tap } from '@yagni-js/yagni';
import { addListener, delegate } from '@yagni-js/yagni-dom';
import { hashRouter, url } from '@yagni-js/yagni-router';

import { debug } from './logger';
import { win } from './globals';
import * as handlers from './handlers';

import { newTodoEventHandler } from './events/new-todo';
import { toggleCompletedEventHandler } from './events/toggle-completed';
import { destroyTodoEventHandler } from './events/destroy-todo';


const urls = [
  url(/^\/?(active|completed)?$/, handlers.appHandler),
];

const appEvents = [
  newTodoEventHandler,
  toggleCompletedEventHandler,
  destroyTodoEventHandler
];

const router = hashRouter(urls);

const delegateEvents = tap(
  pipe([
    pick('target'),
    pick('body'),
    delegate(appEvents)
  ])
);

const onLoadHandler = pipe([
  delegateEvents,
  always(win),
  objOf('target'),
  router
]);

const onLoad = pipe([
  addListener({event: 'hashchange', handler: router}),
  addListener({event: 'load', handler: onLoadHandler})
]);

export default onLoad(win);
