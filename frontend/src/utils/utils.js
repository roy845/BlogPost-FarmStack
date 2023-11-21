export const limitChars = (text, limit) => {
  if (text.length > limit) {
    return text.slice(0, limit) + "...";
  }
  return text;
};

export const isValidImageExtension = (url) => {
  const validImageExtensions = ["jpg", "jpeg", "png", "gif"];
  const extension = url.split(".").pop().toLowerCase();
  return validImageExtensions.includes(extension);
};
