const _ = require("lodash")
const debug = require('debug')('signalk-derived-data')

module.exports = function(app, plugin) {
  var propulsionInstances

  if ( _.get(app.signalk.self, "propulsion") )
  {
    propulsionInstances = _.keys(app.signalk.self['propulsion'])

    return propulsionInstances.map(instance => {
      return {
        hide: true,
        group: 'propulsion',
        optionKey: 'propslip' + instance,
        title: "propulsion." + instance + ".slip (based on RPM, propulsion." + instance + ".transmission.gearRatio and propulsion." + instance + ".drive.propeller.pitch)",
        derivedFrom: function() { return [ "propulsion." + instance + ".revolutions", "navigation.speedThroughWater"] },
        calculator: function(revolutions, stw) {
          var gearRatio = _.get(app.signalk.self, 'propulsion.' + instance + '.transmission.gearRatio.value')
          var pitch = _.get(app.signalk.self, 'propulsion.' + instance + '.drive.propeller.pitch.value')
          return [{ path: 'propulsion.' + instance + '.drive.propeller.slip', value: 1 - ((stw * gearRatio)/(revolutions*pitch))}]
        }
      }
    });
  } else {
    return {
      hide: true,
      optionKey: 'propslip',
      title: "propulsion.*.slip (will not work without RPM, propulsion.*.transmission.gearRatio and propulsion.*.drive.propeller.pitch, the two latter inserted in defaults.json)"
    }
  }
}
