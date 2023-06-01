export const formatTime = (epochTime: number) => {
  const formattedTime = new Date(epochTime).toISOString();
  return formattedTime;
};

export const formatISOToDateString = (dateString: string) => {
  const date = new Date(dateString);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  const formattedDateTime = date.toLocaleString(undefined, options);

  return formattedDateTime;
};
