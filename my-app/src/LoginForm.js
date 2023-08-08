import React,{useState} from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';


function LoginForm(props){
    const navigate=useNavigate();
    function sendToken(tokendata){
        if (tokendata!=null){
           
            return props.sendTokenData(tokendata)
            
        }
    
    }

    function sendEmail(email){
        
        return props.sendUsername(email)

    }
    function sendisAdmin(isAdmin){
        return props.sendAdmin(isAdmin)
    }

    const [useremail,setUseremail]=useState(null);
    const [tokendata,setTokenData]=useState(null);
    const [email, setEmail] = useState(null);
	const [password, setPassword] = useState(null);
    const signupSubmit= (userEmail,userPassword,setTokenData,setUsername)=>{
        
        fetch("http://localhost:8000/signup", {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
				{
                    
					email: userEmail,
                    password: userPassword
				}
			)
        })
        .then((res)=>{
            return res.json()
        })
        .then(data =>{
            
            const token = data.token; 
            const username = data.email;
            setUsername(username);
            
          
            return token;
            
        }).then((token)=>{
            
            return token;
          }).then((result)=>{
            sendToken(result)
            
            navigate('/shop')
          })
        
    }
      function loginSubmit (userEmail,userPassword,setTokenData,setUsername,userReview,productDetails,itemData){
        
        return fetch("http://localhost:8000/login", {
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
					email: userEmail,
                    password: userPassword
				}),
        })
        .then((res)=> {
            return res.json()
        })
        .then(data => {
          
            sendEmail(data.email)
            sendisAdmin(data.isAdmin)
            
            const token = data.token; 
            if(userEmail!=null && itemData!=null){
                
                props.addToCart(itemData,userEmail)
            }
            if (userEmail!=null && productDetails!=null){
                fetch("http://localhost:8000/addReview", {
                  method: "POST",
                  headers:{
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(
              {
                
                
                item_id:productDetails.id,
                name: userEmail,
                message:userReview
              }
            )
              })
                
              }
             
            return token;
          }).then((token)=>{
           
            setTokenData(token)
            return token;
          }).then((result)=>{
            sendToken(result)
            
            navigate('/shop')
          })
          
          
        
        
    };
    
   
      
return(

<div>
    
    {sendToken(tokendata)}
   
    {props.userLogged}
    
<Form>
   
            <Form.Group>
                <Form.Label>Email address</Form.Label><Form.Control
                onChange={(e) =>{setEmail(e.target.value)}}
                type="email" 
                placeholder="Enter email" />
            </Form.Group>
                

            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  onChange={(e) =>{setPassword(e.target.value)}}
                   
                type="password" placeholder="Password" />
            </Form.Group>
            <Button
            variant="primary" onClick={()=>signupSubmit(email,password,setTokenData,setUseremail)}>
                SignUp 
            </Button>
            <span> </span>
            
            <Button
            variant="primary" onClick={()=>loginSubmit(email,password,setTokenData,setUseremail,props.userReview,props.productDetails,props.itemData)}>
                Login
            </Button>
            
            
		</Form>
</div>
)

}

export default LoginForm;