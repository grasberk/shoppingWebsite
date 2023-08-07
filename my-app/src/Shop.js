import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './myStyles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import AddForm from "./AddForm";
import { useTheme } from "./ThemeContext";

function showMessage(available){
  if (available===false){
      return <div className="alert" role="alert">
      Product not available! 
      
    </div>
  }
  
}
function showInputMessage(input){
  if (input===false){
   
      
      return <div className="alert" role="alert">
      Please enter valid inputs! 
      
    </div>
  }
}

function removeShop(data,setItem,newToken){
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
    

async function findItem(filter,setItem,setFilter){
    
      fetch(`http://localhost:8000/items/${filter}`, {
        method:"GET",
        headers:{
            "Content-Type":"application/json",
          }
      }).then(res=>res.json())
      .then(
        (filteredItems)=>{
        
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

function getFilter(setShowFilters){
  fetch(`http://localhost:8000/shop/genres`, {
    method:"GET",
    headers:{
        "Content-Type":"application/json",
      }
  }).then((res=>res.json()))
  .then((filters)=>{
    
    setShowFilters(filters)
  })
}

function initializeLocalQuantity(products){
  const quantityObject = {};
  products.forEach((product)=>{
    quantityObject[product.id]=0;
  });
  return quantityObject;
}

function Shop(props){
  
  const [localQuantity,setLocalQuantity]=useState({})
  const [checkQuantity,setCheckQuantity]=useState({
    isAvailable:true
  })
  const [inventory,setInventory]=useState({
    isUpdated:false
  })
  const [message,setMessage]=useState({
      available:true,
      inputfield:true,
      
  })

  const[filter,setFilter]=useState({
      result: null,
      status:false
  })
  
 
  const[Item,setItem]=useState({
      result:null,
      status:"pending",
      addstatus:"null",
      showQuantity:true
  });

  const[showFilters,setShowFilters]=useState(null)

  const {isDarkMode, toggleTheme}=useTheme();

   
  useEffect(() => {
    if (Item.status === "completed") {
      const initializedQuantity = initializeLocalQuantity(Item.result);
      setLocalQuantity(initializedQuantity);
    }
  }, [Item.status]);
 

    function editInventory(product){
      
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
    function addQ(product) {
      if (localQuantity[product.id] < product.inventory) {

        setLocalQuantity((prevQuantity) => ({
          ...prevQuantity,
          [product.id]: prevQuantity[product.id] + 1,
        }));
        setCheckQuantity({ isAvailable: true });
      }else{
        setCheckQuantity({ isAvailable: false });
      }
    
    }
    
    function removeQ(product) {
      if(localQuantity[product.id]>0){
      setLocalQuantity((prevQuantity) => ({
        ...prevQuantity,
        [product.id]: Math.max(prevQuantity[product.id] - 1, 0), 
      }));
      setCheckQuantity({ isAvailable: true });
    }else{
      setCheckQuantity({ isAvailable: false });
    }
  }
  function resetQ(product) {
    
    setLocalQuantity((prevQuantity) => ({
      ...prevQuantity,
      [product.id]: 0, 
    }));
    
  
}


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
       ).then(()=>{
        getFilter(setShowFilters)
       })
    }
  
    
   if(Item.status==="completed"){
   
  
    return(
        
        <div className={isDarkMode ? "dark-theme" : "light-theme"}>
            
            <button id="toggleview"onClick={toggleTheme}>
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>
  
            <Form id="filter"> 
            <Form.Group>
              <Form.Label>Filter by Name</Form.Label>
              <Form.Control type="text" name="filter" placeholder="type full name" 
               onChange={(e) => {
                setFilter({ result: e.target.value });
                findItem(e.target.value, setItem, setFilter); 
                
              }}
              ></Form.Control>
              <select name="filter" 
              onChange={(e) => {
                setFilter({ result: e.target.value });
                findItem(e.target.value, setItem, setFilter); 
                
              }}>
                  
                  <option value="">Select an option</option>
                  {showFilters && showFilters.map((filter,index)=>(
                    <option key={index} value={filter}>{filter}</option>
                  ))}
                  <option value="alphabetically">A-Z</option>
                  <option value="priceLH">Price: Low to High</option>
                  <option value="priceHL">Price: High to Low</option>
                </select>
                      
              </Form.Group>
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
            </Card.Text>
            
            
            {props.userAdmin===false ?<div>
            <Button onClick={()=>removeQ(product)} >-</Button>{localQuantity[product.id]}
            <Button onClick={()=>addQ(product)} >+</Button>
                
            <Button variant="success" onClick={()=>{
              console.log(localQuantity[product.id])
              props.addToCart(product,props.userLogged,localQuantity[product.id])
              resetQ(product)
              
              
            }} >Submit</Button>
            </div>: null }
           

            {props.userAdmin === true ? <Button variant="danger" onClick={()=>removeShop(product,setItem,props.newToken)} >Remove</Button> : null }
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
        {showMessage(checkQuantity.isAvailable)}
        {showInputMessage(message.inputfield)}
        </div>
       
        
        
        </div>
        
    );

   }

}
export default Shop;