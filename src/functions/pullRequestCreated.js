const axios = require('axios');
const util = require('util');
const { app } = require('@azure/functions');

app.http('pullRequestCreated', {
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

            const title = reqBody.resource.title;
            const repositoryName = reqBody.resource.repository.name;
            const sourceRefName = reqBody.resource.sourceRefName;
            const targetRefName = reqBody.resource.targetRefName;
            const mergeStatus = reqBody.resource.mergeStatus;
            const pullRequestId = reqBody.resource.pullRequestId;
            const description = reqBody.resource.description;
            const creator = reqBody.resource.createdBy.displayName || 'Seguro fuíste tú';
            const pullRequestUrl = reqBody.resource._links.web.href;
            const email = reqBody.resource.lastMergeCommit.author.email ? reqBody.resource.lastMergeCommit.author.email: "N/A";


            const adaptiveCardPayload = {
                "type": "AdaptiveCard",
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "version": "1.3",
                "body": [
                    {
                        "type": "TextBlock",
                        "size": "Large",
                        "weight": "Default",
                        "text": "Pull Request Creado",
                        "style": "heading",
                        "fontType": "Default"
                    },
                    {
                        "type": "TextBlock",
                        "text": `Título: ${title}`,
                        "wrap": true
                    },
                    {
                        "type": "FactSet",
                        "facts": [
                            {
                                "title": "Repositorio",
                                "value": repositoryName
                            },
                            {
                                "title": "Rama:",
                                "value": sourceRefName
                            },
                            {
                                "title": "Rama Target:",
                                "value": targetRefName
                            },
                            {
                                "title": "Estado:",
                                "value": mergeStatus
                            },
                            {
                                "title": "Pull Request ID:",
                                "value": pullRequestId
                            },
                            {
                                "title": "Descripción:",
                                "value": description
                            },
                            {
                                "title": "Creado por: ",
                                "value": creator
                            },
                            {
                                "title": "Email: ",
                                "value": email
                            }
                        ]
                    }
                ],
                "actions": [
                    {
                        "type": "Action.OpenUrl",
                        "title": "Ver Pull Request",
                        "url": pullRequestUrl
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
