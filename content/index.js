const { GraphQLClient } = require('graphql-request');

const { credentials, conferenceTitle, eventYear } = require('./config');
const textContent = require('./fetch-texts');
const pageContent = require('./fetch-pages');
const brandContent = require('./fetch-brand');
const speakerContent = require('./fetch-speakers');
const sponsorContent = require('./fetch-sponsors');
const talksContent = require('./fetch-talks');
const workshopContent = require('./fetch-workshops');

const createClient = ({ endpoint, token }) => {
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

const client = createClient(credentials);

const getContent = async() => {
  const fetchAll = [
    textContent,
    pageContent,
    brandContent,
    speakerContent,
    sponsorContent,
    talksContent,
    workshopContent,
  ].map(
    async content =>
      await content.fetchData(client, { conferenceTitle, eventYear })
  );

  const contentArray = await Promise.all(fetchAll);
  const contentMap = contentArray.reduce(
    (content, piece) => ({ ...content, ...piece }),
    {}
  );
  return contentMap;
};

module.exports = {
  getContent,
};
