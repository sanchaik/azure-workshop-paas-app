var express = require('express');
var router = express.Router();

const { BlobServiceClient, ContainerClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

/* GET home page. */
router.get('/', async function(req, res, next) {

    var viewModel = {};
    viewModel.documents = [];

        if(true || process.env.AZURE_STORAGE_ACCOUNT_NAME != null) {

        var sharedKeyCredential = new StorageSharedKeyCredential(
            process.env.AZURE_STORAGE_ACCOUNT_NAME, 
            process.env.AZURE_STORAGE_ACCOUNT_KEY);
        
        var blobServiceClient = new BlobServiceClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, sharedKeyCredential);
        
        var logsContainer = blobServiceClient.getContainerClient('logs');

        //var blobs = await logsContainer.listBlobsFlat();
        
        //let blobItem = await blobs.next();
        //while (!blobItem.done) {
        //    console.log(`Blob ${i++}: ${blobItem.value.name}`);
        //    blobItem = await iter.next();
        //}

    }
    
    viewModel.documents.push({ name: "1", link: "1" });

    res.render('logs', viewModel);
});

module.exports = router;
