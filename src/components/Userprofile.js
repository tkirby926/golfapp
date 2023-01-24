
var  UserProfile = (function() {

  function getCourseCookie() {
    if (document.cookie === "") {
      return "null";
    }
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded .split('; ');
    var username = "null";
    for (var i = 0; i < cArr.length; i++) {
      if (cArr[i].split('=')[0] === "course_admin") {
        username = cArr[i].split('=')[1];
        return username;
      }
    }
    return username;
  }
  function setCookie(cName, cValue, expDays) {
    document.cookie = "";
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + ";"
  }

  function getCookie() {
    if (document.cookie === "") {
      return "null";
    }
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded .split('; ');
    var username = "null";
    for (var i = 0; i < cArr.length; i++) {
      if (cArr[i].split('=')[0] === "username") {
        username = cArr[i].split('=')[1];
        return username;
      }
    }
    return username;
  }

  function deleteCookie() {
    if (document.cookie === "") {
      return;
    }
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded .split('; ');
    for (var i = 0; i < cArr.length; i++) {
      if (cArr[i].split('=')[0] === "username") {
        var username = cArr[i].split('=')[1];
        fetch(getUrl() + "/api/v1/delete_cookie/" + username, { credentials: 'same-origin', method: 'DELETE' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
        })
      }
    }
    setCookie('username', 'null', 30)
    return;
  }

  function checkAdminCookie() {
    if (document.cookie === "") {
      return "null";
    }
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded .split('; ');
    var username = "null";
    for (var i = 0; i < cArr.length; i++) {
      if (cArr[i].split('=')[0] === "admin") {
        username = cArr[i].split('=')[1];
        return username;
      }
    }
    return username;
  }

  return {
    setCookie: setCookie,
    getCookie: getCookie,
    getCourseCookie: getCourseCookie,
    checkAdminCookie: checkAdminCookie,
    deleteCookie: deleteCookie,
  }

})();

export default UserProfile;