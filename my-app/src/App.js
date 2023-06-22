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

function checkCart(data,cart,setCart){
  const cartids=[]



return fetch("http://localhost:8000/cart")
        .then((res)=>{
          return res.json()
        }).then(
         (result)=>{
             
             setCart({
                 result:result
                 
             })
             return result
         }).then( (result)=>{
          
          if (result!=null){
          result.map(product=> cartids.push(product.id)  )
         
          }
        }).then(()=>{
          const x=cartids.includes(data.id)
          
         
          return x
          
        })
          


          }
          
          



 function pushToCart(data,cart,setCart,username,isLogged,setMessage,navigate){
  console.log(isLogged)
  console.log(username)
 if (username===null){
  console.log("pls log in")
  setMessage("Please Log In!")
  navigate("/login")
  
  

 }
 else{
  console.log("start push to cart")
  console.log(username)
  checkCart(data,cart,setCart).then((checkResponse)=>{
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
 
  

  
            

          }
  

function showMessage(username,message){
  console.log(message)
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

function showUsername(username,setUsername){
  setUsername(username)
  console.log("showing username in application.js")
  console.log(username)
}
function showAdmin(isAdmin,setCheckAdmin){
  setCheckAdmin(isAdmin)
  console.log(isAdmin)
}


const handleLogin = (setIsLoggedIn,username) => {
  if(username){
    setIsLoggedIn(true);
  }
  else{
    setIsLoggedIn(false);
  }
  
};



function App() {
  const [checkAdmin,setCheckAdmin]=useState(false)
  const [username,setUsername]=useState(null)
  const [message,setMessage]=useState(null)
  const [product,setProduct]=useState(null)

const [token, setToken]=useState(null);

  const navigate=useNavigate();
  const[itemData,setItemData]=useState({
    itemData:null
  })
  const[cart,setNewCart]=useState({
    result:[]
})
// cart:[]
const[userReview,setUserReview]=useState({
  reviews:[],
  recieved:false,
  
})
  return (
    
    <div class="p-3 mb-2 bg-body-tertiary">
      
      <div>
        
        {console.log(message)}
        {showMessage(username,message)}
        
      </div>
      
     
       <div class="topnav">
        
        <Nav>
          <Nav.Item><Nav.Link as={Link} to="/shop"> Shop   </Nav.Link></Nav.Item>

          <Nav.Item>{username && (<Nav.Link class="" as={Link} to="/cart">Cart</Nav.Link> )}</Nav.Item>

          
          <Nav.Item> <Nav.Link  as={Link} to="/home">  Home  </Nav.Link></Nav.Item>
          <Nav.Item> {!username && (<Nav.Link  as={Link} to="/login">  SignUp/Login </Nav.Link>)}</Nav.Item>
          <Nav.Item id="username">{username}</Nav.Item>
          
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
                <Shop addToCart={(cardData,isLogged)=>pushToCart(cardData,cart,setNewCart,username,isLogged,setMessage,navigate)}
                addItemToPage={(product)=> itemClicked(product,navigate,setProduct)}
                //newMessage={message}
                newToken={token}
                userLogged={username}
                userAdmin={checkAdmin}

                
                
                />
            } />
            <Route path="/login" element={

                <LoginForm sendTokenData={(tokenData)=>showToken(tokenData,setToken)}
                sendUsername={(username)=>showUsername(username,setUsername)}
                sendAdmin={(isAdmin)=>showAdmin(isAdmin,setCheckAdmin)}
                userLogged={username}

                />
                
                
               
                
            } />
             

                
         
            
            <Route path="/cart" element={username ? <Cart /> : null} />
            {/* <Route path="/cart" element={
               
               <Cart     />
              
           } /> */}
           <Route path="/itempage/:itemid" element={
               
               <ItemPage    productDetails={product} />
           } />
            <Route path="/checkout" element={

                
               
               <Checkout cartData={cart.result}    />
           } />
           
          
        </Routes>
        
        



      
     
    </div>
  );
}

export default App;
