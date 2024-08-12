import ReactDOM from 'react-dom/client';
import React, { FC } from 'react';

export function RenderClientPage(
  PageComponent: (() => React.ReactElement) | FC,
  root: string | HTMLElement = 'client-root',
): void {
  root = typeof root === 'string' ? document.getElementById(root) : root;
  if (!root) {
    return console.warn('Root element not found');
  }
  ReactDOM.createRoot(root as HTMLElement).render(<PageComponent />);
}

export function LoadFor(element: string | HTMLElement, loader: (el: HTMLElement) => Promise<any>) {
  const el = typeof element === 'string' ? document.getElementById(element) : element;
  if (el) {
    return loader(el as HTMLElement);
  }
}
