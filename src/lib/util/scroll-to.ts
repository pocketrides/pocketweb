export const scrollToEnhanced = (looper: () => void, final?: () => void) => {
  // try {
  //   looper();
  // } catch (e) {}

  // setTimeout(() => {
  //   try {
  //     looper();
  //   } catch (e) {}
  // }, 100);

  // setTimeout(() => {
  //   try {
  //     looper();
  //   } catch (e) {}
  // }, 250);

  setTimeout(() => {
    try {
      looper();
      if (final) final();
    } catch (e) {}
  }, 350);
};
