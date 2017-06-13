require('dotenv').config();
const rp = require('request-promise');

/**
 * Constant variables
 **/
const zone = process.env.ZONE;
const accountId = process.env.ACCOUNT_ID;
const uriEncodedAuth = process.env.URI_ENCODED_AUTH;
const uriToPost = `https://${uriEncodedAuth}@aperture.section.io/api/v1/account/${accountId}/zone/${zone}`;

/**
 * variable recordsToPost is in array of objects with keys:
 *
 * recordName - string
 * recordData - array of strings or string
 * recordType - string
 * ttl - number (default 300)
 **/
const recordsToPost = [
    { recordName: 'test.com', recordData: '1.1.1.1', recordType: 'A' },
    { recordName: 'www.test.com', recordData: 'test.abc.com', recordType: 'CNAME' },
    { recordName: 'www.test.com', recordData: 'someTypeofString', recordType: 'TXT' },
];

const count = recordsToPost.length - 1;
let counter = 0;

const main = () => {
    if (count < counter) return Promise.resolve();

    const record = recordsToPost[counter];
    const options = {
        method: 'POST',
        uri: uriToPost,
        body: {
            recordName: record.recordName,
            recordType: record.recordType,
            ttl: record.ttl || 300,
            recordData: Array.isArray(record.recordData) ? record.recordData : [record.recordData],
        },
        json: true,
    };

    return rp(options)
        .then(parsedBody => {
            console.log('Counter:', counter);
            counter += 1;
            return main();
        })
        .catch(err => {
            console.log('Error at counter (record not inputed):', counter);
            counter += 1;
            return main();
        });
}

main()
    .then(() => {
        console.log('Done!');
    })
    .catch(err => {
        console.log('Something bad happened:', err);
    });
