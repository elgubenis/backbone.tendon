# backbone.tendon
Backbone Tendon lets you define the events hash in a different manner.

# example
```js
const GoButtonView = Marionette.ItemView.extend({
  template: _.template('<button data-tendon="go" value="2">GO!</button>'),
  el: 'body',
  onClick: {
    go(value) {
      console.log('go', 'value is', value);
    },
    any(value, e, $target, name) {
      console.log('clicked', $target);
      // name here is the data-tendon="" attributes value
    }
  },
  onBlur: {
    name(value, e, $target) {
      console.log(value);
      console.log(e);
    },
  },
  initialize() {
    this.tendon($); // pass jquery to get a jquery wrapped $target instead of a "native" target
  },
});

const goButton = new GoButtonView();
```
