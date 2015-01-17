import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  children: DS.hasMany('group', {inverse: 'parent'}),
  parent: DS.belongsTo('group', {inverse: 'children'}),
  depth: DS.attr('number'),
  hasChildren: function() {
    return this.get('_data.children.length') > 0 || false;
  }.property('_data.children.@each'),
  childNum: function() {
    return this.get('_data.children.length') || 0;
  }.property('_data.children.@each')
});
