import "./css/StarRating.css";
import React, { useState } from "react";

const leaveReview = (e) => {
    e.preventDefault();
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
        body: JSON.stringify({  rating: rating.toString(),
                                description: e.target[5].value})
    };
    fetch('/api/v1/add_review', requestOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            if (data.error == "none") {
                window.location.assign("/");
            }
        });

}

const StarRating = () => {
    const [course_review, setCourseReview] = useState("");
    const [course, setCourse] = useState("");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    return (
        <div>
                <h3 style={{textAlign: 'center'}}>Leave a Review</h3>
                <h4 hidden={!course_review} style={{textAlign: 'center'}}>We value the opinions of our customers. Please let us know how we are doing and what we can improve on, and thank you very much for using GolfTribe</h4>
                <div hidden = {course_review}>{course}</div>
                <form style={{width: '50%', minHeight: '20vh'}} class='form' onSubmit={(event) => leaveReview(event)}>
                    <div style={{display: 'block', width: '100%'}}>
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
            </div>
    );
  };

  export default StarRating;