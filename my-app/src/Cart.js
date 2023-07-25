
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import './myStyles.css'

function findTotal(cart,total){
    let costOfItems=[]
    let sum=0;
    cart.result.forEach(function addTotal (item){
        costOfItems.push(item.quantity*item.price)
     
        
    })
    
    for (let i=0; i < costOfItems.length; i++){
        sum += costOfItems[i]
    }
    if (total.total!=sum){
        return sum;
    }
    else{
        return false;
    }
    
    

}
function showMessage(total,setTotal,cart){
    
    let totalCost=findTotal(cart, total)
    
    if (totalCost!=false ){
        setTotal({
            total: totalCost,
            
        })

    }
    
   
    
    return <div id="total" className="alert" role="alert">
    Total: ${total.total} 
    
  </div>
}


function checkout(cart,total,setTotal){
     
    
    let value=0
 
    cart.result.forEach(product => {
      
        
        

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
  
        
        fetch("http://localhost:8000/cart/delete", {
            method:"DELETE",
          }).then(()=>{
            setTotal({
                total:0
            })
          })
          

        
        
    
    
}

function remove(product,setUpdateCart,updateCart,setCart){
    fetch(`http://localhost:8000/cart/delete/${product.id}`, {
        method:"DELETE",
      }).then(()=>{
        setUpdateCart({
            updateCart:!updateCart
        })
        setCart({
            satus:false
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
    function editQuantity(product){
       
        fetch(`http://localhost:8000/cart/update/${product.id}`, {
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
            inventory:product.inventory,
            type:product.type
          
        }
      )
        })

    }
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
        status: "pending",
        total:0
    })
    
        
     
    if (cart.status!==true){
        fetch(`http://localhost:8000/users/${props.user}`, {
            method:"GET",
            headers:{
                "Content-Type":"application/json",
              }
          }).then(res=>res.json())
          .then(
            (result)=>{
            console.log(result.cart_id)
            
            return result.cart_id
          }).then((cartid)=>{
            fetch(`http://localhost:8000/cart/${cartid}`).then(res=>res.json()).then(
                (result)=>{
                    console.log(result)
                        setCart({
                            result:result,
                            status:!cart.status
                        })
                    
                    
                    
                }
               )
            
          })
      
        // fetch("http://localhost:8000/cart")
        // .then(res=>res.json())
        // .then(
        //  (result)=>{
             
        //          setCart({
        //              result:result,
        //              status:!cart.status
        //          })
             
             
             
        //  }
        // )
     }
 
    if(cart.status===true){
        return(
            
        
            <div >
              
                <h1>Cart Page </h1>
                {showMessage(total,setTotal,cart)}
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
                <Button variant="success" onClick={()=>editQuantity(item)} >Edit Quantity</Button>
                </Card.Body>
                
                <Button variant="danger" onClick={()=>remove(item,setUpdateCart,updateCart,setCart)} >Remove</Button>
    
                </Card>)}
                
                </div>
                <Button onClick={()=>checkout(cart,total,setTotal)}>Checkout</Button>
                
                    


            </div>
            
           
            
            
        )

    }
    
    
    
    

}
export default Cart;