var  TourSteps = (function() {

    function getSteps() {
        return [{title: "Introduction", 
        content: "Welcome to GolfTribe! Before diving in, here's an overview of our site to give a background on the features! Please press the Next button to continue.", 
        target: "#times_form", 
        placement: "top-end"},
        {title: "Tee Time Window", 
        content: "Here is where to book tee times on the homepage. Enter your zipcode below to find courses in your area and book teetimes with other golfers, whose profiles you will see before booking. After booking, you will also have the opportunity to invite friends (if there are enough spots).", 
        target: "#times_form", 
        placement: "top-start"},
        {title: "Edit Profile", 
        content: "This section is the dropdown for everything else you will need for GolfTribe. This first section allows you to edit any of the selections you made in your profile.", 
        target: "#ep", 
        placement: "left-start"},
        {title: "Booking Times", 
        content: "This selection takes you back to the homepage, which is the main route for booking teetimes.", 
        target: "#home", 
        placement: "left-start"},
        {title: "Golftribe User Hub", 
        content: "This button routes to the page where you can see all other Golftribe users (including friends). You can also see people who have requested to be your friend, along with your friends' upcoming teetimes (which are instantly joinable if they are not full).", 
        target: "#friends", 
        placement: "left-start"},
        {title: "Your Activity", 
        content: "This section shows you all activity in your profile, including the posts you have created, your friends, and your upcoming tee times.", 
        target: "#activity", 
        placement: "left-start"},
        {title: "Message Friends", 
        content: "This selection takes you to all message conversations you have with your Golftribe friends. It also easily allows you to start new conversations with friends.", 
        target: "#messages", 
        placement: "left-start"},
        {title: "Friends' Posts", 
        content: "This button takes you to all your friends posts. Posts may have buttons (if the posting user chooses) that link to teetimes they have upcoming, making it easier than ever to play with your friends.", 
        target: "#posts", 
        placement: "left"},
        {title: "Course/User Search", 
        content: "If you know the course or user you want to search for, use this bar to do so quickly.", 
        target: "#search", 
        placement: "bottom"}];
    }

    return {
        getSteps: getSteps
    }
})();

export default TourSteps;