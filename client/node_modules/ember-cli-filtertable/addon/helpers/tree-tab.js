import Em from 'ember';

// Show the expand/contract arrow and tab the colum to the relevant depth
export default Em.Handlebars.makeBoundHelper(function(record) {
  var txt = '<span style="padding-left: %@em;">%@</span>',
      indent = Math.max(0, record.get('depth')-1 * 1.2),  // default indent is 1.2 em;
      isExpanded = record.get('isExpanded') || false;
  if (record.get('childNum') < 1) {
    txt = txt.fmt(indent, '- ');
  } else if (isExpanded === true) {
    txt = txt.fmt(indent, '# ');
  } else {
    txt = txt.fmt(indent, '+ ');
  }
  return new Em.Handlebars.SafeString(txt);
});
