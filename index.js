var gcloud = require('google-cloud');
var newreq = require('request');

module.exports = {
  downloadMonth: function(request, response) {
    var month = request.body.month;
    var authkey = request.body.authkey;
    var eaId = '**********';
    console.log('month: ' + month);

    // Create a gcs client.
    var gcs = gcloud.storage({
          // We're using the API from the same project as the Cloud Function.
        projectId: process.env.GCP_PROJECT,
    });

    var bucket = gcs.bucket('bcf_azure_billing_downloads');
    var dst;
    dst = bucket.file(month + '_download.csv');
    var wr = dst.createWriteStream();


    newreq({
    headers: {
      'api-version': '1.0',
      'authorization': 'bearer ' + authkey
      },
    uri: 'https://ea.azure.com/rest/' + eaId + '/usage-report?month=' + month + '&type=detail&fmt=Csv',
    method: 'GET'
    }).pipe(wr).on('finish', function() {response.status(200).send('File transfer is done')});

  },
};
