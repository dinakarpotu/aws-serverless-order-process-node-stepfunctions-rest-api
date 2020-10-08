/**
 * Workflow - Order Process /create order
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

const moment = require('moment');
const { contains } = require('underscore');
const { v4: uuidv4 } = require('uuid');
const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ORDER_TABLE; 

const processOrderMeta = async (handset) => {
    let mobileStatus = null;
    let dataStatus = null;

    let handsetProcessed = handset.map( async (cell) => {
        for(let key in cell) {
            switch (key) {
                case 'mobile':
                   mobileStatus = 'mobileActive';
                
                case '4G':
                  dataStatus = 'dataActive';
                                        
                default:
            }
        }
    });
    
    await Promise.all(handsetProcessed);
    return {
        mobileStatus: mobileStatus,
        dataStatus: dataStatus
    }
}

exports.handler = async (event) => {
    try {
        let item = {};
        item.user_id = event.input.user_id;
        item.user_name = event.input.user_name;
        item.service = event.input.choice;
        item.order_id = item.user_id + ':' + uuidv4();
        item.timestamp = moment().unix();
 
        if ((event.input.choice) == 'landline')
        {
            item.landlineStatus = 'landlineActive';

        }
        else {
 
            let handset = await processOrderMeta(event.input.handset);
 
            item.mobileStatus = handset.mobileStatus;
            item.dataStatus = handset.dataStatus;
        };
 
        let data = await dynamodb.put({
            TableName: tableName,
            Item: item
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(item)
        };

    } catch (err) {
        console.log("Error", err);
        return {
            statusCode: err.statusCode ? err.statusCode : 500,
            body: JSON.stringify({
                error: err.name ? err.name : "Exception",
                message: err.message ? err.message : "Unknown error add"
            })
        };
    }
}