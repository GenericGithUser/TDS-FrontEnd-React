let navigateRef = null;

export const setNavigateB = (fn) => {
  navigateRef = fn;
};

export const navigateB = (path, options = {}) => {
  if (navigateRef) navigateRef(path, options);
  else window.location.href = path; // Fallback
};