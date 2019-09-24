const { GraphQLClient } = require('graphql-request');

const { development } = require('./config');

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
  const data = await client.request(queryTexts).then(res => res.pieceOfTexts);
  const subContent = data.reduce(
    (obj, item) => ({
      ...obj,
      [item.key]: item.markdown,
    }),
    {}
  );
  return {
    welcome: subContent,
  };
};

const getContent = async() => {
  const content = await fetchData();
  console.log('TCL: getContent -> content', content);
  return content;
};

module.exports = {
  getContent,
};
