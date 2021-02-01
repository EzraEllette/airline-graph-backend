AIRLINE
  - NAME -> String
  - FLIGHTS -> [FLIGHT]
  - ID -> Int
FLIGHT -> INCOMING_FLIGHTS, OUTGOING_FLIGHTS
  - AIRLINE -> AIRLINE
  - SOURCE -> Airport
  - DESTINATION -> Airport
Airport
  - CODE -> String
  - NAME -> String
  - LATITUDE -> Float
  - LONGITUDE -> Float
  - INCOMING_FLIGHTS -> [FLIGHT]
  - OUTGOING_FLIGHTS -> [FLIGHT]



Route { airline: 4951, src: "NBO", dest: "IST" }
Airline { id: 24, name: "American Airlines" },
Airport {
    code: "WAE",
    name: "Wadi al-Dawasir Domestic Airport",
    lat: 20.504167,
    long: 45.199444
  },