const { createLogger, format, transports, winston } = require('winston');
const { combine, timestamp, json } = format;
require('winston-daily-rotate-file');
const { AzureBlobTransport, IAzureBlobTransportOptions } = require('winston-azure-transport');

require('dotenv').config();

const dailyRotateFileTransport = filename => new transports.DailyRotateFile({
    filename: `./logs/%DATE%-${filename}.log`,
    maxSize: "10m",
    maxDays: "365d",
    zippedArchive: true,
    datePattern: 'YYYY-MM-DD'
  });


const logger = function(filename) { 

    var transports = [];

    //transports.push(dailyRotateFileTransport(filename));

    if(process.env.LOG_BLOB_SAS_URL != null) {
        transports.push(new AzureBlobTransport({
            containerUrl: process.env.LOG_BLOB_SAS_URL, 
            nameFormat: "{yyyy}/{MM}/{dd}/{hh}/web.log",
            retention: 365,
            trace: true
        }));
    }

    return new createLogger({
        format: combine(
            timestamp(),
            json()
        ),
        transports: transports,
        exitOnError: false
        }); 
}

module.exports = logger;