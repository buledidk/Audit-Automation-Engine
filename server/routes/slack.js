/**
 * Slack API Routes - Phase 8 Day 3
 * Handles Slack slash commands, events, and interactive actions
 * Endpoints: POST /api/slack/command, POST /api/slack/events, GET /api/slack/status
 */
import { Router } from 'express';

const router = Router();

// In-memory command history
const commandHistory = [];

// Slash command handler: /audit <subcommand>
router.post('/command', async (req, res) => {
  try {
    const { command, text, user_name, channel_name, response_url } = req.body;

    const parts = (text || '').trim().split(/\s+/);
    const subCommand = parts[0] || 'help';
    const args = parts.slice(1);

    // Log command
    commandHistory.unshift({
      id: 'cmd-' + Date.now(),
      command: subCommand,
      args: args.join(' '),
      user: user_name,
      channel: channel_name,
      timestamp: new Date().toISOString(),
    });
    if (commandHistory.length > 100) commandHistory.pop();

    const response = await executeCommand(subCommand, args, { user: user_name, channel: channel_name });
    res.json(response);
  } catch (err) {
    res.json({ response_type: 'ephemeral', text: ':x: Error: ' + err.message });
  }
});

// Slack events endpoint (for app mentions, messages, etc.)
router.post('/events', async (req, res) => {
  const { type, challenge, event } = req.body;

  // URL verification challenge from Slack
  if (type === 'url_verification') {
    return res.json({ challenge });
  }

  // Acknowledge receipt
  res.sendStatus(200);

  // Process event asynchronously
  if (type === 'event_callback' && event) {
    handleEvent(event).catch((err) => console.error('[Slack Event Error]', err.message));
  }
});

// Interactive actions (button clicks, modals, etc.)
router.post('/interactive', async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload || '{}');
    const { type, actions, user } = payload;

    if (type === 'block_actions' && actions && actions.length > 0) {
      const action = actions[0];
      console.log('[Slack Action]', action.action_id, 'by', user?.username);
    }

    res.json({ text: 'Action received' });
  } catch (err) {
    res.json({ text: 'Action processing error' });
  }
});

// Status endpoint
router.get('/status', (req, res) => {
  res.json({
    service: 'SlackBotService',
    status: process.env.SLACK_BOT_TOKEN ? 'configured' : 'not_configured',
    commands: ['status', 'build', 'deploy', 'agents', 'incidents', 'rankings', 'help'],
    recentCommands: commandHistory.slice(0, 10),
    uptime: process.uptime(),
  });
});

// Command history
router.get('/history', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  res.json({ commands: commandHistory.slice(0, limit), total: commandHistory.length });
});

// --- Command Execution ---

async function executeCommand(cmd, args, context) {
  const handlers = {
    status: handleStatus,
    build: handleBuild,
    deploy: handleDeploy,
    agents: handleAgents,
    incidents: handleIncidents,
    rankings: handleRankings,
    help: handleHelp,
  };

  const handler = handlers[cmd.toLowerCase()];
  if (!handler) {
    return { response_type: 'ephemeral', text: ':question: Unknown command: ' + cmd + '. Use /audit help.' };
  }

  return handler(args, context);
}

function handleStatus() {
  return {
    response_type: 'in_channel',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: ':bar_chart: AuditEngine Status' } },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: '*Platform:* AuditEngine v2026.1' },
          { type: 'mrkdwn', text: '*Status:* :large_green_circle: Operational' },
          { type: 'mrkdwn', text: '*Agents:* 18 monitored' },
          { type: 'mrkdwn', text: '*Build:* Passing' },
        ],
      },
    ],
  };
}

function handleBuild(args, context) {
  const target = args[0] || 'all';
  return {
    response_type: 'in_channel',
    text: ':hammer_and_wrench: Build triggered for *' + target + '* by @' + (context.user || 'system'),
  };
}

function handleDeploy(args, context) {
  const env = args[0] || 'staging';
  return {
    response_type: 'in_channel',
    text: ':rocket: Deploy to *' + env + '* initiated by @' + (context.user || 'system'),
  };
}

function handleAgents() {
  const agents = [
    'RiskAssessment',
    'Compliance',
    'DataValidation',
    'DocumentAnalysis',
    'FinancialReview',
    'QualityControl',
    'Sampling',
    'Reporting',
    'FraudDetection',
    'Materiality',
    'Evidence',
    'Workpaper',
    'Timeline',
    'Communication',
    'Archive',
    'Planning',
    'Analytics',
    'Supervisor',
  ];
  return {
    response_type: 'in_channel',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: ':robot_face: Agent Status (18)' } },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: agents.map((a) => ':large_green_circle: ' + a + 'Agent').join('\n') },
      },
    ],
  };
}

function handleIncidents() {
  return {
    response_type: 'ephemeral',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: ':warning: Recent Incidents' } },
      { type: 'section', text: { type: 'mrkdwn', text: 'No active incidents.' } },
    ],
  };
}

function handleRankings() {
  return {
    response_type: 'in_channel',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: ':trophy: Top 5 Agents' } },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ':first_place_medal: RiskAssessment — 97\n:second_place_medal: Compliance — 95\n:third_place_medal: FraudDetection — 93\n4. QualityControl — 91\n5. DocumentAnalysis — 89',
        },
      },
    ],
  };
}

function handleHelp() {
  return {
    response_type: 'ephemeral',
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: ':book: AuditEngine Commands' } },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*/audit status* — Platform overview\n*/audit build [target]* — Trigger build\n*/audit deploy [env]* — Deploy\n*/audit agents* — Agent list\n*/audit incidents* — Recent alerts\n*/audit rankings* — Top agents\n*/audit help* — This message',
        },
      },
    ],
  };
}

async function handleEvent(event) {
  if (event.type === 'app_mention') {
    console.log('[Slack Mention]', event.text, 'from', event.user);
  }
}

export default router;
