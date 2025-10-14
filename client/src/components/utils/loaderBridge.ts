let showFn: (() => void) | null = null;
let hideFn: (() => void) | null = null;

export const setGlobalLoader = (show: () => void, hide: () => void) => {
  showFn = show;
  hideFn = hide;
};

export const globalLoader = {
  show: () => showFn?.(),
  hide: () => hideFn?.(),
};
