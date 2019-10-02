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
            avatar {
              url
            }
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

  console.log("TCL: fetchData -> mcs", JSON.stringify(mcs, null, 2))
  return {
    mcs,
  };
};

module.exports = {
  fetchData,
};
