// ═══════════════════════════════════════════════════════════════
// FINANCIAL MODEL UI — Extended Suite (fm9–fm18)
// AuditEngine v10 AURA
// 10 React memo components for extended financial model calculators
// ═══════════════════════════════════════════════════════════════

import { useState, memo } from "react";
import {
  calcImpairmentSensitivity,
  calcECLProvisionMatrix,
  calcLeaseEnhanced,
  calcSBPCharge,
  calcEIRAmortisedCost,
  calcBondValuation,
  calcInvestmentPropertyValuation,
  calcPensionDBO,
  calcGoodwillImpairment,
  calcDeferredTax,
} from "./FinancialModelsComplete";

const defaultColors = {
  bg: "#0B1120",
  acc: "#F5A623",
  tx: "#F0F0F0",
  dim: "#B0B8C8",
  fnt: "rgba(255,255,255,0.40)",
  grn: "#66BB6A",
  red: "#EF5350",
  org: "#FFA726",
  blu: "#42A5F5",
  pur: "#CE93D8",
  tl: "#26A69A",
  card: "rgba(255,255,255,0.06)",
  brd: "rgba(255,255,255,0.12)",
};

const mkInp = (CC) => ({
  width: "100%",
  padding: "12px 14px",
  borderRadius: 8,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.14)",
  color: CC.tx,
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 13,
  outline: "none",
});
const mkLbl = (CC) => ({
  fontSize: 10,
  color: CC.acc,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  marginBottom: 6,
  display: "block",
  fontWeight: 600,
});
const mkCard = (c) => ({
  padding: 20,
  borderRadius: 12,
  background: "linear-gradient(135deg," + c + "15," + c + "08)",
  border: "1px solid " + c + "44",
  textAlign: "center",
});
const mkVal = (c) => ({
  fontFamily: "'Cormorant Garamond',serif",
  fontSize: 28,
  color: c,
  fontWeight: 700,
});
const mkSub = (CC) => ({ fontSize: 11, color: CC.dim, fontWeight: 600 });
const mkTh = (CC) => ({
  textAlign: "left",
  padding: "10px 12px",
  background: "rgba(255,255,255,0.08)",
  borderBottom: "2px solid " + CC.acc + "44",
  fontSize: 10,
  color: CC.acc,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontWeight: 700,
});
const mkTd = (CC) => ({
  padding: "8px 12px",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  color: CC.dim,
});

