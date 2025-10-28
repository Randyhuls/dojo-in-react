define([
  'dojo/_base/lang',
], function (lang) {
  this.mainWidget = null;
{
    return function (args) {
      return lang.mixin({}, args, {
        init: function() {
          console.log('MyController init!', args.init);
          if (args.init) args.init.call(this);
        },
        beforeActivate: function() {
          console.log('MyController beforeActivate!');
          if (args.beforeActivate) args.beforeActivate.call(this);
        },
        afterActivate: function() {
          console.log('MyController afterActivate!');
          if (args.afterActivate) args.afterActivate.call(this);
        },
        beforeDeactivate: function() {
          console.log('MyController beforeDeactivate!');
          if (args.beforeDeactivate) args.beforeDeactivate.call(this);
        },
        afterDeactivate: function() {
          console.log('MyController afterDeactivate!');
          if (args.afterDeactivate) args.afterDeactivate.call(this);
        },
        destroy: function() {
          console.log('MyController destroy!');
          if (args.destroy) args.destroy.call(this);
        }
      });
    }
  }
});
