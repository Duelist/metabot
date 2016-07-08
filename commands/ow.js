var scraper = requireRoot('utils/scraper')

/**
 * Returns profile stats for your battletag
 * @param {String} battletag
 * @return {String}
 */
function ow(callback) {
  scraper.getPlayerInfoByBattleTag('Zapyre-1177', function(data){
      //console.log(data)
      //var retVal =  //battletag + '\'s Overwatch Stats: '
      //retVal += 'Total Wins: ' + jsonObj.playerInfo.playerName
      return callback(data)
  })
}



module.exports = ow
