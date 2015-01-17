import Em from 'ember';

export default Em.Component.extend({
  /* System settings */
  layoutName: 'components/filter-table',
  selectAll: false,  // select-all button off by default
  deselectAll: false,  // toggle for deselecting all (w/o all being selected)
  selectedRecords: Em.A([]),
  updateSelectedRecords: function() {
    var sr = this.get('selectedRecords'),
        fr = this.get('filteredRecords');
    Em.run.once(function() {
      sr.clear();
      sr.addObjects(fr.filterBy('selected', true));
      Em.debug("Selected: %@".fmt(sr.get('length')));
    });
  }.observes('filteredRecords.@each.selected'),
  loadSelectedRecordsOnController: function() {
    var to = this.get('targetObject');
    if (to === undefined || to === null) {
      Em.debug("WARNING: no target object found. Are we testing?");
      return;
    }
    if (Em.isBlank(to.get('selectedRecords'))) {
      this.set('targetObject.selectedRecords', this.get('selectedRecords'));
    }
  }.on('init'),
  isTree: false,
  showSearchAncestors: true,

  /* General table settings */
  viewLimit: 20,
  columnNum: 2,
  headerFilterColspan: function() {
    var diff = (this.get('showCheckboxes')) ? 1 : 0;
    return this.get('columnNum') + diff;
  }.property('columnNum'),

  /* Elements pertaining to the input box used for filtereing results */
  showTextFilter: true,
  textFilter: "",  // The search bar at the top for filtering
  filterField: 'name',

  /* Checkbox select/deselect all logic */
  showCheckboxes: true,
  noneSelected: function() {
    return this.get('selectedRecords.length') < 1;
  }.property('selectedRecords.@each'),
  oneSelected: function() {
    return this.get('selectedRecords.length') === 1;
  }.property('selectedRecords.@each'),
  oneOrMoreSelected: function() {
    return this.get('selectedRecords.length') > 0;
  }.property('selectedRecords.@each'),
  allSelected: function() {
    return this.get('selectedRecords.length') ===
           this.get('filteredRecords.length');
  }.property('selectedRecords.@each', 'filteredRecords.@each'),

  /* Tree view settings */
  applyTreeFilter: function(records) {
    /* All expand/collapse logic is done here. We don't dynamically add records
     * in the template. Instead we add them to the list here and rely on the
     * sorting by depth first to ensure the correct order.
     */
    if (this.get('isTree') === false) {
      return records;
    }
    function getSubtree(record) {
      // Returns an array containing the whole subtree of the parent
      var records = [record];
      if (record.get('isExpanded') === true) {
        // This needs to become a promise for async references
        record.get('children.content').forEach(function(child) {
          records = records.concat(getSubtree(child));
        });
      }
      return records;
    }
    function isAncestor(node, filterResults) {
      var _isAncestor = false;
      node.get('children').forEach(function(child) {
        if (filterResults.indexOf(child) > -1) {
          // this is a direct parent of a search result
          _isAncestor = true;
        }
        if (isAncestor(child, filterResults) === true) {
          // this child is a distant ancestor;
          _isAncestor = true;
        }
      });
      return _isAncestor;
    }

    function getAncestors(node, filterResults) {
      var ancestors = [];


      if (filterResults.indexOf(node) > -1) {
        ancestors.push(node);
      } else {
        if (isAncestor(node, filterResults)) {
          ancestors.push(node);
          var childAncestors = [];
          node.get('children').forEach(function(child) {
            childAncestors = childAncestors.concat( getAncestors(child, filterResults));
          });
          ancestors = ancestors.concat(childAncestors);
        }
      }
      return ancestors;
    }

    var finalGroups = Em.A([]);
    Em.debug("If text filter is empty, display root nodes");
    if (Em.isBlank(this.get('textFilter'))) {
      // work off the root nodes
      records.forEach(function(r) {
        if (r.get('depth') < 2) {
          finalGroups = finalGroups.concat(getSubtree(r));
        }
      });
    } else {
      if (this.get('showSearchAncestors') === false) {
        // show only matching search results
        finalGroups = records;
      } else {
        // Construct a tree containing the ancestry lines of the matching
        // search results. We do this by traversing the tree from all the roots
        var roots = this.get('_prefilterRecords').filterBy('depth', 1);

        Em.debug('- Getting ancestry -');
        roots.forEach(function(r) {
          Em.debug('  %@'.fmt(r.get('name')));
          finalGroups = finalGroups.concat(getAncestors(r, records));
        });
      }
    }

    return finalGroups;
  },

  filteredRecords: Em.A([]), // Displayed records
  toggleAllSelection: function() {
    // Called when selectAll checkbox is toggled and ensures all records'
    // selection status matches that decreed by the select-all button
    var fRecords = this.get('filteredRecords'),
        sRecords = this.get('selectedRecords'),
        aRecords = this.get('content').filterBy('selected', true);
    Em.debug("Select-all checkbox selected? %@".fmt(this.get('selectAll')));
    Em.run.once(this, function() {
      if (this.get('selectAll') === true) {
        // Select-all button checked, ensure that all visible records are
        // selected, and invisible records are unchecked
        if (sRecords.get('length') === fRecords.get('length')) {
          // all records are already selected
          return;
        }
        // unselecting hidden records, and select all visible records
        aRecords.forEach(function(r) {
          r.set('selected', false);
        });
        fRecords.forEach(function(r) {
          r.set('selected', true);
        });
      } else {
        // select-all is unchecked, so lets unselect all if all visible records
        // are selected
        if (sRecords.get('length') === fRecords.get('length')) {
          // deselect-all since all are selected
          aRecords.forEach(function(r) {
            r.set('selected', false);
          });
        }
      }
    });
  }.observes('selectAll'),
  toggleSelectAllCheckbox: function() {
    Em.run.once(this, function() {
      var as = this.get('allSelected'), sa = this.get('selectAll');
      if (as !== sa) {
        Em.debug("Set select-all checkbox to table state");
        this.set('selectAll', as);
      }
    });
  }.observes('selectedRecords.@each'),
  deselectAllRecords: function() {
    if (this.get('deselectAll') !== true) {
      // only run this when deselectAll is set to true. it is automatically
      // returned to false once everything has been deselected;
      return;
    }
    // Explicitly deselect all. Just setting selectAll to false isn't
    // sufficient since not all records may be selected at this point
    if (this.get('selectAll') === true) {
      // all records are selected, so we can simply deselect them all
      this.set('selectAll', false);
    } else {
      var aRecords = this.get('content').filterBy('selected', true);
      aRecords.forEach(function(r) {
        r.set('selected', false);
      });
    }
    this.set('deselectAll', false);
  }.observes('deselectAll'),
  hasNoFilteredRecords: function() {
    return this.get('filteredRecords.length') < 1;
  }.property('filteredRecords.@each'),
  hasNoActualRecords: function() {
    return this.get('content').get('length') < 1;
  }.property('content.@each'),
  applyTextFilter: function(ac) {
    var filter = this.get('textFilter');
    if (!Em.isBlank(filter)) {
      Em.debug("Applying text filter to records");
      filter = filter.toLowerCase();
      var ff = this.get('filterField');
      ac = ac.filter(function(record) {
        if (Em.isBlank(record) || Em.isBlank(record.get(ff))) {
          return false;
        }
        return record.get(ff).toLowerCase().indexOf(filter) > -1;
      });
    }
    return ac;
  },
  loadRecords: function() {
    Em.debug('Refreshing visible records');
    if (this.get('_ignoreReload') === true) {
      Em.debug("Don't reload for targetObject.reload value change");
      this.set('_ignoreReload', false);
      return;
    }
    if (this.get('reloadRecords') === true) {
      this.set('_ignoreReload', true);
      this.set('reloadRecords', false);
    }
    var ac = this.get('arrangedContent') ||
             this.get('content.arrangedContent') ||
             this.get('content');
    if (Em.isEmpty(ac)) {
      this.set('filteredRecords', []);
      return;
    }
    ac = ac.toArray();  // make copy of the content record
    this.set('_prefilterRecords', ac);
    ac = this.applyTextFilter(ac);
    if (!Em.isBlank(this.get('targetObject.applyDropdownFilter'))) {
      ac = this.get('targetObject').applyDropdownFilter(ac);
    }
    if (ac.then === undefined) {
      this.showFilteredRecords(ac);
    } else {
      var that = this;
      ac.then(function(records) {
        that.showFilteredRecords(records.get('content') || records);
      });
    }
  }.observes('textFilter', 'reloadRecords'),
  showFilteredRecords: function(records) {
    records = this.applyTreeFilter(records);
    Em.debug("Showing filteredRecords");
    var vl = this.get('viewLimit');
    if (vl > 0 && records.get('length') > this.get('viewLimit')) {
      Em.debug("\tChopping records to viewLimit");
      records = records.splice(0, this.get('viewLimit'));
    }
    this.set('filteredRecords', Em.A(records));
  },
  loadOnContentChange: function() {
    if (Em.isEmpty(this.get('content'))) {
      return;
    }
    Em.run.once(this, 'loadRecords');
  }.on('init').observes('content.@each'),
  actions: {
    // custom actions which the user can implement. Its a direct link to a
    // controller action handler
    submit: function(actionName, record) {
      this.get('targetObject').send(actionName, record);
    },
    remove: function(actionName, record) {
      this.get('targetObject').send(actionName, record);
    },
    toggleExpand: function(record) {
      Em.debug("Expanding/Collapsing record");
      var e = record.get('isExpanded') || false;
      if (record.get('childNum') < 1) {
        Em.debug("Cannot expand record without children");
        return;
      }
      record.set('isExpanded', !e);
      this.set('reloadRecords', true);
    }
  }
});
