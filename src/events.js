import { traversePath } from './utils.js';

const callbacks = [];

export function on(path, fn, { once = false } = {}) {
  const callback = traversePath(callbacks, path);
  if (once) {
    const orig = fn;
    fn = (...args) => {
      off(path, fn);
      orig(...args);
    }
  }

  callback.push(fn);
}

export function off(path, fn) {
  const callback = traversePath(callbacks, path);
  if (callback.indexOf(fn) < 0) {
    return;
  }

  callback.splice(callback.indexOf(fn), 1);
}

export function emit(path, ...args) {
  [...traversePath(callbacks, path)].map(fn => {  // clone
    fn(...args);
  });
}