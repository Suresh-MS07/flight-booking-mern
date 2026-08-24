const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  return app.listen(PORT, () => {
    console.log(`SkyBooker API listening on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error(`Unable to start the API: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = startServer;
