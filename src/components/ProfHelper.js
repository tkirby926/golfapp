import UserProfile from './Userprofile';
import Chat from './photos/live-chat.jpeg'

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
        event.stopPropagation();
        window.location.assign(url);
    }

    function checkNull(user, index, preface) {
        if (user[index] === "none" || user[index] === "" || user[index] === null || user[index] === undefined) {
            return;
        }
        else {
            if (index == 4 || index == 6 || index == 7 || index == 11 || index == 13 || index == 14) {
                return (<div><h4 style={{fontWeight: 'bold', margin: '0'}}>{preface}</h4><h4 style={{fontWeight: 'normal', display: 'flex', marginTop: '0', marginBottom: '8px'}}>{getAns(index, user[index])}</h4></div>)
            }
            return (<div><h4 style={{fontWeight: 'bold', margin: '0'}}>{preface}</h4><h4 style={{fontWeight: 'normal', display: 'flex',  marginTop: '0', marginBottom: '8px'}}>{user[index]}</h4></div>)
        }
    } 

    function getProf(user, status) {
        var src = user[15];
        if (user[15] === null || user[15] === '') {
            src = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
        }
        return (
        <div>
                        <div style={{width: '100%'}}>
                            <img src={src} style={{borderRadius: '50%', height: '100px', margin: '0 auto', display: 'block'}}></img><br></br>
                        </div>
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
        </div>
        )
    }

    function showFriendsWindow(my_friends, under_width, user) {
        var separation = under_width ? ['50%', '14%'] : ['57%', '10%'];
        return (
            <div style={{display: 'inline-block', float:'left', width: '98%', marginLeft: '1%'}}>
                <h3 style={{marginLeft: '4%'}}>My Friends:</h3>
                <div hidden={my_friends.length === 0}>
                {my_friends.map((result, index) => {
                    var url = "/user?return_url=" + window.location.pathname + "&user=" + result[0];
                    var message_url = '/messages?id=' + result[0];
                    var name = result[1] + " " + result[2];
                    var img_url = result[3];
                    if (img_url === null || img_url == '') {
                        img_url = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
                    }
                        return (
                        <div onClick={(event) => navigate(event, url)} class="user_button" style={{width: '80%', cursor: 'pointer', marginLeft: '7%'}}>
                            <img src={img_url} style={{float: 'left', height: '40px', marginRight: '3%', borderRadius: '50%', border: 'thin solid white'}}></img>
                            <div style={{float: 'left', width: separation[0], height: "100%"}}>
                                <a style={{fontWeight: 'bold', fontSize: 'medium', color: '#0E2F04'}}>{name}<br></br></a>
                                <a style={{fontWeight: 'normal', fontSize: 'medium', color: '#0E2F04'}}>{result[0]}</a>
                            </div>
                            <div style={{float: 'left', height: '100%', backgroundColor: 'white', width: separation[1]}} onClick={(event) => navigate(event, message_url)}>
                                <img src={Chat} style={{margin: 'auto', fontSize: '25px', cursor: 'pointer', height: '40px', display: 'table-cell', borderRadius: '400px', verticalAlign: 'middle', textAlign: 'center'}}></img>
                            </div>
                            <div style={{float: 'right', height: '100%', width:'18%', backgroundColor: 'white'}}>
                                <a href="/" style={{cursor: 'pointer', height: '40px', color: 'white', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', borderRadius: '4px', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: '#0E2F04'}}>Book Time</a>
                            </div>
                        </div>
                        )
                    })}
                    </div>
                    <div hidden={my_friends.length !== 0}>
                        <p hidden={user} style={{textAlign: 'center'}}>You have not added friends yet. Book tee times to meet new users, or use the search bar above to search for users!</p>
                        <p hidden={user} style={{textAlign: 'center'}}>Please sign up or log in to see friends.</p>
                    </div>
                <div style={{marginBottom: '4vh', width: '100%', marginTop: '10%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                    <a class="button4" style={{fontWeight: 'bold'}} href="/see_friends">See All Friends/Users</a>
                </div>    
            </div>
        )
    }

    return {
        getAns: getAns,
        getProf: getProf,
        showFriendsWindow: showFriendsWindow
    }
})();

export default ProfHelper;