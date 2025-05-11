
export const parseEstimate = (estimate: number) => {
  if (!estimate) {
    return `-`;
  }
  //convert from minutes to hours and minutes
  const hours = Math.floor(estimate / 60);
  const minutes = estimate % 60;

  // Write as 1h30m

  if (estimate > 60) {
    return `${hours}hr ${minutes}min`;
  }
};

export const parseProgress = (progress: number) => {
  const hours = Math.floor(progress / 3600);
  const minutes = Math.floor((progress % 3600) / 60);
  const seconds = Math.floor((progress % 3600) % 60);

  const format = (unit: number) => (unit < 10 ? `0${unit}` : `${unit}`);

  if (progress > 3600) {
    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
  }

  return `${format(minutes)}:${format(seconds)}`;
};
