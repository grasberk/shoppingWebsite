
import Card from 'react-bootstrap/Card';
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import './myStyles.css'
function showMessage(total){
    return <div id="total" className="alert" role="alert">
    Total: ${total.total} 
    
  </div>
}
function checkout(cart,total,setTotal){
     console.log(cart.result)
    
    let value=0
 
    cart.result.forEach(product => {
      
        value+=(product.price*product.quantity)
        

        fetch(`http://localhost:8000/shop/update/${product.id}`, {
        method: "PUT",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
    {
     
        id:product.id,
        cart_id:1,
        name: product.name,
        price:product.price,
        img: product.img,
        desc:product.desc,
        quantity:product.quantity,
        inventory:(product.inventory-product.quantity),
        type:product.type
      
    }
  )
    })
        
    });
    setTotal({
        total:value
    })
    
    console.log(value)
        fetch("http://localhost:8000/cart/delete", {
            method:"DELETE",
          })
          

        
        
    
    
}

function remove(product,setUpdateCart,updateCart){
    fetch(`http://localhost:8000/cart/delete/${product.id}`, {
        method:"DELETE",
      }).then(()=>{
        setUpdateCart({
            updateCart:!updateCart
        })
      })
      
    // cart=cart.filter(product=>product.id!==productId)
    // console.log(cart)
    // setCart({
    //     result: cart
    // })
    
    // console.log(cart)
    
    
}

function Cart(props){
    function addQ(product,updateQuantity,increment,){
        
        if (product.inventory!==0&&product.quantity<product.inventory ){
            
            product.quantity++
        // setProduct(products)
        updateQuantity({
            isUpdated:!increment
        })
        }
    
    
    
    else{
        
        updateQuantity({
            isAvailable:false
        })
    
    }
    
    
    }
    function removeQ(product,updateQuantity,increment){
      console.log(product)
        if (product.inventory!==0&&product.quantity<product.inventory){
            
            if(product.quantity>=1){
                product.quantity--
               // setProduct(products)
               updateQuantity({
                   isUpdated:!increment
               })
               
    
           }
        }
    
    
    
    else{
        
        updateQuantity({
            isAvailable:false
        })
    }
    
    
    
    }
        
    // const [checkout,setCheckout]=useState({
    //     purchased:null
    // })
    const[Quantity, setQuantity]=useState({
        items:0,
        isUpdated:false,
        isAvailable:true
    })
    
    const[updateCart,setUpdateCart]=useState({
        updateCart:false
    })
    const[cart,setCart]=useState({
        //result: props.itemData,
        result: null,
        status:false,
        deletestatus:null

    })
    const[total,setTotal]=useState({
        total:0
    })
    
    
      
    //  fetch("http://localhost:8000/cart")
    //     .then(res=>res.json())
    //     .then(
    //      (result)=>{
             
    //          setCart({
    //              result:result,
    //              status:!false
    //          })
             
    //      }
    //     )
        
     
    if (Cart.status!==true){
      
        fetch("http://localhost:8000/cart")
        .then(res=>res.json())
        .then(
         (result)=>{
             
                 setCart({
                     result:result,
                     status:true
                 })
             
             
             
         }
        )
     }
 
    if(cart.status===true){
        return(
            
        
            <div >
               
                <h1>Cart Page </h1>
                {showMessage(total)}
                <div className="products">
                {cart.result.map(item=>
                <Card key={item.id} style={{ width: '18rem' }}>
                <Card.Img src={item.img} width={100}/>
                
                    
                <Card.Body>

                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                      {/* Quantity: {item.quantity} <br></br> */}
                      Price:{item.price}<br></br>
                      Description: {item.desc}
                   
                  </Card.Text>
                  <Button onClick={()=>removeQ(item,setQuantity,Quantity.isUpdated,Quantity.isAvailable)} >-</Button>{item.quantity}
                <Button onClick={()=>addQ(item,setQuantity,Quantity.isUpdated,Quantity.isAvailable)} >+</Button>
                </Card.Body>
                
                <Button variant="danger" onClick={()=>remove(item,setUpdateCart,updateCart)} >Remove</Button>
    
                </Card>)}
                
                </div>
                <Button onClick={()=>checkout(cart,total,setTotal)}>Checkout</Button>
                
                    


            </div>
            
           
            
            
        )

    }
    
    
    
    

}
export default Cart;