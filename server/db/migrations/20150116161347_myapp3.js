'use strict';                                      //note this migration adds/removes ALL tables, including three tables with foreign keys

exports.up = function(knex, Promise) {
  return Promise.all([
    //knex.raw('SET foreign_key_checks = 0;'),     //postgreSQL style
    knex.raw('PRAGMA foreign_keys = OFF'),         //sqlite3 style

    /* CREATE teacher table */
    knex.schema.createTable('teacher', function (table) {
      table.bigIncrements('teacher_id').primary().unsigned();
      table.string('name',30);
      table.string('email',50);
      table.string('pwdhash');
    }),

    /* CREATE student table */
    knex.schema.createTable('student', function (table) {
      table.bigIncrements('student_id').primary().unsigned();
      table.string('name',30);
      table.string('email',50);
      table.string('pwdhash');
    }),

    /* CREATE class table */
    knex.schema.createTable('class', function (table) {
      table.bigIncrements('class_id').primary().unsigned();
      table.string('name',50).notNullable();
    }),

    /* CREATE assignment table */
    knex.schema.createTable('assignment', function (table) {
      table.bigIncrements('assignment_id').primary().unsigned();
      table.string('name',50).notNullable();

      /* CREATE FKS */
      table.bigInteger('class_id')
      .unsigned()
      .index()
      .references('class_id')
      .inTable('class');
    }),

     /* CREATE teacher_class table */
    knex.schema.createTable('class_teacher', function (table) {
      table.bigIncrements('class_teacher_id').primary().unsigned();

      /* CREATE FKS */
      table.bigInteger('teacher_id')
      .unsigned()
      .index()
      .references('teacher_id')
      .inTable('teacher');

      table.bigInteger('class_id')
      .unsigned()
      .index()
      .references('class_id')
      .inTable('class');
    }),

    /* CREATE student_class table */
    knex.schema.createTable('class_student', function (table) {
      table.bigIncrements('class_student_id').primary().unsigned();

      /* CREATE FKS */
      table.bigInteger('student_id')
      .unsigned()
      .index()
      .references('student_id')
      .inTable('student');

      table.bigInteger('class_id')
      .unsigned()
      .index()
      .references('class_id')
      .inTable('class');
    }),

    //knex.raw('SET foreign_key_checks = 1;')     //postgreSQL style
    knex.raw('PRAGMA foreign_keys = ON')          //sqlite3 style
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
//    knex.raw('SET foreign_key_checks = 0;'),    //postgreSQL style
    knex.raw('PRAGMA foreign_keys = OFF'),        //sqlite3 style

    knex.schema.dropTable('student'),

    knex.schema.dropTable('teacher'),

    knex.schema.dropTable('class'),

    knex.schema.dropTable('assignment'),

    knex.schema.dropTable('class_teacher'),

    knex.schema.dropTable('class_student'),

//    knex.raw('SET foreign_key_checks = 1;')     //postgreSQL style
    knex.raw('PRAGMA foreign_keys = ON')          //sqlite3 style

  ]);
};

