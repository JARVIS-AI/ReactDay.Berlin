const fetchData = () => new Promise(resolve => {
  setTimeout(() => {
    console.log('Content is fetched');
    resolve();
  }, 2000)
})

const getContent = async () => {
  await fetchData();
  return {
    name: 'Berlin Day',
    title: 'From data',
    description: 'Important content'
  }
}

module.exports = {
  getContent
};
