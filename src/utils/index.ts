export const truncateText = (text: string, maxLength = 500) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};