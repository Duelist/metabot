var express = require('express')
var request = require('request')
var cheerio = require('cheerio')
var app     = express()

app.get('/scrape', function(req, res){
    
  var url = 'https://playoverwatch.com/en-us/career/pc/us/' + req.query.name

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html)
      var json =  { playerInfo : {
        playerName : '', 
        level: '',
        totalWins: ''},
        featuredStats : {},
        //heroesPlaytime : {},
        careerStats : {}
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
            
      // Top Heroes
      /*$('#top-heroes-section').filter(function(){
          var data = $(this);
          var statBar = $(this).find('.progress-category-item');
          statBar.each(function (index) {
            statInner = $(this).find('.bar-text').first();
            var hero = 'hero' + index;
            json.heroesPlaytime[hero] = {};
            json.heroesPlaytime[hero].heroname = statInner.children('.title').first().text();
            json.heroesPlaytime[hero].hours = statInner.children('.description').first().text();
          });
      })*/
            
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

            //res.end(req.query.name);
      res.end(JSON.stringify(json, null, 4))
    }
  })
})

app.listen('8081')
console.log('Magic happens on port 8081')
exports = module.exports = app
