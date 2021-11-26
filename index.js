const express = require('express')
const app = express()
const cors = require('cors');
// const admin = require("firebase-admin");
require('dotenv').config();
const ObjectId=require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');


const port = process.env.PORT || 5000;

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v2cxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

    try{
        
        await client.connect();
        
        const database =client.db('pink-lips');
        const productsCollection=database.collection('products');
        const ordersCollection=database.collection('orders');
        const usersCollection=database.collection('users');
        const reviewsCollection=database.collection('reviews');

        app.get('/products',async (req, res) => {
           
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })
        app.post('/products', async(req,res)=>{
            const product=req.body;
            console.log('hit the post api',product);
            const result = await productsCollection.insertOne(product) ;
            console.log(result);
            res.json(result);
           
          })
          // delete single product
        app.delete('/products/:id',async(req,res)=>{
            console.log("d");
            const id = req.params.id;
            const query={_id:ObjectId(id)};
            const result = await productsCollection.deleteOne(query); 
            res.json(result)
        })

        app.get('/orders',async (req, res) => {
            // const email = req.query.email;
            // const date = req.query.date;
            // const query = { email: email, date: date }
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })
        app.post('/orders', async(req,res)=>{
            const order=req.body;
            console.log('hit the post api',order);
            const result = await ordersCollection.insertOne(order) ;
            console.log(result);
            res.json(result);
           
          })
          // delete single order
        app.delete('/orders/:id',async(req,res)=>{
            console.log("d");
            const id = req.params.id;
            const query={_id:ObjectId(id)};
            const result = await ordersCollection.deleteOne(query); 
            res.json(result)
        })
        app.put('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            const filter={_id:ObjectId(id)};
            const updateDoc={
                $set:{
                  status:"Delivered",
                }
            };
            const result = await ordersCollection.updateOne(filter,updateDoc);
            res.json(result)
  
        })
        app.get('/myOrders/:email', async(req,res)=>{
            console.log("dfghghbgf");
            const email= req.params.email;
            console.log(email);
            const cursor=ordersCollection.find({"email": email});
           const myOrders=await cursor.toArray();
           res.send(myOrders);
      
          })
          app.post('/review', async(req,res)=>{
            const review=req.body;
            console.log('hit the post api',review);
            const result = await reviewsCollection.insertOne(review) ;
            console.log(result);
            res.json(result);
           
          })
          app.get('/review',async (req, res) => {
           
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
         
         
          app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
           const updateDoc={$set:{role:'admin'}}
           const result = await usersCollection.updateOne(filter,updateDoc,);
            res.json(result);
        })
    
}
finally {
    // await client.close();
}
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Jerins Parlour!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})