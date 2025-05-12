export const parseEstimate = (estimate: string) => {
  if (estimate.includes('h')) {
    const parts = estimate.split('h');
    const hours = parseInt(parts[0], 10);
    if (estimate.includes('m')) {
      const minutes = parseInt(parts[1].replace('m', ''), 10);
      return hours * 60 + minutes;
    }

    const minutes = parseInt(parts[1], 10);
    return hours * 60 + minutes;
  }

   const parts = estimate.split(':');
   if (parts.length === 2) {
     const hours = parseInt(parts[0], 10);
     const minutes = parseInt(parts[1], 10);
     return hours * 60 + minutes;
   }
};

export const formatEstimate = (estimate: number) => {

  
  if (!estimate) {
    return `-`;
  }
  //convert from seconds to hours and minutes
  const hours = Math.floor(estimate / 3600);
  const minutes = Math.floor((estimate % 3600) / 60);
  // Write as 1h30m

  if (estimate > 3600) {
    return `${hours}hr ${minutes}min`;
  }

  return `${minutes}min`;
};

export const formatProgress = (progress: number) => {
  const hours = Math.floor(progress / 3600);
  const minutes = Math.floor((progress % 3600) / 60);
  const seconds = Math.floor((progress % 3600) % 60);

  const format = (unit: number) => (unit < 10 ? `0${unit}` : `${unit}`);

  if (progress > 3600) {
    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
  }

  return `${format(minutes)}:${format(seconds)}`;
};
