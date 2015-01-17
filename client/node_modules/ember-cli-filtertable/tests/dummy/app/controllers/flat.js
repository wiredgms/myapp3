import Em from 'ember';
export default Em.ArrayController.extend({
  /* Options for dropdown filter */
  activeFilterOptions: ['all users', 'active', 'inactive'],
  genderFilterOptions: ['both genders', 'male', 'female'],
  applyDropdownFilter: function(records) {
    Em.debug("Applying dropdown filter in controller");
    var activeFilter = this.get('activeFilter'),
        genderFilter = this.get('genderFilter');
    if (activeFilter !== 'all users') {
      records = records.filterBy('isActive', activeFilter === 'active');
    }
    if (genderFilter !== 'both genders') {
      records = records.filterBy('gender', genderFilter);
    }
    return records;
  },
  reloadTable: function() {
    Em.debug("Sending reload user table from controller");
    Em.debug(this.get('reloadUsers'));
    this.set('reloadUsers', true);
  }.observes('genderFilter', 'activeFilter'),

  customBtnActive: function() {
    //Handler to set isActive on custom button
    return this.get('selectedRecords.length') === 2;
  }.property('selectedRecords.@each'),
  actions: {
    clickedNone: function() {
      Em.debug("Clicked on NONE button");
    },
    clickedOne: function() {
      Em.debug("Clicked on ONE button");
    },
    clickedMany: function() {
      Em.debug("Clicked on MANY button");
    },
    clickedCustom: function() {
      Em.debug("Clicked on CUSTOM button");
    },
    removeRow: function(record) {
      Em.debug("Removing selected record");
      this.get('content').removeObject(record);
      record.destroy();
    }
  }
});
