
import { callMethod, equals, identity, ifElse, isEmpty, pick, pipe } from '@yagni-js/yagni';
import { eventHandler } from '@yagni-js/yagni-dom';

import { debug } from './logger';


const isEnter = pipe([
  pick('originalEvent'),
  pick('code'),
  equals('Enter')
]);

const createTodo = pipe([
  pick('matchedElement'),
  callMethod(pick('value'), 'trim'),
  ifElse(
    equals(''),
    identity,
    debug
  )
]);

const newTodoHandler = ifElse(
  isEnter,
  createTodo,
  identity
);


export const newTodo = eventHandler('keypress', '[data-js=new-todo]', newTodoHandler);
