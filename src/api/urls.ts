// const {hostname} = window.location;

// export const host = process.env.REACT_APP_PROD_URL; // Production url
const host = '2fm3on5exc.execute-api.us-east-1.amazonaws.com';
// export const host = /dev|local/.test(hostname)
//   ? process.env.REACT_APP_DEV_URL // in case its the local environment connect to development
//   : /uat/.test(hostname)
//     ? process.env.REACT_APP_STAGE_URL
//     : process.env.REACT_APP_QA_URL // Production url

const baseUrl = `https://${host}`;

export const getEventsUrl = () => `${baseUrl}/events`;
export const createEventUrl = () => `${baseUrl}/events`;
export const updateEventUrl = (id: number) => `${baseUrl}/events/${id}`;
export const deleteEventUrl = (id: number) => `${baseUrl}/events${id}`;
export const uploadEventPhotosUrl = (id: number) =>
  `${baseUrl}/events/upload/${id}`;
