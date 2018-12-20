import Slack from 'slack-node';

const webhookUri = 'https://hooks.slack.com/services/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';

const slack = new Slack();
slack.setWebhook(webhookUri);

export function publishSlackMessage(params) {
    slack.webhook(params, (err) => { if (err) throw (err); });
}

export default slack;
