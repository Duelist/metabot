var request = require('request')
var cheerio = require('cheerio')
const SCRAPER = requireRoot('constants/scraper')


/**
 * Request player info from (Overwatch)URL - battletag format example (Zapyre-1177)
 * @param {String} battletag
 * @param 
 */
function getCareerStatsByBattleTag(battleTag, callback) {
  var url = SCRAPER.URL + battleTag
  request.get(url, function(error, response, html){
    if(!error && response.statusCode === 200){
      var $ = cheerio.load(html)
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
      
      return callback(JSON.stringify(json, null, 4))
    }
    return callback('error')
  })
  return url
}

  
/**
 * Request player info from (Overwatch)URL - battletag format example (Zapyre-1177)
 * @param {String} battletag
 * @param 
 */
function getPlayerInfoByBattleTag(battleTag, callback) {
  var url = SCRAPER.URL + battleTag
  var obj = request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html)
      var json =  { playerInfo : {
        playerName : '', 
        level: '',
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
      $('.masthead-detail').filter(function(){
        json.playerInfo.totalWins = $(this).children().first().text()
      })
      
      // Featured Stats
      $('#highlights-section').filter(function(){
        var statCard = $(this).find('.column')
        statCard.each(function (index) {
          var statInner = $(this).find('.card-content').first()
          var key = statInner.children('.card-copy').text()
          json.featuredStats[key] = statInner.children('.card-heading').text()
        })
      })
      
      return callback(JSON.stringify(json, null, 4))
    }
    return callback('error')
  })
  return obj
}

module.exports = {
  getCareerStatsByBattleTag,
  getPlayerInfoByBattleTag
}
