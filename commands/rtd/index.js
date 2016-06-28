var redisUtil = requireRoot('utils/redis')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function rollDice(num) {
  let total = 0;
  if (num <= 0) {
    return 0;
  }
  else {
    return getRandomInt(1,7) + rollDice(num-1)
  }
}

/**
 * Returns a pong for your ping.
 * @return {String}
 */
function* roll_the_dice(events, restargs) {
  let roll = rollDice(1)

  // yield redisUtil.addToSortedSet({
  //  key    : 'rtd',
  //  member : events.message.author.username,
  //  score  : roll
  // })

  // var saved_rolls = yield redisUtil.getBatchFromSortedSet({ key: 'rtd' })

  yield redisUtil.setHashForKey('asd');

  var saved_rolls = yield redisUtil.getHashForKey('asd');

  // let result = yield saved_rolls.next().value;
  return saved_rolls;
}

module.exports = roll_the_dice
