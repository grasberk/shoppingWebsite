import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { useState } from 'react';



//create admin routes to remove
//i need to fix quantity 
//on click of item open to a item summary page which includes item info

//item summary should include latest 5 review(order by id) 
//users should be able to leave stars



function AddForm(props) {

  const[formdata,setFormData]=useState({
    id:null,
    name:null,
    price:null,
    img:null,
    desc:null,
    inventory:null,
    type:null
  })

  

  return (
    <Card className="block" style={{ width: "18rem" }}>
      <Card.Body>
          
          <Form>
          
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="Enter name" onChange={(e)=>setFormData({
                ...formdata,
                name:e.target.value
                
              })}  ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control type="text" placeholder="Enter price" onChange={(e)=>setFormData({
                ...formdata,
                price:e.target.value
                
              })}></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Img</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter img link" onChange={(e)=>setFormData({
                  ...formdata,
                  img:e.target.value
                  
                })}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description" onChange={(e)=>setFormData({
                  ...formdata,
                  desc:e.target.value
                  
                })}
              ></Form.Control>
              
            </Form.Group>
            <Form.Group>
              <Form.Label>Inventory</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter quantity" onChange={(e)=>setFormData({
                  ...formdata,
                  inventory:e.target.value
                  
                })}
              ></Form.Control>
              
            </Form.Group>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" name="name" placeholder="Enter type" onChange={(e)=>setFormData({
                ...formdata,
                type:e.target.value
                
              })}  ></Form.Control>
            </Form.Group>
           
            <Button onClick={()=>{props.newItem(formdata)}}>Submit</Button>
            
          </Form>
          
          
        
      </Card.Body>
    </Card>
  );
}

export default AddForm;
