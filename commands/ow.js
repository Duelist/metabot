var scrapper = requireRoot('utils/scrapper')

/**
 * Returns profile stats for your battletag
 * @param {String} battletag
 * @return {String}
 */
function ow(battletag) {
  var jsonObj = scrapper.getPlayerInfoByBattleTag(battletag)
  var retVal = jsonObj.playerInfo.playerName //battletag + '\'s Overwatch Stats: '
  //retVal += 'Total Wins: ' + jsonObj.playerInfo.playerName
  return retVal
}



module.exports = ow
