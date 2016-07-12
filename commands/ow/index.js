var scraper = requireRoot('utils/scraper')

/**
 * Returns profile stats for your battletag
 * @param {String} battletag
 * @return {String}
 */
function* ow(battletag) {
  // i.e. 'Zapyre-1177'
  if (battletag.args == null || battletag.args.length == 0){
    return 'Usage: !ow [battletag] \nNote: the battletag is case sensitive.'
  } else {
    var data = yield scraper.getPlayerInfoByBattleTag(battletag.args[0])
    console.log(data)
    return formatOwData(data)
  }
}

/** Returns a nicely parsed string with your overwatch data.
 * @param (String} data
 * @return {String}
 */
function formatOwData (data){
  var str = ''
  str += data.playerInfo.playerName + ' is level ' + data.playerInfo.level + ', rank ' + data.playerInfo.rank + ' with ' + data.playerInfo.totalWins
  str += '\n\nFeatured Stats'
  console.log(str)
  for (key in data.featuredStats){
    str += '\n' + key + " : " + data.featuredStats[key]
  }
  console.log(str)
  return str
}


module.exports = ow
