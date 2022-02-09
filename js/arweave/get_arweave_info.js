let request = require("request");

let options = {
 method: 'GET',
 url: 'https://arweave.net/info'
};

request(options, function (error, response, body) {
  if (error){
   console.error(error);
  }
  console.log('Arweave body: ', JSON.parse(body));
  console.log('Arweave network height is: ' + JSON.parse(body).height);
});

/*
% node get_arweave_info.js
Arweave network height is: 869003
*/
