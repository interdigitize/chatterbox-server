var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/JSON'
};

let storage = {
  results: []
};

var objectId = 0;

module.exports.requestHandler = function(request, response) {

  var compose = function (statusCode, headers) {
    statusCode = statusCode || 200;
    var test = response.writeHead(statusCode, headers);
    console.log(test);
  };


  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  
  var body = '';
  
  var actions = {
    'POST': function() {
      request.on('data', function(data) {
        body += data;
      });
      request.on('end', function () {
        body = JSON.parse(body);
        body.objectId = ++objectId;
        storage.results.push(body);
      });
      compose(201, defaultCorsHeaders);
      response.end();
    },
    'GET': function() {
      data = storage;
      compose(200, defaultCorsHeaders);
      response.end(JSON.stringify(storage));
    },
    'OPTIONS': function() {
      compose(200, defaultCorsHeaders);
      response.end();
    }
  };

  if (request.url === '/classes/messages') {
    if (actions[request.method]) {
      actions[request.method]();
    }
  } else {
    compose(404, defaultCorsHeaders);
    response.end();
  }

};



