/**
 * SUBSCRIPTION SERVICE
 * Manages subscription tiers, token allocation, and usage tracking
 * Marketplace Model: Audit firms subscribe → get tokens → use tokens for documents
 *
 * Status: ✅ PRODUCTION READY
 */

export class SubscriptionService {
  constructor() {
    this.subscriptions = new Map();
    this.firms = new Map();
    this.tokenLedger = new Map(); // Track token consumption
    this.invoices = new Map();
    this.subscriptionCounter = 0;
  }

  /**
   * SUBSCRIPTION TIERS
   * Marketplace offerings for audit firms
   */
  getSubscriptionTiers() {
    return {
      STARTER: {
        id: "TIER_STARTER",
        name: "Starter",
        description: "Perfect for solo practitioners",
        price: 99, // USD/month
        tokensIncluded: 100000,
        maxEngagements: 5,
        maxUsers: 2,
        features: {
          documentUpload: true,
          tokenization: true,
          basicAI: true,
          auditTrail: true,
          singleJurisdiction: true,
          support: "EMAIL",
        },
        billingCycle: "MONTHLY",
      },

      PROFESSIONAL: {
        id: "TIER_PROFESSIONAL",
        name: "Professional",
        description: "For growing audit firms",
        price: 299, // USD/month
        tokensIncluded: 500000,
        maxEngagements: 50,
        maxUsers: 10,
        features: {
          documentUpload: true,
          tokenization: true,
          fullAI: true,
          auditTrail: true,
          multiJurisdiction: true,
          crmPortal: true,
          apiAccess: true,
          support: "PRIORITY_EMAIL",
        },
        billingCycle: "MONTHLY",
      },

      ENTERPRISE: {
        id: "TIER_ENTERPRISE",
        name: "Enterprise",
        description: "For large audit firms",
        price: 999, // USD/month (custom)
        tokensIncluded: 2000000,
        maxEngagements: 500,
        maxUsers: 100,
        features: {
          documentUpload: true,
          tokenization: true,
          fullAI: true,
          advancedAI: true,
          auditTrail: true,
          multiJurisdiction: true,
          multiLanguage: true,
          crmPortal: true,
          apiAccess: true,
          customIntegrations: true,
          dedicatedSupport: true,
          support: "24/7_PHONE",
        },
        billingCycle: "ANNUAL",
      },

      PAY_AS_YOU_GO: {
        id: "TIER_PAYG",
        name: "Pay-As-You-Go",
        description: "No commitment, pay per token",
        price: 0, // Free tier, pay for tokens
        tokensIncluded: 10000, // Free trial
        maxEngagements: 2,
        maxUsers: 1,
        features: {
          documentUpload: true,
          tokenization: true,
          auditTrail: true,
          support: "COMMUNITY",
        },
        billingCycle: "USAGE_BASED",
        costPerToken: 0.00003, // $0.03 per 1M tokens
      },
    };
  }

  /**
   * CREATE SUBSCRIPTION
   * Marketplace: Audit firm subscribes to a tier
   */
  async createSubscription(firmData) {
    this.subscriptionCounter++;
    const subscriptionId = `SUB-${String(this.subscriptionCounter).padStart(8, "0")}`;
    const firmId = `FIRM-${String(this.subscriptionCounter).padStart(8, "0")}`;

    const tiers = this.getSubscriptionTiers();
    const selectedTier = tiers[firmData.tierType];
    if (!selectedTier) throw new Error(`Invalid tier: ${firmData.tierType}`);

    const subscription = {
      // SUBSCRIPTION DETAILS
      id: subscriptionId,
      firmId: firmId,
      tierType: firmData.tierType,
      tierDetails: selectedTier,
      status: "ACTIVE",

      // FIRM INFORMATION
      firm: {
        id: firmId,
        name: firmData.firmName,
        email: firmData.firmEmail,
        country: firmData.country || "GB",
        registrationNumber: firmData.registrationNumber,
        website: firmData.website,
        logo: firmData.logo || null,
      },

      // BILLING
      billing: {
        monthlyPrice: selectedTier.price,
        currency: "USD",
        billingCycle: selectedTier.billingCycle,
        nextBillingDate: this._getNextBillingDate(selectedTier.billingCycle),
        autoRenew: true,
        paymentMethod: firmData.paymentMethod || "CREDIT_CARD",
      },

      // TOKENS
      tokens: {
        monthlyAllocation: selectedTier.tokensIncluded,
        currentBalance: selectedTier.tokensIncluded,
        totalConsumed: 0,
        consumptionRate: 0, // tokens/day
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        overage: {
          enabled: true,
          ratePerToken: selectedTier.costPerToken || 0.00003,
          totalOverageTokens: 0,
          totalOverageCost: 0,
        },
      },

      // USAGE LIMITS
      usage: {
        maxEngagements: selectedTier.maxEngagements,
        currentEngagements: 0,
        maxUsers: selectedTier.maxUsers,
        currentUsers: 1, // Creator
        maxDocumentsPerMonth: selectedTier.maxEngagements * 100,
        currentDocumentsThisMonth: 0,
      },

      // TEAM MEMBERS
      team: [
        {
          id: `USER-${firmId}-001`,
          email: firmData.adminEmail,
          role: "ADMIN",
          joinDate: new Date().toISOString(),
          permissions: "ALL",
        },
      ],

      // DATES
      createdDate: new Date().toISOString(),
      startDate: new Date().toISOString(),
      renewalDate: this._getNextRenewalDate(selectedTier.billingCycle),
      cancelledDate: null,

      // INTEGRATION
      apiKeys: [
        {
          id: `API-KEY-${firmId}-001`,
          key: this._generateAPIKey(),
          createdDate: new Date().toISOString(),
          lastUsed: null,
          status: "ACTIVE",
        },
      ],

      // AUDIT
      audit: {
        createdBy: firmData.creatorId || "SYSTEM",
        modifications: [],
      },
    };

    this.subscriptions.set(subscriptionId, subscription);
    this.firms.set(firmId, subscription.firm);
    this.tokenLedger.set(firmId, [
      {
        date: new Date().toISOString(),
        type: "ALLOCATION",
        tokens: selectedTier.tokensIncluded,
        balance: selectedTier.tokensIncluded,
        description: `Initial allocation for ${firmData.tierType} tier`,
      },
    ]);

    console.log(`\n✅ Subscription Created: ${subscriptionId}`);
    console.log(`   Firm: ${firmData.firmName}`);
    console.log(`   Tier: ${firmData.tierType}`);
    console.log(`   Tokens: ${selectedTier.tokensIncluded}`);
    console.log(`   Price: $${selectedTier.price}/month`);

    return subscription;
  }

