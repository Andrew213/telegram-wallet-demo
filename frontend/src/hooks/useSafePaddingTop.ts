const useSafePaddingTop = () => {
  const safeAreInsentTop = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--tg-safe-area-inset-top",
    ),
    10,
  );
  const contentSafeAreaInsentTop = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--tg-content-safe-area-inset-top",
    ),
    10,
  );

  return safeAreInsentTop + contentSafeAreaInsentTop;
};

export default useSafePaddingTop;
