const queryPages = /* GraphQL */ `
  query($conferenceTitle: ConferenceTitle, $eventYear: EventYear) {
    conf: conferenceBrand(where: { title: $conferenceTitle }) {
      id
      status
      year: conferenceEvents(where: { year: $eventYear }) {
        id
        status
        speakers: pieceOfSpeakerInfoes {
          status
          id
          overlayMode
          label
          speaker {
            id
            name
            company
            country
            bio
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

const overlay = str =>
  `speaker--${str.toLowerCase().replace('lightgreen', 'light-green')}`;

const fetchData = async(client, vars) => {
  const data = await client
    .request(queryPages, vars)
    .then(res => res.conf.year[0].speakers);

  const speakers = data
    .map(item => ({
      ...item.speaker,
      ...item,
      mod: overlay(item.overlayMode),
    }))
    .map(({ bio, githubUrl, twitterUrl, speaker, overlayMode, ...item }) => ({
      ...item,
      company: `${item.company}, ${item.country}`,
      avatar: item.avatar.url,
      text: bio,
      github: githubUrl,
      twitter: twitterUrl,
    }));

  return {
    speakers,
  };
};

module.exports = {
  fetchData,
};
