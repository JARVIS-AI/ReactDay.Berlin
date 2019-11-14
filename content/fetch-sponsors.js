const queryPages = /* GraphQL */ `
  query($conferenceTitle: ConferenceTitle, $eventYear: EventYear) {
    conf: conferenceBrand(where: { title: $conferenceTitle }) {
      id
      status
      year: conferenceEvents(where: { year: $eventYear }) {
        id
        status
        sponsors: pieceOfSponsorInfoes {
          status
          id
          category
          sponsor {
            id
            status
            title
            site
            avatar {
              url(
                transformation: {
                  image: { resize: { width: 600 } },
                  document: { output: { format: jpg } } 
                }
              )
            }
          }
          width
        }
      }
    }
  }
`;

const fetchData = async(client, vars) => {
  const data = await client
    .request(queryPages, vars)
    .then(res => res.conf.year[0].sponsors);

  const sponsorsList = data
    .map(item => ({
      ...item.sponsor,
      ...item,
      avatar: item.sponsor.avatar || {},
    }))
    .map(({ site, avatar, title, width, category }) => ({
      category,
      alt: title,
      img: avatar.url,
      link: site,
      width,
    }))
    .filter(({ img }) => img);

  const titlesMap = {
    Gold: 'Gold',
    Silver: 'Silver',
    Partner: 'Partners',
  };
  const sponsors = ['Gold', 'Silver', 'Partner'].map(cat => ({
    title: titlesMap[cat],
    list: sponsorsList.filter(({ category }) => category === cat),
  }));

  return {
    sponsors,
  };
};

module.exports = {
  fetchData,
};
