import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Dropbox } from 'dropbox';

var  DropBoxHelpers = (function() {
  
  function getdb() {
    var dbx = new Dropbox({ clientId: 'oop5bqdljvyo2aa', clientSecret: 'hsspgilce6up444' });
    var authUrl = dbx.auth.getAuthenticationUrl('http://localhost:3000')
    dbx.usersGetCurrentAccount()
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.error(error);
        });
    console.log(dbx)
    console.log(authUrl)
  }

  return {
    getdb: getdb
  }

})();

export default DropBoxHelpers;