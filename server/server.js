var Hapi = require('hapi');
var Joi = require('joi');
var routes = require('./routes');

// Create a server with a host and port
var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000,
});

server.register({ register: require('lout') }, function(err) {
});

server.route(routes);

server.start(function () {
    console.log('MyApp3 Server running at:', server.info.uri);
});