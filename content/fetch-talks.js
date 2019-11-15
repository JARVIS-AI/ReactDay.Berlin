const { markdownToHtml } = require('./markdown');
const { labelTag } = require('./utils');

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
            isLightning
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
              }
            }
          }
        }
      }
    }
  }
`;

const overlay = labelTag('talk');

const byTime = (a, b) => {
  const aTime = new Date(`1970/01/01 ${a.time}`);
  const bTime = new Date(`1970/01/01 ${b.time}`);
  return aTime - bTime;
};


const fetchData = async(client, vars) => {
  const data = await client
    .request(queryPages, vars)
    .then(res => res.conf.year[0].schedule[0]);

  const talksRaw = data.talks
    .map(({ title, description, timeString, track, speaker, isLightning }) => {
      try {
        return {
          isLightning,
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
            tag: overlay(pieceOfSpeakerInfoes.label),
          }
        );
      } catch (err) {
        console.log('\nError in parsing talks', talk);
        console.error(err);
        return null;
      }
    })
    .filter(Boolean)
    .map(async item => ({
      ...item,
      text: await markdownToHtml(item.text),
    }));

  const allTalks = await Promise.all(talksRaw);

  const talks = allTalks.filter(t => !t.isLightning);
  const ltTalks = allTalks.filter(t => t.isLightning);

  const tracks = [...new Set(allTalks.map(({ track }) => track).filter(Boolean))]
    .map(track => data.talks.find(talk => talk.track.name === track).track)
    .sort((a, b) => {
      return +b.isPrimary - +a.isPrimary;
    })
    .map(({ name }) => name);

  const ltTalksScheduleItems = tracks.map(track => {
    const lightningTalks = ltTalks.filter(lt => lt.track === track);
    if (!lightningTalks.length) return null;
    return {
      title: 'Lightning talks',
      track,
      lightningTalks,
    }
  }).filter(Boolean);

  const schedule = tracks
    .map(track => ({
      tab: track,
      list: [...data.additionalEvents, ...talks, ...ltTalksScheduleItems]
        .filter(event => event.track === track)
        .reduce((list, talk) => {
          const sameTitleTalk = list.find(({ title }) => title === talk.title);
          // we really need Abstract Equality Comparison here because from graph-ql will come null while JSON will have undefined
          // const isRealSame = sameTitleTalk && sameTitleTalk.time == talk.time;
          // if (isRealSame) return list;
          if (talk.title === 'Lightning talks' && talk.lightningTalks) {
            const updatedTalk = {
              ...talk,
              ...sameTitleTalk,
              realLt: true,
            };
            return [updatedTalk, ...list];
          }
          const updatedTalk = {
            ...talk,
            ...sameTitleTalk,
          };
          return [updatedTalk, ...list];
        }, [])
        .filter(talk => talk.title !== 'Lightning talks' || talk.realLt)
        .sort(byTime),
    }))
    .filter(({ list }) => list.length);

  return {
    schedule,
    tracks,
    talks: allTalks,
    ltTalks,
    fullTalks: talks,
  };
};

module.exports = {
  fetchData,
};
