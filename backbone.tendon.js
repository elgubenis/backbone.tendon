(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return factory(Backbone, _);
    });
  }
  else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(Backbone, _);
  } else {
    factory(root.Backbone, root._);
  }
}(this, function(Backbone, _) {
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

  _.extend(Backbone.View.prototype, {
    tendon(jQueryWrapper) {
      if (!jQueryWrapper) jQueryWrapper = (arg) => arg;
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

          // "click [data-tendon=hit]", do stuff
          events[`${eventNS} [data-tendon="${tendon}]`] = (e) => {
            return tendonCaller({
              event: e,
              value: e.currentTarget.value,
              target: jQueryWrapper(e.target),
              currentTarget: jQueryWrapper(e.currentTarget),
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
      this.delegateEvents(events);
    }
  });

  return Backbone.View;
}));
