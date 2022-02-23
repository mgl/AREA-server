// Sends a message in the configured server

import axios from 'axios';

function postMessage(_url: string) {
  if (_url === '') {
    _url =
      'https://discordapp.com/api/webhooks/942802858665971832/QlF86Xa2wrzBscnyyRmvC3qYf8D8l2j4Rw-pLbdZbAPZbc7V6B365tyUDDwqVOOIj2G7';
  }
  axios
    .post('_url')
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
