!(async () => {
  const infoBlock = document?.getElementById?.('uiCoreData');

  const parsed =
    ((text) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        return {};
      }
    })(infoBlock?.textContent || '{}') || {};

  if (infoBlock) {
    infoBlock?.remove?.();
  }

  (window as Record<string, any>).appCore = {
    get(name: string) {
      return parsed[name];
    },
  };
})();
