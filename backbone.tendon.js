(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore', 'jquery'], function(Backbone, _) {
      return factory(Backbone, _, $);
    });
  }
  else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    var $ = require('jquery');
    module.exports = factory(Backbone, _, $);
  } else {
    factory(root.Backbone, root._, root.$);
  }
}(this, function(Backbone, _, jQueryWrapper) {
  'use strict';

  const eventNames = [
    'Click', 'DblClick', // clicks
    'MouseDown', 'MouseUp', 'MouseOver', 'MouseMove', 'MouseOut', // mouse movement
    'DragStart', 'Drag', 'DragEnter', 'DragLeave', 'DragOver', 'Drop', 'DragEnd', // drag 'n drop
    'KeyDown', 'KeyPress', 'KeyUp', // keyboard
    'Load', 'Unload', 'Abort', 'Error', 'Resize', 'Scroll', // window
    'Select', 'Change', 'Submit', 'Reset', 'Focus', 'Blur', // form
    'FocusIn', 'FocusOut', 'DOMActivate', // form etc.
    'LoadStart', 'Progress', 'LoadEnd', // progress
    'TouchStart', 'TouchEnd', 'TouchMove', 'TouchEnter', 'TouchLeave', 'TouchCancel', // touch
  ];

  const delegateEvents = Backbone.View.prototype.delegateEvents;

  _.extend(Backbone.View.prototype, {
    delegateEvents(events) {
      return delegateEvents.call(this, Object.assign(events, this.tendon()));
    },
    tendon() {
      const events = {};

      // eventName: Click
      const attachHandler = (eventName) => {
        // eventNS: click
        const eventNS = eventName.toLowerCase();
     
        // onEventName: onClick
        const onEventName = `on${eventName}`;

        // methods in view's onClick object
        const tendons = this[onEventName] || {};
        
        // for every method in the onClick object
        for (let tendon of Object.keys(tendons)) {
          // get the method by its name
          const tendonCaller = tendons[tendon];
          const tendonEq = tendon === 'default' ? '' : `="${tendon}"`;

          // "click [data-tendon=hit]", do stuff
          events[`${eventNS} [data-tendon${tendonEq}]`] = (e) => {
            const currentTarget = e.currentTarget;
            const name = currentTarget.getAttribute('data-tendon');

            return tendonCaller({
              e,
              event: e,
              value: currentTarget.value,
              name,
              tendon: name,
              target: jQueryWrapper(e.target),
              currentTarget: jQueryWrapper(currentTarget),
              relatedTarget: jQueryWrapper(e.relatedTarget),
              preventDefault: e.preventDefault,
              stopPropagation: e.stopPropagation,
              stopImmediatePropagation: e.stopImmediatePropagation,
            });
          }
        }
      };

      // for every eventName, attach listeners
      _.invoke(eventNames, function () { attachHandler(this); });
      return events;
    }
  });

  return Backbone.View;
}));
