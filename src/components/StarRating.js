import "./css/StarRating.css";
import React, { useState } from "react";

const leaveReview = (e, user, course_review) => {
    e.preventDefault();
    var url = '/api/v1/add_review';
    if (course_review) {
        url = '/api/v1/add_course_review';
    }
    var rating = 0;
    for (var i = 0; i < 5; i++) {
        if (e.target[i].className == "off") {
            rating = i;
            break;
        }
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  user: user,
                                rating: rating.toString(),
                                description: e.target[5].value})
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            if (data.error == "none") {
                window.location.assign("/");
            }
        });

}

const showReviews = (reviews) => {
    return (<div>
                {reviews.map((review, index) => {
                    return (<div class="user_button" style={{margin: '0 auto', width: '80%'}}>
                    {[...Array(5)].map((star, index1) => {
                        return (
                            <button
                            style={{backgroundColor: 'transparent', border: 'none', outline: 'none', cursor: 'pointer'}}
                            type="button"
                            key={index1}
                            className={(index1 < review[1]) ? "on" : "off"}
                            >
                            <span className="star">&#9733;</span>
                            </button>
                        );
                        })}
                        <div>
                            <p style={{fontWeight: 'bold'}}>{new Date(review[3]).toLocaleString()}</p>
                            <p style={{fontWeight: 'bold'}}>{review[4]}</p>
                            <p style={{fontWeight: 'normal', color: 'black'}}>{review[2]}</p>
                        </div>
                        </div>
                    )
                })
                }
            </div>)
}

const StarRating = (props) => {
    const course_review = props.course_review;
    const course = props.course;
    const user = props.user;
    const reviews = props.reviews;
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    var src = '';
    if (course_review) {
        if (course[11] == null) {
            src = 'https://i.ibb.co/BL7m5kk/11de0d7a11a5.jpg';
        }
        else {
            src = course[11];
        }
    }
    return (
        <div>
                <h3 style={{textAlign: 'center'}}>Leave a Review</h3>
                <h4 hidden={course_review} style={{textAlign: 'center'}}>We value the opinions of our customers. Please let us know how we are doing and what we can improve on, and thank you very much for using GolfTribe</h4>
                <form style={{width: '50%', minHeight: '20vh'}} class='form' onSubmit={(event) => leaveReview(event, user, course_review)}>
                    <div hidden={!course_review} style={{float: 'left', display: 'flex'}}>
                        <img src={src} style={{height: '80px'}}></img>
                        <h3>{course[3]}</h3>
                    </div>
                    <div style={{display: 'block', width: '100%', clear: 'both'}}>
                        <div style={{float: 'left'}}>
                            <h4>Rating: </h4>
                            <div>
                            <div className="star-rating">
                                {[...Array(5)].map((star, index) => {
                                index += 1;
                                return (
                                    <button
                                    style={{backgroundColor: 'transparent', border: 'none', outline: 'none', cursor: 'pointer'}}
                                    type="button"
                                    key={index}
                                    className={index <= (hover || rating) ? "on" : "off"}
                                    onClick={() => setRating(index)}
                                    onMouseEnter={() => setHover(index)}
                                    onMouseLeave={() => setHover(rating)}
                                    >
                                    <span className="star">&#9733;</span>
                                    </button>
                                );
                                })}
                            </div>
                            </div>
                        </div>
                        <div style={{float: 'right', width: '60%'}}>
                            <h4>Description: </h4>
                            <textarea name="descript" style={{height: '100px', marginBottom: '1.5vh', width: '100%'}}></textarea>
                        </div>
                    </div>
                    <div style={{display: 'block', overflow: 'auto', width: '100%'}}>
                        <input class="button" type="submit" value="Submit"></input>
                    </div>
                </form>
                <div hidden={!course_review}>
                    <h2 style={{marginLeft: '10vw'}}>Last 5 Reviews:</h2>
                    {showReviews(reviews)}
                </div>
            </div>
    );
  };

  export default StarRating;