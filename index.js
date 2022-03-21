const express=require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app=express();

const port= process.env.PORT || 5000;

const ObjectId=require('mongodb').ObjectId;
var cors=require('cors');
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a0n4p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    //GET API
    app.get('/services',async(req,res)=>{
      const cursor = servicesCollection.find({});
      const services= await cursor.toArray();
      res.send(services)
    })
    //GET API
    app.get('/services/:id',async(req,res)=>{
      const id=req.params.id;
      const query = { _id:ObjectId(id)};
      const service = await servicesCollection.findOne(query);
      res.send(service);
    })

    // POST API
    app.post('/services',async(req,res)=>{
     const service=req.body;
     console.log('Hit the post API',service);
     const result = await servicesCollection.insertOne(service);
    //  console.log(result);
    res.send(result);
    })
    
    //DELETE API
    app.delete('/services/:id',async(req,res)=>{
      const id=req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await servicesCollection.deleteOne(query);
      console.log(result);
      res.send(result)
    })
    
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
  res.send('Hitting');
})

app.listen(port,()=>{
   console.log("Running port",port);
})