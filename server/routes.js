var Hapi = require('hapi');
var Joi = require('joi');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
      filename: "./dev.sqlite3"
  }
});

var bookshelf = require('bookshelf')(knex);

var Teacher = bookshelf.Model.extend({
  tableName: 'teacher'
});

var Class = bookshelf.Model.extend({
  tableName: 'class'
});

module.exports = [

  {
    method: 'GET',
    path: '/products',
    handler: getProducts
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: getProduct,
    config: {
      validate: {
        params: {
          id: Joi.number().integer()
        },
      },
      response: {
        schema: {
          id: Joi.number().required(),
          name: Joi.string().min(2).max(50)
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/products',
    handler: addProduct,
    config: {
      payload: {
        parse: true,
      },
      validate: {
        params: {
          name: Joi.string().min(3).max(20)
        }
      },
      response: {
        schema: {
          id: Joi.number().required()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/hello/{user?}',
    handler: function (request, reply) {
        //var user = request.params.user ? encodeURIComponent(request.params.user) : 'stranger';
        //var user = request.query.user ? encodeURIComponent(request.query.user) : 'stranger';
        var user = request.params.user ? encodeURIComponent(request.params.user) : request.query.name ? encodeURIComponent(request.query.name) : 'stranger';

        reply('Hello ' + user + '!');
    },
    config: {
      validate: {
        params: {
          user: Joi.string().min(3).max(10)
        },
        query: {
          name: Joi.string().min(2).max(20)
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/teachers',
    handler: getTeachers
  },
  {
    method: 'GET',
    path: '/teachers/{id}',
    handler: getTeacher,
    config: {
      validate: {
        params: {
          id: Joi.number().integer()
        }
/*
      },
      response: {
        schema: {
          teacher_id: Joi.number().required(),
          name: Joi.string().min(2).max(50),
          email: Joi.string().min(2).max(50),
          pwdhash: Joi.string().min(25).max(50)
        }
*/
      }
    }
  },
  {
    method: 'GET',
    path: '/classes',
    handler: getClasses
  },
  {
    method: 'GET',
    path: '/classes/{id}',
    handler: getClass,
    config: {
      validate: {
        params: {
          id: Joi.number().integer()
        }
/*
      },
      response: {
        schema: {
          teacher_id: Joi.number().required(),
          name: Joi.string().min(2).max(50),
          email: Joi.string().min(2).max(50),
          pwdhash: Joi.string().min(25).max(50)
        }
*/
      }
    }
  },
  {
    method: 'PUT',
    path: '/classes/{id}',
    handler: updateClass,
    config: {
      validate: {
        params: {
          id: Joi.number().integer()
        }
/*
      },
      response: {
        schema: {
          teacher_id: Joi.number().required(),
          name: Joi.string().min(2).max(50),
          email: Joi.string().min(2).max(50),
          pwdhash: Joi.string().min(25).max(50)
        }
*/
      }
    }
  },
  {
    method: 'POST',
    path: '/classes',
    handler: addClass,

    config: {
      validate: {
        payload: {
          name: Joi.string().required().min(3).max(50)
        }
      }
    }

  }
];


function getProducts(request, reply) {

  if (request.query.name) {
      reply(findProducts(request.query.name));
  }
  else {
      reply(products);
  }
}

function findProducts(name) {
  return products.filter(function(product) {
      return product.name.toLowerCase() === name.toLowerCase();
  });
}

function getProduct(request, reply) {
  var product = products.filter(function(p) {
      return p.id == request.params.id;
  }).pop();

  reply(product);
}

function addProduct(request, reply) {
  var product = {
      id: products[products.length - 1].id + 1,
      name: request.payload.name
  };

  products.push(product);

  reply({id: product.id}).code(201);
}

function getTeachers(request, reply) {

  if (request.query.email) {
    new Teacher({email:request.query.email})
      .fetch()
      .then(function(teacher){
   //     reply('{"teacher:"' + JSON.stringify(teacher) + '}');
        reply(teacher);
    });
  }
  else {
    Teacher.fetchAll().then(function(teachers) {
      reply('{"teachers:"' + JSON.stringify(teachers) + '}');
    });
  }
}

function getTeacher(request, reply) {
  new Teacher({teacher_id:request.params.id})
    .fetch()
    .then(function(teacher){
 //     reply('{"teacher:"' + JSON.stringify(teacher) + '}');
      reply(teacher);
  });
}

function getClasses(request, reply) {

  Class.fetchAll().then(function(classes) {
    reply('{"classes:"' + JSON.stringify(classes) + '}');
  });
}

function getClass(request, reply) {
  new Class({class_id:request.params.id})
    .fetch()
    .then(function(classobj){
 //     reply('{"teacher:"' + JSON.stringify(teacher) + '}');
      reply(classobj);
  });
}

function addClass(request, reply) {

  reply('this would have added a new class named '+ request.payload.name);
}

function updateClass(request, reply) {

  reply('this would have updated the class with id '+ request.params.id);
}

var products = [{
        id: 1,
        name: 'Electric Guitar'
    },
    {
        id: 2,
        name: 'Plastic Banjo'
    },
    {
        id: 3,
        name: 'Wireless Mic'
    }
];

