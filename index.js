const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.moxan1v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    //
    const products = client.db("ProductBD").collection("product");
    const Category = client.db("ProductBD").collection("Categories");
    const addCarts = client.db("ProductBD").collection("productCart");

    // Category

    app.get("/Category", async (req, res) => {
      const category = Category.find();
      const result = await category.toArray();
      res.send(result);
    });

    // add product information

    app.get("/allProduct", async (req, res) => {
      const product = products.find();
      const result = await product.toArray();
      res.send(result);
    });

    app.get("/product/:brand", async (req, res) => {
      const brand = req.params.brand;
      const brandProduct = products.find({ brand: brand });
      const result = await brandProduct.toArray();
      res.send(result);
    });

    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      const result = await products.insertOne(product);
      res.send(result);
    });

    // update product information

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query);
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = {
        $set: {
          image: product.image,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          description: product.description,
        },
      };
      const result = await products.updateOne(query, update, options);
      res.send(result);
    });

    // add to card

    app.get("/addCart/:email", async (req, res) => {
      const email = req.params.email;
      const query = addCarts.find({ email: email });
      const result = await query.toArray();
      res.send(result);
    });

    app.post("/addCart", async (req, res) => {
      const product = req.body;
      const result = await addCarts.insertOne(product);
      res.send(result);
    });

    app.delete("/addCart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addCarts.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`app listening on ${port}`);
});
