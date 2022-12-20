import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Dropbox } from 'dropbox';

var  DropBoxHelpers = (function() {
  
  function getdb() {
    var dbx = new Dropbox({ clientId: 'oop5bqdljvyo2aa', clientSecret: 'hsspgilce6up444' });
    fetch("https://api.dropbox.com/oauth2/token", {refresh_token: "eFcxbUDKloUAAAAAAAAAI-JQW4NglFTf_lpYVQoDumE", grant_type: "refresh_token", client_id: "oop5bqdljvyo2aa"})
    .then((data) => {
        console.log(data);
    })
    var authUrl = dbx.auth.getAuthenticationUrl('http://localhost:3000', "offline")
    console.log(authUrl)
  }

  return {
    getdb: getdb
  }

})();

export default DropBoxHelpers;