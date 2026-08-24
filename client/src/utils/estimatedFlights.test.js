import { buildEstimatedFlights } from './estimatedFlights';

test('builds stable, non-bookable estimates for a route', () => {
  const search = { from: 'DEL', to: 'BOM', date: '2026-08-30' };
  const firstResult = buildEstimatedFlights(search);
  const secondResult = buildEstimatedFlights(search);

  expect(firstResult).toHaveLength(6);
  expect(secondResult).toEqual(firstResult);
  expect(firstResult[0]).toEqual(expect.objectContaining({
    source: 'estimated',
    bookable: false,
  }));
  expect(firstResult[0].itineraries[0].segments[0]).toEqual(expect.objectContaining({
    departure: expect.objectContaining({ iataCode: 'DEL' }),
    arrival: expect.objectContaining({ iataCode: 'BOM' }),
  }));
});
