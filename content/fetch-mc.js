const queryPages = /* GraphQL */ `
  query($conferenceTitle: ConferenceTitle, $eventYear: EventYear) {
    conf: conferenceBrand(where: { title: $conferenceTitle }) {
      id
      status
      year: conferenceEvents(where: { year: $eventYear }) {
        id
        status
        mcs {
          id
          speaker {
            id
            name
            bio
            company
            country
            companySite
            githubUrl
            twitterUrl
          }
        }
      }
    }
  }
`;

const fetchData = async(client, vars) => {
  const data = await client
    .request(queryPages, vars)
    .then(res => res.conf.year[0].mcs);

  const mcs = data.map(m => ({ ...m.speaker }));

  return {
    mcs,
  };
};

module.exports = {
  fetchData,
};
