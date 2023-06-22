import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { useState } from 'react';
import Home from "./Home";
import { useParams } from "react-router-dom";
import ReviewForm from "./Review";
function addReview(data,addedReviews,setUpdated,check){
    //data represents the review that was submitted
    if (data!=null){
      if (data!=null){
        fetch("http://localhost:8000/addReview", {
          method: "POST",
          headers:{
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(
      {
        
        _id: data._id,
        item_id:data.item_id,
        name: data.name,
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
    
    
     const params=useParams();
    const[userReview,setUserReview]=useState({
        reviews:null,
        recieved:false,
        
      })
    const [product,setProduct]=useState({
        product:null,
        productId:null
        
    })
   if (product.product === null){

    fetch(`http://localhost:8000/items/${params.itemid}`)
       .then(res=>res.json())
       .then(
        (result)=>{
            
            setProduct({
                product:result,
                
                
            })
            getReviews(userReview,setUserReview,params.itemid)
        
        }
        
       )
       
   }
   
    
    // if (userReview.reviews===null ){
    //     getReviews(userReview,setUserReview,product.productId)
    // }
    

   if(product.product===null || userReview.reviews===null){
    
        return(
            <h1>Item {params.itemid} not found</h1>
            
        )
   }

   else{
    
    return(
        
       
        <div>
             
            <Card key={product.product.id}  border={"dark"} className="block"  style={{ width: '18rem' }}>
            
            <Card.Img src={product.product.img} className="itemImg"  />
            
            
         
          <Card.Body>
            <Card.Title>{product.product.name}</Card.Title>
            <Card.Text>
                 
                Price:{product.product.price}<br></br>
                Description: {product.product.desc} 
             
            </Card.Text>
            
            
            
            
          </Card.Body>
          
          
          </Card>
          <h1>User Reviews</h1>
          {userReview.reviews.map(post=>
            <Card>
                <h1>Name: {post.name}</h1>

                <h2>Post: {post.message}</h2>

            </Card>)}
           {/* <p>reviews:{JSON.stringify(userReview.reviews)}</p>  */}
        
           <ReviewForm sendReview={(reviewData)=>addReview(reviewData,userReview.reviews,setUserReview,userReview.recieved)}></ReviewForm>
        </div>
        
        
        
        
    );
    
   
   }
   
 }

export default ItemPage