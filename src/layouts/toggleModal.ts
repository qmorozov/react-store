export const toggleModal = (elementToToggleSelector: string, triggerElementSelector: string) => {
  const elementToToggle = document.querySelector<HTMLElement>(elementToToggleSelector);
  const triggerElement = document.querySelector<HTMLElement>(triggerElementSelector);
  const body = document.querySelector<HTMLElement>('body');

  if (!elementToToggle || !triggerElement || !body) {
    return;
  }

  triggerElement.addEventListener('click', () => {
    elementToToggle.classList.toggle('--open');
    body.classList.toggle('--modal-open');
  });

  document.addEventListener('click', (event: MouseEvent) => {
    const targetElement = (event.target as HTMLElement).closest<HTMLElement>(
      `${triggerElementSelector}, ${elementToToggleSelector}`,
    );
    if (!targetElement || (event.target as HTMLElement).classList.contains('--close-button')) {
      elementToToggle.classList.remove('--open');
      body.classList.remove('--modal-open');
    }
  });
};
