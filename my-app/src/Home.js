import ReviewForm from "./Review";
import Card from 'react-bootstrap/Card';
import { useState } from "react";
import { Button } from "react-bootstrap";




function Home(props){
 
   
    return(
        <div>
              <h1>Home Page </h1>
       
        <Button onClick={()=>props.sendMessage(message)}>send message from home component</Button> 
        </div>
      
        
    );
    
    

}
export default Home;