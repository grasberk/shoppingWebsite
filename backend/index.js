
require("dotenv").config()
const cors=require('cors');
const express = require("express");
const app = express();
app.use(express.urlencoded({extended:true}));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SALT_COUNT = 10;


const JWT_SECRET=process.env.JWT_SECRET;


app.use(cors({
    origin:'*'
}));
app.use(express.json());

app.listen(8000, () => console.log("Server is running"));

const mongoose = require("mongoose");

const { decrypt } = require("dotenv");

mongoose.connect(process.env.REACT_APP_MONGODB_URI, {
  useNewUrlParser: "true",
});

mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});

const userSchema=new mongoose.Schema({

  
  email: String,
  password: String,
  isAdmin:Boolean,
  user_id: Number,
  cart_id:Number

})

const reviewSchema=new mongoose.Schema({
    //  _id:Number,
     item_id:Number,
    name:String,
    message:String
})
//fix schema each document should have a list of items?
const cartSchema=new mongoose.Schema({
    user_id: Number,
    cart_id:Number,
    id:Number,
    name: String,
    price:Number,
    img: String,
    desc:String,
    quantity:Number,
    type:String,
    inventory:Number

})
const itemSchema=new mongoose.Schema({
    id:{
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price:{
      type: Number,
      required: true
    },
    img: {
      type: String,
      required: true
    },
    desc:{
      type: String,
      required: true
    },
    type:{
      type: String,
      required: true
    },
    inventory:{
      type: Number,
      required: true
    }

})

const Review = mongoose.model('Review',reviewSchema)
const Item=mongoose.model('Items',itemSchema)
const Cart=mongoose.model('Carts',cartSchema)
const User=mongoose.model('Users',userSchema)

function authenticateToken(req,res, next){

  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  const decoded = jwt.verify(token, JWT_SECRET);
    console.log("if token function")
      console.log(decoded)
      if (decoded.isAdmin === true) {
        next(); 
      } 
    }
  
  
app.get('/reviews', async (req,res)=>{
    
  const allReviews=await Review.find()
  res.json(allReviews)
  


  });


app.get('/reviews/:id', async (req,res)=>{

    
  
  const itemReviews=await Review.find({item_id:req.params.id})
  
  res.json(itemReviews)
    
  
  
    });


app.get('/test',(req,res)=>{
    res.send({message: "Hello from backend!"})
})

app.post('/addReview', async (req,res)=>{
  const newReview = await Review.create({
    item_id:req.body.item_id,
    name: req.body.name,
    message:req.body.message
    
});
res.json(newReview)
})

   //shop routes
app.get('/items', async(req,res)=>{
    
  
    const allItems= await Item.find()
    res.json(allItems)
   
})
app.get('/shop/genres', async (req,res)=>{
  genres= await Item.distinct('type')
  res.json(genres)
})

//filter by price

app.get('/items/:filter', async (req, res) => {
  const filter = req.params.filter;
  genres = await Item.distinct('type');

  switch (true) {
      case genres.includes(filter):
          someItems = await Item.find({ type: filter });
          res.json(someItems);
          break;

      case filter === 'alphabetically':
          someItems = await Item.find({}).sort({ name: 1 });
          res.json(someItems);
          break;

      case filter === 'priceLH':
          someItems = await Item.find().sort({ price: 1 });
          res.json(someItems);
          break;

      case filter === 'priceHL':
          someItems = await Item.find().sort({ price: -1 });
          res.json(someItems);
          break;

      default:
          someItems = await Item.find({ name: filter });
          res.json(someItems);
          break;
  }
});

//find items by type

// app.get('/items/type', async(req,res)=>{
  
//   const filteredItems=await Item.find();
//   res.json(filteredItems)
// })

//cart routes
//find item by id
app.get('/item/:id', async(req,res)=>{
    
  
  const oneItem= await Item.findOne({id:req.params.id})
  res.json(oneItem)
 
})
//show all items in cart with same cart id
app.get('/cart/:cartid', async(req,res)=>{
    
  
  const userCart= await Cart.find({cart_id:req.params.cartid})
  res.json(userCart)
 
})
app.get('/cart', async(req,res)=>{
  const allCart= await Cart.find()
  
  res.json(allCart)

});
app.put('/cart/update/:id', async(req,res)=>{
  product=await Cart.findOneAndUpdate({id:req.params.id}, {quantity:req.body.quantity})
  
  res.json(product)
})

app.post("/addToCart", async (req,res)=>{
  const newCart = await Cart.create({
    user_id: req.body.user_id,
    cart_id:req.body.cart_id,
    id:req.body.id,
    name: req.body.name,
    price:req.body.price,
    img: req.body.img,
    desc:req.body.desc,
    quantity:req.body.quantity,
    type:req.body.type,
    inventory:req.body.inventory
});

res.json(newCart)
})



app.delete("/cart/delete/:id", async(req,res)=>{
  
  await Cart.findOneAndDelete({id:req.params.id})
  
  res.json(await Cart.find())
  
 
})
app.delete("/cart/delete", async(req,res)=>{
  await Cart.deleteMany()
  

  res.json(await Cart.find())


  
 
 
})

//register
//collect username and password(done)
//bcrypt and hash password, store in db (password,secret_key)
//generate JWT token on BE and give to FE (jwt.sign)
//DONT encrypt password and match to db

//login routes
//collect username and password from user(done)
//use bcrypt to check if password matches email password in db (done)
//if match send jwt token to front end(done)
//when user access shop page send token from FE to BE and BE dycrpts the token to know who the user
//if user is admin or not different routes will be given access

app.get('/users',async (req,res)=>{
  const allUsers=await User.find()
  res.json(allUsers)
})
//find user infor by email
app.get('/users/:email',async (req,res)=>{
  const oneUser=await User.findOne({email:req.params.email})
  res.json(oneUser)
})

//signup

app.post("/signup", async (req,res)=>{
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  const allUsers = await User.find().sort({ user_id: -1 });
  const newUser_id=allUsers.length>0 ? allUsers[0].user_id+1:0;
  const allCarts = await Cart.find().sort({ cart_id: -1 });
  const newCart_id = allCarts.length > 0 ? allCarts[0].cart_id + 1 : 0;
  const newUser = await User.create({
    email: req.body.email,
    password: hashedPassword,
    isAdmin:false,

    user_id:newUser_id,
    cart_id:newUser_id,
});

const payload={email: newUser.email, isAdmin: newUser.isAdmin}
const token=jwt.sign(payload, JWT_SECRET)

const response ={
  email: newUser.email,
  token: token
}
//res.json({token})
res.json(response)

//res.json(newUser)
})

//login
app.post('/login', async (req,res)=>{
  const {email, password}=req.body
  const user = await User.findOne({email})
  
  if (user){
    const passwordMatch = bcrypt.compare(password, user.password).then((result)=>{
      if(result){
        
        const payload = {email: user.email, isAdmin:user.isAdmin}
        const token=jwt.sign(payload, JWT_SECRET)
       
        
        const response ={
          email: user.email,
          isAdmin: user.isAdmin,
          token: token
        }
        //res.json({token})
        res.json(response)
       
       
      }
      else{
    
        console.log("password dont match")
      }
    })
    
  
}
//fix signup bug: when new user signs up cant fetch shop data
//display email of logged in user
//hide add form from logged in user if not admin
//hide remove button so non-admins cant remove
//if no one is logged in, allowed to see shop, cart should not be accessible or visible until logged in
//if the user tried to add/remove item to cart, user should be prompted to login
//have a login page which after logged in redirect user to the shop
//filter using backend route



  
})
    

//admin routes

app.post("/additem", authenticateToken,  async (req,res)=>{


  const maxIdItem = await Item.findOne().sort('-id'); 
    const newId = maxIdItem ? maxIdItem.id + 1 : 0; 
  const newItem = await Item.create({

    id:newId,
    name:req.body.name,
    price:req.body.price,
    img:req.body.img,
    desc:req.body.desc,
    inventory:req.body.inventory,
    type:req.body.type
    
    
});


res.json(newItem);
  
})
//delete item from shop working 
app.delete("/shop/delete/:id", authenticateToken, async(req,res)=>{

  await Item.findOneAndDelete({id:req.params.id})
  
  res.json(await Item.find())

  // product=await Item.deleteOne()
  // await Item.findById(product.id)
  // res.json(await Item.find())
})
//update all

app.put('/shop/update/:id', async(req,res)=>{
  product=await Item.findOneAndUpdate({id:req.params.id}, {inventory:req.body.inventory})
  
  res.json(product)
})

