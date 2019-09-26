const queryPages = /* GraphQL */ `
  query($conferenceTitle: ConferenceTitle, $eventYear: EventYear) {
    conf: conferenceBrand(where: { title: $conferenceTitle }) {
      id
      status
      year: conferenceEvents(where: { year: $eventYear }) {
        id
        status
        pages {
          titleSeo
          description
          seoDescription
          key
          titlePage
          pageSlogan
          pageStatistics
          themeColor {
            hex
          }
          keywords
        }
      }
    }
  }
`;

const fetchData = async(client, vars) => {
  const pages = await client
    .request(queryPages, vars)
    .then(res => res.conf.year[0].pages);

  const subContent = pages.reduce(
    (obj, item) => ({
      ...obj,
      [item.key]: { ...item, keywords: item.keywords.join(', ') },
    }),
    {}
  );
  return {
    pages: subContent,
  };
};

module.exports = {
  fetchData,
};
