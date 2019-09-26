const conferenceTitle = 'React_Day_Berlin';
const eventYear = 'Y2019';

const credentials = {
  endpoint: process.env.CMS_ENDPOINT,
  token: process.env.CMS_TOKEN,
};

module.exports = {
  conferenceTitle,
  eventYear,
  credentials,
};
