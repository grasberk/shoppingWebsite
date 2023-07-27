import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './myStyles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import AddForm from "./AddForm";
import { useTheme } from "./ThemeContext";




function showInputMessage(input,setMessage){
  

  if (input===false){
   
      
      return <div className="alert" role="alert">
      Please enter valid inputs! 
      
    </div>
  }
 
  
  
}
function showMessage(available){
    if (available===false){
        return <div className="alert" role="alert">
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
  console.log(data)
   
   
    const newItem={

    
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
    
  
function filterByPrice(filter,setItem){

  if (filter==="priceLH"){
    fetch(`http://localhost:8000/items/priceLH`, {
        method:"GET",
        headers:{
            "Content-Type":"application/json",
          },
      }).then(res=>res.json())
      .then(
        (filteredItems)=>{
          
        console.log("filter result")
        console.log(filteredItems)
        return filteredItems
        
      })

  }
  if (filter==="priceHL"){
    fetch(`http://localhost:8000/items/priceHL`, {
        method:"GET",
        headers:{
            "Content-Type":"application/json",
          },
      }).then(res=>res.json())
      .then(
        (filteredItems)=>{
        console.log("filter result")
        console.log(filteredItems)
          return filteredItems
        
      })

  }
  
}



async function findItem(filter,setItem,setFilter){
    console.log(filter)
    // if (filter === "priceLH" || filter === "priceHL"){
    //   const filteredItems= await filterByPrice(filter,setItem)
    //   console.log(filteredItems)
    //   console.log("filteringbyprice")

    // }
    // if(filter!="alphabetically"){
      fetch(`http://localhost:8000/items/${filter}`, {
        method:"GET",
        headers:{
            "Content-Type":"application/json",
          }
      }).then(res=>res.json())
      .then(
        (filteredItems)=>{
        console.log("filter result")
        console.log(filteredItems)
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

    // }
   
        

    
    



}



function Shop(props){
  
   
  const {isDarkMode, toggleTheme}=useTheme();
  
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

    function editInventory(product){
      console.log(product.inventory)
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
        inventory:product.inventory,
        type:product.type
      
    }
  )
    })
    }
    function addInventory(product,setInventory,updateInventory){

      product.inventory++
      setInventory({
        isUpdated:!updateInventory
      })


    }
    function subtractInventory(product,setInventory,updateInventory){

      product.inventory--
      setInventory({
        isUpdated:!updateInventory
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

    // function checkFilter(filter,Item){
    //   console.log(filter)
    //   console.log(Item)
    //   if (filter==="alphabetically"){
    //     return Item.result.slice().sort((a, b) => a.name.localeCompare(b.name));
    //   }
    //   else{
    //     return Item
    //   }
      
    // }
    const [inventory,setInventory]=useState({
      isUpdated:false
    })
    const [message,setMessage]=useState({
        available:true,
        inputfield:true,
        
    })

    const[Quantity, setQuantity]=useState({
        items:0,
        isUpdated:false,
        isAvailable:true,
        dataSent:false
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
        addstatus:"null",
        showQuantity:true
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
  
    
    
    // const [originalData,setOriginalData]=useState(Item)
   if(Item.status==="completed"){
   
    // const sortedItems = Item.result.sort((a, b) => {
    //   const nameA = a.name.toLowerCase();
    //   const nameB = b.name.toLowerCase();
    //   if (nameA < nameB) return -1;
    //   if (nameA > nameB) return 1;
    //   return 0;
    // });
    // const sortedItems=checkFilter(filter,Item)
    return(
        
        <div className={isDarkMode ? "dark-theme" : "light-theme"}>
            
            <button id="toggleview"onClick={toggleTheme}>
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
              
               {/* {props.userLogged} */}
              
              
            
            <Form id="filter"> 
            <Form.Group>
              <Form.Label>Filter by Name</Form.Label>
              <Form.Control type="text" name="filter" placeholder="type full name" onChange={(e)=>setFilter({
                
                result:e.target.value
                
              })}  ></Form.Control>
              <select name="filter" onChange={(e) => {
                setFilter({ result: e.target.value });
                findItem(e.target.value, setItem, setFilter); // Call findItem on select change
                
              }}>
                {/* <select name="filter" onChange={(e) => setFilter({ result: e.target.value })}> */}
                  <option value="">Select an option</option>
                  <option value="alphabetically">A-Z</option>
                  <option value="fighting">Fighting</option>
                  <option value="sports">Sports</option>
                  <option value="priceLH">Price: Low to High</option>
                  <option value="priceHL">Price: High to Low</option>
                </select>
                      
              </Form.Group>
             
              
              {/* <Button onClick={()=>findItem(filter,setItem,setFilter)}> Submit</Button> */}
              
              </Form>
              
            <div className="products">
                
            {Item.result.map((product)=> 
            
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
                
            <Button variant="success" onClick={()=>{
              props.addToCart(product,props.userLogged)
              setItem({
                showQuantity:!Item.showQuantity
              })

              
              

            }} >Submit</Button>
           

            {props.userAdmin===true ? <Button variant="danger" onClick={()=>removemShop(product,setItem,props.newToken,props.userAdmin)} >Remove</Button> : null }
            <br></br>
            {props.userAdmin===true ? <Button onClick={()=>subtractInventory(product,setInventory)}>-</Button> : null }
            {props.userAdmin===true ? product.inventory : null }
            {props.userAdmin===true ? <Button  onClick={()=>addInventory(product,setInventory,inventory.isUpdated)}>+</Button> : null }
            {props.userAdmin===true ?  <Button variant="success" onClick={()=>editInventory(product)} >Submit</Button> : null }
            
          
            
            <p>Inventory: {product.inventory}</p>
            
            
          </Card.Body>

        </Card> )}
        
       {props.userAdmin===true ? <AddForm newItem={(data)=>{
        if(data.name===null || data.price===null || data.img===null ||  data.desc===null || data.inventory===null || data.type===null){
          console.log("null fields exist")
          setMessage({
            inputfield:false
          })
         }
         else{
        
          createItem(data,props.newToken).then(res=>res.json())
          .then(
           (result)=>{
            
               
               setItem({
                   status:"pending",
                   addstatus:"completed"
               })
               
           }
          ).then(()=>{
            setMessage({
              inputfield:true
            })
          })

         }
         
             }
            
        } ></AddForm>: null} 
        {showMessage(Quantity.isAvailable)}
        {showInputMessage(message.inputfield,setMessage)}
        </div>
       
        
        
        </div>
        

  
      
      
        
    );

   }
    
    
    
    

}
export default Shop;