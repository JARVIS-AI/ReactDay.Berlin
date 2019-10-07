const queryPages = /* GraphQL */ `
  query($conferenceTitle: ConferenceTitle, $eventYear: EventYear) {
    conf: conferenceBrand(where: { title: $conferenceTitle }) {
      id
      status
      year: conferenceEvents(where: { year: $eventYear }) {
        id
        status
        schedule: daySchedules(where: { talks_some: {} }) {
          id
          status
          additionalEvents
          date
          talks {
            id
            status
            timeString
            title
            description
            track {
              id
              status
              name
              isPrimary
            }
            speaker {
              name
              company
              country
              pieceOfSpeakerInfoes(
                where: { conferenceEvent: { year: $eventYear } }
              ) {
                label
                overlayMode
              }
            }
          }
        }
      }
    }
  }
`;

const byTime = (a, b) => {
  const aTime = new Date(`1970/01/01 ${a.time}`);
  const bTime = new Date(`1970/01/01 ${b.time}`);
  return aTime - bTime;
};

const fetchData = async(client, vars) => {
  const data = await client
    .request(queryPages, vars)
    .then(res => res.conf.year[0].schedule[0]);

  const talks = data.talks
    .map(({ title, description, timeString, track, speaker }) => {
      try {
        return {
          title,
          text: description,
          time: timeString,
          track: track && track.name,
          name: speaker && speaker.name,
          place: speaker && `${speaker.company}, ${speaker.country}`,
          pieceOfSpeakerInfoes:
            (speaker && speaker.pieceOfSpeakerInfoes[0]) || {},
        };
      } catch (err) {
        console.log('\nError in parsing talks');
        console.error(err);
        return {};
      }
    })
    .map(({ pieceOfSpeakerInfoes, ...talk }) => {
      try {
        return (
          talk.title && {
            ...talk,
            speaker: talk.name,
            from: talk.place,
            label: pieceOfSpeakerInfoes.label,
            labelColor: (pieceOfSpeakerInfoes.overlayMode || '').toLowerCase(),
          }
        );
      } catch (err) {
        console.log('\nError in parsing talks', talk);
        console.error(err);
        return null;
      }
    })
    .filter(Boolean);

  const tracks = [...new Set(talks.map(({ track }) => track).filter(Boolean))]
    .map(track => data.talks.find(talk => talk.track.name === track).track)
    .sort((a, b) => {
      return +b.isPrimary - +a.isPrimary;
    })
    .map(({ name }) => name);

  const schedule = tracks
    .map(track => ({
      tab: track,
      list: [...data.additionalEvents, ...talks]
        .filter(event => event.track === track)
        .reduce((list, talk) => {
          const sameTitleTalk = list.find(({ title }) => title === talk.title);
          // we really need Abstract Equality Comparison here because from graph-ql will come null while JSON will have undefined
          const isRealSame = sameTitleTalk && sameTitleTalk.time == talk.time;
          if (isRealSame) return list;
          return [talk, ...list];
        }, [])
        .sort(byTime),
    }))
    .filter(({ list }) => list.length);

  return {
    schedule,
    tracks,
    talks,
  };
};

module.exports = {
  fetchData,
};
