import Em from 'ember';

export default Em.Component.extend({
  tagName: 'button',
  classNames: ['btn'],
  classNameBindings: ['selectedClass'],
  attributeBindings: ['isDisabled:disabled'],
  isDisabled: function() {
    return this.get('isButtonActive') === false;
  }.property('isButtonActive'),
  selectedClass: function() {
    var c = (this.get('isButtonActive') === true) ?
           this.get('activeClass') : 'btn-default';
    if (this.get('isSet') === true) {
      c += ' active';
    }
    return c;
  }.property('isButtonActive', 'isSet'),

  /* User variables */
  activeClass: 'btn-primary',
  isButtonActive: function() {
    var key = this.get('buttonToggleName');
    return Em.isBlank(key) ? true : this.get(key);
  }.property('targetObject.selectedRecords.@each'),
  buttonToggleName: function() {
    if (Em.isBlank(this.get('isActive'))) {
      Em.debug("No isActive function for action button %@".fmt(this.get('title')));
      return null;
    }
    var activeFn = 'targetObject.%@'.fmt(this.get('isActive'));
    if (!Em.isBlank(this.get(activeFn))) {
      return activeFn;
    }
    activeFn = 'targetObject.%@'.fmt(activeFn);
    // custom handler on controller
    if (!Em.isBlank(this.get(activeFn))) {
      return activeFn;
    }
    // no handler found
    return null;
  }.property(),
  hasGlyph: function() {
    return (!Em.isBlank(this.get('glyphicon')));
  }.property('glyphicon'),
  action: null,
  click: function() {
    if (Em.isBlank(this.get('action'))) {
      Em.debug("No action defined for " + this.get('title'));
      alert("Not yet implemented");
      return;
    }
    // This component can lie either in the controller or in the filter table
    // component. We assume its in the filter table, but if not, the controller
    // is the relevant targetObject
    var t = this.get('targetObject');
    t = (t.get('targetObject') === undefined) ? t : t.get('targetObject');
    t.send(this.get('action'));
  }
});
