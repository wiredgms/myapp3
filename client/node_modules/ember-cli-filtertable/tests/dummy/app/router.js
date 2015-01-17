import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('tree');
  this.route('flat', {path: '/'});
});

export default Router;