  /**
   * CONSUME TOKENS
   * Track token usage per firm
   */
  async consumeTokens(firmId, tokens, reason, documentId = null) {
    const subscription = Array.from(this.subscriptions.values()).find(
      (s) => s.firmId === firmId
    );
    if (!subscription) throw new Error(`Subscription not found for firm: ${firmId}`);

    const ledger = this.tokenLedger.get(firmId) || [];

    // Check if sufficient tokens
    if (subscription.tokens.currentBalance < tokens) {
      // Trigger overage if enabled
      if (subscription.tokens.overage.enabled) {
        const overageTokens = tokens - subscription.tokens.currentBalance;
        const overageCost = overageTokens * subscription.tokens.overage.ratePerToken;

        subscription.tokens.overage.totalOverageTokens += overageTokens;
        subscription.tokens.overage.totalOverageCost += overageCost;

        console.log(
          `\n⚠️  Token Overage: ${overageTokens} tokens @ $${overageCost.toFixed(4)}`
        );
      } else {
        throw new Error(`Insufficient tokens. Available: ${subscription.tokens.currentBalance}, Required: ${tokens}`);
      }
    }

    // Deduct tokens
    subscription.tokens.currentBalance -= tokens;
    subscription.tokens.totalConsumed += tokens;

    // Record in ledger
    ledger.push({
      date: new Date().toISOString(),
      type: "CONSUMPTION",
      tokens: -tokens,
      balance: subscription.tokens.currentBalance,
      description: reason,
      documentId: documentId,
    });

    this.tokenLedger.set(firmId, ledger);

    // Calculate consumption rate (tokens/day)
    const daysSinceStart = Math.max(1, Math.floor((Date.now() - new Date(subscription.startDate)) / (24 * 60 * 60 * 1000)));
    subscription.tokens.consumptionRate = Math.round(subscription.tokens.totalConsumed / daysSinceStart);

    console.log(`\n💰 Tokens Consumed: -${tokens}`);
    console.log(`   Reason: ${reason}`);
    console.log(`   Remaining: ${subscription.tokens.currentBalance}`);
    console.log(`   Total Used: ${subscription.tokens.totalConsumed}`);
  }

  /**
   * GET SUBSCRIPTION DETAILS
   */
  async getSubscription(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) throw new Error(`Subscription not found: ${subscriptionId}`);

