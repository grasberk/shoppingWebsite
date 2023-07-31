import React,{useState} from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
//tried putting loginsubmit in app.js and pass as props
//tried using props and state
//works with other props
function showUsername(username){
    
    if (username.result!=null){
        return(
            <div>
                <h1>user logged in as: {username.result}</h1>
                
            </div>
        )
    }
}
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
        console.log("start of sign up");
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
            
            const token = data.token; // Access the token property in the response
            const username=data.email
            setUsername(username)
            
            console.log("returning token") 
            return token;
            
        }).then((token)=>{
            console.log("setting token state")
           
            //setTokenData(token)
            return token;
          }).then((result)=>{
            sendToken(result)
            
            navigate('/shop')
          })
        
    }
      function loginSubmit (userEmail,userPassword,setTokenData,setUsername,userReview,productDetails,itemData){
        console.log("start login")
        console.log(itemData)
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
            console.log("checking for user email and review")
           
            console.log(userEmail)
            console.log(userReview)
            sendEmail(data.email)
            sendisAdmin(data.isAdmin)
            
            const token = data.token; // Access the token property in the response
            if(userEmail!=null && itemData!=null){
                console.log(itemData)
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
    {/* {sendEmail(useremail)} */}
    {props.userLogged}
    
<Form>
    {/* <Button onClick={sendInfo}>Send Data to Parent</Button> */}
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