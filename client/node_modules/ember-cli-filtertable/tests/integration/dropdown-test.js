import Em from 'ember';
import startApp from '../helpers/start-app';
import { test } from 'ember-qunit';

var App;

module('Dropdown filter', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Em.run(App, App.destroy);
  }
});

test("Filter active status", function() {
  expect(2);
  visit('/');
  andThen(function() {
    equal(Em.$("tbody tr").length, 7, "7 Initial Records");
    var selector = ".spec-activeDropdown>option:nth(1)";
    selectOption(selector);
  });
  andThen(function() {
    equal(Em.$("tbody tr").length, 4);
  });
});

test("Filter inactive status", function() {
  expect(2);
  visit('/');
  andThen(function() {
    equal(Em.$("tbody tr").length, 7);
    var selector = ".spec-activeDropdown>option:nth(2)";
    selectOption(selector);
  });
  andThen(function() {
    equal(Em.$("tbody tr").length, 3);
  });
});

test("Filter males", function() {
  expect(2);
  visit('/');
  andThen(function() {
    equal(Em.$("tbody tr").length, 7);
    var selector = ".spec-genderDropdown>option:nth(1)";
    selectOption(selector);
  });
  andThen(function() {
    equal(Em.$("tbody tr").length, 4);
  });
});

test("Filter females", function() {
  expect(2);
  visit('/');
  andThen(function() {
    equal(Em.$("tbody tr").length, 7);
    var selector = ".spec-genderDropdown>option:nth(2)";
    selectOption(selector);
  });
  andThen(function() {
    equal(Em.$("tbody tr").length, 3);
  });
});

test("Filter inactive females", function() {
  expect(2);
  visit('/');
  andThen(function() {
    equal(Em.$("tbody tr").length, 7);
    selectOption(".spec-genderDropdown>option:nth(2)"); // female
    selectOption(".spec-activeDropdown>option:nth(2)"); // inactive
  });
  andThen(function() {
    equal(Em.$("tbody tr").length, 1);
  });
});

test("Filter inactive males", function() {
  expect(2);
  visit('/');
  andThen(function() {
    equal(Em.$("tbody tr").length, 7);
    selectOption(".spec-genderDropdown>option:nth(2)"); // female
    selectOption(".spec-activeDropdown>option:nth(2)"); // inactive
  });
  andThen(function() {
    equal(Em.$("tbody tr").length, 1);
  });
});
