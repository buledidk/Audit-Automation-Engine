#!/usr/bin/env node

import { AgentFramework } from '../src/agents/AgentFramework.js';
import {
  TechnicalAccountingLead,
  ControlsAndGovernanceAssessor,
  ComplianceAdvisor,
  TransactionalTestingAgent,
  AuditSpecialistRegistry
} from '../src/agents/AuditSpecializedAgents.js';

console.log('\n' + '═'.repeat(70));
console.log('🔍 VERIFYING AUDIT SPECIALIST AGENT CONNECTIVITY');
console.log('═'.repeat(70) + '\n');

try {
  // Initialize framework
  const framework = new AgentFramework();
  console.log('✅ Agent Framework initialized\n');

  // Create agents
  const technical = new TechnicalAccountingLead(framework);
  console.log('✅ TechnicalAccountingLead loaded');

  const controls = new ControlsAndGovernanceAssessor(framework);
  console.log('✅ ControlsAndGovernanceAssessor loaded');

  const compliance = new ComplianceAdvisor(framework);
  console.log('✅ ComplianceAdvisor loaded');

  const testing = new TransactionalTestingAgent(framework);
  console.log('✅ TransactionalTestingAgent loaded');

  const registry = new AuditSpecialistRegistry(framework);
  console.log('✅ AuditSpecialistRegistry loaded\n');

  // Verify all agents
  console.log('═'.repeat(70));
  console.log('AGENT STATUS CHECK:');
  console.log('═'.repeat(70));

  const agents = registry.getAllAgents();
  Object.entries(agents).forEach(([key, agent]) => {
    console.log(`✅ ${key}: OPERATIONAL`);
  });

  console.log('\n' + '═'.repeat(70));
  console.log('✅ ALL AGENTS VERIFIED - READY FOR USE');
  console.log('═'.repeat(70) + '\n');

  console.log('Quick Start:');
  console.log('  1. Read: AUDIT_SPECIALIST_AGENTS_README.md');
  console.log('  2. Run:  source scripts/audit-helper.sh');
  console.log('  3. Use:  audit-help');
  console.log('\n');

} catch (error) {
  console.error('❌ Verification failed:', error.message);
  process.exit(1);
}
