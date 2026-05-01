/**
 * ENHANCEMENT #10: REGULATORY UPDATE ENGINE
 * ========================================
 * Automated monitoring of regulatory changes from UK financial
 * and audit standard-setting bodies.
 *
 * Sources monitored:
 *  - FRC  (Financial Reporting Council)
 *  - FCA  (Financial Conduct Authority)
 *  - IASB (IFRS Foundation)
 *  - Charity Commission
 *  - HMRC
 *
 * Ensures compliance with the latest standards by fetching,
 * parsing and impact-assessing regulatory updates.
 */

// ---------------------------------------------------------------------------
// Standard-reference mappings used for impact assessment
// ---------------------------------------------------------------------------

const STANDARD_REFERENCES = {
  ISA: [
    'ISA 200', 'ISA 210', 'ISA 220', 'ISA 230', 'ISA 240',
    'ISA 250', 'ISA 260', 'ISA 265', 'ISA 300', 'ISA 315',
    'ISA 320', 'ISA 330', 'ISA 402', 'ISA 450', 'ISA 500',
    'ISA 501', 'ISA 505', 'ISA 510', 'ISA 520', 'ISA 530',
    'ISA 540', 'ISA 550', 'ISA 560', 'ISA 570', 'ISA 580',
    'ISA 600', 'ISA 610', 'ISA 620', 'ISA 700', 'ISA 701',
    'ISA 705', 'ISA 706', 'ISA 710', 'ISA 720',
  ],
  FRS: [
    'FRS 100', 'FRS 101', 'FRS 102', 'FRS 103', 'FRS 104', 'FRS 105',
  ],
  IFRS: [
    'IFRS 1', 'IFRS 2', 'IFRS 3', 'IFRS 7', 'IFRS 9',
    'IFRS 10', 'IFRS 13', 'IFRS 15', 'IFRS 16', 'IFRS 17',
    'IAS 1', 'IAS 7', 'IAS 12', 'IAS 16', 'IAS 19', 'IAS 36', 'IAS 37', 'IAS 38',
  ],
  FCA: [
    'COBS', 'SYSC', 'SUP', 'PRIN', 'MCOB', 'CASS', 'DISP',
  ],
};

/**
 * Keywords that, when found in a regulatory update title, signal a
 * connection to an active engagement procedure and therefore raise
 * impact to HIGH.
 */
const HIGH_IMPACT_KEYWORDS = [
  'fraud', 'going concern', 'material misstatement', 'audit report',
  'money laundering', 'anti-bribery', 'related party', 'revenue recognition',
  'impairment', 'fair value', 'estimates', 'subsequent events',
  'auditor independence', 'ethical standard', 'data protection',
  'sanctions', 'financial crime',
];

/**
 * Maps standards to the working-paper types they typically affect.
 */
const WP_MAP = {
  'ISA 240': ['WP-FRAUD', 'WP-RISK-ASSESSMENT'],
  'ISA 250': ['WP-LAWS-REGS'],
  'ISA 315': ['WP-RISK-ASSESSMENT', 'WP-UNDERSTANDING-ENTITY'],
  'ISA 330': ['WP-SUBSTANTIVE-PROCEDURES', 'WP-TESTS-OF-CONTROLS'],
  'ISA 450': ['WP-MISSTATEMENTS'],
  'ISA 500': ['WP-EVIDENCE'],
  'ISA 540': ['WP-ESTIMATES'],
  'ISA 550': ['WP-RELATED-PARTIES'],
  'ISA 560': ['WP-SUBSEQUENT-EVENTS'],
  'ISA 570': ['WP-GOING-CONCERN'],
  'ISA 700': ['WP-AUDIT-REPORT'],
  'ISA 701': ['WP-KEY-AUDIT-MATTERS'],
  'ISA 720': ['WP-OTHER-INFORMATION'],
  'FRS 102': ['WP-ACCOUNTING-POLICIES', 'WP-FINANCIAL-STATEMENTS'],
  'FRS 105': ['WP-MICRO-ENTITY'],
  'IFRS 9':  ['WP-FINANCIAL-INSTRUMENTS'],
  'IFRS 15': ['WP-REVENUE'],
  'IFRS 16': ['WP-LEASES'],
  'IFRS 17': ['WP-INSURANCE-CONTRACTS'],
  'COBS':    ['WP-CONDUCT-OF-BUSINESS'],
  'SYSC':    ['WP-SYSTEMS-CONTROLS'],
  'CASS':    ['WP-CLIENT-ASSETS'],
};

