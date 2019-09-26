const { markdownToHtml } = require('./markdown');

const queryTexts = /* GraphQL */ `
  query($conferenceTitle: ConferenceTitle, $eventYear: EventYear) {
    conf: conferenceBrand(where: { title: $conferenceTitle }) {
      id
      status
      year: conferenceEvents(where: { year: $eventYear }) {
        id
        status
        renderStyle
        pieceOfTexts {
          key
          markdown
        }
      }
    }
  }
`;

const fetchData = async(client, vars) => {
  const pieceOfTexts = await client
    .request(queryTexts, vars)
    .then(res => res.conf.year[0].pieceOfTexts);

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
    pagesPieceOfTexts: subContent,
  };
};

module.exports = {
  fetchData,
};
