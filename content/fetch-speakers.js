const { markdownToHtml } = require('./markdown');

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
  str && `speaker--${str.toLowerCase().replace('lightgreen', 'light-green')}`;

const fetchData = async(client, vars) => {
  const data = await client
    .request(queryPages, vars)
    .then(res => res.conf.year[0].speakers);

  const speakers = data
    .map(item => ({
      ...item.speaker,
      ...item,
      avatar: item.speaker.avatar || {},
      mod: overlay(item.overlayMode),
    }))
    .map(
      async({
        bio,
        githubUrl,
        twitterUrl,
        speaker,
        overlayMode,
        avatar,
        ...item
      }) => ({
        ...item,
        company: `${item.company}, ${item.country}`,
        avatar: avatar.url,
        text: await markdownToHtml(bio),
        github: githubUrl,
        twitter: twitterUrl,
      })
    );

  return {
    speakers: await Promise.all(speakers),
  };
};

module.exports = {
  fetchData,
};
