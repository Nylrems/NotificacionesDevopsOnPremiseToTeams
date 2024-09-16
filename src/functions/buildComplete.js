const axios = require('axios');
const util = require('util');
const { app } = require('@azure/functions');

app.http('buildComplete', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log('Received request to transform payload.');

    const teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;
    if (!teamsWebhookUrl) {
      context.log('Teams Webhook URL is not defined.');
      return {
        status: 500,
        body: "Teams Webhook URL is not defined"
      };
    }

    try {
      const reqBody = await request.json();
      context.log('Received payload:', util.inspect(reqBody, { depth: null }));

      const buildNumber = reqBody.resource.buildNumber || 'N/A';
      const buildStatus = reqBody.resource.status || 'N/A';
      // const message = reqBody.message.markdown;
      // const requestedFor = (reqBody.resource.requests && reqBody.resource.requests[0].requestedFor && reqBody.resource.requests[0].requestedFor.displayName) || 'N/A';
      const buildUrl = reqBody.resource._links.web.href || '#';
      const definitionName = reqBody.resource.definition.name; 
      const buildResult = reqBody.resource.result;  
      const buildRequestedFor = reqBody.resource.requestedFor.displayName;   

      const adaptiveCardPayload = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3",
        "body": [
          {
            "type": "TextBlock",
            "size": "Large",
            "weight": "Bolder",
            "text": "Build completed",
            "style": "heading",
          },
          {
            "type": "TextBlock",
            "text": `Build ${buildNumber} ${buildStatus}`,
            "wrap": true
          },
          {
            "type": "FactSet",
            "facts": [
              {
                "title": "Pipeline:",
                "value": definitionName
              },
              {
                "title": "Build Number:",
                "value": buildNumber
              },
              {
                "title": "Estado:",
                "value": buildStatus
              },
              {
                "title": "Resultado:",
                "value": buildResult
              },
              {
                "title": "Creado por:",
                "value": buildRequestedFor
              },
            ]
          }
        ],
        "actions": [
          {
            "type": "Action.OpenUrl",
            "title": "Ver Build",
            "url": buildUrl
          }
        ]
      };

      context.log('Transformed Payload:', util.inspect(adaptiveCardPayload, { depth: null }));

      const response = await axios.post(teamsWebhookUrl, adaptiveCardPayload);

      if (response.status === 200 || response.status === 202) {
        context.log('Payload sent successfully');
        return {
          status: 200,
          body: "Payload sent successfully"
        };
      } else {
        context.log(`Error sending payload to Teams: ${response.statusText}`);
        return {
          status: 500,
          body: `Error sending payload to Teams: ${response.statusText}`
        };
      }
    } catch (err) {
      context.log(`Invalid request body or error sending to Teams: ${util.inspect(err)}`);
      return {
        status: 400,
        body: "Invalid request body or error sending to Teams"
      };
    }
  }
}
);
