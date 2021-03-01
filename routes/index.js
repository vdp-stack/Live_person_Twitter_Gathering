var express = require('express');
var Twitter = require('twitter');

var router = express.Router(); 
var client = new Twitter({
  consumer_key: 'YDn3RLk0s2UiYj2R71Qg',
  consumer_secret: 'zaFtCeJgX6fgM4wsYVWeYHtrBadPxUd3vaGfIIY7Y',
  access_token_key: '357401051-thSpfJV79tqludpTPUx7Ak2Lx2Llt7hQbbCc1rRL',
  access_token_secret: 'K0L6mvFv5fwewpGdQOQJVOEMD0I6eIJLp3LsFxqjC3qGS'
});

router.get('/', function(req, res, next) {
  // https://dev.twitter.com/rest/reference/get/statuses/user_timeline
  client.get('statuses/user_timeline', { screen_name: 'nodejs', count: 20 }, function(error, tweets, response) {
    if (!error) {
      res.status(200).render('index', { title: 'Express', tweets: tweets });
    }
    else {
      res.status(500).json({ error: error });
    }
  });
});

module.exports = router;