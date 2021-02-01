const graph = require("./graph");
const morgan = require("morgan");
const express = require("express");
const app = express();

app.use(express.json());
app.use(morgan("tiny"));

// all flights
app.get('/all', (_request, response) => {
  const flights = graph.Flight.all.map(f => {
    return {
      airline: f.airline.name,
      src: f.src.name,
      dest: f.dest.name,
    };
  })
  response.json(flights);
});

// all flights by airline id
app.get('/airlines/:airlineId', (request, response) => {
  const airlineId = request.params.airlineId;

  const airline = graph.Airline.getById(airlineId)

  const data = {
    id: airline.id,
    name: airline.name,
    flights: airline.flights.map(f => {
      return {
        src: f.src.name,
        dest: f.dest.name,
      };
    }),
  };

  response.json(data);
});

// All flights by airport code
app.get('/airports/:code', (request, response) => {
  const code = request.params.code;

  const humanizer = (f) => {
    return {
      airline: f.airline.name,
      src: f.src.name,
      dest: f.dest.name
    }
  };

  const airport = graph.Airport.getByCode(code);

  if (airport === undefined) {

    return json.sendStatus(404);
  }

  const flights = airport.outbound.map(humanizer).concat(airport.inbound.map(humanizer));

  const data = {
    code: airport.code,
    name: airport.name,
    lat: airport.lat,
    long: airport.long,
    flights,
  };

  response.json(data);
});

// all flights leaving airport by code
app.get('/source/:code', (request, response) => {
  const source = request.params.code;

  const airport = graph.Airport.getByCode(source);

  const data = {
    code: airport.code,
    name: airport.name,
    lat: airport.lat,
    long: airport.long,
    flights: airport.outbound.map(f => {
      return {
        airline: f.airline.name,
        src: f.src.name,
        dest: f.dest.name
      };
    }),
  };

  response.json(data);
});

// all flights to airport by code
app.get('/destination/:code', (request, response) => {
  const source = request.params.code;

  const airport = graph.Airport.getByCode(source);

  const data = {
    code: airport.code,
    name: airport.name,
    lat: airport.lat,
    long: airport.long,
    flights: airport.inbound.map(f => {
      return {
        airline: f.airline.name,
        src: f.src.name,
        dest: f.dest.name
      };
    }),
  };

  response.json(data);
});


module.exports = app;