module.exports = function(app) {
  var express = require('express');
  var groupRouter = express.Router();

  var GROUPS = [
    {id: 1, name: "Single", depth: 1},
    {id: 2, name: "Parent of 2", children: [3,4], depth: 1},
    {id: 3, name: "Child 1", depth: 2, children: [5], parent: 2},
    {id: 4, name: "Child 2", depth: 2, parent: 2},
    {id: 5, name: "Sub-child 1", depth: 3, parent: 3}
  ];

  groupRouter.get('/', function(req, res) {
    res.send({groups:GROUPS});
  });

  groupRouter.get('/:id', function(req, res) {
    res.send({groups: GROUPS[req.params.id]});
  });
  app.use('/api/groups', groupRouter);
};
