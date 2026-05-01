import { C } from "../../data";

const PLANNING_IDS = new Set(["a1","a2","a3","a4","a5","a6","a7","a8","a9","a10"]);
const RISK_IDS = new Set(["b1","b2","b3","b4"]);
const LEAD_IDS = new Set(["c1","c2","c3","c4","c5","c6","c7","c8"]);
const FS_IDS = new Set(["fs1","fs2","fs3","fs4"]);
const COMPLETION_IDS = new Set(["e1","e2","e3","e4","e5","e6","dc1"]);
const REPORTING_IDS = new Set(["f1","f2","f3","f4","z1"]);
const REG_IDS = new Set(["reg1","reg2","reg3","reg4"]);

export default function WPBody({ wp, buildExportCtx, getMappedTotals }) {
  if (!wp) return null;

  if (PLANNING_IDS.has(wp.id)) return <PlanningWP wp={wp} />;
  if (RISK_IDS.has(wp.id)) return <RiskWP wp={wp} />;
  if (LEAD_IDS.has(wp.id)) return <LeadScheduleWP wp={wp} />;
  if (wp.type === "testing") return <TestingWP wp={wp} />;
  if (FS_IDS.has(wp.id)) return <FinancialStatementsWP wp={wp} />;
  if (COMPLETION_IDS.has(wp.id)) return <CompletionWP wp={wp} />;
  if (REPORTING_IDS.has(wp.id)) return <ReportingWP wp={wp} />;
  if (REG_IDS.has(wp.id)) return <RegulatoryWP wp={wp} />;
  if (wp.id === "std1") return <StandardsBrowser />;
  if (wp.id === "res1") return <ResearchHub />;
  if (wp.id === "coa1") return <ChartOfAccountsWP />;
  if (wp.id.startsWith("fm")) return <FinancialModelsWP wp={wp} />;
  if (wp.id === "int1") return <IntegrationsHub buildExportCtx={buildExportCtx} getMappedTotals={getMappedTotals} />;

  return <div style={{color:C.dim,padding:20}}>Working paper template ready.</div>;
}
