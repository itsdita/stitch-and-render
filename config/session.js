const expressSession = require("express-session");
const mongoDBStore = require("connect-mongodb-session");

//set up sessions storage
function createSessionStore() {
  const MongoDBStore = mongoDBStore(expressSession);

  const sessionStore = new MongoDBStore({
    uri: "mongodb://localhost:27017",
    databaseName: "stitchAndRender",
    collection: "sessions",
  });

  return sessionStore;
}

function createSessionConfig() {
  return {
    secret: "snr-wbst-1913",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days; if no date set, cookie doesn't expire
    },
  };
}


module.exports = createSessionConfig;