var express = require('express');
var router = express.Router();

const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
    
    var accessToken = req.headers["x-ms-token-aad-access-token"];
    var graphApiUrl = "https://graph.microsoft.com/v1.0";
    var requestUrl = `${graphApiUrl}/me`;
    var config = { headers: { Authorization: `Bearer ${accessToken}`}}

    axios.get(requestUrl, config)
    .then(resp => {
        res.render('myprofile', { requestUrl: requestUrl, response: JSON.stringify(resp.data) });
    })
    .catch(e => { console.log(e); res.render('error', { error: e }); });
    
});

module.exports = router;