export const scrollToEnhanced = (looper: () => void) => {
  try {
    looper();
  } catch (e) {}

  setTimeout(() => {
    try {
      looper();
    } catch (e) {}
  }, 575);
};
