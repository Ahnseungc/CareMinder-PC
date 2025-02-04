export const isElectron = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf(" electron/") > -1) {
    return true;
  }

  // @ts-ignore
  if (window.electron) {
    return true;
  }

  return false;
};
