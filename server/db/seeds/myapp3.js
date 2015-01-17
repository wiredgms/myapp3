'use strict';

exports.seed = function(knex, Promise) {
  return Promise.all([

    knex('teacher').truncate(),
    knex('class').truncate(),
    knex('class_teacher').truncate(),

    knex('teacher').insert([
      {
        name: 'Joe Smith',
        email: 'jsmith@test.net',
        pwdhash: '5f4dcc3b5aa765d61d8327deb882cf99'
      },
      {
        name: 'Vanessa Smith',
        email: 'vsmith@test.net',
        pwdhash: '5f4dcc3b5aa765d61d8327deb882cf99'
      }
    ]),

    knex('class').insert([
      {
        name: 'Introduction to Wood Shop'
      },
      {
        name: 'Fifth-Order Differential Equations in Modern Cooking'
      }
    ]),

    knex('class_teacher').insert([
      {
        teacher_id: '1',
        class_id: '1'
      },
      {
        teacher_id: '2',
        class_id: '2'
      }
    ])

  ]);

};