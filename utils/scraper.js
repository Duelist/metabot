let co = require('co')
let request = require('co-request')
let cheerio = require('cheerio')
const SCRAPER = requireRoot('constants/scraper')


/**
 * Request player info from (Overwatch)URL - battletag format example (Zapyre-1177)
 * @param {String} battletag
 * @param 
 */
/*function* getCareerStatsByBattleTag(battleTag) {
  var url = SCRAPER.URL + battleTag
  var obj = yield request(url)
  if (obj){
    var $ = cheerio.load(obj.body)
    var json =  { careerStats : {} }
    // Career Stats
    $('#stats-section').filter(function(){
      var heroList = $(this).find('.js-career-select').first().children()
      var perHero = $(this).find('.js-stats')
      perHero.each(function (index) {
        var key = heroList.eq(index).text()
        json.careerStats[key] = {}
        var statCard = $(this).children('.column')
        statCard.each(function () {                
          var statInner = $(this).find('.data-table').first()
          var category = statInner.find('th').text()
          json.careerStats[key][category] = {}
          var innerCategory = statInner.find('tbody').children('tr')
          innerCategory.each(function () {
            var innerKey = $(this).children('td').eq(0).text()
            json.careerStats[key][category][innerKey] = $(this).children('td').eq(1).text()
          })
        })
      })
    })
    
    return json
  }
  
  return obj
}*/

  
/**
 * Request player info from (Overwatch)URL - battletag format example (Zapyre-1177)
 * @param {String} battletag
 * @param 
 */
function* getPlayerInfoByBattleTag(battleTag) {
  var url = SCRAPER.URL + battleTag
  var obj = yield request(url)
  
  if (obj){
    var $ = cheerio.load(obj.body)
    var json =  { playerInfo : {
      playerName : '', 
      level: '',
      rank: '',
      totalWins: ''},
      featuredStats : {}
    }
    // Player Info
    $('.header-masthead').filter(function(){
      json.playerInfo.playerName = $(this).text()
    })
    $('.u-vertical-center').filter(function(){
      json.playerInfo.level = $(this).text()
    })
    $('.competitive-rank').filter(function(){
      json.playerInfo.rank = $(this).find('.u-align-center').text()
    })
    $('.masthead-detail').filter(function(){
      json.playerInfo.totalWins = $(this).children().first().text()
    })
    // Featured Stats
    $('.highlights-section').filter(function(){
      var statCard = $(this).find('.column')
      statCard.each(function (index) {
        var statInner = $(this).find('.card-content').first()
        var key = statInner.children('.card-copy').text()
        json.featuredStats[key] = statInner.children('.card-heading').text()
      })
    })
    return json
  }
  return obj
}

module.exports = {
  //getCareerStatsByBattleTag,
  getPlayerInfoByBattleTag
}
