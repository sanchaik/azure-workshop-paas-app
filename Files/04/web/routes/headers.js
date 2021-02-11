var express = require('express');
var router = express.Router();
var logger = require('../winston');

/* GET home page. */
router.get('/', function(req, res, next) {

    var viewModel = {}
    viewModel.headers = [];
    for(var item in req.headers) {
        viewModel.headers.push({
            name: item,
            value: req.headers[item]
        })
    }

    res.render('headers', viewModel);
});

module.exports = router;
