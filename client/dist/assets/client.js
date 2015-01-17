define("client/app", 
  ["ember","ember-data","ember/resolver","ember/load-initializers","client/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var DS = __dependency2__["default"];
    var Resolver = __dependency3__["default"];
    var loadInitializers = __dependency4__["default"];
    var config = __dependency5__["default"];

    Ember.MODEL_FACTORY_INJECTIONS = true;

    var App = Ember.Application.extend({
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix,
      Resolver: Resolver,
      ApplicationAdapter: DS.ActiveModelAdapter
    });

    loadInitializers(App, config.modulePrefix);

    __exports__["default"] = App;
  });
define("client/components/action-button", 
  ["ember","ember-cli-filtertable/components/action-button","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Em = __dependency1__["default"];
    var ActionButton = __dependency2__["default"];

    __exports__["default"] = ActionButton;
  });
define("client/components/async-button", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      tagName: "button",
      textState: "default",
      reset: false,
      classNames: ["async-button"],
      classNameBindings: ["textState"],
      attributeBindings: ["disabled", "type"],

      type: "submit",
      disabled: Ember.computed.equal("textState", "pending"),

      click: function () {
        var _this = this;
        this.sendAction("action", function (promise) {
          _this.set("promise", promise);
        });
        this.set("textState", "pending");

        // If this is part of a form, it will perform an HTML form
        // submission
        return false;
      },

      text: Ember.computed("textState", "default", "pending", "resolved", "fulfilled", "rejected", function () {
        return this.getWithDefault(this.textState, this.get("default"));
      }),

      resetObserver: Ember.observer("textState", "reset", function () {
        if (this.get("reset") && ["resolved", "rejected", "fulfilled"].contains(this.get("textState"))) {
          this.set("textState", "default");
        }
      }),

      handleActionPromise: Ember.observer("promise", function () {
        var _this = this;
        this.get("promise").then(function () {
          if (!_this.isDestroyed) {
            _this.set("textState", "fulfilled");
          }
        })["catch"](function () {
          if (!_this.isDestroyed) {
            _this.set("textState", "rejected");
          }
        });
      }),

      setUnknownProperty: function (key, value) {
        if (key === "resolved") {
          Ember.deprecate("The 'resolved' property is deprecated. Please use 'fulfilled'", false);
          key = "fulfilled";
        }

        this[key] = null;
        this.set(key, value);
      }
    });
  });
define("client/components/filter-table", 
  ["ember","ember-cli-filtertable/components/filter-table","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Em = __dependency1__["default"];
    var Filtertable = __dependency2__["default"];

    __exports__["default"] = Filtertable;
  });
define("client/components/growl-instance", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      classNames: ["growl-instance"],
      classNameBindings: ["type"],
      type: (function () {
        return this.get("notification.options.type");
      }).property(),
      click: function () {
        this.destroyAlert();
      },
      didInsertElement: function () {
        if (this.get("notification.options.fadeIn")) {
          this.$().hide().fadeIn();
        }

        if (this.get("notification.options.twitch")) {
          var el = this.$(),
              maxDegree = 1,
              negative;
          var interval = window.setInterval(function () {
            negative = negative ? "" : "-";
            el.css("transform", "rotate(" + negative + maxDegree + "deg)");
          }, 75);
          Ember.run.later(function () {
            el.css("transform", "rotate(0deg)");
            window.clearInterval(interval);
          }, 400);
        }

        // unless a click-to-dismiss is required we auto close
        if (!this.get("notification.options.clickToDismiss")) {
          Ember.run.later(this, this.destroyAlert, this.get("notification.options.closeIn"));
        }
      },
      destroyAlert: function () {
        var self = this;
        if (this.$()) {
          this.$().fadeOut(Ember.run(this, function () {
            // send the action on up so the manager can remove this item from array
            self.sendAction("action", self.get("notification"));
          }));
        } else {
          self.sendAction("action", self.get("notification"));
        }
      },
      actions: {
        dismiss: function () {
          // a close button has been clicked
          this.destroyAlert();
        }
      }
    });
  });
define("client/components/growl-manager", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      classNames: ["growl-manager"],
      actions: {
        dismiss: function (notification) {
          this.get("notifications").removeObject(notification);
        }
      }
    });
  });
