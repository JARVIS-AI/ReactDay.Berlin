const { GraphQLClient } = require('graphql-request');

const { development, conferenceTitle, eventYear } = require('./config');
const textContent = require('./fetch-text');
// const eventContent = require('./fetch-event');

const createClient = ({ endpoint, token }) => {
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

const client = createClient(development);

/*
TODO: Pass
conferenceKey
eventKey
to queries
*/
const getContent = async() => {
  const fetchAll = [textContent].map(
    async content =>
      await textContent.fetchData(client, { conferenceTitle, eventYear })
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
