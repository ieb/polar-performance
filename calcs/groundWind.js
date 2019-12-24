const debug = require('debug')('signalk-derived-data')

module.exports = function(app, plugin) {
  return {
    group: 'wind',
    optionKey: 'groundWind',
    title: "Ground Wind Angle and Speed (based on COG, HDM, SOG, AWA and AWS)",
    defaultValues: [ 0, 0, 0, 0, 0],
    derivedFrom: [ "navigation.headingMagnetic", "navigation.courseOverGround", "navigation.speedOverGround", "environment.wind.speedApparent", "environment.wind.angleApparent" ],
    calculator: function(hdm, cog, sog, aws, awa) {
      // sog is in m/s, > 40kn SOG ignore, sensor error, we dont go that fast :(
      if ( sog > 20 ) {
        return undefined;
      } 
      var cogAngle = cog-hdm;
      if ( sog < 0.1 ) {
        // use heading for cog
        cogAngle = 0;
      } 

      // X is stern to bow, Y is port to stbd
      var apparentX = Math.cos(awa) * aws; 
      var apparentY = Math.sin(awa) * aws;
      // aparent cog angle
      var sogX = Math.cos(cogAngle)*sog;
      var sogY = Math.sin(cogAngle)*sog;
      var groundX = apparentX - sogX;
      var groundY = apparentY - sogY;

      var angle = Math.atan2(groundY, groundX);
      var speed = Math.sqrt(Math.pow(groundY, 2) + Math.pow(groundX, 2));
      var dir = hdm + angle;

      if ( dir > Math.PI*2 ) {
        dir = dir - Math.PI*2;
      } else if ( dir < 0 ) {
        dir = dir + Math.PI*2;
      }
      return [{ path: "environment.wind.directionGround", value: dir},
              { path: "environment.wind.angleGround", value: angle},
              { path: "environment.wind.speedGround", value: speed}]
    }
  };
}
