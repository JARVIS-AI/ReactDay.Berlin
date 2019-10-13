const labelColors = [
  { label: 'Keynote', color: '#36a901', tag: 'keynote' },
  { label: 'React Advanced', color: '#36a901', tag: 'react-advanced' },
  { label: 'Graphics', color: '#d00000', tag: 'graphics' },
  { label: 'React Native', color: '#230cea', tag: 'react-native' },
  { label: 'GraphQL', color: '#bc0063', tag: 'graphql' },
  { label: 'Performance', color: '#810cea', tag: 'performance' },
  { label: 'Hooks', color: '#edb403', tag: 'hooks' },
  { label: 'Serverless', color: '#00a27a', tag: 'serverless' },
  { label: 'Testing', color: '#edb403', tag: 'testing' },
  { label: 'A11y', color: '#d00000', tag: 'a11y' },
  { label: null, color: '#666666', tag: 'null' },
  { label: 'Inspiration', color: '#36CDC4', tag: 'inspiration' },
  { label: 'State', color: '#36a901', tag: 'state' },
  { label: 'Hardware', color: '#03B5ED', tag: 'hardware' },
  { label: 'ReasonML', color: '#d00000', tag: 'reasonml' },
  { label: 'Navigation', color: '#FF823B', tag: 'navigation' },
  { label: 'Visualization', color: '#D00AE1', tag: 'visualization' },
  { label: 'Deep Dive', color: '#bc0063', tag: 'deep-dive' },
  { label: 'Diversity', color: '#bc0063', tag: 'diversity' },
  { label: 'Animations', color: '#810cea', tag: 'animations' },
  { label: 'Architecture', color: '#810cea', tag: 'architecture' },
  { label: 'Blockchain', color: '#810cea', tag: 'blockchain' },
  { label: 'WebGL', color: '#810cea', tag: 'webgl' },
];

if (!process.env.CMS_ENDPOINT || !process.env.CMS_TOKEN) {
  require('dotenv').config();
}

if (!process.env.CMS_ENDPOINT || !process.env.CMS_TOKEN) {
  throw new Error(`Can't find environment variables: 'CMS_ENDPOINT' and 'CMS_TOKEN'.
  Set them in .env file for local development or pass to env when running on CI.
  `);
}

const conferenceTitle = 'React_Day_Berlin';
const eventYear = 'Y2019';

const credentials = {
  endpoint: process.env.CMS_ENDPOINT,
  token: process.env.CMS_TOKEN,
};

module.exports = {
  conferenceTitle,
  eventYear,
  credentials,
  labelColors,
};
