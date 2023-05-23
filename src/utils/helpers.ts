export const formatTime = (epochTime: number) => {
  const formattedTime = new Date(epochTime).toISOString();
  return formattedTime;
};
