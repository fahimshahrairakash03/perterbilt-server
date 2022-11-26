const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4r8e4ne.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client.db("peterbilt").collection("categories");
    const productCollection = client.db("peterbilt").collection("products");
    const bookingCollection = client.db("peterbilt").collection("bookings");

    //category finidin API
    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categoryCollection.find(query).toArray();
      res.send(result);
    });

    //products loading API
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    //booking Api
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.log);

app.get("/", (req, res) => {
  res.send("Peterbilt API is running");
});

app.listen(port, () => {
  console.log("API is running on port 5000");
});
