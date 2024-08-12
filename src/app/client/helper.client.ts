export function className(classCondition: Record<string, boolean>) {
  return Object.entries(classCondition)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(' ');
}

export type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

export function coreInfo<T>(name: string, def: T): T {
  return (window as Record<string, any>).appCore?.get?.(name) ?? def;
}

export function redirectToAuth(currentUser) {
  const url = window.location;
  if (!currentUser.signed) {
    return (url.href = `/auth?redirect=${url.pathname}`);
  }
  return null;
}

export function initRedirectSelect(selector = `[data-select-redirect]`) {
  return (document.querySelectorAll(selector) || []).forEach((el) => {
    (el as HTMLSelectElement).addEventListener('change', (evt) => {
      return (window.location.href = (evt.target as HTMLSelectElement).value);
    });
  });
}
