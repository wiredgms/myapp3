import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  surname: DS.attr('string'),
  email: DS.attr('string'),
  isActive: DS.attr('boolean'),
  gender: DS.attr('string'),
  fullName: function() {
    return "%@ %@".fmt(this.get('name'), this.get('surname'));
  }.property('name', 'surname')
});