// ---------------------------------------------------------------------------
// Registry of regulatory sources
// ---------------------------------------------------------------------------

const REGULATORY_SOURCES = [
  {
    id: 'FRC',
    name: 'Financial Reporting Council',
    url: 'https://www.frc.org.uk/library?page=1',
    category: 'audit-standards',
  },
  {
    id: 'FCA',
    name: 'Financial Conduct Authority',
    url: 'https://www.fca.org.uk/news/news-stories',
    category: 'financial-regulation',
  },
  {
    id: 'IASB',
    name: 'IFRS Foundation',
    url: 'https://www.ifrs.org/news-and-events/',
    category: 'accounting-standards',
  },
  {
    id: 'CHARITY_COMMISSION',
    name: 'Charity Commission',
    url: 'https://www.gov.uk/government/organisations/charity-commission/about',
    category: 'charity-regulation',
  },
  {
    id: 'HMRC',
    name: 'HM Revenue & Customs',
    url: 'https://www.gov.uk/government/organisations/hm-revenue-customs',
    category: 'tax-regulation',
  },
];

// ---------------------------------------------------------------------------
// Engine implementation
// ---------------------------------------------------------------------------

export class RegulatoryUpdateEngine {
  constructor() {
    /** All known standard identifiers used for keyword matching. */
    this.standardReferences = STANDARD_REFERENCES;

    /** Registry of sources we monitor. */
    this.sources = REGULATORY_SOURCES;

    /** In-memory cache of previously fetched updates. */
    this._cache = [];

    /** Historical change-log (persisted across calls for the engine lifetime). */
    this._changeLog = [];

    /** Timestamp of the most recent successful fetch. */
    this._lastFetched = null;

    /** Request timeout in milliseconds. */
    this._fetchTimeout = 10_000;
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /**
   * checkUpdates(auditData)
   * -----------------------
   * Backward-compatible entry point consumed by AuditAccuracyEnhancementEngine.
   * Delegates to checkForUpdates(), then reshapes the output to match the
   * legacy contract: { newRequirements, affectedAreas, requiredUpdates, complianceStatus }.
   */
  async checkUpdates(_auditData) {
    const updates = await this.checkForUpdates();

    const newRequirements = updates.map((u) => ({
      standard: u.standard || u.source,
      area: u.title,
      effectiveDate: u.date,
      url: u.url,
    }));

    const affectedAreas = updates.map((u) => {
      const impact = this.assessImpact(u);
      return {
        area: u.title,
        impact: impact.level,
        industry: this._industryFromSource(u.source),
      };
    });

    const requiredUpdates = updates
      .filter((u) => this.assessImpact(u).level !== 'LOW')
      .map((u) => ({
        update: `Review procedures for: ${u.title}`,
        status: 'PENDING',
      }));

    const hasHighImpact = affectedAreas.some((a) => a.impact === 'HIGH');

    return {
      newRequirements,
      affectedAreas,
      requiredUpdates,
      complianceStatus: hasHighImpact ? 'ACTION_REQUIRED' : 'CURRENT',
    };
  }

  /**
   * checkForUpdates()
   * -----------------
   * Fetches updates from every registered source, parses them and returns
   * structured update objects.  Falls back to cached results when network
   * requests fail.
   *
   * @returns {Promise<Array<{source, standard, title, date, url, impact, affectedWPs}>>}
   */
  async checkForUpdates() {
    const results = [];

    const fetches = this.sources.map(async (source) => {
      try {
        const items = await this._fetchSource(source);
        for (const item of items) {
          const matched = this._matchStandards(item.title);
          const impact = this._determineImpactLevel(item.title, matched);
          const affectedWPs = this._resolveAffectedWPs(matched);

          const update = {
            source: source.id,
            standard: matched.length > 0 ? matched.join(', ') : source.category,
            title: item.title,
            date: item.date || new Date().toISOString().slice(0, 10),
            url: item.url || source.url,
            impact,
            affectedWPs,
          };

          results.push(update);
        }
      } catch (_err) { // eslint-disable-line no-unused-vars
        // Network failure for this source -- silently skip.
        // Cached data will be used as fallback below.
      }
    });

    await Promise.all(fetches);

    if (results.length > 0) {
      this._cache = results;
      this._lastFetched = new Date();
      this._appendToChangeLog(results);
      return results;
    }

    // All fetches failed -- return cached results.
    return this._cache;
  }

  /**
   * assessImpact(update)
   * --------------------
   * Maps a regulatory update to affected ISAs / FRS sections / FCA rules,
   * determines impact level, and returns affected working-paper types.
   *
   * @param {object} update  A structured update object (from checkForUpdates).
   * @returns {{ level: string, matchedStandards: string[], affectedWPs: string[], reason: string }}
   */
  assessImpact(update) {
    if (!update) {
      return { level: 'LOW', matchedStandards: [], affectedWPs: [], reason: 'No update provided' };
    }

    const titleLower = (update.title || '').toLowerCase();
    const matched = this._matchStandards(update.title);
    const affectedWPs = this._resolveAffectedWPs(matched);
    const level = this._determineImpactLevel(update.title, matched);

    let reason;
    if (level === 'HIGH') {
      const kw = HIGH_IMPACT_KEYWORDS.find((k) => titleLower.includes(k));
      reason = kw
        ? `Contains high-impact keyword "${kw}"`
        : `Affects active engagement procedure standards: ${matched.join(', ')}`;
    } else if (level === 'MEDIUM') {
      reason = `Matches known standard references: ${matched.join(', ')}`;
    } else {
      reason = 'General regulatory update with no direct procedural impact detected';
    }

    return { level, matchedStandards: matched, affectedWPs, reason };
  }

  /**
   * getChangeLog()
   * --------------
   * Returns the full historical list of regulatory updates observed during
   * this engine instance's lifetime, sorted newest-first.
   *
   * @returns {Array<object>}
   */
  getChangeLog() {
    return [...this._changeLog].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  // -----------------------------------------------------------------------
  // Fetching helpers
  // -----------------------------------------------------------------------

  /**
   * Fetch a single regulatory source.  Uses the browser-native `fetch` API
   * with an AbortController timeout so we never hang indefinitely.
   *
   * Returns an array of { title, date?, url? } items parsed from the
   * response body.  The parsing is intentionally lenient -- the pages we
   * hit are normal HTML, so we do simple regex extraction rather than full
   * DOM parsing (we run in a non-DOM context for tests / build).
   *
   * @private
   */
  async _fetchSource(source) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this._fetchTimeout);

    try {
      const response = await fetch(source.url, {
        signal: controller.signal,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'AuditEngine-RegulatoryMonitor/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${source.id}`);
      }

      const html = await response.text();
      return this._parseHtml(html, source);
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Very lightweight HTML extraction.  We look for common patterns in
   * regulatory sites:
   *  - <a ...>Title</a>
   *  - <h2/h3>Title</h2/h3>
   *  - <time datetime="...">
   *
   * We cap at 20 items per source to avoid flooding results.
   *
   * @private
   */
  _parseHtml(html, source) {
    const items = [];
    if (!html) return items;

    // Try matching headline links: <a ...href="URL"...>Title</a>
    const linkRegex = /<a\s[^>]*href="([^"]*)"[^>]*>([^<]{10,120})<\/a>/gi;
    let match;
    while ((match = linkRegex.exec(html)) !== null && items.length < 20) {
      const url = match[1];
      const title = this._stripHtmlEntities(match[2]).trim();

      // Skip generic navigation / footer links
      if (title.length < 12 || /^(home|about|contact|menu|skip|cookie)/i.test(title)) {
        continue;
      }

      items.push({
        title,
        url: url.startsWith('http') ? url : `${new URL(source.url).origin}${url}`,
        date: this._extractNearbyDate(html, match.index),
      });
    }

    // Deduplicate by title
    const seen = new Set();
    return items.filter((item) => {
      const key = item.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Try to find a date string near a given index in the HTML.
   * Looks for ISO dates (YYYY-MM-DD) or <time datetime="..."> within 500
   * characters of the match.
   *
   * @private
   */
  _extractNearbyDate(html, index) {
    const window = html.slice(Math.max(0, index - 300), index + 500);

    // <time datetime="2024-06-01">
    const timeMatch = window.match(/<time[^>]*datetime="([^"]+)"/i);
    if (timeMatch) return timeMatch[1].slice(0, 10);

    // Bare ISO date
    const isoMatch = window.match(/(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) return isoMatch[1];

    // DD Month YYYY
    const longMatch = window.match(
      /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
    );
    if (longMatch) {
      const months = {
        january: '01', february: '02', march: '03', april: '04',
        may: '05', june: '06', july: '07', august: '08',
        september: '09', october: '10', november: '11', december: '12',
      };
      const day = longMatch[1].padStart(2, '0');
      const mon = months[longMatch[2].toLowerCase()];
      return `${longMatch[3]}-${mon}-${day}`;
    }

    return new Date().toISOString().slice(0, 10);
  }

  /** @private */
  _stripHtmlEntities(str) {
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }

  // -----------------------------------------------------------------------
  // Standard-matching helpers
  // -----------------------------------------------------------------------

  /**
   * Scan the title for any standard references we track.
   *
   * @private
   * @param {string} text
   * @returns {string[]} Matched standard identifiers (e.g. ['ISA 540', 'FRS 102']).
   */
  _matchStandards(text) {
    if (!text) return [];
    const upper = text.toUpperCase();
    const found = [];

    for (const group of Object.values(this.standardReferences)) {
      for (const std of group) {
        if (upper.includes(std)) {
          found.push(std);
        }
      }
    }

    return [...new Set(found)];
  }

  /**
   * Determine the impact level of an update.
   *
   *  HIGH   - title contains a high-impact keyword OR matches a standard
   *           that directly affects active engagement procedures.
   *  MEDIUM - matches any tracked standard reference.
   *  LOW    - general update with no recognised standard match.
   *
   * @private
   */
  _determineImpactLevel(title, matchedStandards) {
    const lower = (title || '').toLowerCase();

    // Check for high-impact keywords first
    if (HIGH_IMPACT_KEYWORDS.some((kw) => lower.includes(kw))) {
      return 'HIGH';
    }

    // Standards that directly govern engagement procedures are HIGH
    const procedureStandards = [
      'ISA 240', 'ISA 315', 'ISA 330', 'ISA 540', 'ISA 570',
      'ISA 700', 'ISA 701', 'IFRS 9', 'IFRS 15', 'IFRS 16', 'IFRS 17',
    ];
    if (matchedStandards.some((s) => procedureStandards.includes(s))) {
      return 'HIGH';
    }

    if (matchedStandards.length > 0) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  /**
   * Resolve matched standards to their affected working-paper types.
   *
   * @private
   * @param {string[]} matchedStandards
   * @returns {string[]}
   */
  _resolveAffectedWPs(matchedStandards) {
    const wps = new Set();
    for (const std of matchedStandards) {
      const mapped = WP_MAP[std];
      if (mapped) {
        mapped.forEach((wp) => wps.add(wp));
      }
    }
    return [...wps];
  }

  // -----------------------------------------------------------------------
  // Misc helpers
  // -----------------------------------------------------------------------

  /** @private */
  _industryFromSource(sourceId) {
    const map = {
      FRC: 'All',
      FCA: 'Financial Services',
      IASB: 'All',
      CHARITY_COMMISSION: 'Charities',
      HMRC: 'All',
    };
    return map[sourceId] || 'All';
  }

  /** @private */
  _appendToChangeLog(updates) {
    for (const u of updates) {
      // Avoid duplicate log entries (same source + title + date).
      const exists = this._changeLog.some(
        (existing) =>
          existing.source === u.source &&
          existing.title === u.title &&
          existing.date === u.date,
      );
      if (!exists) {
        this._changeLog.push({ ...u, loggedAt: new Date().toISOString() });
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

/**
 * Singleton instance for consumers that want a shared engine.
 * Import as: `import { regulatoryUpdateEngine } from '...'`
 */
export const regulatoryUpdateEngine = new RegulatoryUpdateEngine();

/**
 * Default export is the class itself so callers can instantiate their own
 * (the parent AuditAccuracyEnhancementEngine does `new RegulatoryUpdateEngine()`).
 */
export default RegulatoryUpdateEngine;