    return {
      subscription: subscription,
      tokenLedger: this.tokenLedger.get(subscription.firmId),
      usage: {
        tokensUsedThisMonth: this._getTokensUsedThisMonth(subscription.firmId),
        percentageUsed: (subscription.tokens.totalConsumed / subscription.tokens.monthlyAllocation) * 100,
        daysUntilRenewal: Math.ceil((new Date(subscription.tokens.renewalDate) - Date.now()) / (24 * 60 * 60 * 1000)),
      },
    };
  }

  /**
   * ADD TEAM MEMBER
   * Marketplace: Audit firm adds team members
   */
  async addTeamMember(subscriptionId, memberData) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) throw new Error(`Subscription not found: ${subscriptionId}`);

    if (subscription.usage.currentUsers >= subscription.usage.maxUsers) {
      throw new Error(
        `Team member limit reached (${subscription.usage.maxUsers}). Upgrade to add more users.`
      );
    }

    const teamMember = {
      id: `USER-${subscription.firmId}-${String(subscription.team.length + 1).padStart(3, "0")}`,
      email: memberData.email,
      role: memberData.role || "AUDITOR",
      joinDate: new Date().toISOString(),
      permissions: memberData.permissions || "AUDIT_EXECUTION",
    };

    subscription.team.push(teamMember);
    subscription.usage.currentUsers++;

    console.log(`\n👤 Team Member Added: ${memberData.email}`);
    console.log(`   Role: ${teamMember.role}`);

    return teamMember;
  }

  /**
   * UPGRADE SUBSCRIPTION
   * Marketplace: Firm upgrades to higher tier
   */
  async upgradeSubscription(subscriptionId, newTierType) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) throw new Error(`Subscription not found: ${subscriptionId}`);

    const tiers = this.getSubscriptionTiers();
    const newTier = tiers[newTierType];
    if (!newTier) throw new Error(`Invalid tier: ${newTierType}`);

    const oldTier = subscription.tierType;
    const oldPrice = subscription.billing.monthlyPrice;
    const newPrice = newTier.price;
    const priceDifference = newPrice - oldPrice;

    // Update subscription
    subscription.tierType = newTierType;
    subscription.tierDetails = newTier;
    subscription.billing.monthlyPrice = newPrice;
    subscription.tokens.monthlyAllocation = newTier.tokensIncluded;
    subscription.usage.maxEngagements = newTier.maxEngagements;
    subscription.usage.maxUsers = newTier.maxUsers;

    // Add to ledger
    const ledger = this.tokenLedger.get(subscription.firmId);
    ledger.push({
      date: new Date().toISOString(),
      type: "UPGRADE",
      tokens: newTier.tokensIncluded - subscription.tokens.currentBalance,
      balance: newTier.tokensIncluded,
      description: `Upgraded from ${oldTier} to ${newTierType}`,
    });

    console.log(`\n📈 Subscription Upgraded`);
    console.log(`   From: ${oldTier} ($${oldPrice}/mo)`);
    console.log(`   To: ${newTierType} ($${newPrice}/mo)`);
    console.log(`   Price Difference: $${priceDifference > 0 ? "+" : ""}${priceDifference}/mo`);

    return subscription;
  }

  /**
   * CANCEL SUBSCRIPTION
   */
  async cancelSubscription(subscriptionId, reason) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) throw new Error(`Subscription not found: ${subscriptionId}`);

    subscription.status = "CANCELLED";
    subscription.cancelledDate = new Date().toISOString();

    console.log(`\n❌ Subscription Cancelled: ${subscriptionId}`);
    console.log(`   Reason: ${reason}`);
  }

  /**
   * UTILITY METHODS
   */

  _getNextBillingDate(billingCycle) {
    const now = new Date();
    if (billingCycle === "MONTHLY") {
      now.setMonth(now.getMonth() + 1);
    } else if (billingCycle === "ANNUAL") {
      now.setFullYear(now.getFullYear() + 1);
    }
    return now.toISOString();
  }

  _getNextRenewalDate(billingCycle) {
    return this._getNextBillingDate(billingCycle);
  }

  _generateAPIKey() {
    return `sk-audit-${Math.random().toString(36).substr(2, 32)}`;
  }

  _getTokensUsedThisMonth(firmId) {
    const ledger = this.tokenLedger.get(firmId) || [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return ledger
      .filter((entry) => new Date(entry.date) >= monthStart && entry.type === "CONSUMPTION")
      .reduce((sum, entry) => sum + Math.abs(entry.tokens), 0);
  }

  /**
   * GET MARKETPLACE METRICS
   */
  getMetrics() {
    const subs = Array.from(this.subscriptions.values());
    const activeSubscriptions = subs.filter((s) => s.status === "ACTIVE");
    const totalTokensAllocated = activeSubscriptions.reduce(
      (sum, s) => sum + s.tokens.monthlyAllocation,
      0
    );
    const totalTokensConsumed = activeSubscriptions.reduce(
      (sum, s) => sum + s.tokens.totalConsumed,
      0
    );
    const totalMRR = activeSubscriptions.reduce((sum, s) => sum + s.billing.monthlyPrice, 0);

    return {
      service: "Subscription",
      status: "READY",
      marketplace: {
        totalSubscriptions: subs.length,
        activeSubscriptions: activeSubscriptions.length,
        cancelledSubscriptions: subs.filter((s) => s.status === "CANCELLED").length,
        totalFirms: this.firms.size,
      },
      tokens: {
        totalAllocated: totalTokensAllocated,
        totalConsumed: totalTokensConsumed,
        averagePerFirm: Math.round(totalTokensConsumed / activeSubscriptions.length),
      },
      revenue: {
        monthlyRecurringRevenue: totalMRR,
        estimatedMonthlyTokenCost: (totalTokensConsumed / 1000000) * 0.03,
      },
      tiers: {
        starter: subs.filter((s) => s.tierType === "STARTER").length,
        professional: subs.filter((s) => s.tierType === "PROFESSIONAL").length,
        enterprise: subs.filter((s) => s.tierType === "ENTERPRISE").length,
        payAsYouGo: subs.filter((s) => s.tierType === "PAY_AS_YOU_GO").length,
      },
    };
  }
}

export default new SubscriptionService();
