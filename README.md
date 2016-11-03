# backbone.tendon
Backbone Tendon lets you define the events hash in a different manner.

# example
```js
const GoButtonView = Marionette.ItemView.extend({
  template: _.template('<button td="go">GO!</button>'),
  el: 'body',
  onClick: {
    go() {
      console.log('go');
    },
    any(e, $target, value, name) {
      console.log('clicked', $target)
    }
  },
  onBlur: {
    name(e, $target, value) {
      console.log(value);
    },
  },
  initialize() {
    this.tendon($); // pass jquery to get a $target instead if a target
  },
});

const goButton = new GoButtonView();
```