//import the MongoDB driver, which is a library that provides tools for interacting with
//MongoDB databases from a Node.js application
const mongodb = require("mongodb");

//a class that provides methods to connect to a MongoDB server, access databases, and
//perform various operations like inserting, querying, updating, and deleting documents
const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
  const client = await MongoClient.connect("mongodb://localhost:27017");
  database = client.db("userData");
}

function getDb() {
  if (!database) {
    throw { message: "Database connection not established!" };
  }
  return database;
}

module.exports = {
  connectToDatabase: connect,
  getDb: getDb,
};
