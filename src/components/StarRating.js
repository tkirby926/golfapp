import "./css/StarRating.css";
import React from "react";
import UserProfile from './Userprofile';



export class StarRating extends React.Component {

    showReviews(reviews) {
        if (this.state.course_review) {
        return (<div>
                    {reviews.map((review, index) => {
                        return (<div class="user_button" style={{margin: '0 auto', width: '80%'}}>
                        {[...Array(5)].map((star, index1) => {
                            return (
                                <button
                                style={{backgroundColor: 'transparent', border: 'none', outline: 'none'}}
                                type="button"
                                key={index1}
                                className={(index1 < review[1]) ? "on" : "off"}
                                >
                                <span className="star">&#9733;</span>
                                </button>
                            );
                            })}
                            <div>
                                <p style={{fontWeight: 'bold', color: '#0E2F04'}}>{new Date(review[3]).toLocaleString()}</p>
                                <p style={{fontWeight: 'bold', color: '#0E2F04'}}>{review[4]}</p>
                                <p style={{fontWeight: 'normal', color: 'black'}}>{review[2]}</p>
                            </div>
                            </div>
                        )
                    })
                    }
                </div>)
        }
        else {
            return ('')
        }
    }

    leaveReview(e) {
        e.preventDefault();
        var url = '/api/v1/add_review';
        var body = JSON.stringify({  user: this.state.user,
            rating: this.state.rating.toString(),
            description: e.target[5].value})
        if (this.state.course_review) {
            url = '/api/v1/add_course_review';
            body = JSON.stringify({  user: this.state.user,
                rating: this.state.rating.toString(),
                description: e.target[5].value,
                courseid: this.state.course[0]})
        }
        var rating = 0;
        for (var i = 0; i < 5; i++) {
            if (e.target[i].className === "off") {
                rating = i;
                break;
            }
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        };
        fetch(UserProfile.getUrl() + url, requestOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            if (data.error === "none" && !this.state.course_review) {
                window.location.assign("/");
            }
            else if (data.error === "none") {
                this.state.reviews.unshift([this.state.course[0], this.state.rating, e.target[5].value, new Date().toLocaleString(), data.user_readable])
                this.forceUpdate();
            }
            else {
                this.setState({error: data.error});
            }
        });
    }
    constructor(props) {
        super(props);
        this.state = {
            course_review: this.props.course_review,
            course: this.props.course,
            user: this.props.user,
            reviews: this.props.reviews,
            rating_avg: this.props.rating,
            rating: '',
            hover: '',
            under_width: false,
            error: ''
        }
        if (this.state.course === null) {
            this.state.course = ['','','','','','','','','','','','',]
        }
    }

    setHover(hov) {
        this.setState({hover: hov})
    }

    setRating(rat) {
        this.setState({rating: rat})
    }

    directToCProf(e) {
        e.preventDefault();
        window.location.assign('/course/' + this.state.course[0])
    }

    render() {
        var src = '';
        this.state.under_width = false;
        var float_r = 'left';
        var float_d = 'right';
        var d_size = '60%';
        if (window.innerWidth < 700) {
            this.state.under_width = true;
            float_r = 'none';
            float_d = 'none';
            d_size = '95%';
        }
        if (this.state.course_review) {
            if (this.state.course[11] === null) {
                src = 'https://i.ibb.co/BL7m5kk/11de0d7a11a5.jpg';
            }
            else {
                src = this.state.course[11];
            }
        }
        var display = this.state.course_review ? 'flex': 'none';
        return (
            <div>
                    <h3 style={{textAlign: 'center'}}>Leave a Review</h3>
                    <h4 hidden={this.state.course_review} style={{textAlign: 'center'}}>We value the opinions of our customers. Please let us know how we are doing and what we can improve on, and thank you very much for using GolfTribe</h4>
                    <div class="user_button_biege" style={{width: '90%', marginLeft: '5%', display: display, paddingTop: '10px', paddingBottom: '10px'}}>
                        <div style={{margin: '0 auto'}}>
                            <img src={src} style={{height: '80px', float: 'left'}}></img>
                            <h3 style={{color: 'black', textAlign: 'center'}}>{this.state.course[3]}</h3>
                            <h3 style={{float: 'left', color: 'black', marginLeft: '2vw'}}>Average Rating: {[...Array(5)].map((star, index1) => {
                                                                                                                return (
                                                                                                                    <button
                                                                                                                    style={{backgroundColor: 'transparent', border: 'none', outline: 'none'}}
                                                                                                                    type="button"
                                                                                                                    key={index1}
                                                                                                                    className={(index1 < this.state.rating_avg) ? "on" : "off"}
                                                                                                                    >
                                                                                                                    <span className="star">&#9733;</span>
                                                                                                                    </button>
                                                                                                                );
                                                                                                                })}</h3>
                            <button style={{marginLeft: '40%', width: '20%'}} class='button4' onClick={(event) => this.directToCProf(event)}>Book a Tee Time Here</button>
                        </div>    
                    </div>
                    <form style={{width: '50%', minHeight: '20vh'}} class='form' onSubmit={(event) => this.leaveReview(event)}>
                        <p style={{color: 'red'}}>{this.state.error}</p>
                        <div style={{display: 'block', width: '100%', clear: 'both'}}>
                            <div style={{float: float_r}}>
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
                                        className={index <= (this.state.hover || this.state.rating) ? "on" : "off"}
                                        onClick={() => this.setRating(index)}
                                        onMouseEnter={() => this.setHover(index)}
                                        onMouseLeave={() => this.setHover(this.state.rating)}
                                        >
                                        <span className="star">&#9733;</span>
                                        </button>
                                    );
                                    })}
                                </div>
                                </div>
                            </div>
                            <div style={{float: float_d, width: d_size}}>
                                <h4>Description: </h4>
                                <textarea name="descript" style={{height: '100px', marginBottom: '1.5vh', width: '100%'}}></textarea>
                            </div>
                        </div>
                        <div style={{display: 'block', overflow: 'auto', width: '100%'}}>
                            <input class="button" type="submit" value="Submit"></input>
                        </div>
                    </form>
                    <div hidden={!this.state.course_review}>
                        <h2 style={{marginLeft: '10vw'}}>Last 5 Reviews:</h2>
                        {this.showReviews(this.state.reviews)}
                    </div>
                </div>
        )
    }
  }

  export default StarRating;