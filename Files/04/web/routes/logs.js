var express = require('express');
var router = express.Router();
var storage = require("@azure/storage-blob")

const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

require('dotenv').config();

/* GET home page. */
router.get('/', async function(req, res, next) {

    try {
        var viewModel = {};
        viewModel.logFiles = [];

        if(process.env.AZURE_STORAGE_ACCOUNT_NAME != null) {

            var sharedKeyCredential = new StorageSharedKeyCredential(
                process.env.AZURE_STORAGE_ACCOUNT_NAME, 
                process.env.AZURE_STORAGE_ACCOUNT_KEY);
            
            var blobServiceClient = new BlobServiceClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, sharedKeyCredential);
            
            const blobSAS = storage.generateBlobSASQueryParameters({
                containerName: "logs", 
                permissions: storage.BlobSASPermissions.parse("r"), 
                startsOn: new Date(new Date().valueOf() - 30),
                expiresOn: new Date(new Date().valueOf() + 86400)
            },
            sharedKeyCredential 
            ).toString();

            var logsContainer = blobServiceClient.getContainerClient('logs');

            for await (const blob of logsContainer.listBlobsFlat()) {
                viewModel.logFiles.push({ 
                    name: blob.name, 
                    link: `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/logs/${blob.name}?${blobSAS}`
                });
            }

        }
        
        res.render('logs', viewModel);
    } 
    catch(err){
        res.render('error', { error: err});
    }

});

module.exports = router;
