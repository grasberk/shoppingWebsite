import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { useState } from 'react';
import Home from "./Home";
import { useParams } from "react-router-dom";
import ReviewForm from "./Review";


function showReviews(userReview){

  if (userReview.recieved!=true){
    
  }

}
function showMessage(message,userEmail){
  console.log(userEmail)
  if (!userEmail){
    return (
      <div><h1>{message}</h1></div>
    )

  }
  
}


function getReviews(userReview,setUserReview,id){
    //console.log(userReview)
    console.log("item id")
    console.log(id)
    fetch(`http://localhost:8000/reviews/${id}`)
       .then(res=>res.json())
       
       .then(
        (result)=>{
            //console.log(result)
            setUserReview({
                reviews:result,
                
            })
           

            
        }
        
        
       )
      
      
       
}

    
function ItemPage(props){
  const [username,setUsername]=useState(null);
  function addReview(data,addedReviews,setUpdated,check,productDetails,userEmail,setMessage){
    //data represents the review that was submitted
    if (!userEmail){
      console.log("no username")
      setMessage("Please Log In")
      props.goToLogin(data.message)
      

    }
    else{
      if (data!=null){
        
        if (data!=null){
          fetch("http://localhost:8000/addReview", {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
        {
          
          
          item_id:productDetails.id,
          name: userEmail,
          message:data.message
        }
      )
        })
          
        }
          //userreview.reviews(list of reviews)
          addedReviews.push(data)
          
          //setstate for reviews 
          setUpdated({
              
              reviews: addedReviews,
              //recieved
              
              
              recieved:!check
          })
          
          
        }
    }
  

    
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
    
    //console.log(props.productDetails)
    const[Quantity, setQuantity]=useState({
      items:0,
      isUpdated:false,
      isAvailable:true
  })
     const params=useParams();
     const [message,setMessage]=useState(null)
    const[userReview,setUserReview]=useState({
        reviews:null,
        recieved:false,
        
      })
    const [product,setProduct]=useState({
        product:null,
        productId:null
        
    })
   if (product.product === null){
   
    console.log("params.itemid")
    console.log(console.log(params.itemid))
    fetch(`http://localhost:8000/item/${params.itemid}`)
    
       .then(res=>res.json())
       .then(
        (result)=>{
          console.log(result)
          console.log("params.itemid")
    console.log(console.log(params.itemid))
          //need to only run show page after fetch
            
            setProduct({
                product:result,
                
                
            })
            getReviews(userReview,setUserReview,params.itemid)
        
        }
        
       )
       
   }

   if(product.product===null || userReview.reviews===null){
    
        return(
            <h1>Loading...</h1>
            
        )
   }

   else{
    
    return(
        
       
        <div>
          
             {showMessage(message,props.userEmail)}
            <Card key={product.product.id}  border={"dark"} className="block"  style={{ width: '18rem' }}>
            
            <Card.Img src={product.product.img} className="itemImg"  />
            
            
         
          <Card.Body>
            <Card.Title>{product.product.name}</Card.Title>
            <Card.Text>
                Type:{product.product.type}<br></br>
                Price:{product.product.price}<br></br>
                Description: {product.product.desc} 
             
            </Card.Text>
            <Button onClick={()=>removeQ(product.product,setQuantity,Quantity.isUpdated,Quantity.isAvailable)} >-</Button>{product.product.quantity}
            <Button onClick={()=>addQ(product.product,setQuantity,Quantity.isUpdated,Quantity.isAvailable)} >+</Button>
                
            <Button onClick={()=>props.addToCart(product.product)}>Add To Cart</Button>
            
            
            
          </Card.Body>
          
          
          </Card>
         
          <h1>User Reviews</h1>
          {showReviews(userReview)}
          {userReview.reviews.map(post=>
            <Card>
              {console.log(post.name)}
                <h1>Name: {post.name}</h1>

                <h2>Post: {post.message}</h2>

            </Card>)}
           {/* <p>reviews:{JSON.stringify(userReview.reviews)}</p>  */}
        
           <ReviewForm sendReview={(reviewData)=>addReview(reviewData,userReview.reviews,setUserReview,userReview.recieved,props.productDetails,props.userEmail,setMessage)}></ReviewForm>
        </div>
        
        
        
        
    );
    
   
   }
   
 }

export default ItemPage