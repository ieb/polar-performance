const _ = require('lodash')

module.exports = function(app) {
  var draft = _.get(app.signalk.self, 'design.draft.maximum.value')

  var derivedFrom = typeof draft === 'undefined' ? [] : [ "environment.depth.belowKeel" ];
  
  return {
    hide: true,
    group: "depth",
    optionKey: 'belowSurface',
    title: "Depth Below Surface (based on depth.belowKeel and design.draft.maximum)",
    derivedFrom: derivedFrom,
    calculator: function(depthBelowKeel)
    {
      return [{ path: 'environment.depth.belowSurface', value: depthBelowKeel + draft}]
    }
  };
}
