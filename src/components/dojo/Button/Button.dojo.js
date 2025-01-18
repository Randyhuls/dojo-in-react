define([
  'dojo/_base/declare',
  'dojo/text!dojo-widgets/Button/Button.dojo.html',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin'
], function (
  declare,
  template,
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin,
) {
  return declare('DojoButton', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      templateString: template,

      constructor: function (options) {
          declare.safeMixin(this, options);
          console.log('constructor!');
      },

      postCreate: function () {
          this.inherited(arguments);
          console.log('postCreate!');        
      },

      startup: function () {
          if (this._started) {
              return;
          }
          console.log('startup!');
          console.log('this!', this);
          this.labelNode.innerHTML = this.label
      }
  });
},);
