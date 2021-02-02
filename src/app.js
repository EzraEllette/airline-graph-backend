const graph = require("./graph");
const morgan = require("morgan");
const express = require("express");
const helpers = require("./utilities/helpers");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
/**
 *
 * I need to change these to return a flight list with all of the data serialized
 * OOPS
 */

// all flights
app.get("/all", (_request, response) => {
  const flights = graph.Flight.all.map(helpers.humanizeFlight);
  response.json(flights);
});

// all flights by airline id
app.get("/airlines/:airlineId", (request, response) => {
  const airlineId = request.params.airlineId;

  const airline = graph.Airline.getById(airlineId);

  const data = {
    id: airline.id,
    name: airline.name,
    flights: airline.flights.map((f) => {
      return {
        src: f.src.name,
        dest: f.dest.name,
      };
    }),
  };

  response.json(data);
});

// All flights by airport code
app.get("/airports/:code", (request, response) => {
  const code = request.params.code;

  const airport = graph.Airport.getByCode(code);

  if (airport === undefined) {
    return json.sendStatus(404);
  }

  const flights = airport.outbound
    .map(helpers.humanizeFlight)
    .concat(airport.inbound.map(helpers.humanizeFlight));

  // const data = {
  //   code: airport.code,
  //   name: airport.name,
  //   lat: airport.lat,
  //   long: airport.long,
  //   flights,
  // };

  response.json(flights);
});

// all flights leaving airport by code
app.get("/source/:code", (request, response) => {
  const source = request.params.code;

  const airport = graph.Airport.getByCode(source);

  const flights = airport.outbound.map(helpers.humanizeFlight);
  // const data = {
  //   code: airport.code,
  //   name: airport.name,
  //   lat: airport.lat,
  //   long: airport.long,
  //   flights: airport.outbound.map(helpers.humanizeFlight),
  // };

  response.json(flights);
});

// all flights to airport by code
app.get("/destination/:code", (request, response) => {
  const destination = request.params.code;

  const airport = graph.Airport.getByCode(destination);

  const data = {
    code: airport.code,
    name: airport.name,
    lat: airport.lat,
    long: airport.long,
    flights: airport.inbound.map(helpers.humanizeFlight),
  };

  response.json(data);
});

// // multiple filters, choose
// // src: airport code
// // destination: airport code
// // airport: airport code
// // airline: airline id
// // send as json object
// // if there are no results, an empty array will be sent
// /**
//  * note to self:
//  *  find all of the flights that fit the constraints
//  *  then map them to have info about the airports airlines etc
//  *  just no more information about flights, we have it already!!!
//  */
// /*
// // All airports -> american
//                    []flights
//  filter by:   [] airport vs [] airlines
//              []outbound vs []inbound
//  selection = airport: [NO]source [NO]destination

// <form id=flightsform>
//   <checkboxes>airport vs airline</checkboxes>
//       // filter by text America -> JSON.stringify(flight).includes(text)

//       airline, airport name
//   <button>Submit</button>
// </form>
// */

app.get("/filter", (request, response) => {
  const { source, destination, airport, airline } = request.query;
  let result = null;
  console.dir(request.params);
  if (source) {
    if (result === null) {
      result = graph.Airport.getByCode(source).outbound;
    } else {
      result = result.filter((flight) => flight.src.code === source);
    }
  }
  if (destination) {
    if (result === null) {
      result = graph.Airport.getByCode(destination).inbound;
    } else {
      result = result.filter((flight) => flight.dest.code === destination);
    }
  }

  if (airport) {
    if (result === null) {
      let flights = graph.Airport.getByCode(airport);
      result = flights.outbound.concat(flights.inbound);
    } else {
      result = result.filter((flight) => {
        return flight.src.code === airport || flight.dest.code === airport;
      });
    }
  }

  if (airline) {
    if (result === null) {
      result = graph.Airline.getById(airline).flights;
    } else {
      result = result.filter((flight) => flight.airline.id === Number(airline));
    }
  }

  if (result === null) {
    result = graph.Flight.all;
  }

  response.json(result.map(helpers.humanizeFlight));
});

app.get("/from/:source/to/:destination", (request, response) => {
  const source = graph.Airport.getByCode(request.params.source);
  const destination = graph.Airport.getByCode(request.params.destination);
  if (!source || !destination) {
    return response.json([]);
  }

  response.json(
    graph.Airport.fromTo(source, destination).map(helpers.humanizeFlight)
  );
});

app.get("/bfs/from/:source/to/:destination", (request, response) => {
  const source = graph.Airport.getByCode(request.params.source);
  const destination = graph.Airport.getByCode(request.params.destination);
  if (!source || !destination) {
    return response.json([]);
  }

  response.json(
    graph.Airport.fromToBFS(source, destination).map(helpers.humanizeFlight)
  );
});

// get a list of airports
app.get("/airports", (_request, response) => {
  response.json(
    Object.values(graph.Airport.all).map((a) => {
      return {
        code: a.code,
        name: a.name,
        lat: a.lat,
        long: a.long,
      };
    })
  );
});

app.get("/airlines", (_request, response) => {
  response.json(
    Object.values(graph.Airline.all).map((a) => {
      return {
        id: a.id,
        name: a.name,
      };
    })
  );
});

module.exports = app;
