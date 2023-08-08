import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ReviewForm from './Review';
import { useParams } from 'react-router-dom';



function showReviews(userReview) {
  if (!userReview.reviews || userReview.reviews.length === 0) {
    return <p>No reviews available</p>;
  }
}

function showMessage(message, userEmail) {
  
  if (!userEmail) {
    return (
      <div>
        <h1>{message}</h1>
      </div>
    );
  }
}

function ItemPage(props) {
  const [localQuantity,setLocalQuantity]=useState(0)
  const [checkQuantity,setCheckQuantity]=useState({
    isAvailable:true
  })
  const [message, setMessage] = useState(null);
  
  const params = useParams();
  const [userReview, setUserReview] = useState({
    reviews: null,
  });
  const [product, setProduct] = useState({
    product: null,
    productId: null,
  });

  useEffect(() => {
    fetchProductAndReviews();
  }, []);

  function fetchProductAndReviews() {
    const { itemid } = params;
    fetch(`http://localhost:8000/item/${itemid}`)
      .then((res) => res.json())
      .then((result) => {
        setProduct({
          product: result,
        });
        fetchReviews(itemid);
      });
  }

  function fetchReviews(id) {
    fetch(`http://localhost:8000/reviews/${id}`)
      .then((res) => res.json())
      .then((result) => {
        setUserReview({
          reviews: result,
        });
      });
  }

  function addReview(data, productDetails, userEmail, setMessage, userReview, setUserReview) {
    if (!userEmail) {
      
      setMessage('Please Log In');
      props.goToLogin(data.message);
    } else {
      fetch(`http://localhost:8000/users/${userEmail}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
           
            return data.email;
          }
        })
        .then((user) => {
      
          fetch('http://localhost:8000/addReview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              item_id: productDetails.id,
              name: user,
              message: data.message,
            }),
          }).then(() => {
            
            fetchReviews(productDetails.id);
          });
        })
        .then(() => {
          setUserReview({
            ...userReview,
            recieved: true,
          });
        });
    }
  }

  function addQ(product) {
    if (localQuantity < product.inventory) {

      setLocalQuantity((prevQuantity) => (
         prevQuantity + 1));
      setCheckQuantity({ isAvailable: true });
    }else{
      setCheckQuantity({ isAvailable: false });
    }
  
  }
  
  function removeQ(product) {
    if(localQuantity>0){
    setLocalQuantity((prevQuantity) => (
      prevQuantity - 1 
    ));
    setCheckQuantity({ isAvailable: true });
  }else{
    setCheckQuantity({ isAvailable: false });
  }
}
function resetQ(product) {
  
  setLocalQuantity(0);
  

}


  if (product.product === null || userReview.reviews === null) {

    return <h1>Loading...</h1>;
  } else {
    
    return (
      <div>
        {showMessage(message, props.userEmail)}
        <Card key={product.product.id} border={'dark'} className="block" style={{ width: '18rem' }}>
          <Card.Img src={product.product.img} className="itemImg" />
          <Card.Body>
            <Card.Title>{product.product.name}</Card.Title>
            <Card.Text>
              Type: {product.product.type}
              <br />
              Price: {product.product.price}
              <br />
              Description: {product.product.desc}
            </Card.Text>
            <Button onClick={() => removeQ(product.product)}>-</Button>
            {localQuantity}
            <Button onClick={() => addQ(product.product)}>+</Button>
            <Button onClick={() =>{
              props.addToCart(product.product,localQuantity)
              resetQ(product.product)
            } }>Add To Cart</Button>
          </Card.Body>
        </Card>
        <h1>User Reviews</h1>
        {showReviews(userReview)}
        {userReview.reviews.map((post) => (
          <Card key={post._id}>
           
            <h1>Name: {post.name}</h1>
            <h2>Post: {post.message}</h2>
          </Card>
        ))}
        <ReviewForm
          sendReview={(reviewData) => addReview(reviewData, props.productDetails, props.userEmail, setMessage, userReview, setUserReview)}
        ></ReviewForm>
      </div>
    );
  }
}

export default ItemPage;
