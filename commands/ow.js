var scraper = requireRoot('utils/scraper')

/**
 * Returns profile stats for your battletag
 * @param {String} battletag
 * @return {String}
 */
function ow() {
  var data = scraper.getPlayerInfoByBattleTag('Zapyre-1177');
  return data;
}



module.exports = ow
