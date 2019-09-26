const queryPages = /* GraphQL */ `
  query($conferenceTitle: ConferenceTitle) {
    conf: conferenceBrand(where: { title: $conferenceTitle }) {
      id
      status
      city
      url
      title
      slackUrl
      twitterUrl
      facebookUrl
      mediumUrl
      youtubeUrl
    }
  }
`;

const fetchData = async(client, vars) => {
  const conference = await client
    .request(queryPages, vars)
    .then(res => res.conf);

  return {
    conference,
  };
};

module.exports = {
  fetchData,
};
