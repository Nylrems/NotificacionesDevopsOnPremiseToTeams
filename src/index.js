// const axios = require('axios');
// const util = require('util');

// module.exports = async function (context, req) {
//     context.log('Received request to transform payload.');

//     const teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;

//     try {
//         const reqBody = req.body;

//         // Transform the payload
//         const transformedPayload = {
//             text: `A new work item has been created: \n**Title:** ${reqBody.resource.fields['System.Title']} \n**Assigned To:** ${reqBody.resource.fields['System.AssignedTo'].displayName} \n**State:** ${reqBody.resource.fields['System.State']}`
//         };

//         // Send the transformed payload to Teams
//         const response = await axios.post(teamsWebhookUrl, transformedPayload);

//         if (response.status === 200 || response.status === 202) {
//             context.res = {
//                 status: 200,
//                 body: "Payload sent successfully"
//             };
//         } else {
//             context.log(`Error sending payload to Teams: ${response.statusText}`);
//             context.res = {
//                 status: 500,
//                 body: `Error sending payload to Teams: ${response.statusText}`
//             };
//         }
//     } catch (err) {
//         context.log(`Invalid request body or error sending to Teams: ${util.inspect(err)}`);
//         context.res = {
//             status: 400,
//             body: "Invalid request body or error sending to Teams"
//         };
//     }
// };
