
import { method, tap } from '@yagni-js/yagni';
import { console } from './globals';


export const debug = tap(method(console, 'log'));
