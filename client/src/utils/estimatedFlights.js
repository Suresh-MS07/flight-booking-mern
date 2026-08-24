const carriers = [
  { code: 'AI', number: 202 },
  { code: '6E', number: 681 },
  { code: 'IX', number: 112 },
  { code: 'QP', number: 1423 },
  { code: 'AI', number: 805 },
  { code: '6E', number: 521 },
];

const departureTimes = ['05:45', '07:30', '10:15', '13:40', '17:25', '20:10'];
const fareAdjustments = [0, 720, 340, 1180, 560, 1540];
const durationAdjustments = [15, 0, 25, 10, 35, 20];

const createSeed = (value) => Array.from(value).reduce(
  (seed, character) => ((seed * 31) + character.charCodeAt(0)) % 100000,
  17,
);

const toLocalIso = (date, time, minutesToAdd = 0) => {
  const instant = new Date(`${date}T${time}:00Z`);
  instant.setUTCMinutes(instant.getUTCMinutes() + minutesToAdd);
  return instant.toISOString().replace('.000Z', '');
};

const toDuration = (minutes) => `PT${Math.floor(minutes / 60)}H${minutes % 60}M`;

export const buildEstimatedFlights = ({ from, to, date }) => {
  const seed = createSeed(`${from}-${to}-${date}`);
  const baseFare = 3600 + (seed % 2600);
  const baseDuration = 85 + (seed % 75);

  return carriers.map((carrier, index) => {
    const durationMinutes = baseDuration + durationAdjustments[index];

    return {
      id: `estimated-${from}-${to}-${date}-${index + 1}`,
      source: 'estimated',
      bookable: false,
      validatingAirlineCodes: [carrier.code],
      itineraries: [{
        duration: toDuration(durationMinutes),
        segments: [{
          departure: { iataCode: from, at: toLocalIso(date, departureTimes[index]) },
          arrival: { iataCode: to, at: toLocalIso(date, departureTimes[index], durationMinutes) },
          carrierCode: carrier.code,
          number: String(carrier.number + (seed % 40)),
          duration: toDuration(durationMinutes),
        }],
      }],
      price: {
        currency: 'INR',
        total: String(baseFare + fareAdjustments[index]),
      },
    };
  });
};
