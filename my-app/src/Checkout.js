import Card from 'react-bootstrap/Card';
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import './myStyles.css'

function Checkout(props){
   const [cart,setCart]=useState({
      data:props.cartData
   })
   
   if(cart.data!=null){
       
      return(
    
         <div>
           <h1>Checkout Page</h1>
           
           
         </div>
         
           
         
      )
   }
 
}

export default Checkout;