#Ember CLI Filter Table [![Build Status](https://travis-ci.org/gevious/ember-filtertable.svg)](https://travis-ci.org/gevious/ember-filtertable)

## Description
This component is an Ember CLI add-on which presents a standard html table but
allows for extra options. It includes a text input box for easy filtering, as
well as hooks for dropdown filtering. It also allows for extra buttons in the
header which can activate/deactivate based on selections in the table.

## Installation
npm install ember-cli-filtertable --save-dev

##Basic Usage

    {{filter-table content=content bodyTemplate="mytable-body"
                   headerTemplate="mytable-header"}}

## Demo
Clone this repo and run the app

    sudo npm install -g ember-cli
    git clone git@github.com:gevious/ember-filtertable
    cd ember-filtertable
    npm install; bower install
    ember serve


## Options
When calling the filter table, the following options are available:

### General Options

#### viewLimit
Type: `Number`
Default: `20`

This is the number of maximum records that will be shown in the table.  If it
is set to 0, no limit will be enforced.

#### columnNum
Type: `Number`
Default: `2`

This is the number of columns within the table. It is needed to calculate the
header colspan attribute.

#### selectedRecords
Type: `Array`
Default: `selectedRecords`

This option is only needed when implementing logic that needs to know how many
records are selected. By default, it will use the `selectedRecords` field on
the controller if it hasn't been defined at startup.

#### reloadRecords
Type: `Boolean`

Link this value to a variable in the controller to be able to refresh the table
at will. This is particularly useful if one wants to implement some table
filters (ie dropdown filters) and update the table after the filter has been
selected. This value is reset to `false` every time the table is refreshed
manually.

#### isTree
Type: `Boolean`
Default: false

When this is set, the table will assume the data is in a tree view. For this
to work the data must have the following fields defined:

- parent - a belongsTo relationship containing the parent record
- children - a hasMany relationship to all its children
- depth - the depth of the record in the tree (1 being a root node)
- childNum - returns a count of the number of children a record has

#### showSearchAncestors
Type: `Boolean`
Default: true

With this selection activated the whole line of ancestry is shown in the table
if the search filter matches a child. To only display the child record, set
this to `false`.

### Text Filter Options

#### showTextFilter
Type: `Boolean`
Default: `true`

Either show or hide the text input for record filtering in the header

#### filterField
Type: `String`
Default: `name`

The field in each record on which to apply the text filtering

### Checkbox options

#### showCheckboxes
Type: `Boolean`
Default: `true`

This will show the _select all_ checkbox in the header. It is a convenience checkbox to allow for quick selecting of the whole visible record set

#### toggleSelected
Type: `Boolean`
Default: `false`

By default no records are selected, but setting this to true will mark all visible records as selected.


## Table rows
Since table rows aren't called directly anymore, but rather via the component,
any defined actions won't actually call the controller.  We've added 5 proxies
to the component which will call an action on the component. They are called:

    submit, remove, action1, action2, action3

To get them to work correctly, you'll need to define the action as follows:


    <td {{action "remove" "removeRow" r}}>(remove)</td>

That definition will call the `removeRow` action on the controller with the
current record.


## Tree view
The table can be setup to display a tree view of records.  Since this adds
quite a bit of overhead, it needs to be enabled with the property `isTree`.

__Note:__ At this point, the whole tree needs to be loaded into memory. In a
future update the table will be able to handle lazy loading of nodes using
promises.

## Within the controller

The controller must implement the `applyDropdownFilter` function which will be
called when the records are generated and filtered. This method doesn't have to
be defined. If it is defined, it receives an array of records that match the
text filter, and should return an array which has all the custom filtering
applied.
