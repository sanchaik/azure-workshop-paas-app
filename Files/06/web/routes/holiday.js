var express = require('express');
var router = express.Router();

var async = require('async');
var Connection = require('tedious').Connection;  
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  

const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

var webLogger = require('../winston')('web');

require('dotenv').config();

const appInsights = require('applicationinsights');

appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).start();

const appInsightsClient = appInsights.defaultClient;

/* GET home page. */
router.get('/', async function(req, res, next) {

    webLogger.info(`NODE_ENV = ${process.env.NODE_ENV.trim()}`);

    if(process.env.NODE_ENV.trim() != 'development') 
    {
        try 
        {
            let credentials = new DefaultAzureCredential();
            let keyVaultClient = new SecretClient(process.env.KEY_VAULT_URL, credentials);
            let secretNames = [];

            for await (let secretProperties of keyVaultClient.listPropertiesOfSecrets()) {
                webLogger.info("Secret properties: ", secretProperties);
                secretNames.push(secretProperties.name);
            }

            secretNames.forEach(function(name) {
                webLogger.info(`getting secret ${name}`)
                keyVaultClient.getSecret(name)
                .then(function(secret) {
                    let envVarName = secret.name.replace(/-/g, '_');
                    webLogger.info(`setting env ${envVarName} with value from secret ${secret.name}`)
                    process.env[envVarName] = secret.value;
                    webLogger.info(`env var ${envVarName} is set`);
                })
            });

            appInsightsClient.trackEvent({name: "secrets updated", properties: {secretsCount: secretNames.length }});

        }
        catch(err) {
            appInsightsClient.trackException({ exception: err });
            res.render('error', { error: err});
            return;
        }
    }

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
    
    var startTime = Date.now();
    var query = '';

    appInsightsClient.trackTrace({ message: 'querying database'});

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

                query = "SELECT [DATE], [DETAIL] FROM Holidays";

                var request = new Request(query, function(err) { 
                    
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
                appInsightsClient.trackDependency(
                    {
                        target: process.env.DBNAME, 
                        name: "select holidays", 
                        data: query, 
                        duration: (Date.now() - startTime), 
                        resultCode: 0, 
                        success: true, 
                        dependencyTypeName: "SQL Database"
                    });
                callback(null, result);
            } catch (e) { 
                appInsightsClient.trackDependency(
                    {
                        target: process.env.DBNAME, 
                        name: "select holidays", 
                        data: query, 
                        duration: (Date.now() - startTime), 
                        resultCode: 0, 
                        success: false, 
                        dependencyTypeName: "SQL Database"
                    });
                callback(e); 
            }
        }
    ],
    function(err, result){
        if(err) {
            appInsightsClient.trackException({ exception: err });
            res.render('error', { error: err});
        } else {
            res.render('holiday', { dates: result });  
        }
    });

});

module.exports = router;