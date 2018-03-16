
import { map, pick, pipe, transform } from '@yagni-js/yagni';
import { query, queryFirst } from '@yagni-js/yagni-dom';

import { debug } from './logger';


const serializeTodo = transform({
  completed: pipe([queryFirst('[name=is-completed]'), pick('checked')]),
  title: pipe([queryFirst('[name=title]'), pick('value')])
});

export const serializeTodos = pipe([
  query('[data-js=todo-list] li'),
  map(serializeTodo)
]);