define("client/helpers/tree-tab", 
  ["ember","ember-cli-filtertable/helpers/tree-tab","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Em = __dependency1__["default"];
    var Treetab = __dependency2__["default"];

    __exports__["default"] = Treetab;
  });
define("client/initializers/export-application-global", 
  ["ember","client/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    function initialize(container, application) {
      var classifiedName = Ember.String.classify(config.modulePrefix);

      if (config.exportApplicationGlobal) {
        window[classifiedName] = application;
      }
    };
    __exports__.initialize = initialize;
    __exports__["default"] = {
      name: "export-application-global",

      initialize: initialize
    };
  });
define("client/initializers/growl", 
  ["client/services/growl","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Growl = __dependency1__["default"];

    __exports__["default"] = {
      name: "growl",
      initialize: function (container, app) {
        Growl.reopenClass({
          container: container
        });

        app.register("growl:main", Growl);
        app.inject("route", "growl", "growl:main");
        app.inject("controller", "growl", "growl:main");
      }
    };
  });
define("client/models/class", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var attr = DS.attr;

    __exports__["default"] = DS.Model.extend({
      name: attr("string")
    });
  });
define("client/router", 
  ["ember","client/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    var Router = Ember.Router.extend({
      location: config.locationType
    });

    Router.map(function () {
      this.resource("classes", { path: "/classes" });
    });

    __exports__["default"] = Router;
  });
define("client/routes/classes", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("class");
      }
    });
  });
define("client/services/growl", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Object.extend({
      notifications: Ember.A(),
      error: function (context, opts) {
        opts = opts || {};
        opts.type = "error";
        this._notify.call(this, context, opts);
      },
      alert: function (context, opts) {
        opts = opts || {};
        opts.type = "alert";
        this._notify.call(this, context, opts);
      },
      info: function (context, opts) {
        opts = opts || {};
        opts.type = "info";
        this._notify.call(this, context, opts);
      },

      _notify: function (context, opts) {
        // default options
        var options = {
          type: "error",
          fadeIn: true,
          closeIn: 5000, // automatically close in 5 seconds.
          clickToDismiss: false, // stay open until it receives a click?
          twitch: false
        };

        Ember.merge(options, opts);

        // if the developer passed an identical message then we just update
        // the open notification balloon options
        var existing = this.get("notifications").findBy("content", context);
        if (existing) {
          return;
        }

        var notification = Ember.ObjectProxy.extend({
          // {{notification.content}} for a string or {{notification.foo}} if you
          // pass an object from a route via this.growl.error({foo: 'bar'});
          content: context,
          options: options,
          updated: 0,
          isInfo: (function () {
            return options.type === "info";
          }).property(),
          isAlert: (function () {
            return options.type === "alert";
          }).property(),
          isError: (function () {
            return options.type === "error";
          }).property()
        }).create();

        this.get("notifications").pushObject(notification);
      }
    });
  });
define("client/templates/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      data.buffer.push("<h2 id=\"title\">\n  Welcome to MyApp 3\n  <div class=\"rightlink\"><a href=\"#\">Logout</a></div>\n</h2>\n<nav>\n  <ul>\n    <li><a href=\"#\">New Class</a></li>\n    <li><a href=\"#\">Manage Students</a></li>\n    <li><a href=\"classes\">Classes List</a></li>\n  </ul>\n</nav>\n\n");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("client/templates/classes", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n      <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "class", "class", options) : helperMissing.call(depth0, "link-to", "class", "class", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n  ");
      return buffer;
      }
    function program2(depth0,data) {
      
      var stack1;
      stack1 = helpers._triageMustache.call(depth0, "class.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      }

      data.buffer.push("<ul>\n  ");
      stack1 = helpers.each.call(depth0, "class", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</ul>\n");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("client/templates/components/action-button", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n  <span ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":glyphicon glyphicon")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></span>\n");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "hasGlyph", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n<span>");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</span>\n");
      return buffer;
      
    });
  });
