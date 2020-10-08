/**
 * Route: DELETE /order/s/{service}
 */

const AWS = require('aws-sdk');
const { time } = require('console');
AWS.config.update({ region: 'ap-south-1' });

const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ORDER_TABLE; 

exports.handler = async (event) => {
    try {
        let service = decodeURIComponent(event.pathParameters.service);
        
        let params = {
            TableName: tableName,
            Key: {
                user_id: util.getUserId(event.headers),
                service: service
            }
        };
        
        await dynamodb.delete(params).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders()
        };
    } catch (err) {
        console.log("Error", err);
        return {
            statusCode: err.statusCode ? err.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name ? err.name : "Exception",
                message: err.message ? err.message : "Unknown error delete user"
            })
        };
    }
}