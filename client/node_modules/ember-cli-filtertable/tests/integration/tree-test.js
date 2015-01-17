import startApp from '../helpers/start-app';
import { test } from 'ember-qunit';
import Em from 'ember';
var App;

module('Tree filter', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Em.run(App, App.destroy);
  }
});

test("Init shows only root nodes", function() {
  expect(1);
  visit('/tree');
  andThen(function() {
    equal(find("tbody tr").length, 2);
  });
});

test("Cannot expand record without children", function() {
  expect(3);
  visit('/tree');
  andThen(function() {
    equal(find("tbody tr").length, 2);
    equal(find("tbody tr:first .spec-toggle-expand").text(), '- ');
    click("tbody tr:first .spec-toggle-expand");
  });
  andThen(function() {
    equal(find("tbody tr").length, 2);
  });
});

test("Expand and contract record", function() {
  expect(6);
  visit('/tree');
  andThen(function() {
    equal(find("tbody tr").length, 2);
    equal(find("tbody tr:nth(1) .spec-toggle-expand").text(), '+ ');
    click("tbody tr:nth(1) .spec-toggle-expand");
  });
  andThen(function() {
    equal(find("tbody tr").length, 4);
    equal(find("tbody tr:nth(1) .spec-toggle-expand").text(), '# ');
    click("tbody tr:nth(1) .spec-toggle-expand");
  });
  andThen(function() {
    equal(find("tbody tr").length, 2);
    equal(find("tbody tr:nth(1) .spec-toggle-expand").text(), '+ ');
  });
});

test("Test tree expansion for search", function() {
  expect(4);
  visit('/tree');
  andThen(function() {
    equal(find("tbody tr").length, 2);
    fillIn('input', "s");
  });
  andThen(function() {
    equal(find("tbody tr").length, 4);
    fillIn('input', "su");
  });
  andThen(function() {
    equal(find("tbody tr").length, 3);
  });
  andThen(function() {
    fillIn('input', "si");
    equal(find("tbody tr").length, 1);
  });
});
