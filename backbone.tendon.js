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
      const html = this.template ? this.template() : '';
      const events = {};

      const attachEvent = (eventName) => {
        if (!eventName) return;
        const eventType = eventName.toLowerCase();
        const actions = this[`on${eventName}`] || {};
        for (let key of Object.keys(actions)) {
          if (key === 'any') {
            events[`${eventType} [td]`] = (e) => {
              const currentTarget = e.currentTarget;
              this[`on${eventName}`][key].call(this, e, $(currentTarget), currentTarget.value, currentTarget.getAttribute('td'));
            };
          } else if (html.indexOf(`td="${key}"`) > -1) {
            events[`${eventType} [td="${key}"]`] = (e) => {
              const currentTarget = e.currentTarget;
              this[`on${eventName}`][key].call(this, e, $(currentTarget), currentTarget.value);
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