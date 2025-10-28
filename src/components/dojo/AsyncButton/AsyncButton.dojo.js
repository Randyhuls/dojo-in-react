define([
  'dojo-widgets/MyController',
  'dojo-widgets/Button/Button.dojo',
], function (MyController, Button) {
  return MyController({
    createButtonWidget: function() {
      this.mainWidget = new Button({
        label: 'Async Button',
      });
    },
    init: function() {      
      this.createButtonWidget();
      console.log('AsyncButton init!', this.mainWidget);
    }
  });
});
