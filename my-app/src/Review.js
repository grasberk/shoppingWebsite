
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { useState } from 'react';




function ReviewForm(props) {

  const[review,setReview]=useState({
    
    _id: null,
    message:null
  })

  return (
    <div>

        <Form>
        {/* <Form.Group>
              <Form.Label>Item ID</Form.Label>
              <Form.Control type="text" name="itemid" placeholder="Enter item id" onChange={(e)=>setReview({
                ...review,
                item_id:e.target.value
                
              })}  ></Form.Control>
            </Form.Group> */}
            {/* <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="Enter name" onChange={(e)=>setReview({
                ...review,
                name:e.target.value
                
              })}  ></Form.Control>
            </Form.Group> */}
            <Form.Group>
              <Form.Label>Review</Form.Label>
              <Form.Control type="text" name="review" placeholder="Enter your Review" onChange={(e)=>setReview({
                ...review,
                message:e.target.value
                
              })}  ></Form.Control>
            </Form.Group>
            <Button>Cancel</Button>
            <Button onClick={()=> props.sendReview(review)}> Submit</Button>
            
            <h1>{props.message}</h1>
            
          </Form>
        
          
         
          

             
    </div>
          
         
          
          
        
     
  );
}

export default ReviewForm;
