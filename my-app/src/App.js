import React from 'react';
import { Routes, Route,Link,Navigate } from "react-router-dom";
import Home from './Home';
import Cart from './Cart';
import Shop from './Shop';
import ReviewForm from './Review';
import { useState } from 'react';
import Nav from 'react-bootstrap/Nav'
import LoginForm from './LoginForm';
import './App.css'
import ItemPage from './ItemPage';
import { useNavigate } from 'react-router-dom';
import Checkout from './Checkout';
import { Button } from 'react-bootstrap';

function addToCart (data){
  console.log(data)
  if (data!=null){
    console.log(data.product.name)
    fetch("http://localhost:8000/addToCart", {
          method: "POST",
          headers:{
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(
      {
        //user_id: req.body.user_id,
        id:data.product.id,
        cart_id:1,
        name: data.product.name,
        price:data.product.price,
        img: data.product.img,
        desc:data.product.desc,
        quantity:data.product.quantity,
        type:data.product.type,
        inventory:data.product.inventory
      }
    )
      })
  }
  
}

function itemClicked(product,navigate,setProduct){
  setProduct(product)
  console.log(product)
  navigate("/itempage/"+product.id)

  
}

function checkoutPage(navigate,cart,setCart){
  navigate("/checkout")
  fetch("http://localhost:8000/cart")
        .then((res)=>{
          return res.json()
        }).then(
          (result)=>{
              
              setCart({
                  result:result
                  
              })
              
          })
          
}

function checkCart(data){
  console.log(data)
  
  const cartids=[]



return fetch("http://localhost:8000/cart")
        .then((res)=>{
          return res.json()
        }).then(
         (result)=>{
             
             return result
         }).then( (result)=>{
          
          if (result!=null){
          result.map(product=> cartids.push(product.id)  )
         
          }
        }).then(()=>{
          const x=cartids.includes(data.id)
          
         console.log("return of check is: ")
         console.log(x)
          return x
          
        })
          


          }
          
          

function navigateLogin(navigate,data,setReview){
  console.log(data)
  setReview(data)
  navigate('/login')
}

 function pushToCart(data,username,setMessage,navigate){
  console.log("show username:")

  console.log(username)
 if (username===null || username===false ){
  
  
  setMessage("Please Log In!")
  navigate("/login")
//   if (data!=null&& data.quantity!==0 ){
     
//     fetch("http://localhost:8000/addToCart", {
//           method: "POST",
//           headers:{
//               'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(
//       {
//         //user_id: req.body.user_id,
//         id:data.id,
//         cart_id:1,
//         name: data.name,
//         price:data.price,
//         img: data.img,
//         desc:data.desc,
//         quantity:data.quantity,
//         type:data.type,
//         inventory:data.inventory
//       }
//     )
//       })
       
  
  
// }
  

 }
 
  console.log("start push to cart")
  // fetch("http://localhost:8000/cart")
  // .then(res=>res.json())
  // .then(
  //  (result)=>{
  //      console.log(result)
  //          setCart({
  //              result:result,
  //          })
           
       
       
       
  //  }
  // )
  checkCart(data).then((checkResponse)=>{
    console.log(checkResponse)
    return checkResponse
  }).then((result)=>{
    if(result===false){
    
        if (data!=null&& data.quantity!==0){
     
          fetch("http://localhost:8000/addToCart", {
                method: "POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
            {
              //user_id: req.body.user_id,
              id:data.id,
              cart_id:1,
              name: data.name,
              price:data.price,
              img: data.img,
              desc:data.desc,
              quantity:data.quantity,
              type:data.type,
              inventory:data.inventory
            }
          )
            })
             
        
        
      }
    }
    else{
      console.log(data)
      console.log("start update")
      fetch(`http://localhost:8000/cart/update/${data.id}`, {
              method: "PUT",
              headers:{
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(
          {
           
              id:data.id,
              cart_id:1,
              name: data.name,
              price:data.price,
              img: data.img,
              desc:data.desc,
              quantity:data.quantity,
              type:data.type,
              inventory:data.inventory
            
          }
        )
          })
  
    }
    console.log("after check cart2")
  })
  
 
 
  

  
            

          }
  

function showMessage(username,message){
  
  if (!username){
    return (
      
      <div>{message}</div>
    )

  }
  
  
}

function showToken(token,setToken){
  setToken(token)
  console.log("showing token in app.js")
  console.log(token)
}

function showUsername(username,setUsername,setIsLoggedIn,setIsUserLoggedIn){
  if (username !== "admin@gmail.com"){
    setIsUserLoggedIn(true)
  }
  else{
    setIsUserLoggedIn(false)
  }
  setUsername(username)
  setIsLoggedIn(true)
  console.log("showing username in application.js")
  console.log(username)
}
function showAdmin(isAdmin,setCheckAdmin){
  setCheckAdmin(isAdmin)
  console.log(isAdmin)
}


const handleLogin = (setIsLoggedIn,username,isLoggedIn,navigate,setUsername) => {
  if(username){
    
    setUsername(false)
    setIsLoggedIn(false);
  }
  
  console.log(isLoggedIn)
  navigate('/login')
  
};



function App() {
  const [review,setReview]=useState(null)
  const [checkAdmin,setCheckAdmin]=useState(false)
  const [username,setUsername]=useState(null)
  const [message,setMessage]=useState(null)
  const [product,setProduct]=useState(null)
  const [isLoggedIn, setIsLoggedIn]=useState(null)
  const [isUserLoggedIn, setIsUserLoggedIn]=useState(false)
const [token, setToken]=useState(null);

  const navigate=useNavigate();
  const[itemData,setItemData]=useState({
    itemData:null
  })
  const[cart,setCart]=useState({
    result:null
  })
// cart:[]
const[userReview,setUserReview]=useState({
  reviews:[],
  recieved:false,
  
})
  return (
    
    <div className="p-3 mb-2 bg-body-tertiary">
      
      <div>
        
        
        {showMessage(username,message)}
        
      </div>
      
     
       <div className="topnav">
        
        <Nav>
          <Nav.Item><Nav.Link as={Link} to="/shop"> Shop   </Nav.Link></Nav.Item>

          

          <Nav.Item>
            {username && isUserLoggedIn && (<Nav.Link as={Link} to="/cart">Cart</Nav.Link> )}
            </Nav.Item>

              
          <Nav.Item> <Nav.Link  as={Link} to="/home">  Home  </Nav.Link></Nav.Item>
          <Nav.Item> {!username && (<Nav.Link  as={Link} to="/login">  SignUp/Login </Nav.Link>)}</Nav.Item>
          <Nav.Item id="username">{username}</Nav.Item>

         {username && <Button onClick={()=>{handleLogin(setIsLoggedIn,username,isLoggedIn,navigate,setUsername)}}>  Logout </Button>}
          
        </Nav>
        <h1 id="shoptitle"> GameMart </h1>
        </div>
        
        <Routes>
            <Route path="/home" element={
                <Home userData={userReview.reviews} />
                
            } />

            <Route path="/review" element={

                <ReviewForm />
                
            } />
             
             <Route path="/shop" element={
                <Shop addToCart={(cardData,isLogged)=>pushToCart(cardData,username,setMessage,navigate)}
                addItemToPage={(product)=> itemClicked(product,navigate,setProduct)}
                //newMessage={message}
                newToken={token}
                userLogged={username}
                userAdmin={checkAdmin}

                
                
                />
            } />
            <Route path="/login" element={

                <LoginForm sendTokenData={(tokenData)=>showToken(tokenData,setToken)}
                sendUsername={(username)=>showUsername(username,setUsername,setIsLoggedIn,setIsUserLoggedIn)}
                sendAdmin={(isAdmin)=>showAdmin(isAdmin,setCheckAdmin)}
                userLogged={username}
                userReview={review}
                productDetails={product}

                />
            
            } />
            
            <Route path="/cart" element={username ? <Cart /> : null} />

           <Route path="/itempage/:itemid" element={
               
               <ItemPage    
               addToCart={(productData)=>pushToCart(productData,username,setMessage,navigate)}
               productDetails={product}
               userEmail={username}
               goToLogin={(data)=>navigateLogin(navigate,data,setReview)}
               
               
               />
           } />
            <Route path="/checkout" element={

                
               
               <Checkout cartData={cart.result}    />
           } />
           
          
        </Routes>
        
        



      
     
    </div>
  );
}

export default App;