// ─────────────────────────────────────────────────────────────
// 1. IMPAIRMENT SENSITIVITY MATRIX
// ─────────────────────────────────────────────────────────────
export const ImpairmentSensitivityCalc = memo(function ImpairmentSensitivityCalc({ colors }) {
  const CC = colors || defaultColors;
  const [inputs, setInputs] = useState({
    cf1: "", cf2: "", cf3: "", cf4: "", cf5: "",
    discountRate: "10", terminalGrowth: "2", carryingAmount: "5000000",
  });
  const upd = (k, v) => setInputs((p) => ({ ...p, [k]: v }));
  const inp = mkInp(CC);
  const lbl = mkLbl(CC);

  const cashFlows = [inputs.cf1, inputs.cf2, inputs.cf3, inputs.cf4, inputs.cf5]
    .map((v) => parseFloat(v) || 0)
    .filter((_, i) => [inputs.cf1, inputs.cf2, inputs.cf3, inputs.cf4, inputs.cf5][i] !== "");
  const dr = parseFloat(inputs.discountRate) / 100 || 0.1;
  const tgRaw = parseFloat(inputs.terminalGrowth);
  const tg = !isNaN(tgRaw) ? tgRaw / 100 : 0.02;
  const ca = parseFloat(inputs.carryingAmount) || 0;
  const hasData = cashFlows.length >= 1 && cashFlows.some((c) => c !== 0) && dr > tg && ca > 0;

  const result = hasData
    ? calcImpairmentSensitivity({ cashFlows, baseDiscount: dr, baseGrowth: tg, carryingAmount: ca })
    : null;

  return (
    <div>
      <div style={{ fontSize: 14, color: CC.tx, fontWeight: 700, marginBottom: 4 }}>IAS 36 — Impairment Sensitivity Matrix</div>
      <div style={{ fontSize: 11, color: CC.dim, marginBottom: 20 }}>Sensitivity analysis across discount and growth rate assumptions</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 16 }}>
        {[1, 2, 3, 4, 5].map((y) => (
          <div key={y}>
            <label style={lbl}>Year {y} CF</label>
            <input value={inputs["cf" + y]} onChange={(e) => upd("cf" + y, e.target.value)} style={inp} placeholder="e.g. 500000" />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div><label style={lbl}>Base Discount Rate (%)</label><input value={inputs.discountRate} onChange={(e) => upd("discountRate", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Base Growth Rate (%)</label><input value={inputs.terminalGrowth} onChange={(e) => upd("terminalGrowth", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Carrying Amount</label><input value={inputs.carryingAmount} onChange={(e) => upd("carryingAmount", e.target.value)} style={inp} /></div>
      </div>
      {result && (
        <div>
          {result.breakEvenDiscount && (
            <div style={{ ...mkCard(CC.red), marginBottom: 16 }}>
              <div style={mkVal(CC.red)}>{result.breakEvenDiscount}%</div>
              <div style={mkSub(CC)}>Break-Even Discount Rate</div>
            </div>
          )}
          <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid " + CC.brd }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={mkTh(CC)}>Discount Rate</th>
                  {result.growthSteps.map((g) => (
                    <th key={g} style={mkTh(CC)}>Growth {g}%</th>
                  ))}
                  <th style={mkTh(CC)}>Headroom</th>
                </tr>
              </thead>
              <tbody>
                {result.matrix.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                    <td style={{ ...mkTd(CC), color: CC.acc, fontWeight: 600 }}>{row.discountRate}%</td>
                    {result.growthSteps.map((g) => {
                      const val = row["g" + g];
                      const isImpaired = typeof val === "number" && val < ca;
                      return (
                        <td key={g} style={{ ...mkTd(CC), color: val === "N/A" ? CC.fnt : isImpaired ? CC.red : CC.grn }}>
                          {val === "N/A" ? "N/A" : "£" + val.toLocaleString()}
                        </td>
                      );
                    })}
                    <td style={{ ...mkTd(CC), color: row.headroom === "N/A" ? CC.fnt : row.headroom >= 0 ? CC.grn : CC.red, fontWeight: 600 }}>
                      {row.headroom === "N/A" ? "N/A" : "£" + row.headroom.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// 2. ECL PROVISION MATRIX
// ─────────────────────────────────────────────────────────────
export const ECLProvisionMatrixCalc = memo(function ECLProvisionMatrixCalc({ colors }) {
  const CC = colors || defaultColors;
  const [buckets, setBuckets] = useState([
    { label: "Current", balance: "500000", lossRate: "0.5" },
    { label: "30-60 days", balance: "200000", lossRate: "2" },
    { label: "60-90 days", balance: "100000", lossRate: "5" },
    { label: "90-120 days", balance: "50000", lossRate: "15" },
    { label: "120+ days", balance: "25000", lossRate: "40" },
  ]);
  const [fla, setFla] = useState("5");
  const inp = mkInp(CC);
  const lbl = mkLbl(CC);

  const updBucket = (i, k, v) => setBuckets((p) => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n; });

  const agingBuckets = buckets.map((b) => ({ label: b.label, balance: parseFloat(b.balance) || 0 }));
  const historicalLossRates = buckets.map((b) => (parseFloat(b.lossRate) || 0) / 100);
  const forwardLookingAdjustment = (parseFloat(fla) || 0) / 100;
  const hasData = agingBuckets.some((b) => b.balance > 0);

  const result = hasData ? calcECLProvisionMatrix({ agingBuckets, historicalLossRates, forwardLookingAdjustment }) : null;

  return (
    <div>
      <div style={{ fontSize: 14, color: CC.tx, fontWeight: 700, marginBottom: 4 }}>IFRS 9 — ECL Provision Matrix</div>
      <div style={{ fontSize: 11, color: CC.dim, marginBottom: 20 }}>Simplified approach for trade receivables — PD/LGD by aging bucket</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 16 }}>
        {buckets.map((b, i) => (
          <div key={i} style={{ background: CC.card, borderRadius: 10, padding: 14, border: "1px solid " + CC.brd }}>
            <div style={{ fontSize: 11, color: CC.acc, fontWeight: 700, marginBottom: 10 }}>{b.label}</div>
            <div><label style={lbl}>Balance</label><input value={b.balance} onChange={(e) => updBucket(i, "balance", e.target.value)} style={inp} /></div>
            <div style={{ marginTop: 8 }}><label style={lbl}>Loss Rate (%)</label><input value={b.lossRate} onChange={(e) => updBucket(i, "lossRate", e.target.value)} style={inp} /></div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 250, marginBottom: 20 }}>
        <label style={lbl}>Forward-Looking Adjustment (%)</label>
        <input value={fla} onChange={(e) => setFla(e.target.value)} style={inp} />
      </div>
      {result && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={mkCard(CC.acc)}><div style={mkVal(CC.acc)}>£{result.totalBalance.toLocaleString()}</div><div style={mkSub(CC)}>Total Receivables</div></div>
            <div style={mkCard(CC.red)}><div style={mkVal(CC.red)}>£{result.totalProvision.toLocaleString()}</div><div style={mkSub(CC)}>Total ECL Provision</div></div>
            <div style={mkCard(CC.org)}><div style={mkVal(CC.org)}>{result.coverageRatio}%</div><div style={mkSub(CC)}>Coverage Ratio</div></div>
          </div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid " + CC.brd }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>{["Bucket", "Balance", "Historical Rate", "Adjusted Rate", "Provision"].map((h, i) => <th key={i} style={mkTh(CC)}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {result.results.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                    <td style={{ ...mkTd(CC), color: CC.acc, fontWeight: 600 }}>{r.label}</td>
                    <td style={mkTd(CC)}>£{r.balance.toLocaleString()}</td>
                    <td style={mkTd(CC)}>{r.historicalRate}%</td>
                    <td style={{ ...mkTd(CC), color: CC.org }}>{r.adjustedRate}%</td>
                    <td style={{ ...mkTd(CC), color: CC.red, fontWeight: 600 }}>£{r.provision.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// 3. LEASE ENHANCED (IFRS 16 with escalation & modifications)
// ─────────────────────────────────────────────────────────────
export const LeaseEnhancedCalc = memo(function LeaseEnhancedCalc({ colors }) {
  const CC = colors || defaultColors;
  const [inputs, setInputs] = useState({
    annualPayment: "50000", escalationRate: "3", leaseTerm: "10",
    ibr: "5", directCosts: "5000", usefulLife: "",
  });
  const upd = (k, v) => setInputs((p) => ({ ...p, [k]: v }));
  const inp = mkInp(CC);
  const lbl = mkLbl(CC);

  const pay = parseFloat(inputs.annualPayment) || 0;
  const esc = (parseFloat(inputs.escalationRate) || 0) / 100;
  const term = parseInt(inputs.leaseTerm) || 0;
  const ibr = (parseFloat(inputs.ibr) || 0) / 100;
  const dc = parseFloat(inputs.directCosts) || 0;
  const ul = inputs.usefulLife ? parseInt(inputs.usefulLife) : null;

  const result = pay > 0 && term > 0 && ibr > 0
    ? calcLeaseEnhanced({ annualPayment: pay, escalationRate: esc, leaseTerm: term, ibr, directCosts: dc, usefulLife: ul })
    : null;

  return (
    <div>
      <div style={{ fontSize: 14, color: CC.tx, fontWeight: 700, marginBottom: 4 }}>IFRS 16 — Enhanced Lease Calculator</div>
      <div style={{ fontSize: 11, color: CC.dim, marginBottom: 20 }}>ROU asset and lease liability with escalation, direct costs, and remeasurement</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Annual Payment</label><input value={inputs.annualPayment} onChange={(e) => upd("annualPayment", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Escalation Rate (%)</label><input value={inputs.escalationRate} onChange={(e) => upd("escalationRate", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Lease Term (years)</label><input value={inputs.leaseTerm} onChange={(e) => upd("leaseTerm", e.target.value)} style={inp} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <div><label style={lbl}>IBR (%)</label><input value={inputs.ibr} onChange={(e) => upd("ibr", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Direct Costs</label><input value={inputs.directCosts} onChange={(e) => upd("directCosts", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Useful Life (blank = lease term)</label><input value={inputs.usefulLife} onChange={(e) => upd("usefulLife", e.target.value)} style={inp} placeholder="Optional" /></div>
      </div>
      {result && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={mkCard(CC.blu)}><div style={mkVal(CC.blu)}>£{Math.round(result.rouAsset).toLocaleString()}</div><div style={mkSub(CC)}>ROU Asset</div></div>
            <div style={mkCard(CC.org)}><div style={mkVal(CC.org)}>£{Math.round(result.leaseLiability).toLocaleString()}</div><div style={mkSub(CC)}>Lease Liability</div></div>
            <div style={mkCard(CC.pur)}><div style={mkVal(CC.pur)}>£{Math.round(result.annualDepreciation).toLocaleString()}</div><div style={mkSub(CC)}>Annual Depreciation</div></div>
            <div style={mkCard(CC.acc)}><div style={mkVal(CC.acc)}>£{Math.round(result.totalInterest).toLocaleString()}</div><div style={mkSub(CC)}>Total Interest</div></div>
          </div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid " + CC.brd }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>{["Year", "Payment", "Opening Liab", "Interest", "Closing Liab", "Depreciation", "ROU NBV", "P&L Impact", "Old Rent", "Difference"].map((h, i) => <th key={i} style={mkTh(CC)}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {result.schedule.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                    <td style={{ ...mkTd(CC), color: CC.acc, fontWeight: 600 }}>{r.year}</td>
                    <td style={mkTd(CC)}>£{r.payment.toLocaleString()}</td>
                    <td style={mkTd(CC)}>£{r.openingLiab.toLocaleString()}</td>
                    <td style={{ ...mkTd(CC), color: CC.org }}>£{r.interest.toLocaleString()}</td>
                    <td style={{ ...mkTd(CC), color: CC.tx, fontWeight: 500 }}>£{r.closingLiab.toLocaleString()}</td>
                    <td style={mkTd(CC)}>£{r.depreciation.toLocaleString()}</td>
                    <td style={{ ...mkTd(CC), color: CC.blu }}>£{r.rouNBV.toLocaleString()}</td>
                    <td style={{ ...mkTd(CC), color: CC.pur }}>£{r.plImpact.toLocaleString()}</td>
                    <td style={mkTd(CC)}>£{r.oldRentExpense.toLocaleString()}</td>
                    <td style={{ ...mkTd(CC), color: r.plDifference >= 0 ? CC.red : CC.grn, fontWeight: 600 }}>£{r.plDifference.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// 4. SHARE-BASED PAYMENT (SBP) CHARGE
// ─────────────────────────────────────────────────────────────
export const SBPCalc = memo(function SBPCalc({ colors }) {
  const CC = colors || defaultColors;
  const [inputs, setInputs] = useState({
    fairValuePerOption: "2.50", numberOfOptions: "100000",
    vestingPeriod: "3", expectedForfeitures: "10", gradedVesting: false,
  });
  const upd = (k, v) => setInputs((p) => ({ ...p, [k]: v }));
  const inp = mkInp(CC);
  const lbl = mkLbl(CC);

  const fv = parseFloat(inputs.fairValuePerOption) || 0;
  const numOpts = parseFloat(inputs.numberOfOptions) || 0;
  const vp = parseInt(inputs.vestingPeriod) || 0;
  const ef = (parseFloat(inputs.expectedForfeitures) || 0) / 100;

  const result = fv > 0 && numOpts > 0 && vp > 0
    ? calcSBPCharge({ fairValuePerOption: fv, numberOfOptions: numOpts, vestingPeriod: vp, expectedForfeitures: ef, gradedVesting: inputs.gradedVesting })
    : null;

  return (
    <div>
      <div style={{ fontSize: 14, color: CC.tx, fontWeight: 700, marginBottom: 4 }}>IFRS 2 — Share-Based Payment Charge</div>
      <div style={{ fontSize: 11, color: CC.dim, marginBottom: 20 }}>Equity-settled SBP with vesting conditions and forfeiture estimates</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Fair Value per Option</label><input value={inputs.fairValuePerOption} onChange={(e) => upd("fairValuePerOption", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Number of Options</label><input value={inputs.numberOfOptions} onChange={(e) => upd("numberOfOptions", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Vesting Period (years)</label><input value={inputs.vestingPeriod} onChange={(e) => upd("vestingPeriod", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Expected Forfeitures (%)</label><input value={inputs.expectedForfeitures} onChange={(e) => upd("expectedForfeitures", e.target.value)} style={inp} /></div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ ...lbl, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={inputs.gradedVesting} onChange={(e) => upd("gradedVesting", e.target.checked)} style={{ accentColor: CC.acc }} />
          Graded Vesting (IFRS 2.IG11)
        </label>
      </div>
      {result && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={mkCard(CC.acc)}><div style={mkVal(CC.acc)}>£{result.totalFairValue.toLocaleString()}</div><div style={mkSub(CC)}>Total Fair Value</div></div>
            <div style={mkCard(CC.blu)}><div style={mkVal(CC.blu)}>{result.adjustedOptions.toLocaleString()}</div><div style={mkSub(CC)}>Adjusted Options (net of forfeitures)</div></div>
          </div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid " + CC.brd }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>{["Year", "Annual Charge", "Cumulative Charge"].map((h, i) => <th key={i} style={mkTh(CC)}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {result.charges.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                    <td style={{ ...mkTd(CC), color: CC.acc, fontWeight: 600 }}>{r.year}</td>
                    <td style={{ ...mkTd(CC), color: CC.org }}>£{r.charge.toLocaleString()}</td>
                    <td style={{ ...mkTd(CC), color: CC.tx, fontWeight: 500 }}>£{r.cumulative.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// 5. EIR AMORTISED COST
// ─────────────────────────────────────────────────────────────
export const EIRAmortisedCostCalc = memo(function EIRAmortisedCostCalc({ colors }) {
  const CC = colors || defaultColors;
  const [inputs, setInputs] = useState({
    nominalAmount: "1000000", fees: "25000", nominalRate: "5",
    term: "5", repaymentType: "amortising",
  });
  const upd = (k, v) => setInputs((p) => ({ ...p, [k]: v }));
  const inp = mkInp(CC);
  const lbl = mkLbl(CC);

  const nom = parseFloat(inputs.nominalAmount) || 0;
  const fees = parseFloat(inputs.fees) || 0;
  const rate = (parseFloat(inputs.nominalRate) || 0) / 100;
  const term = parseInt(inputs.term) || 0;

  const result = nom > 0 && term > 0
    ? calcEIRAmortisedCost({ nominalAmount: nom, fees, nominalRate: rate, term, repaymentType: inputs.repaymentType })
    : null;

  return (
    <div>
      <div style={{ fontSize: 14, color: CC.tx, fontWeight: 700, marginBottom: 4 }}>IFRS 9 — EIR & Amortised Cost</div>
      <div style={{ fontSize: 11, color: CC.dim, marginBottom: 20 }}>Effective interest rate calculation with fee amortisation schedule</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Nominal Amount</label><input value={inputs.nominalAmount} onChange={(e) => upd("nominalAmount", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Transaction Fees</label><input value={inputs.fees} onChange={(e) => upd("fees", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Nominal Rate (%)</label><input value={inputs.nominalRate} onChange={(e) => upd("nominalRate", e.target.value)} style={inp} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div><label style={lbl}>Term (years)</label><input value={inputs.term} onChange={(e) => upd("term", e.target.value)} style={inp} /></div>
        <div>
          <label style={lbl}>Repayment Type</label>
          <select value={inputs.repaymentType} onChange={(e) => upd("repaymentType", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
            <option value="amortising">Amortising</option>
            <option value="bullet">Bullet</option>
            <option value="interest_only">Interest Only</option>
          </select>
        </div>
      </div>
      {result && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={mkCard(CC.acc)}><div style={{ ...mkVal(CC.acc), fontSize: 36 }}>{result.eir}%</div><div style={mkSub(CC)}>Effective Interest Rate</div></div>
            <div style={mkCard(CC.blu)}><div style={mkVal(CC.blu)}>£{result.netAmount.toLocaleString()}</div><div style={mkSub(CC)}>Net Amount (after fees)</div></div>
          </div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid " + CC.brd }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>{["Period", "Opening Balance", "Interest at EIR", "Cash Flow", "Closing Balance"].map((h, i) => <th key={i} style={mkTh(CC)}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {result.schedule.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                    <td style={{ ...mkTd(CC), color: CC.acc, fontWeight: 600 }}>{r.period}</td>
                    <td style={mkTd(CC)}>£{r.opening.toLocaleString()}</td>
                    <td style={{ ...mkTd(CC), color: CC.org }}>£{r.interestAtEIR.toLocaleString()}</td>
                    <td style={mkTd(CC)}>£{r.cashFlow.toLocaleString()}</td>
                    <td style={{ ...mkTd(CC), color: CC.tx, fontWeight: 500 }}>£{r.closing.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// 6. BOND VALUATION
// ─────────────────────────────────────────────────────────────
export const BondValuationCalc = memo(function BondValuationCalc({ colors }) {
  const CC = colors || defaultColors;
  const [inputs, setInputs] = useState({
    faceValue: "1000", couponRate: "5", couponFrequency: "2",
    yearsToMaturity: "10", marketYield: "6",
  });
  const upd = (k, v) => setInputs((p) => ({ ...p, [k]: v }));
  const inp = mkInp(CC);
  const lbl = mkLbl(CC);

  const fv = parseFloat(inputs.faceValue) || 0;
  const cr = (parseFloat(inputs.couponRate) || 0) / 100;
  const cf = parseInt(inputs.couponFrequency) || 2;
  const ytm = parseFloat(inputs.yearsToMaturity) || 0;
  const my = (parseFloat(inputs.marketYield) || 0) / 100;

  const result = fv > 0 && ytm > 0 && my > 0
    ? calcBondValuation({ faceValue: fv, couponRate: cr, couponFrequency: cf, yearsToMaturity: ytm, marketYield: my })
    : null;

  return (
    <div>
      <div style={{ fontSize: 14, color: CC.tx, fontWeight: 700, marginBottom: 4 }}>IFRS 9 — Bond Valuation</div>
      <div style={{ fontSize: 11, color: CC.dim, marginBottom: 20 }}>Bond pricing, yield analysis, duration, convexity, and DV01</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 20 }}>
        <div><label style={lbl}>Face Value</label><input value={inputs.faceValue} onChange={(e) => upd("faceValue", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Coupon Rate (%)</label><input value={inputs.couponRate} onChange={(e) => upd("couponRate", e.target.value)} style={inp} /></div>
        <div>
          <label style={lbl}>Coupon Frequency</label>
          <select value={inputs.couponFrequency} onChange={(e) => upd("couponFrequency", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
            <option value="1">Annual</option>
            <option value="2">Semi-Annual</option>
            <option value="4">Quarterly</option>
          </select>
        </div>
        <div><label style={lbl}>Years to Maturity</label><input value={inputs.yearsToMaturity} onChange={(e) => upd("yearsToMaturity", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Market Yield (%)</label><input value={inputs.marketYield} onChange={(e) => upd("marketYield", e.target.value)} style={inp} /></div>
      </div>
      {result && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={mkCard(CC.acc)}><div style={mkVal(CC.acc)}>£{result.cleanPrice.toLocaleString()}</div><div style={mkSub(CC)}>Clean Price</div></div>
            <div style={mkCard(CC.blu)}><div style={mkVal(CC.blu)}>£{result.dirtyPrice.toLocaleString()}</div><div style={mkSub(CC)}>Dirty Price</div></div>
            <div style={mkCard(CC.grn)}><div style={mkVal(CC.grn)}>{result.currentYield}%</div><div style={mkSub(CC)}>Current Yield</div></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 16 }}>
            {[
              { l: "Accrued Interest", v: "£" + result.accruedInterest },
              { l: "Macaulay Duration", v: result.macaulayDuration },
              { l: "Modified Duration", v: result.modifiedDuration },
              { l: "Convexity", v: result.convexity },
              { l: "DV01", v: result.dv01 },
            ].map((m, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 8, background: CC.card, border: "1px solid " + CC.brd, textAlign: "center" }}>
                <div style={{ fontSize: 16, color: CC.tx, fontWeight: 600 }}>{m.v}</div>
                <div style={{ fontSize: 9, color: CC.fnt, marginTop: 2 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// 7. INVESTMENT PROPERTY VALUATION
// ─────────────────────────────────────────────────────────────
export const PropertyValuationCalc = memo(function PropertyValuationCalc({ colors }) {
  const CC = colors || defaultColors;
  const [inputs, setInputs] = useState({
    passingRent: "120000", erv: "140000", capRate: "6",
    targetRate: "8", exitYield: "7", voidAllowance: "5",
    capex: "50000", managementFee: "3", years: "10",
  });
  const upd = (k, v) => setInputs((p) => ({ ...p, [k]: v }));
  const inp = mkInp(CC);
  const lbl = mkLbl(CC);

  const pr = parseFloat(inputs.passingRent) || 0;
  const erv = parseFloat(inputs.erv) || 0;
  const capRate = (parseFloat(inputs.capRate) || 0) / 100;
  const targetRate = (parseFloat(inputs.targetRate) || 0) / 100;
  const exitYield = (parseFloat(inputs.exitYield) || 0) / 100;
  const voidAll = (parseFloat(inputs.voidAllowance) || 0) / 100;
  const capex = parseFloat(inputs.capex) || 0;
  const mgmt = (parseFloat(inputs.managementFee) || 0) / 100;
  const years = parseInt(inputs.years) || 10;

  const result = erv > 0 && capRate > 0 && targetRate > 0 && exitYield > 0
    ? calcInvestmentPropertyValuation({ passingRent: pr, erv, capRate, targetRate, exitYield, voidAllowance: voidAll, capex, managementFee: mgmt, years })
    : null;

  return (
    <div>
      <div style={{ fontSize: 14, color: CC.tx, fontWeight: 700, marginBottom: 4 }}>IAS 40 — Investment Property Valuation</div>
      <div style={{ fontSize: 11, color: CC.dim, marginBottom: 20 }}>Income capitalisation and DCF approaches for property fair value</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Passing Rent (p.a.)</label><input value={inputs.passingRent} onChange={(e) => upd("passingRent", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>ERV (p.a.)</label><input value={inputs.erv} onChange={(e) => upd("erv", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Cap Rate (%)</label><input value={inputs.capRate} onChange={(e) => upd("capRate", e.target.value)} style={inp} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Target Rate / Discount (%)</label><input value={inputs.targetRate} onChange={(e) => upd("targetRate", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Exit Yield (%)</label><input value={inputs.exitYield} onChange={(e) => upd("exitYield", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Void Allowance (%)</label><input value={inputs.voidAllowance} onChange={(e) => upd("voidAllowance", e.target.value)} style={inp} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <div><label style={lbl}>Capex (Year 1)</label><input value={inputs.capex} onChange={(e) => upd("capex", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Management Fee (%)</label><input value={inputs.managementFee} onChange={(e) => upd("managementFee", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>DCF Term (years)</label><input value={inputs.years} onChange={(e) => upd("years", e.target.value)} style={inp} /></div>
      </div>
      {result && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={mkCard(CC.acc)}><div style={mkVal(CC.acc)}>£{result.incomeCapValue.toLocaleString()}</div><div style={mkSub(CC)}>Income Capitalisation Value</div></div>
            <div style={mkCard(CC.grn)}><div style={mkVal(CC.grn)}>£{result.dcfValue.toLocaleString()}</div><div style={mkSub(CC)}>DCF Value</div></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
            <div style={{ padding: 12, borderRadius: 8, background: CC.card, border: "1px solid " + CC.brd, textAlign: "center" }}>
              <div style={{ fontSize: 16, color: CC.blu, fontWeight: 600 }}>£{result.pvCashFlows.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: CC.fnt }}>PV of Cash Flows</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: CC.card, border: "1px solid " + CC.brd, textAlign: "center" }}>
              <div style={{ fontSize: 16, color: CC.org, fontWeight: 600 }}>£{result.terminalValue.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: CC.fnt }}>Terminal Value</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: CC.card, border: "1px solid " + CC.brd, textAlign: "center" }}>
              <div style={{ fontSize: 16, color: CC.pur, fontWeight: 600 }}>£{result.pvTerminal.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: CC.fnt }}>PV of Terminal</div>
            </div>
          </div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid " + CC.brd }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr>{["Year", "Net Cash Flow"].map((h, i) => <th key={i} style={mkTh(CC)}>{h}</th>)}</tr></thead>
              <tbody>
                {result.cashFlows.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                    <td style={{ ...mkTd(CC), color: CC.acc, fontWeight: 600 }}>{r.year}</td>
                    <td style={{ ...mkTd(CC), color: CC.tx, fontWeight: 500 }}>£{r.cashFlow.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// 8. PENSION DEFINED BENEFIT OBLIGATION
// ─────────────────────────────────────────────────────────────
export const PensionDBOCalc = memo(function PensionDBOCalc({ colors }) {
  const CC = colors || defaultColors;
  const [inputs, setInputs] = useState({
    currentServiceCost: "150000", pastServiceCost: "0", discountRate: "4.5",
    salaryGrowth: "3", pensionIncrease: "2.5", averageAge: "45",
    averageSalary: "50000", yearsOfService: "15", normalRetirementAge: "65",
    planAssets: "2000000", accrualRate: "1.6667", lifeExpectancy: "85",
  });
  const upd = (k, v) => setInputs((p) => ({ ...p, [k]: v }));
  const inp = mkInp(CC);
  const lbl = mkLbl(CC);

  const csc = parseFloat(inputs.currentServiceCost) || 0;
  const psc = parseFloat(inputs.pastServiceCost) || 0;
  const dr = (parseFloat(inputs.discountRate) || 0) / 100;
  const sg = (parseFloat(inputs.salaryGrowth) || 0) / 100;
  const pi = (parseFloat(inputs.pensionIncrease) || 0) / 100;
  const aa = parseFloat(inputs.averageAge) || 0;
  const as2 = parseFloat(inputs.averageSalary) || 0;
  const yos = parseFloat(inputs.yearsOfService) || 0;
  const nra = parseFloat(inputs.normalRetirementAge) || 65;
  const pa = parseFloat(inputs.planAssets) || 0;
  const ar = (parseFloat(inputs.accrualRate) || 0) / 100;

  const result = as2 > 0 && dr > 0 && aa < nra
    ? calcPensionDBO({ currentServiceCost: csc, pastServiceCost: psc, discountRate: dr, salaryGrowth: sg, pensionIncrease: pi, averageAge: aa, averageSalary: as2, yearsOfService: yos, normalRetirementAge: nra, planAssets: pa, accrualRate: ar, lifeExpectancy: parseFloat(inputs.lifeExpectancy) || 85 })
    : null;

  return (
    <div>
      <div style={{ fontSize: 14, color: CC.tx, fontWeight: 700, marginBottom: 4 }}>IAS 19 — Defined Benefit Pension</div>
      <div style={{ fontSize: 11, color: CC.dim, marginBottom: 20 }}>Projected unit credit method for DBO and P&L charge</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Current Service Cost</label><input value={inputs.currentServiceCost} onChange={(e) => upd("currentServiceCost", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Past Service Cost</label><input value={inputs.pastServiceCost} onChange={(e) => upd("pastServiceCost", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Discount Rate (%)</label><input value={inputs.discountRate} onChange={(e) => upd("discountRate", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Salary Growth (%)</label><input value={inputs.salaryGrowth} onChange={(e) => upd("salaryGrowth", e.target.value)} style={inp} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Average Age</label><input value={inputs.averageAge} onChange={(e) => upd("averageAge", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Average Salary</label><input value={inputs.averageSalary} onChange={(e) => upd("averageSalary", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Years of Service</label><input value={inputs.yearsOfService} onChange={(e) => upd("yearsOfService", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Retirement Age</label><input value={inputs.normalRetirementAge} onChange={(e) => upd("normalRetirementAge", e.target.value)} style={inp} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        <div><label style={lbl}>Plan Assets</label><input value={inputs.planAssets} onChange={(e) => upd("planAssets", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Accrual Rate (%)</label><input value={inputs.accrualRate} onChange={(e) => upd("accrualRate", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Life Expectancy (age)</label><input value={inputs.lifeExpectancy} onChange={(e) => upd("lifeExpectancy", e.target.value)} style={inp} /></div>
      </div>
      {result && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={mkCard(CC.red)}><div style={mkVal(CC.red)}>£{result.dbo.toLocaleString()}</div><div style={mkSub(CC)}>DBO</div></div>
            <div style={mkCard(CC.grn)}><div style={mkVal(CC.grn)}>£{result.planAssets.toLocaleString()}</div><div style={mkSub(CC)}>Plan Assets</div></div>
            <div style={mkCard(result.netLiability > 0 ? CC.red : CC.grn)}>
              <div style={mkVal(result.netLiability > 0 ? CC.red : CC.grn)}>£{Math.abs(result.netLiability).toLocaleString()}</div>
              <div style={mkSub(CC)}>Net {result.netLiability > 0 ? "Liability" : "Asset"}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
            {[
              { l: "Interest Cost", v: "£" + result.interestCost.toLocaleString(), c: CC.org },
              { l: "Interest on Assets", v: "£" + result.interestOnAssets.toLocaleString(), c: CC.blu },
              { l: "Net Interest", v: "£" + result.netInterest.toLocaleString(), c: CC.pur },
              { l: "P&L Charge", v: "£" + result.plCharge.toLocaleString(), c: CC.acc },
            ].map((m, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 8, background: CC.card, border: "1px solid " + CC.brd, textAlign: "center" }}>
                <div style={{ fontSize: 16, color: m.c, fontWeight: 600 }}>{m.v}</div>
                <div style={{ fontSize: 9, color: CC.fnt, marginTop: 2 }}>{m.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid " + CC.brd, textAlign: "center" }}>
              <div style={{ fontSize: 14, color: CC.tx, fontWeight: 600 }}>£{result.projectedSalary.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: CC.fnt }}>Projected Final Salary</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid " + CC.brd, textAlign: "center" }}>
              <div style={{ fontSize: 14, color: CC.tx, fontWeight: 600 }}>£{result.annualPension.toLocaleString()}</div>
              <div style={{ fontSize: 9, color: CC.fnt }}>Annual Pension at Retirement</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// 9. GOODWILL IMPAIRMENT TEST
// ─────────────────────────────────────────────────────────────
export const GoodwillImpairmentCalc = memo(function GoodwillImpairmentCalc({ colors }) {
  const CC = colors || defaultColors;
  const [inputs, setInputs] = useState({
    carryingAmount: "10000000", goodwill: "3000000",
    ebitda: "1500000", revenue: "8000000",
    evEbitda: "8", evRevenue: "1.5", dcfRecoverable: "12000000",
  });
  const upd = (k, v) => setInputs((p) => ({ ...p, [k]: v }));
  const inp = mkInp(CC);
  const lbl = mkLbl(CC);

  const ca = parseFloat(inputs.carryingAmount) || 0;
  const gw = parseFloat(inputs.goodwill) || 0;
  const ebitda = parseFloat(inputs.ebitda) || 0;
  const rev = parseFloat(inputs.revenue) || 0;
  const evE = parseFloat(inputs.evEbitda) || 0;
  const evR = parseFloat(inputs.evRevenue) || 0;
  const dcfR = parseFloat(inputs.dcfRecoverable) || 0;

  const result = ca > 0
    ? calcGoodwillImpairment({ carryingAmount: ca, goodwill: gw, ebitda, revenue: rev, comparableMultiples: { evEbitda: evE, evRevenue: evR }, dcfRecoverable: dcfR })
    : null;

  return (
    <div>
      <div style={{ fontSize: 14, color: CC.tx, fontWeight: 700, marginBottom: 4 }}>IAS 36 — Goodwill Impairment Test</div>
      <div style={{ fontSize: 11, color: CC.dim, marginBottom: 20 }}>CGU allocation, market multiples, and headroom analysis</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Carrying Amount (CGU)</label><input value={inputs.carryingAmount} onChange={(e) => upd("carryingAmount", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Goodwill Allocated</label><input value={inputs.goodwill} onChange={(e) => upd("goodwill", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>DCF Recoverable</label><input value={inputs.dcfRecoverable} onChange={(e) => upd("dcfRecoverable", e.target.value)} style={inp} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        <div><label style={lbl}>EBITDA</label><input value={inputs.ebitda} onChange={(e) => upd("ebitda", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Revenue</label><input value={inputs.revenue} onChange={(e) => upd("revenue", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>EV/EBITDA Multiple</label><input value={inputs.evEbitda} onChange={(e) => upd("evEbitda", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>EV/Revenue Multiple</label><input value={inputs.evRevenue} onChange={(e) => upd("evRevenue", e.target.value)} style={inp} /></div>
      </div>
      {result && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={mkCard(CC.blu)}><div style={mkVal(CC.blu)}>£{result.recoverable.toLocaleString()}</div><div style={mkSub(CC)}>Recoverable Amount</div></div>
            <div style={mkCard(result.headroom >= 0 ? CC.grn : CC.red)}>
              <div style={mkVal(result.headroom >= 0 ? CC.grn : CC.red)}>£{result.headroom.toLocaleString()}</div>
              <div style={mkSub(CC)}>Headroom ({result.headroomPct}%)</div>
            </div>
            <div style={mkCard(result.impairment > 0 ? CC.red : CC.grn)}>
              <div style={mkVal(result.impairment > 0 ? CC.red : CC.grn)}>£{result.impairment.toLocaleString()}</div>
              <div style={mkSub(CC)}>{result.impairment > 0 ? "Impairment Loss" : "No Impairment"}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {[
              { l: "FV by EV/EBITDA", v: "£" + result.fvByEbitda.toLocaleString(), c: CC.org },
              { l: "FV by EV/Revenue", v: "£" + result.fvByRevenue.toLocaleString(), c: CC.pur },
              { l: "Goodwill Post-Impairment", v: "£" + result.goodwillPostImpairment.toLocaleString(), c: CC.tl },
            ].map((m, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 8, background: CC.card, border: "1px solid " + CC.brd, textAlign: "center" }}>
                <div style={{ fontSize: 16, color: m.c, fontWeight: 600 }}>{m.v}</div>
                <div style={{ fontSize: 9, color: CC.fnt, marginTop: 2 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────
// 10. DEFERRED TAX CALCULATION
// ─────────────────────────────────────────────────────────────
export const DeferredTaxCalc = memo(function DeferredTaxCalc({ colors }) {
  const CC = colors || defaultColors;
  const [items, setItems] = useState([
    { name: "PPE", accountingBase: "500000", taxBase: "400000" },
    { name: "Intangibles", accountingBase: "200000", taxBase: "150000" },
    { name: "Provisions", accountingBase: "0", taxBase: "80000" },
    { name: "Lease Liability", accountingBase: "300000", taxBase: "0" },
  ]);
  const [inputs, setInputs] = useState({ mainRate: "25", smallRate: "19", profits: "300000" });
  const upd = (k, v) => setInputs((p) => ({ ...p, [k]: v }));
  const updItem = (i, k, v) => setItems((p) => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n; });
  const addItem = () => setItems((p) => [...p, { name: "New Item", accountingBase: "0", taxBase: "0" }]);
  const removeItem = (i) => setItems((p) => p.filter((_, idx) => idx !== i));
  const inp = mkInp(CC);
  const lbl = mkLbl(CC);

  const parsedItems = items.map((it) => ({
    name: it.name,
    accountingBase: parseFloat(it.accountingBase) || 0,
    taxBase: parseFloat(it.taxBase) || 0,
  }));
  const mainRate = (parseFloat(inputs.mainRate) || 0) / 100;
  const smallRate = (parseFloat(inputs.smallRate) || 0) / 100;
  const profits = parseFloat(inputs.profits) || 0;

  const result = parsedItems.length > 0
    ? calcDeferredTax({ items: parsedItems, mainRate, smallRate, profits })
    : null;

  return (
    <div>
      <div style={{ fontSize: 14, color: CC.tx, fontWeight: 700, marginBottom: 4 }}>IAS 12 — Deferred Tax Computation</div>
      <div style={{ fontSize: 11, color: CC.dim, marginBottom: 20 }}>Temporary differences, DTL/DTA, with marginal relief</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Main Rate (%)</label><input value={inputs.mainRate} onChange={(e) => upd("mainRate", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Small Profits Rate (%)</label><input value={inputs.smallRate} onChange={(e) => upd("smallRate", e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Taxable Profits</label><input value={inputs.profits} onChange={(e) => upd("profits", e.target.value)} style={inp} /></div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: CC.acc, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Temporary Difference Items</div>
          <button onClick={addItem} style={{ padding: "6px 14px", borderRadius: 6, background: CC.acc + "22", border: "1px solid " + CC.acc + "44", color: CC.acc, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>+ Add Item</button>
        </div>
        {items.map((it, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr auto", gap: 10, marginBottom: 8, alignItems: "end" }}>
            <div><label style={lbl}>Description</label><input value={it.name} onChange={(e) => updItem(i, "name", e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Accounting Base</label><input value={it.accountingBase} onChange={(e) => updItem(i, "accountingBase", e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Tax Base</label><input value={it.taxBase} onChange={(e) => updItem(i, "taxBase", e.target.value)} style={inp} /></div>
            <button onClick={() => removeItem(i)} style={{ padding: "10px 12px", borderRadius: 6, background: CC.red + "22", border: "1px solid " + CC.red + "44", color: CC.red, fontSize: 12, cursor: "pointer", marginBottom: 0 }}>x</button>
          </div>
        ))}
      </div>
      {result && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div style={mkCard(CC.red)}><div style={mkVal(CC.red)}>£{result.totalDTL.toLocaleString()}</div><div style={mkSub(CC)}>Total DTL</div></div>
            <div style={mkCard(CC.grn)}><div style={mkVal(CC.grn)}>£{result.totalDTA.toLocaleString()}</div><div style={mkSub(CC)}>Total DTA</div></div>
            <div style={mkCard(result.isLiability ? CC.red : CC.grn)}>
              <div style={mkVal(result.isLiability ? CC.red : CC.grn)}>£{Math.abs(result.netDT).toLocaleString()}</div>
              <div style={mkSub(CC)}>Net {result.isLiability ? "DTL" : "DTA"}</div>
            </div>
            <div style={mkCard(CC.acc)}><div style={mkVal(CC.acc)}>{result.effectiveRate}%</div><div style={mkSub(CC)}>Effective Tax Rate</div></div>
          </div>
          <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid " + CC.brd }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>{["Item", "Accounting Base", "Tax Base", "Temp Diff", "DTL", "DTA"].map((h, i) => <th key={i} style={mkTh(CC)}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {result.results.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                    <td style={{ ...mkTd(CC), color: CC.acc, fontWeight: 600 }}>{r.name}</td>
                    <td style={mkTd(CC)}>£{r.accountingBase.toLocaleString()}</td>
                    <td style={mkTd(CC)}>£{r.taxBase.toLocaleString()}</td>
                    <td style={{ ...mkTd(CC), color: r.tempDiff > 0 ? CC.red : r.tempDiff < 0 ? CC.grn : CC.dim, fontWeight: 600 }}>£{r.tempDiff.toLocaleString()}</td>
                    <td style={{ ...mkTd(CC), color: r.dtl > 0 ? CC.red : CC.dim }}>£{r.dtl.toLocaleString()}</td>
                    <td style={{ ...mkTd(CC), color: r.dta > 0 ? CC.grn : CC.dim }}>£{r.dta.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});
