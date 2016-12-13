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
    tendon($) {
      if (!$) $ = (arg) => arg;
      const events = {};

      const attachEvent = (eventName) => {
        if (!eventName) return;
        const eventType = eventName.toLowerCase();
     
        const actions = this[`on${eventName}`] || {};
        const onEventName = `on${eventName}`;
        const caller = this[onEventName];
        
        for (let key of Object.keys(actions)) {
          const keyCaller = caller[key];
          if (key === 'any') {
            events[`${eventType} [data-tendon]`] = (e) => {
              const currentTarget = e.currentTarget;
              keyCaller.call(this, currentTarget.value, e, $(currentTarget), currentTarget.getAttribute('data-tendon'));
            };
          } else {
            events[`${eventType} [data-tendon="${key}"]`] = (e) => {
              const currentTarget = e.currentTarget;
              keyCaller.call(this, currentTarget.value, e, $(currentTarget));
            };
          }
        }
      };

      const self = this;
      _.invoke(eventNames, function (name) { attachEvent.call(self, this); });
      this.events = _.extend(this.events || {}, events);
      this.delegateEvents();
    }
  });

  return Backbone.View;
}));
