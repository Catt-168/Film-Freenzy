export function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function capitalizeFirstLetterinSentence(sentence) {
  return sentence.replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
}

export function formatReadableDate(movieDate) {
  return new Date(movieDate).getFullYear();
}

export function formatReadableExactDate(movieDate) {
  return new Date(movieDate).getDate();
}

export function convertMinutesToHoursAndMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return { hours, remainingMinutes };
}
