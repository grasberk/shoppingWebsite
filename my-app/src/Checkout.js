import Card from 'react-bootstrap/Card';
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import './myStyles.css'

function Checkout(props){
   const [cart,setCart]=useState({
      data:props.cartData
   })
   console.log(props.cartData)
   if(cart.data!=null){
         console.log(cart.data)
      return(
    
         <div>
           <h1>Checkout Page</h1>
           
           
         </div>
         
           
         
      )
   }
 
}

export default Checkout;