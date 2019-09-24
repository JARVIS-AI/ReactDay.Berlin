const { GraphQLClient } = require('graphql-request');

const { development } = require('./config');
const { markdownToHtml } = require('./markdown');

const createClient = ({ endpoint, token }) => {
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

const client = createClient(development);

const queryTexts = /* GraphQL */ `
  query {
    pieceOfTexts {
      status
      updatedAt
      createdAt
      id
      markdown
      key
    }
  }
`;

const fetchData = async() => {
  const pieceOfTexts = await client
    .request(queryTexts)
    .then(res => res.pieceOfTexts);

  const pieceOfHTMLs = await Promise.all(
    pieceOfTexts.map(async item => ({
      ...item,
      html: await markdownToHtml(item.markdown),
    }))
  );

  const subContent = pieceOfHTMLs.reduce(
    (obj, item) => ({
      ...obj,
      [item.key]: item.html,
    }),
    {}
  );
  return {
    welcome: subContent,
  };
};

const getContent = async() => {
  const content = await fetchData();
  return content;
};

module.exports = {
  getContent,
};
