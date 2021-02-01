/**
 * @constructor name, code, lat, long
 */

const { airports, airlines, routes } = require("./data");

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

  airports.forEach(({name, code, lat, long}) => new Airport(name, code, lat, long));
  airlines.forEach(({ name, id }) => new Airline(name, id));
  routes.forEach(({airline, src, dest}) => new Flight(airline, src, dest))

  return {
    Airline,
    Flight,
    Airport,
  }
})();


// console.log(Airline.all);