import Em from 'ember';

export default Em.Route.extend({
  model: function() {
    return this.get('store').find('user');
  }
});
