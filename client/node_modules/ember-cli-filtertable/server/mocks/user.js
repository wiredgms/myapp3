module.exports = function(app) {
  var express = require('express');
  var userRouter = express.Router();

  var USERS = [
    {id: 1, name: "Andrew", surname: "Zimba", email: "andrew@ft.example.com",
     isActive: true, gender: 'male'},
    {id: 2, name: "Betty", surname: "Xaru", email: "betty@ft.example.com",
     isActive: true, gender: 'female'},
    {id: 3, name: "Charles", surname: "Wu", email: "charles@ft.example.com",
     isActive: false, gender: 'male'},
    {id: 4, name: "Dianna", surname: "Vice", email: "dianna@ft.example.com",
     isActive: true, gender: 'female'},
    {id: 5, name: "Eddie", surname: "Upton", email: "eddie@ft.example.com",
     isActive: true, gender: 'male'},
    {id: 6, name: "Frieda", surname: "Tonton", email: "frieda@ft.example.com",
     isActive: false, gender: 'female'},
    {id: 7, name: "Graeme", surname: "Smith", email: "graeme@ft.example.com",
     isActive: false, gender: 'male'}
  ];

  userRouter.get('/', function(req, res) {
    res.send({users:USERS});
  });

  userRouter.get('/:id', function(req, res) {
    res.send({users: USERS[req.params.id]});
  });
  app.use('/api/users', userRouter);
};
