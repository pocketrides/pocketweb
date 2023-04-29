export const scrollToEnhanced = (looper: () => void, final?: () => void) => {
  try {
    looper();
  } catch (e) {}

  setTimeout(() => {
    try {
      looper();
      if (final) final();
    } catch (e) {}
  }, 475);
};
