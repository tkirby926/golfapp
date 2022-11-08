import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

var  UserProfile = (function() {
  
  function checkCourseCookie() {
    if (document.cookie == "") {
      return "null";
    }
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded .split('; ');
    var username = "null";
    for (var i = 0; i < cArr.length; i++) {
      if (cArr[i].split('=')[0] == "course_admin") {
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
    document.cookie = cName + "=" + cValue + "; " + expires + ";";
  }

  function checkCookie() {
    if (document.cookie == "") {
      return "null";
    }
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded .split('; ');
    var username = "null";
    for (var i = 0; i < cArr.length; i++) {
      if (cArr[i].split('=')[0] == "username") {
        username = cArr[i].split('=')[1];
        return username;
      }
    }
    return username;
  }

  function checkAdminCookie() {
    if (document.cookie == "") {
      return "null";
    }
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded .split('; ');
    var username = "null";
    for (var i = 0; i < cArr.length; i++) {
      if (cArr[i].split('=')[0] == "admin") {
        username = cArr[i].split('=')[1];
        return username;
      }
    }
    return username;
  }

  return {
    setCookie: setCookie,
    checkCookie: checkCookie,
    checkCourseCookie: checkCourseCookie,
    checkAdminCookie: checkAdminCookie
  }

})();

export default UserProfile;