const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const userCollection = client.db("peterbilt").collection("users");
    const advertiseCollection = client.db("peterbilt").collection("advertise");
    const reportCollection = client.db("peterbilt").collection("reports");

    //category finidin API
    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categoryCollection.find(query).toArray();
      res.send(result);
    });

    //products loading API
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { categoryId: id };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    //API for creating product
    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    //API for updating product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const product = await productCollection.findOne(filter);
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          availability: "sold",
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedDoc,
        options
      );

      res.send(result);
    });

    //API for deleting product
    app.delete("/product/selected/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(filter);
      res.send(result);
    });

    //API for getting product for seller
    app.get("/products", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    //API for getting the advertised products
    app.get("/advertise", async (req, res) => {
      const query = { availability: "available" };
      const result = await advertiseCollection.find(query).toArray();
      res.send(result);
    });

    //API for reporting product
    app.post("/product/reported", async (req, res) => {
      const product = req.body;
      const result = await reportCollection.insertOne(product);
      res.send(result);
    });

    //API for getting reported product
    app.get("/product/reported", async (req, res) => {
      const query = {};
      const result = await reportCollection.find(query).toArray();
      res.send(result);
    });

    //API for posting the advertised product
    app.post("/advertise", async (req, res) => {
      const advertise = req.body;
      const result = await advertiseCollection.insertOne(advertise);
      res.send(result);
    });

    //user Api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //Api for Admin Hook
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    //API for seller hook
    app.get("/users/seller/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const user = await userCollection.findOne(query);
      res.send({ isSeller: user?.userRole === "seller" });
    });

    //API for grtting all users
    app.get("/users", async (req, res) => {
      const query = {};
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    //API for making admin
    app.put("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = await userCollection.findOne(filter);
      if (user.role !== "admin") {
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            role: "admin",
          },
        };
        const result = await userCollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        res.send(result);
      }
    });

    //API for deleting seller and buyer
    app.delete("/users/selected/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(filter);
      res.send(result);
    });

    //API for grtting all seller
    app.get("/users/sellers", async (req, res) => {
      const query = { userRole: "seller" };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    //API for grtting all buyer
    app.get("/users/buyers", async (req, res) => {
      const query = { userRole: "buyer" };
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    //booking Api

    //API for posting booking
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    //API for getting bookings
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await bookingCollection.find(query).toArray();
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
