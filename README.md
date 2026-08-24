# SkyBooker

[![CI](https://github.com/Suresh-MS07/flight-booking-mern/actions/workflows/ci.yml/badge.svg)](https://github.com/Suresh-MS07/flight-booking-mern/actions/workflows/ci.yml)

SkyBooker is a full-stack MERN flight-booking application that searches live flight offers, supports account-based bookings, verifies Razorpay payments, assigns seats, and emails booking confirmations.

## Engineering highlights

- Live flight search through the Amadeus API with configurable INR conversion
- JWT authentication with bcrypt password hashing and user-scoped booking history
- Razorpay order creation and constant-time signature verification
- Responsive React booking flow with seat selection and boarding-pass UI
- Environment-based configuration with no credentials committed to source
- API input validation, CORS allow-listing, security headers, JSON 404/error responses, and a health endpoint
- Automated client build/tests and API tests on every pull request

## Architecture

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Web client | React, React Router, Bootstrap, Framer Motion | Search, authentication, checkout, and trip management |
| API | Node.js, Express | Validation, auth, booking, flight, and payment workflows |
| Data | MongoDB, Mongoose | Users and user-owned bookings |
| Integrations | Amadeus, Razorpay, Nodemailer | Flight inventory, payments, and email tickets |

The React client calls the Express API. The API keeps third-party secrets server-side, persists records in MongoDB, and limits booking reads and writes to the authenticated user.

## Local setup

Requirements: Node.js 20+, npm, and MongoDB.

1. Clone the repository.
2. Copy `server/.env.example` to `server/.env` and add your sandbox credentials.
3. Copy `client/.env.example` to `client/.env` and add the public Razorpay key ID.
4. Install and start the API:

   ```bash
   cd server
   npm ci
   npm run dev
   ```

5. In another terminal, install and start the client:

   ```bash
   cd client
   npm ci
   npm start
   ```

The client runs at `http://localhost:3000`; the API runs at `http://localhost:5000`. Check API health at `GET /api/health`.

## Configuration

| Variable | Location | Purpose |
| --- | --- | --- |
| `REACT_APP_API_BASE_URL` | Client | Express API origin |
| `REACT_APP_RAZORPAY_KEY_ID` | Client | Public Razorpay checkout key ID |
| `MONGO_URI` | Server | MongoDB connection string |
| `JWT_SECRET` | Server | Long random token-signing secret |
| `CLIENT_URL` | Server | Comma-separated allowed browser origins |
| `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET` | Server | Amadeus flight search credentials |
| `EUR_TO_INR_RATE` | Server | Display-price conversion rate |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Server | Razorpay order and verification credentials |
| `EMAIL_USER`, `EMAIL_PASS` | Server | Gmail/app-password credentials for ticket mail |

Use sandbox credentials for development. Never commit `.env` files or secret keys.

## API overview

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | No | Service health |
| `POST` | `/api/auth/register` | No | Create an account |
| `POST` | `/api/auth/login` | No | Get a JWT |
| `GET` | `/api/flights/search` | No | Search flight offers |
| `GET` | `/api/bookings` | Yes | List the current user's bookings |
| `POST` | `/api/bookings` | Yes | Save a verified booking |
| `POST` | `/api/payment/orders` | Yes | Create a Razorpay order |
| `POST` | `/api/payment/verify` | Yes | Verify the checkout signature |

Authenticated endpoints expect `Authorization: Bearer <token>`.

## Quality checks

```bash
cd server && npm test
cd client && npm run test:ci
cd client && npm run build
```

GitHub Actions runs the same checks for pull requests and pushes to `main`.

## Production notes

- Set a long, unique `JWT_SECRET` and an exact `CLIENT_URL` allow-list.
- Use managed MongoDB and provider secrets from the deployment platform.
- Keep Amadeus and Razorpay in test mode until the application has production approval.
- A production payment service should calculate the payable fare from server-owned offer data rather than trusting a browser-submitted amount.

## Resume-ready project summary

> Built a MERN flight-booking platform integrating Amadeus search, JWT authentication, Razorpay signature verification, MongoDB user-scoped bookings, automated email tickets, and GitHub Actions CI.

## License

Licensed under the [ISC License](LICENSE).
