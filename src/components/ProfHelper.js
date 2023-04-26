import UserProfile from './Userprofile';

var  ProfHelper = (function() {

    function addFriend(event, user, is_friends) {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                                   receiver: user
            })
        };
        fetch(UserProfile.getUrl() + "/api/v1/users/add_friend", requestOptions)
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data);
            return getProf(user, 'p')
        })
    }

    const check_val = [
        null,
        null,
        null,
        null,
        2.5,
        null,
        1.1,
        1.1,
        null, 
        null,
        null,
        0.5,
        null,
        1.1,
        2.1
    ]

    const data = [
        [],
        [],
        [],
        [],
        ["Less than 75", "75-85", "85-95", "95-105", "105-115", "115+"],
        [],
        ["Always", "Sometimes", "Never"],
        ["Always", "Sometimes", "Never"],
        [],
        [],
        [],
        ["Serious", "Here to have fun"],
        [],
        ["No wagering", "Occassional Wagering", "Frequent Wagering"],
        ["Always Walk", "Most of the Time Walk", "Half and Half", "Most of the time cart", "Always cart"]

    ];

    function getAns(index, value) {
        if (value == check_val[index]) {
            return;
        }
        return data[index][parseInt(value)];
    }

    function navigate(event, url) {
        event.preventDefault();
        window.location.assign(url);
    }

    function checkNull(user, index, preface) {
        if (user[index] === "none" || user[index] === "" || user[index] === null || user[index] === undefined) {
            return;
        }
        else {
            if (index == 4 || index == 6 || index == 7 || index == 11 || index == 13 || index == 14) {
                return (<div><h4 style={{fontWeight: 'bold', display: 'inline'}}>{preface}</h4><h4 style={{fontWeight: 'normal', display: 'inline'}}>{getAns(index, user[index])}</h4></div>)
            }
            return (<div><h4 style={{fontWeight: 'bold', display: 'inline'}}>{preface}</h4><h4 style={{fontWeight: 'normal', display: 'inline'}}>{user[index]}</h4></div>)
        }
    } 

    function seeIfFriends(username, is_friends) {
        if (is_friends === "f") {
            var message_url = '/messages?id=' + username;
            return (
                <div style={{marginTop: '3vh'}}>
                    <button class="button" style={{float: 'left', width: '40%'}} onClick={(event) => navigate(event, '/')}>Book a time</button>
                    <button class="button" style={{float: 'left', width: '40%', marginLeft: '10%'}} onClick={(event) => navigate(event, message_url)}>Send Message</button>
                </div>
            )
        }
        else if (is_friends === "n") {
            return (
                <button class="button" onClick={(event) => addFriend(event, username, is_friends)}>Add Friend</button>
            );
        }
        else if (is_friends === "r") {
            return (
                <button class="button" onClick={(event) => this.acceptFriend(event)}>Accept Friend Request</button>
            );
        }
        else if (is_friends === "l") {
            return (
                <button class="button" onClick={(event) => this.goToLogin(event)}>Login Here to Check Friendship Status!</button>
            );
        }
        else {
            return (
                <button class="button" disabled="true">Friend Request Pending</button>
            );
        }
    }

    function getProf(user, status) {
        var src = user[15];
        if (user[15] === null || user[15] === '') {
            src = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
        }
        return (
        <form class="form1" style={{lineHeight: '2', paddingBottom: '10vh'}}>
                        <img src={src} style={{borderRadius: '50%', height: '200px', margin: '0 auto', display: 'block'}}></img><br></br>
                        <h4 style={{fontWeight: 'bold', fontSize: '20px', lineHeight: '1px', textAlign: 'center'}}>{user[1] + " " + user[2]}</h4>
                        {checkNull(user, 4, "Usual Score: ")}
                        {checkNull(user, 5, "Favorite golf course played: ")}
                        {checkNull(user, 6, "Drinking on the course: ")}
                        {checkNull(user, 7, "Music on the course: ")}
                        {checkNull(user, 8, "Favorite Golfer: ")}
                        {checkNull(user, 9, "Favorite Team: ")}
                        {checkNull(user, 10, "College/School: ")}
                        {checkNull(user, 11, "Serious or casual golfer: ")}
                        {checkNull(user, 13, "Wagering on the course: ")}
                        {checkNull(user, 14, "Golf Cart or Walking: ")}
                        {checkNull(user, 12, "Description: ")}
                        <div>
                            {seeIfFriends(user[0], status)}
                        </div>
                    </form>
        )
    }

    return {
        getAns: getAns,
        getProf: getProf
    }
})();

export default ProfHelper;