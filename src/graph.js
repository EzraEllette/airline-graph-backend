const { response } = require("express");
const { airports, airlines, routes } = require("./data");

/**
 * @constructor name, code, lat, long
 */
class Airport {
  static all = {};
  constructor(name, code, lat, long) {
    this.inbound = [];
    this.outbound = [];
    this.name = name;
    this.code = code;
    this.lat = lat;
    this.long = long;
    Airport.all[code] = this;
  }

  addInbound(flight) {
    this.inbound.push(flight);
  }

  addOutbound(flight) {
    this.outbound.push(flight);
  }

  static getByCode(code) {
    return Airport.all[code];
  }

  // static fromToBFS(source, destination, current = [], visitedAirports = {}) {
  //   if (source === destination) return current;
  //   const queue = [];
  //   visitedAirports[source.code] = true;
  //   // console.log(source.outbound[0]);
  //   current.push(source);
  //   queue.push(current);
  //   source.outbound.forEach((airport) => {
  //     let single = [source, airport.dest];
  //     queue.push(single);
  //   });
  //   while (queue.length > 0) {
  //     if (visitedAirports[destination.source]) break;
  //     current = queue.shift(); // array of locations
  //   }
  //   console.log(current);
  //   // if (current[current.length - 1] === destination) {
  //   //   return current;
  //   // }
  //   return Flight.all;

  //   // // list of outbound flight objects
  //   // let paths = [];
  //   // for (let idx = 0; idx < list.length; idx++) {
  //   //   // iterate through all neighbors
  //   //   // check if neighbors are the destination address
  //   //   // if true -> push to current path
  //   //   if (visitedAirports[destination.code]) continue;
  //   //   const flight = list[idx];
  //   //   if (flight.dest === destination) {
  //   //     currentPath.push(list[idx]);

  //   //     return currentPath;
  //   //   }
  //   // }
  //   // if (!visitedAirports[destination.code]) {
  //   //   for (let idx = 0; idx < list.length; idx++) {
  //   //     if (visitedAirports[list[idx].dest.code]) continue;
  //   //     paths.push(
  //   //       currentPath.concat(
  //   //         this.fromToBFS(
  //   //           list[idx].dest,
  //   //           destination,
  //   //           currentPath.concat(list[idx]),
  //   //           visitedAirports
  //   //         )
  //   //       )
  //   //     );
  //   //   }
  //   // }

  //   // return paths.reduce(
  //   //   (acc, path) => (path.length < acc.length ? path : acc),
  //   //   new Array(Flight.all.length)
  //   // );
  // }

  static fromTo(source, destination, currentPath = [], visitedAirports = {}) {
    visitedAirports[source.code] = true;
    let paths = [];
    const flights = source.outbound;
    for (let index = 0; index < flights.length; index++) {
      const flight = flights[index];

      if (visitedAirports[flight.dest.code]) {
        continue;
      } else {
        if (flight.dest === destination) {
          return currentPath.concat([flight]);
        } else {
          paths.push(
            this.fromTo(
              flight.dest,
              destination,
              currentPath.concat([flight]),
              visitedAirports
            )
          );
        }
      }
    }
    let shortestPath =  paths.reduce(
      (acc, path) => (path.length < acc.length ? path : acc),
      new Array(Flight.all.length)
    );

    // if (shortestPath.length >= Flight.all.length) shortestPath = [];

    return shortestPath;
  }
}

/**
 * @constructor airline, src, dest
 */
class Flight {
  static all = [];
  #airline;
  #src;
  #dest;
  constructor(airline, src, dest) {
    this.#airline = airline;
    this.#src = src;
    this.#dest = dest;
    this.src.addOutbound(this);
    this.dest.addInbound(this);
    this.airline.addFlight(this);
    Flight.all.push(this);
  }

  get airline() {
    return Airline.all[this.#airline];
  }

  get src() {
    return Airport.all[this.#src];
  }

  get dest() {
    return Airport.all[this.#dest];
  }
}

/**
 * @constructor name, id
 */
class Airline {
  static all = {};
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.flights = [];

    Airline.all[id] = this;
  }

  addFlight(flight) {
    this.flights.push(flight);
  }

  static getById(id) {
    return Airline.all[id];
  }
}

module.exports = (() => {
  airports.forEach(
    ({ name, code, lat, long }) => new Airport(name, code, lat, long)
  );
  airlines.forEach(({ name, id }) => new Airline(name, id));
  routes.forEach(({ airline, src, dest }) => new Flight(airline, src, dest));

  return {
    Airline,
    Flight,
    Airport,
  };
})();

// console.log(Airline.all);
