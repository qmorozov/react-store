export function safeJsonParse<T>(s: string, def: T = null): T | null {
  try {
    return JSON.parse(s) || def;
  } catch (e) {
    return def;
  }
}

export class ArrayLinked<T, K extends keyof T = any> extends Map<T[K], T> {
  constructor(key: K, list: T[] = []) {
    super(list.map((item) => [item?.[key], item] as [T[K], T]));
  }

  list() {
    return Array.from(this.values());
  }
}

export function PromiseQueue(list, callback, init: Promise<any> = Promise.resolve()): Promise<any> {
  return list.reduce((p, currentValue) => {
    return p.then(() => callback(currentValue));
  }, init);
}
