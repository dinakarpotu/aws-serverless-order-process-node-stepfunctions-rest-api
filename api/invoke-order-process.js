const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

const stepFunctions = require('aws-sdk/clients/stepfunctions');
// const stepFunctions = new AWS.stepFunctions();

exports.handler = async(event) => {
    let params = {
        stateMachineArn: process.env.STATE_MACHINE_ARN,
        input: JSON.stringify(event)
    }

    let data = await stepFunctions.startExecution(params).promise();
    console.log(data);
    return data;
}