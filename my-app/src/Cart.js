
import Card from 'react-bootstrap/Card';
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import './myStyles.css'
function showMessage(total){
    return <div id="total" class="alert" role="alert">
    Total: ${total.total} 
    
  </div>
}
function checkout(cart,total,setTotal){
     console.log(cart.result)
    // setCheckout({
    //     purchased:cart
    // })
    let value=0
    // cart.result.map(product=>{
    //     console.log(product.price)
    //     value+=(product.price*product.quantity)

    // }
        
        
    //     // console.log(product.price*product.quantity),
        
    //     //total=product.price*product.quantity
        
    
    //     )
    // let value=0
    cart.result.forEach(product => {
        console.log(product.price)
        console.log(product.quantity)
        console.log(product.inventory)
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

function remove(cart,product,productId,setCart,setUpdateCart,updateCart){
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
    // const [checkout,setCheckout]=useState({
    //     purchased:null
    // })
    
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
    
      
     fetch("http://localhost:8000/cart")
        .then(res=>res.json())
        .then(
         (result)=>{
             
             setCart({
                 result:result,
                 status:!false
             })
             
         }
        )
        
     
    
 
    if(cart.result!=null){
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
                      Quantity: {item.quantity} <br></br>
                      Price:{item.price}<br></br>
                      Description: {item.desc}
                   
                  </Card.Text>
                  
                  
      
      
                  
                  
                  
                  
                </Card.Body>
                <Button variant="danger" onClick={()=>remove(cart.result,item,item.id,setCart,setUpdateCart,updateCart)} >Remove</Button>
    
                </Card>)}
                
                </div>
                <Button onClick={()=>checkout(cart,total,setTotal)}>Checkout</Button>
                
                    


            </div>
            
           
            
            
        )

    }
    
    
    
    

}
export default Cart;