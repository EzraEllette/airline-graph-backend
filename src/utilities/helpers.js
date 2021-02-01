const humanizeFlight = (f) => {
  return {
    airline: f.airline.name,
    src: f.src.name,
    dest: f.dest.name
  }
};

module.exports = { humanizeFlight };