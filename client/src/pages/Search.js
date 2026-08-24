import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaFilter,
  FaInfoCircle,
  FaPlane,
  FaShieldAlt,
  FaSuitcaseRolling,
} from 'react-icons/fa';
import { apiRequest } from '../config/api';

const formatTime = (isoString = '') => {
  const time = isoString.split('T')[1];
  return time ? time.slice(0, 5) : '--:--';
};

const durationToMinutes = (value = '') => {
  const hours = Number(value.match(/(\d+)H/)?.[1] || 0);
  const minutes = Number(value.match(/(\d+)M/)?.[1] || 0);
  return (hours * 60) + minutes;
};

const formatDuration = (value = '') => {
  const minutes = durationToMinutes(value);
  if (!minutes) return 'Duration unavailable';
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

const FlightSkeleton = () => (
  <div className="result-card result-skeleton" aria-hidden="true">
    <div className="skeleton-block skeleton-airline" />
    <div className="skeleton-block skeleton-route" />
    <div className="skeleton-block skeleton-price" />
  </div>
);

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEstimated, setIsEstimated] = useState(false);
  const [sortBy, setSortBy] = useState('best');

  const from = (searchParams.get('from') || '').toUpperCase();
  const to = (searchParams.get('to') || '').toUpperCase();
  const date = searchParams.get('date') || '';

  useEffect(() => {
    let active = true;

    const fetchFlights = async () => {
      setLoading(true);
      setError('');
      setFlights([]);
      setIsEstimated(false);

      if (!from || !to || !date) {
        setError('Your search is missing a route or departure date.');
        setLoading(false);
        return;
      }

      try {
        const query = new URLSearchParams({ from, to, date });
        const response = await apiRequest(`/api/flights/search?${query.toString()}`);
        const data = await response.json();

        if (!active) return;
        if (response.ok) {
          const nextFlights = Array.isArray(data) ? data : [];
          setFlights(nextFlights);
          setIsEstimated(
            response.headers.get('X-Flight-Data-Source') === 'estimated'
            || nextFlights.some((flight) => flight.source === 'estimated'),
          );
        } else setError(data.message || 'We could not load fares for this route.');
      } catch {
        if (active) setError('The flight service is taking longer than expected. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchFlights();
    return () => { active = false; };
  }, [from, to, date]);

  const sortedFlights = useMemo(() => {
    const next = [...flights];
    if (sortBy === 'cheapest') {
      return next.sort((a, b) => Number(a.price?.total || 0) - Number(b.price?.total || 0));
    }
    if (sortBy === 'fastest') {
      return next.sort((a, b) => durationToMinutes(a.itineraries?.[0]?.duration) - durationToMinutes(b.itineraries?.[0]?.duration));
    }
    return next;
  }, [flights, sortBy]);

  const formattedDate = date
    ? new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${date}T00:00:00`))
    : 'Select date';

  return (
    <div className="results-page page-shell">
      <section className="results-hero">
        <div>
          <div className="eyebrow eyebrow-light"><span /> Live flight offers</div>
          <h1>{from || 'Origin'} <span><FaPlane /></span> {to || 'Destination'}</h1>
          <p>{formattedDate} · 1 traveler · Economy</p>
        </div>
        <button type="button" className="button button-light button-small" onClick={() => navigate('/')}>
          Modify search
        </button>
      </section>

      <div className="results-toolbar">
        <div>
          <strong>{loading ? 'Finding the right flights' : `${flights.length} flight${flights.length === 1 ? '' : 's'} found`}</strong>
          <span>{isEstimated ? 'Showing non-bookable estimates while live inventory reconnects' : 'Prices include estimated taxes and fees'}</span>
        </div>
        <div className="sort-control" aria-label="Sort flights">
          <FaFilter />
          {[
            ['best', 'Best'],
            ['cheapest', 'Cheapest'],
            ['fastest', 'Fastest'],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={sortBy === value ? 'is-active' : ''}
              onClick={() => setSortBy(value)}
              aria-pressed={sortBy === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="results-layout">
        <aside className="results-aside">
          <div className="aside-card">
            <span className="aside-icon"><FaShieldAlt /></span>
            <h2>Book with clarity</h2>
            <ul>
              <li><FaCheckCircle /> Verified Razorpay checkout</li>
              <li><FaCheckCircle /> User-owned booking history</li>
              <li><FaCheckCircle /> Email ticket confirmation</li>
            </ul>
          </div>
          <div className="aside-card aside-card-compact">
            <FaClock />
            <div><strong>Live availability</strong><span>Fares can change until payment.</span></div>
          </div>
        </aside>

        <section className="flight-results" aria-live="polite" aria-busy={loading}>
          {loading && <><FlightSkeleton /><FlightSkeleton /><FlightSkeleton /></>}

          {!loading && !error && isEstimated && (
            <div className="inventory-notice" role="status">
              <FaInfoCircle />
              <div>
                <strong>Live inventory is temporarily unavailable</strong>
                <span>These clearly marked estimates keep route comparison useful. Live booking returns when the provider reconnects.</span>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="state-card">
              <span className="state-icon">!</span>
              <h2>We hit a little turbulence</h2>
              <p>{error}</p>
              <button type="button" className="button button-primary" onClick={() => navigate('/')}>Try another search</button>
            </div>
          )}

          {!loading && !error && sortedFlights.length === 0 && (
            <div className="state-card">
              <span className="state-icon"><FaPlane /></span>
              <h2>No flights found for this route</h2>
              <p>Try a nearby airport or a different departure date.</p>
              <button type="button" className="button button-primary" onClick={() => navigate('/')}>Change search</button>
            </div>
          )}

          {!loading && !error && sortedFlights.map((flight, index) => {
            const itinerary = flight.itineraries?.[0] || {};
            const segments = itinerary.segments || [];
            const firstSegment = segments[0] || {};
            const lastSegment = segments[segments.length - 1] || firstSegment;
            const carrierCode = flight.validatingAirlineCodes?.[0] || firstSegment.carrierCode || 'SK';
            const price = flight.price?.total || '--';
            const stops = Math.max(segments.length - 1, 0);

            return (
              <article className="result-card" key={flight.id || `${carrierCode}-${index}`}>
                <div className="result-airline">
                  <div className="airline-mark">{carrierCode}</div>
                  <div>
                    <strong>{carrierCode} Airlines</strong>
                    <span>{firstSegment.carrierCode || carrierCode}-{firstSegment.number || '—'}</span>
                    {flight.source === 'estimated' && <em className="inventory-badge">Estimated</em>}
                  </div>
                </div>

                <div className="result-route">
                  <div className="result-time">
                    <strong>{formatTime(firstSegment.departure?.at)}</strong>
                    <span>{firstSegment.departure?.iataCode || from}</span>
                  </div>
                  <div className="route-track">
                    <span>{formatDuration(itinerary.duration || firstSegment.duration)}</span>
                    <div><i /><FaPlane /><i /></div>
                    <small>{stops === 0 ? 'Non-stop' : `${stops} stop${stops === 1 ? '' : 's'}`}</small>
                  </div>
                  <div className="result-time result-time-end">
                    <strong>{formatTime(lastSegment.arrival?.at)}</strong>
                    <span>{lastSegment.arrival?.iataCode || to}</span>
                  </div>
                </div>

                <div className="result-price">
                  <small>per traveler</small>
                  <strong>₹{Number(price).toLocaleString('en-IN')}</strong>
                  <span><FaSuitcaseRolling /> Cabin bag included</span>
                  <button
                    type="button"
                    className="button button-primary button-small"
                    onClick={() => navigate('/book', { state: { flight } })}
                    disabled={flight.bookable === false}
                  >
                    {flight.bookable === false ? 'Estimate only' : <><span>Select</span> <FaArrowRight /></>}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Search;
