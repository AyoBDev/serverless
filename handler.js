'use strict';
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const client = new DynamoDBClient({ region: 'us-east-1' });
const {DynamoDBDocumentClient, PutCommand} = require('@aws-sdk/lib-dynamodb');
const ddbDocClient = DynamoDBDocumentClient.from(client);


module.exports.createNote = async (event) => {
  let data = JSON.parse(event.body);

  try {
    await ddbDocClient.send(
      new PutCommand({
        TableName: "notes",
        Item: {
          noteId: crypto.randomUUID(),
          title: data.title,
          body: data.body
        },
      ConditionExpression: "attribute_not_exists(noteId)"
    })
    
   );

    return {
    statusCode: 201,
    body: JSON.stringify("New Note created successfully!"),
    };

  } catch(err) {
    return {
    statusCode: 400,
    body: JSON.stringify(err.message),
    };
  }
 
};

module.exports.updateNote = async (event) => {
  const noteId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(`Note with id=${noteId} updated successfully!`),
  };
};

module.exports.deleteNote = async (event) => {
  const noteId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(`Note with id=${noteId} deleted successfully!`),
  };
};

module.exports.getAllNotes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify("All Notes have been returned!"),
  };
};
