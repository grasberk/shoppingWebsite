
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
  isAdmin:Boolean

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
    price:String,
    img: String,
    desc:String,
    quantity:Number,
    type:String,
    inventory:Number

})
const itemSchema=new mongoose.Schema({
    id:Number,
    name: String,
    price:String,
    img: String,
    desc:String,
    quantity:Number,
    type:String,
    inventory:Number

})

const Review = mongoose.model('Review',reviewSchema)
const Item=mongoose.model('Items',itemSchema)
const Cart=mongoose.model('Carts',cartSchema)
const User=mongoose.model('Users',userSchema)

function authenticateToken(req,res, next){
  console.log("start of auth function")
  console.log(req.headers)
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];
  // if (!token){
  //   console.log("error")
  // }
  const decoded = jwt.verify(token, JWT_SECRET);
    console.log("if token function")
      console.log(decoded)
      if (decoded.isAdmin === true) {
        next(); // Allow access to the route 
      } 
    }
    //next(); 
  
  



//review routes
//get all reviews
app.get('/reviews', async (req,res)=>{
    
  const allReviews=await Review.find()
  res.json(allReviews)
  


  });


app.get('/reviews/:id', async (req,res)=>{

    
  console.log(req.params.id)
  const itemReviews=await Review.find({item_id:req.params.id})
  
  res.json(itemReviews)
    
  
  
    });

//create review

//test
app.get('/test',(req,res)=>{
    res.send({message: "Hello from backend!"})
})

app.post('/addReview', async (req,res)=>{
  const newReview = await Review.create({
    // _id: 0,
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
   
   
app.get('/items/:type', async(req,res)=>{
    
  
  const someItems= await Item.find({type:req.params.type})
  res.json(someItems)
 
})
//find item by id
app.get('/items/:id', async(req,res)=>{
  const oneItem=await Item.findOne({id:req.params.id})
  res.json(oneItem)
})
//find items by type

// app.get('/items/type', async(req,res)=>{
  
//   const filteredItems=await Item.find();
//   res.json(filteredItems)
// })

//cart routes
app.get('/cart', async(req,res)=>{
  const allCart= await Cart.find()
  //console.log(allCart)
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


  // console.log("remove from cart")
 
 
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

//signup

app.post("/signup", async (req,res)=>{
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  const newUser = await User.create({
    email: req.body.email,
    password: hashedPassword,
    isAdmin:false
});

const payload={email: newUser.email, isAdmin: newUser.isAdmin}
const token=jwt.sign(payload, JWT_SECRET)
console.log(jwt.verify(token, JWT_SECRET))
console.log(token)
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
  console.log(user)
  if (user){
    const passwordMatch = bcrypt.compare(password, user.password).then((result)=>{
      if(result){
        console.log("result")
        console.log(result)
        const payload = {email: user.email, isAdmin:user.isAdmin}
        const token=jwt.sign(payload, JWT_SECRET)
        console.log(jwt.verify(token, JWT_SECRET))
        
        const response ={
          email: user.email,
          isAdmin: user.isAdmin,
          token: token
        }
        //res.json({token})
        res.json(response)
       
        console.log("token")
        console.log(token)
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
  console.log("add item running authenticating")
  const newItem = await Item.create({

    id:req.body.id,
    name:req.body.name,
    price:req.body.price,
    img:req.body.img,
    desc:req.body.desc,
    inventory:req.body.inventory,
    type:req.body.type
    
    
});


res.json(newItem);
  
})

app.delete("/shop/delete/:id", authenticateToken, async(req,res)=>{
  console.log("remove from cart")
  console.log(req.params.id)
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

