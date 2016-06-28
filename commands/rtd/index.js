var redisUtil = requireRoot('utils/redis')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Returns a pong for your ping.
 * @return {String}
 */
function* roll_the_dice() {
 let roll = getRandomInt(0,101)

 yield redisUtil.addToSortedSet({
   key    : 'rtd',
   member : 'test' + roll,
   score  : roll
 })

 var saved_rolls = yield redisUtil.getBatchFromSortedSet({ key: 'rtd' })

 // let result = yield saved_rolls.next().value;
 return saved_rolls;
}

module.exports = roll_the_dice
