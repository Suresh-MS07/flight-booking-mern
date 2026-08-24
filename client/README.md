# SkyBooker web client

React client for SkyBooker. It provides flight search, authentication, seat selection, Razorpay checkout, and user-specific trip history.

## Run locally

```bash
cp .env.example .env
npm ci
npm start
```

Set `REACT_APP_API_BASE_URL` to the Express API origin and `REACT_APP_RAZORPAY_KEY_ID` to a Razorpay public test key ID.

## Checks

```bash
npm run test:ci
npm run build
```

See the [repository README](../README.md) for full-stack setup, architecture, API documentation, and security notes.
