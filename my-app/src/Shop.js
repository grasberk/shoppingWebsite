import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './myStyles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import AddForm from "./AddForm";




function showMessage(available){
    if (available===false){
        return <div class="alert" role="alert">
        Product not available! 
        
      </div>
    }
    
}
function removemShop(data,setItem,newToken,userAdmin){
    console.log(userAdmin)
    fetch(`http://localhost:8000/shop/delete/${data.id}`, {
        method:"DELETE",
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${newToken}`,
          }
      }).then(()=>{
        setItem({
            
            status:"pending"
        })
      })
}
function createItem(data,newToken){
   
    
  //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q0QGdtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2ODYxNTc3NDl9.rOeUsnfjNfgWZHtQCviBcIgzMOCgIT4S7Ump48Mpufs"
  const newItem={

    "id":data.id,
    "name":data.name,
    "price":data.price,
    "img":data.img,
    "desc":data.desc,
    "inventory":data.inventory,
    "type":data.type
    
  }
  return fetch("http://localhost:8000/additem", {
    method:"POST",
    body:JSON.stringify(newItem),
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${newToken}`,
    }
    
  })


}
function findItem(filter,setItem,setFilter){
    
   
        fetch(`http://localhost:8000/items/${filter.result}`, {
        method:"GET",
        headers:{
            "Content-Type":"application/json",
          }
      }).then((res)=>{
        return res.json()
      }).then((filteredItems)=>{
        
        
        setItem({
            result:filteredItems,
            status:"completed"
        })
      }).then(()=>{
        setFilter({
            status:true
        })
        return filter
      })

    
    



}

// function showTestMessage(testmessage){
//     if(testmessage.result!="done"){
//         return(
//             <div>
//                 <h1>{testmessage.result}</h1>
//                 <h2>message from function</h2>
//             </div>
//         )

//     }
    
    
// }

function Shop(props){
    
 const[testmessage,setTestMessage]=useState({
    result:props.newMessage
 })
 const[username,setUsername]=useState({
    result:props.userLogged,
    status:false
 })
 


    //only add to cart if within inventory limits done
    //move reviews to item page done
    //should not be able to add to cart if quantity is zero done
    //checkout component inventory affects quantity 
    //make cart have updated fields for same item instead of new items added to cart db


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
    
    const [message,setMessage]=useState({
        available:"product not available at this time"
    })
    const[Quantity, setQuantity]=useState({
        items:0,
        isUpdated:false,
        isAvailable:true
    })

    const[filter,setFilter]=useState({
        result: null,
        status:false
    })
    const[filterCart,setFilterCart]=useState({
        filterCart:null
    })
    
    // function addToCart(productInfo){

    // }
    const[Item,setItem]=useState({
        result:null,
        status:"pending",
        addstatus:"null"
    });
    if (Item.status!=="completed" && filter.status===false){
      
       fetch("http://localhost:8000/items")
       .then(res=>res.json())
       .then(
        (result)=>{
            
                setItem({
                    result:result,
                    status:"completed"
                })
            
            
            
        }
       )
    }
    else{
        
       //console.log(Item.result)

    }
    

    const [originalData,setOriginalData]=useState(Item)
   if(Item.status==="completed"){
    return(
        
        <div>
            
           
              
               {props.userLogged}
            
            
            <Form id="filter"> 
            <Form.Group>
              <Form.Label>Filter by (fighting,sports)</Form.Label>
              <Form.Control type="text" name="filter" placeholder="type" onChange={(e)=>setFilter({
                
                result:e.target.value
                
              })}  ></Form.Control>
              </Form.Group>
              <Button onClick={()=>findItem(filter,setItem,setFilter)}> Submit</Button>
             
              </Form>
            <div className="products">
                
            {Item.result.map(product=> 
            
            <Card key={product.id} greeting={"hi"} border={"dark"} className="block"  style={{ width: '20rem' }}>
            <Button className="itemButton" onClick={()=>props.addItemToPage(product)} >
            <Card.Img src={product.img} className="itemImg"  />
            </Button>
            
            
            
         
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>
                Type: {product.type}<br></br>
                Price:${product.price}<br></br>
                {/* Description: {product.desc} */}
             
            </Card.Text>
            
            <Button onClick={()=>removeQ(product,setQuantity,Quantity.isUpdated,Quantity.isAvailable)} >-</Button>{product.quantity}
            <Button onClick={()=>addQ(product,setQuantity,Quantity.isUpdated,Quantity.isAvailable)} >+</Button>
                
            <Button variant="success" onClick={()=>props.addToCart(product,props.userLogged)} >Submit</Button>
            {props.userAdmin===true ? <Button variant="danger" onClick={()=>removemShop(product,setItem,props.newToken,props.userAdmin)} >Remove</Button> : null }
            
            <p>Inventory: {product.inventory}</p>
            
            
          </Card.Body>

        </Card> )}
        
       {props.userAdmin===true ? <AddForm newItem={(data)=>{
            createItem(data,props.newToken).then(res=>res.json())
            .then(
             (result)=>{
                 
                 setItem({
                     
                     addstatus:"completed"
                 })
                 
             }
            )
             }
            
        } ></AddForm>: null} 
        {showMessage(Quantity.isAvailable)}
        </div>
       
        
        
        </div>
        

  
      
      
        
    );

   }
    
    
    
    

}
export default Shop;