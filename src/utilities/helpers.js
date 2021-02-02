const humanizeFlight = f => {

  return {
    airline: { name: f.airline.name, id: f.airline.id },
    src: {
      name: f.src.name,
      code: f.src.code,
      lat: f.src.lat,
      long: f.src.long,
    },
    dest: {
      name: f.dest.name,
      code: f.dest.code,
      lat: f.dest.lat,
      long: f.dest.long,
    },
  };
};



// const humanizeFlight = (f) => {
//   return {
//     airline: f.airline.name,
//     src: f.src.name,
//     dest: f.dest.name
//   }
// };

module.exports = { humanizeFlight };