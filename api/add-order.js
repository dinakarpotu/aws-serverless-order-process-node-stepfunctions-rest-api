/**
 * Route: POST /order
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

const moment = require('moment');
const { contains } = require('underscore');
const { v4: uuidv4 } = require('uuid');
const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ORDER_TABLE; 

exports.handler = async (event) => {
    try {
        let item = JSON.parse(event.body).Item;
        item.user_id = util.getUserId(event.headers);
        item.user_name = util.getUserName(event.headers);
        item.service = util.getUserService(event.headers)

        let service = util.getUserService(event.headers)

        if (service.includes('mobile')) {item.mobileStatus = "mobileActive"};
        if (service.includes('data')) {item.dataStatus = "dataActive"};
        if (service.includes('landline')) {item.landlineStatus = "landlineActive"};
        
        item.order_id = item.user_id + ':' + uuidv4();
        item.timestamp = moment().unix();

        let data = await dynamodb.put({
            TableName: tableName,
            Item: item
        }).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(item)
        };
    } catch (err) {
        console.log("Error", err);
        return {
            statusCode: err.statusCode ? err.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name ? err.name : "Exception",
                message: err.message ? err.message : "Unknown error add"
            })
        };
    }
}