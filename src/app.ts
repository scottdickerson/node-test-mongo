import express from "express";
const app = express();
const port = 3000;
import mongodb, { MongoClient, MongoDBNamespace } from "mongodb";

const url = "mongodb://127.0.0.1:27017";

const client = new MongoClient(url);
let db: mongodb.Db;
let testDocuments: mongodb.Collection;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

try {
  client.connect();
  db = client.db("testdb");
  testDocuments = db.collection("testDocuments");
} catch (error) {
  console.error("error connecting to mongo db");
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/documents", async (req, res) => {
  try {
    const documents = await testDocuments.find({}).toArray();
    console.log("found these documents", documents);
    res.json(documents);
  } catch (error) {
    console.error("something went wrong finding documents", error);
    res.sendStatus(500);
  }
});

app.post("/documents", async (req, res) => {
  const documentToCreate = req.body;
  console.log("document to insert", documentToCreate);
  try {
    const insertedDocument = await testDocuments.insertOne(documentToCreate);
    res.send(insertedDocument);
  } catch (error) {
    console.error("problem inserting document", documentToCreate);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
