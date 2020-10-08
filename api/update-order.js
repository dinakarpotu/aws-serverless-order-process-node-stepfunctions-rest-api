/**
 * Route: PATCH /order
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

const moment = require('moment');
const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ORDER_TABLE;  

exports.handler = async (event) => {
    try {
        let item = JSON.parse(event.body).Item;
        item.user_id = util.getUserId(event.headers);
        item.user_name = util.getUserName(event.headers);
        item.service = util.getUserService(event.headers);
        item.timestamp = moment().unix();
        item.expire = moment().add(90, 'days').unix();

        let data = await dynamodb.put({
            TableName: tableName,
            Item: item,
            ConditionExpression: '#s = :s',
            ExpressionAttributeNames: {
                '#s': 'service'
            },
            ExpressionAttributeValues: {
                ':s': item.service
            }
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
                message: err.message ? err.message : "Unknown error update"
            })
        };
    }
}