define("client/templates/components/async-button", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers._triageMustache.call(depth0, "view.text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "template", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("client/templates/components/filter-table", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n  <tr><th ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'colspan': ("headerFilterColspan")
      },hashTypes:{'colspan': "ID"},hashContexts:{'colspan': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n    ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("text"),
        'value': ("textFilter"),
        'autofocus': ("autofocus"),
        'placeholder': ("Enter search filter"),
        'class': ("form-control")
      },hashTypes:{'type': "STRING",'value': "ID",'autofocus': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'value': depth0,'autofocus': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n  </th></tr>\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n  <th class=\"checkbox-all\">");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox"),
        'name': ("allSelected"),
        'checked': ("selectAll")
      },hashTypes:{'type': "STRING",'name': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'name': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("</th>\n");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n  <tr><td ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'colspan': ("headerFilterColspan")
      },hashTypes:{'colspan': "ID"},hashContexts:{'colspan': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("><span class=\"label label-danger\">Note:</span> No records exist yet</td></tr>\n");
      return buffer;
      }

    function program7(depth0,data) {
      
      var stack1;
      stack1 = helpers['if'].call(depth0, "hasNoFilteredRecords", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(10, program10, data),fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      }
    function program8(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n  <tr><td ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'colspan': ("headerFilterColspan")
      },hashTypes:{'colspan': "ID"},hashContexts:{'colspan': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("><span class=\"label label-warning\">Note:</span> No records match your filter</td></tr>\n");
      return buffer;
      }

    function program10(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n");
      stack1 = helpers.each.call(depth0, "r", "in", "filteredRecords", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }
    function program11(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n  <tr>\n  ");
      stack1 = helpers['if'].call(depth0, "showCheckboxes", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "bodyTemplate", options) : helperMissing.call(depth0, "partial", "bodyTemplate", options))));
      data.buffer.push("\n  </tr>\n");
      return buffer;
      }
    function program12(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n  <td>");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox"),
        'name': ("r.selected"),
        'checked': ("r.selected")
      },hashTypes:{'type': "STRING",'name': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'name': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("</td>\n  ");
      return buffer;
      }

      data.buffer.push("<table class=\"table table-striped table-hovered filtertable\">\n<thead>\n");
      stack1 = helpers['if'].call(depth0, "showTextFilter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n<tr>\n");
      stack1 = helpers['if'].call(depth0, "showCheckboxes", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "headerTemplate", options) : helperMissing.call(depth0, "partial", "headerTemplate", options))));
      data.buffer.push("\n</tr>\n</thead>\n<tbody>\n");
      stack1 = helpers['if'].call(depth0, "hasNoActualRecords", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</tbody>\n</table>\n");
      return buffer;
      
    });
  });
define("client/templates/components/growl-instance", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

    function program1(depth0,data) {
      
      
      data.buffer.push("\n  <img src=\"../img/error.svg\" alt=\"Error\"/>\n");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n  <img src=\"../img/alert.svg\" alt=\"Alert\"/>\n");
      }

    function program5(depth0,data) {
      
      
      data.buffer.push("\n  <img src=\"../img/info.svg\" alt=\"Info\"/>\n");
      }

    function program7(depth0,data) {
      
      
      data.buffer.push("\n    <h1>Uh oh.</h1>\n  ");
      }

    function program9(depth0,data) {
      
      
      data.buffer.push("\n    <h1>Attention!</h1>\n  ");
      }

    function program11(depth0,data) {
      
      
      data.buffer.push("\n    <h1>Hey!</h1>\n  ");
      }

      data.buffer.push("\n");
      stack1 = (helper = helpers.unboundIf || (depth0 && depth0.unboundIf),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "notification.isError", options) : helperMissing.call(depth0, "unboundIf", "notification.isError", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      stack1 = (helper = helpers.unboundIf || (depth0 && depth0.unboundIf),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "notification.isAlert", options) : helperMissing.call(depth0, "unboundIf", "notification.isAlert", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      stack1 = (helper = helpers.unboundIf || (depth0 && depth0.unboundIf),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "notification.isInfo", options) : helperMissing.call(depth0, "unboundIf", "notification.isInfo", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n<div class=\"message-area\">\n  ");
      stack1 = (helper = helpers.unboundIf || (depth0 && depth0.unboundIf),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "notification.isError", options) : helperMissing.call(depth0, "unboundIf", "notification.isError", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n  ");
      stack1 = (helper = helpers.unboundIf || (depth0 && depth0.unboundIf),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "notification.isAlert", options) : helperMissing.call(depth0, "unboundIf", "notification.isAlert", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n  ");
      stack1 = (helper = helpers.unboundIf || (depth0 && depth0.unboundIf),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "notification.isInfo", options) : helperMissing.call(depth0, "unboundIf", "notification.isInfo", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n  <div class=\"message\">\n    ");
      data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "notification.content", {hash:{
        'unescaped': ("true")
      },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("client/templates/components/growl-manager", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression((helper = helpers['growl-instance'] || (depth0 && depth0['growl-instance']),options={hash:{
        'action': ("dismiss"),
        'notification': ("")
      },hashTypes:{'action': "STRING",'notification': "ID"},hashContexts:{'action': depth0,'notification': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "growl-instance", options))));
      data.buffer.push("\n");
      return buffer;
      }

      data.buffer.push("\n");
      stack1 = helpers.each.call(depth0, "notifications", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("client/tests/app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('app.js should pass jshint', function() { 
      ok(true, 'app.js should pass jshint.'); 
    });
  });
define("client/tests/client/tests/helpers/resolver.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - client/tests/helpers');
    test('client/tests/helpers/resolver.js should pass jshint', function() { 
      ok(true, 'client/tests/helpers/resolver.js should pass jshint.'); 
    });
  });
define("client/tests/client/tests/helpers/start-app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - client/tests/helpers');
    test('client/tests/helpers/start-app.js should pass jshint', function() { 
      ok(true, 'client/tests/helpers/start-app.js should pass jshint.'); 
    });
  });
define("client/tests/client/tests/test-helper.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - client/tests');
    test('client/tests/test-helper.js should pass jshint', function() { 
      ok(true, 'client/tests/test-helper.js should pass jshint.'); 
    });
  });
