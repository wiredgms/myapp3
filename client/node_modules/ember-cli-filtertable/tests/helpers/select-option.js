import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('selectOption', function(app, selector) {
    // choose an option and trigger the change
    find(selector).prop('selected', true);
    find(selector).change();
    return wait();
});
