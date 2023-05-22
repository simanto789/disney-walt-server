const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.arc8i5u.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('disneyWalt').collection('products');
    const toycollection = client.db('disneyWalt').collection('toys');

    // show products
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    //  show product details
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
      res.send(result);
    })
    // show users toy
    app.get('/alltoys', async (req, res) => {
      const cursor = toycollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    // my toys
    app.get('/toys', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await toycollection.find(query).toArray();
      res.send(result);
    })



    // add toys in mongodb
    app.post('/toys', async (req, res) => {
      const toy = req.body;
      console.log(toy);
      const result = await toycollection.insertOne(toy);
      res.send(result);
    });

    // delete toys from mongodb
    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toycollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('disney is running')
})

app.listen(port, () => {
  console.log(`disney is running on port ${port}`)
})