define("client/tests/client/tests/unit/models/class-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - client/tests/unit/models');
    test('client/tests/unit/models/class-test.js should pass jshint', function() { 
      ok(true, 'client/tests/unit/models/class-test.js should pass jshint.'); 
    });
  });
define("client/tests/client/tests/unit/routes/classes-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - client/tests/unit/routes');
    test('client/tests/unit/routes/classes-test.js should pass jshint', function() { 
      ok(true, 'client/tests/unit/routes/classes-test.js should pass jshint.'); 
    });
  });
define("client/tests/helpers/resolver", 
  ["ember/resolver","client/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    var config = __dependency2__["default"];

    var resolver = Resolver.create();

    resolver.namespace = {
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix
    };

    __exports__["default"] = resolver;
  });
define("client/tests/helpers/start-app", 
  ["ember","client/app","client/router","client/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Application = __dependency2__["default"];
    var Router = __dependency3__["default"];
    var config = __dependency4__["default"];

    __exports__["default"] = function startApp(attrs) {
      var application;

      var attributes = Ember.merge({}, config.APP);
      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

      Ember.run(function () {
        application = Application.create(attributes);
        application.setupForTesting();
        application.injectTestHelpers();
      });

      return application;
    }
  });
define("client/tests/models/class.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/class.js should pass jshint', function() { 
      ok(true, 'models/class.js should pass jshint.'); 
    });
  });
define("client/tests/router.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('router.js should pass jshint', function() { 
      ok(true, 'router.js should pass jshint.'); 
    });
  });
define("client/tests/routes/classes.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/classes.js should pass jshint', function() { 
      ok(true, 'routes/classes.js should pass jshint.'); 
    });
  });
define("client/tests/test-helper", 
  ["client/tests/helpers/resolver","ember-qunit"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var resolver = __dependency1__["default"];
    var setResolver = __dependency2__.setResolver;

    setResolver(resolver);

    document.write("<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>");

    QUnit.config.urlConfig.push({ id: "nocontainer", label: "Hide container" });
    var containerVisibility = QUnit.urlParams.nocontainer ? "hidden" : "visible";
    document.getElementById("ember-testing-container").style.visibility = containerVisibility;
  });
define("client/tests/unit/models/class-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("class", "Class", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("client/tests/unit/routes/classes-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:classes", "ClassesRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
/* jshint ignore:start */

define('client/config/environment', ['ember'], function(Ember) {
  var prefix = 'client';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("client/tests/test-helper");
} else {
  require("client/app")["default"].create({});
}

/* jshint ignore:end */
//# sourceMappingURL=client.map