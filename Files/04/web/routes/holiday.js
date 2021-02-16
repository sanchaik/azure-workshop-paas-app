var express = require('express');
var router = express.Router();

var async = require('async');
var Connection = require('tedious').Connection;  
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  

require('dotenv').config();

var config = {  
    server: process.env.MSSQLSERVER, 
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DBUSERNAME, 
            password: process.env.DBPASSWORD  
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: process.env.DBNAME 
    }
}; 

/* GET home page. */
router.get('/', function(req, res, next) {

    console.log(config);
    
    async.waterfall([
        function(callback){
            try {
                var connection = new Connection(config); 

                connection.on('connect', function(err) {
                    if (err) {  
                        callback(err);
                    } else {
                        callback(null, connection);
                    }
                });
                connection.connect();
            } catch(e) { callback(e); }
        },
        function(connection, callback) {
            try {
                var result = [];  

                var request = new Request("SELECT [DATE], [DETAIL] FROM Holidays", function(err) { 
                    
                    if (err) {  
                        callback(err, connection, result)
                    }
                    else {
                        callback(null, connection, result);
                    }
                });  

                request.on('row', function(columns) {
                    result.push({ date: columns[0].value, detail: columns[1].value })
                });  
                
                connection.execSql(request);

            } catch (e) { callback(e) }

        },
        function(connection, result, callback) {
            try {
                connection.close()
                callback(null, result);
            } catch (e) { callback(e); }
        }
    ],
    function(err, result){
        if(err) {
            res.render('error', { error: err});
        } else {
            res.render('holiday', { dates: result });  
        }
    });

});

module.exports = router;