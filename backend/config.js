// can use directly
// MONGODB_URL=mongodb+srv://<username>>:<password>@<clusterName>.<host>.mongodb.net/?retryWrites=true&w=majority
// instead of using dotenv

module.exports = {
  MONGO_DB_URL_DIRECT:
    "mongodb+srv://<username>>:<password>@<clusterName>.<host>.mongodb.net/?retryWrites=true&w=majority",
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};
