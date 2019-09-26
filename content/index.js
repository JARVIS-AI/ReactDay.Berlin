const { GraphQLClient } = require('graphql-request');

const { development, conferenceTitle, eventYear } = require('./config');
const textContent = require('./fetch-text');
const pageContent = require('./fetch-page');
const brandContent = require('./fetch-brand');
const speakerContent = require('./fetch-speaker');

const createClient = ({ endpoint, token }) => {
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

const client = createClient(development);

const getContent = async() => {
  const fetchAll = [textContent, pageContent, brandContent, speakerContent].map(
    async content =>
      await content.fetchData(client, { conferenceTitle, eventYear })
  );

  const contentArray = await Promise.all(fetchAll);
  const contentMap = contentArray.reduce(
    (content, piece) => ({ ...content, ...piece }),
    {}
  );
  console.log('TCL: getContent -> contentMap\n\n', contentMap);
  return contentMap;
};

module.exports = {
  getContent,
};
