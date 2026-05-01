import { useState } from "react";
import { C } from "../data";
import {
  calcImpairmentDCF, calcDCF, calcEIR, calcProvisionUnwinding,
  calcIFRS16Lease, calcBlackScholes, calcECL, calcIFRS15Revenue
} from "../FinancialModels";

export function ImpairmentDCFCalc({colors}){
  const CC=colors||C;
  const[inputs,setInputs]=useState({cf1:"",cf2:"",cf3:"",cf4:"",cf5:"",discountRate:"10",terminalGrowth:"2",carryingAmount:""});
  const upd=(k,v)=>setInputs(p=>({...p,[k]:v}));
  const cashFlows=[inputs.cf1,inputs.cf2,inputs.cf3,inputs.cf4,inputs.cf5].map(v=>v===""?0:Number(v)).filter(x=>!isNaN(x));
  const dr=parseFloat(inputs.discountRate)/100||0.1;
  const tg=parseFloat(inputs.terminalGrowth)/100||0.02;
  const ca=parseFloat(inputs.carryingAmount)||0;
  const hasAnyCF=cashFlows.some(cf=>cf!==0);
  const result=(cashFlows.length>=1&&hasAnyCF&&dr>tg)?calcImpairmentDCF({cashFlows,discountRate:dr,terminalGrowth:tg}):null;
  const headroom=result&&ca?(result.recoverableAmount-ca):null;
  const inp={width:"100%",padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.14)",color:CC.tx,fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none"};
  const lbl={fontSize:10,color:CC.acc,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6,display:"block",fontWeight:600};
  return<div>
    <div style={{fontSize:14,color:CC.tx,fontWeight:700,marginBottom:4}}>IAS 36 — Impairment DCF Model</div>
    <div style={{fontSize:11,color:CC.dim,marginBottom:20}}>Calculate recoverable amount (value in use) for CGU impairment assessment</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:16}}>
      {[1,2,3,4,5].map(y=><div key={y}><label style={lbl}>Year {y} CF (£)</label><input value={inputs["cf"+y]} onChange={e=>upd("cf"+y,e.target.value)} style={inp} placeholder="e.g. 500000"/></div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
      <div><label style={lbl}>Discount Rate (%)</label><input value={inputs.discountRate} onChange={e=>upd("discountRate",e.target.value)} style={inp}/></div>
      <div><label style={lbl}>Terminal Growth (%)</label><input value={inputs.terminalGrowth} onChange={e=>upd("terminalGrowth",e.target.value)} style={inp}/></div>
      <div><label style={lbl}>Carrying Amount (£)</label><input value={inputs.carryingAmount} onChange={e=>upd("carryingAmount",e.target.value)} style={inp}/></div>
    </div>
    {result&&<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{padding:20,borderRadius:12,background:"linear-gradient(135deg,"+CC.acc+"15,"+CC.acc+"08)",border:"1px solid "+CC.acc+"44",textAlign:"center"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:CC.acc,fontWeight:700}}>£{Math.round(result.recoverableAmount).toLocaleString()}</div>
          <div style={{fontSize:11,color:CC.dim,fontWeight:600}}>Recoverable Amount</div>
        </div>
        <div style={{padding:20,borderRadius:12,background:"linear-gradient(135deg,"+CC.blu+"15,"+CC.blu+"08)",border:"1px solid "+CC.blu+"44",textAlign:"center"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:CC.blu,fontWeight:700}}>£{Math.round(result.pvTerminal).toLocaleString()}</div>
          <div style={{fontSize:11,color:CC.dim,fontWeight:600}}>Terminal Value (PV)</div>
        </div>
        {ca>0&&<div style={{padding:20,borderRadius:12,background:"linear-gradient(135deg,"+(headroom>=0?CC.grn:CC.red)+"15,"+(headroom>=0?CC.grn:CC.red)+"08)",border:"1px solid "+(headroom>=0?CC.grn:CC.red)+"44",textAlign:"center"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:headroom>=0?CC.grn:CC.red,fontWeight:700}}>£{Math.round(headroom).toLocaleString()}</div>
          <div style={{fontSize:11,color:CC.dim,fontWeight:600}}>{headroom>=0?"Headroom":"Impairment Required"}</div>
        </div>}
      </div>
      <div style={{background:CC.card,borderRadius:10,padding:16,border:"1px solid "+CC.brd}}>
        <div style={{fontSize:10,color:CC.acc,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Annual PV Breakdown</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {result.annualPVs.map((pv,i)=><div key={i} style={{padding:8,borderRadius:6,background:"rgba(255,255,255,0.03)",textAlign:"center"}}>
            <div style={{fontSize:9,color:CC.fnt}}>Year {i+1}</div>
            <div style={{fontSize:13,color:CC.tx,fontWeight:600}}>£{Math.round(pv).toLocaleString()}</div>
          </div>)}
        </div>
      </div>
      <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,padding:12,border:"1px solid "+CC.brd}}>
          <div style={{fontSize:10,color:CC.acc,fontWeight:700,marginBottom:4}}>Sensitivity: Discount Rate +/- 1%</div>
          <div style={{fontSize:11,color:CC.dim}}>
            {[dr-0.01,dr+0.01].map((r,i)=>{const s=calcImpairmentDCF({cashFlows,discountRate:r,terminalGrowth:tg});return<div key={i}>Rate {(r*100).toFixed(1)}%: £{Math.round(s.recoverableAmount).toLocaleString()}</div>})}
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,padding:12,border:"1px solid "+CC.brd}}>
          <div style={{fontSize:10,color:CC.acc,fontWeight:700,marginBottom:4}}>Sensitivity: Terminal Growth +/- 0.5%</div>
          <div style={{fontSize:11,color:CC.dim}}>
            {[tg-0.005,tg+0.005].map((g,i)=>{const s=calcImpairmentDCF({cashFlows,discountRate:dr,terminalGrowth:g});return<div key={i}>Growth {(g*100).toFixed(1)}%: £{Math.round(s.recoverableAmount).toLocaleString()}</div>})}
          </div>
        </div>
      </div>
    </div>}
  </div>;
}

export function StandaloneDCFCalc({colors}){
  const CC=colors||C;
  const[inputs,setInputs]=useState({rf:"4.5",beta:"1.0",erp:"5.5",sp:"2.0",kd:"5.0",debtRatio:"30",taxRate:"25",cf1:"",cf2:"",cf3:"",cf4:"",cf5:"",terminalGrowth:"2"});
  const upd=(k,v)=>setInputs(p=>({...p,[k]:v}));
  const cashFlows=[inputs.cf1,inputs.cf2,inputs.cf3,inputs.cf4,inputs.cf5].map(Number).filter(x=>!isNaN(x));
  const result=cashFlows.length===5?calcDCF({rf:parseFloat(inputs.rf)/100,beta:parseFloat(inputs.beta),erp:parseFloat(inputs.erp)/100,sp:parseFloat(inputs.sp)/100,kd:parseFloat(inputs.kd)/100,debtRatio:parseFloat(inputs.debtRatio)/100,taxRate:parseFloat(inputs.taxRate)/100,cashFlows,terminalGrowth:parseFloat(inputs.terminalGrowth)/100}):null;
  const inp={width:"100%",padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.14)",color:CC.tx,fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none"};
  const lbl={fontSize:10,color:CC.acc,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6,display:"block",fontWeight:600};
  return<div>
    <div style={{fontSize:14,color:CC.tx,fontWeight:700,marginBottom:4}}>Standalone DCF Valuation</div>
    <div style={{fontSize:11,color:CC.dim,marginBottom:20}}>CAPM-based WACC with Gordon Growth terminal value</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
      {[{k:"rf",l:"Risk-Free Rate (%)"},{k:"beta",l:"Beta"},{k:"erp",l:"Equity Risk Premium (%)"},{k:"sp",l:"Size Premium (%)"}].map(f=><div key={f.k}><label style={lbl}>{f.l}</label><input value={inputs[f.k]} onChange={e=>upd(f.k,e.target.value)} style={inp}/></div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
      {[{k:"kd",l:"Cost of Debt (%)"},{k:"debtRatio",l:"Debt/Total Capital (%)"},{k:"taxRate",l:"Tax Rate (%)"}].map(f=><div key={f.k}><label style={lbl}>{f.l}</label><input value={inputs[f.k]} onChange={e=>upd(f.k,e.target.value)} style={inp}/></div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:16}}>
      {[1,2,3,4,5].map(y=><div key={y}><label style={lbl}>Year {y} FCF (£)</label><input value={inputs["cf"+y]} onChange={e=>upd("cf"+y,e.target.value)} style={inp}/></div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr",gap:12,marginBottom:16,maxWidth:200}}>
      <div><label style={lbl}>Terminal Growth (%)</label><input value={inputs.terminalGrowth} onChange={e=>upd("terminalGrowth",e.target.value)} style={inp}/></div>
    </div>
    {result&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
      {[{l:"Ke (CAPM)",v:(result.ke*100).toFixed(2)+"%",c:CC.blu},{l:"WACC",v:(result.waccRate*100).toFixed(2)+"%",c:CC.acc},{l:"Enterprise Value",v:"£"+Math.round(result.enterpriseValue).toLocaleString(),c:CC.grn},{l:"Equity Value",v:"£"+Math.round(result.equityValue).toLocaleString(),c:CC.tl}].map((m,i)=><div key={i} style={{padding:16,borderRadius:10,background:"linear-gradient(135deg,"+m.c+"15,"+m.c+"08)",border:"1px solid "+m.c+"44",textAlign:"center"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:m.c,fontWeight:700}}>{m.v}</div>
        <div style={{fontSize:10,color:CC.dim,fontWeight:600,marginTop:4}}>{m.l}</div>
      </div>)}
    </div>}
  </div>;
}

export function EIRCalc({colors}){
  const CC=colors||C;
  const[inputs,setInputs]=useState({nominal:"1000000",fees:"25000",periods:"5",couponRate:"5"});
  const upd=(k,v)=>setInputs(p=>({...p,[k]:v}));
  const nom=parseFloat(inputs.nominal)||0;const fees=parseFloat(inputs.fees)||0;const periods=parseInt(inputs.periods)||5;const coupon=parseFloat(inputs.couponRate)/100||0.05;
  const cashFlows=Array.from({length:periods},(_, i)=>i<periods-1?nom*coupon:nom*(1+coupon));
  const result=nom>0?calcEIR({nominalAmount:nom,fees,cashFlows}):null;
  const inp={width:"100%",padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.14)",color:CC.tx,fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none"};
  const lbl={fontSize:10,color:CC.acc,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6,display:"block",fontWeight:600};
  return<div>
    <div style={{fontSize:14,color:CC.tx,fontWeight:700,marginBottom:4}}>EIR Calculator — IFRS 9 / FRS 102 s11</div>
    <div style={{fontSize:11,color:CC.dim,marginBottom:20}}>Calculate effective interest rate and amortised cost schedule</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:20}}>
      <div><label style={lbl}>Nominal Amount (£)</label><input value={inputs.nominal} onChange={e=>upd("nominal",e.target.value)} style={inp}/></div>
      <div><label style={lbl}>Transaction Fees (£)</label><input value={inputs.fees} onChange={e=>upd("fees",e.target.value)} style={inp}/></div>
      <div><label style={lbl}>Periods (years)</label><input value={inputs.periods} onChange={e=>upd("periods",e.target.value)} style={inp}/></div>
      <div><label style={lbl}>Coupon Rate (%)</label><input value={inputs.couponRate} onChange={e=>upd("couponRate",e.target.value)} style={inp}/></div>
    </div>
    {result&&<div>
      <div style={{padding:20,borderRadius:12,background:"linear-gradient(135deg,"+CC.acc+"15,"+CC.acc+"08)",border:"1px solid "+CC.acc+"44",textAlign:"center",marginBottom:16}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,color:CC.acc,fontWeight:700}}>{(result.eir*100).toFixed(4)}%</div>
        <div style={{fontSize:11,color:CC.dim,fontWeight:600}}>Effective Interest Rate</div>
      </div>
      <div style={{overflowX:"auto",borderRadius:8,border:"1px solid "+CC.brd}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["Period","Opening Balance (£)","Interest (£)","Cash Flow (£)","Closing Balance (£)"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"10px 12px",background:"rgba(255,255,255,0.08)",borderBottom:"2px solid "+CC.acc+"44",fontSize:10,color:CC.acc,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700}}>{h}</th>)}</tr></thead>
          <tbody>{result.amortisedCostSchedule.map((r,i)=><tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.015)":"transparent"}}>
            <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.acc,fontWeight:600}}>{r.period}</td>
            <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.dim}}>£{Math.round(r.openingBalance).toLocaleString()}</td>
            <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.dim}}>£{Math.round(r.interest).toLocaleString()}</td>
            <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.dim}}>£{Math.round(r.cashFlow).toLocaleString()}</td>
            <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.tx,fontWeight:500}}>£{Math.round(r.closingBalance).toLocaleString()}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>}
  </div>;
}

export function ProvisionUnwindingCalc({colors}){
  const CC=colors||C;
  const[inputs,setInputs]=useState({initial:"500000",rate:"3.5",term:"5"});
  const upd=(k,v)=>setInputs(p=>({...p,[k]:v}));
  const result=parseFloat(inputs.initial)>0?calcProvisionUnwinding({initialProvision:parseFloat(inputs.initial),discountRate:parseFloat(inputs.rate)/100||0.035,term:parseInt(inputs.term)||5}):null;
  const inp={width:"100%",padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.14)",color:CC.tx,fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none"};
  const lbl={fontSize:10,color:CC.acc,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6,display:"block",fontWeight:600};
  return<div>
    <div style={{fontSize:14,color:CC.tx,fontWeight:700,marginBottom:4}}>IAS 37 — Provision Unwinding</div>
    <div style={{fontSize:11,color:CC.dim,marginBottom:20}}>Calculate annual unwinding of discount on long-term provisions</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
      <div><label style={lbl}>Initial Provision (£)</label><input value={inputs.initial} onChange={e=>upd("initial",e.target.value)} style={inp}/></div>
      <div><label style={lbl}>Discount Rate (%)</label><input value={inputs.rate} onChange={e=>upd("rate",e.target.value)} style={inp}/></div>
      <div><label style={lbl}>Term (years)</label><input value={inputs.term} onChange={e=>upd("term",e.target.value)} style={inp}/></div>
    </div>
    {result&&<div style={{overflowX:"auto",borderRadius:8,border:"1px solid "+CC.brd}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr>{["Year","Opening (£)","Unwinding (£)","Closing (£)"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"10px 12px",background:"rgba(255,255,255,0.08)",borderBottom:"2px solid "+CC.acc+"44",fontSize:10,color:CC.acc,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700}}>{h}</th>)}</tr></thead>
        <tbody>{result.schedule.map((r,i)=><tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.015)":"transparent"}}>
          <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.acc,fontWeight:600}}>{r.year}</td>
          <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.dim}}>£{Math.round(r.opening).toLocaleString()}</td>
          <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.org}}>£{Math.round(r.unwinding).toLocaleString()}</td>
          <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.tx,fontWeight:500}}>£{Math.round(r.closing).toLocaleString()}</td>
        </tr>)}</tbody>
      </table>
    </div>}
  </div>;
}

export function LeaseCalc({colors}){
  const CC=colors||C;
  const[inputs,setInputs]=useState({payment:"50000",rate:"5",term:"10",frequency:"annual"});
  const upd=(k,v)=>setInputs(p=>({...p,[k]:v}));
  const pay=parseFloat(inputs.payment)||0;const rate=parseFloat(inputs.rate)/100||0.05;const term=parseInt(inputs.term)||10;
  const result=pay>0?calcIFRS16Lease({payments:pay,rate,term}):null;
  const inp={width:"100%",padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.14)",color:CC.tx,fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none"};
  const lbl={fontSize:10,color:CC.acc,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6,display:"block",fontWeight:600};
  return<div>
    <div style={{fontSize:14,color:CC.tx,fontWeight:700,marginBottom:4}}>IFRS 16 / FRS 102 s20 — Lease Calculator</div>
    <div style={{fontSize:11,color:CC.dim,marginBottom:20}}>Calculate ROU asset, lease liability, and amortisation schedule</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
      <div><label style={lbl}>Annual Payment (£)</label><input value={inputs.payment} onChange={e=>upd("payment",e.target.value)} style={inp}/></div>
      <div><label style={lbl}>Incremental Borrowing Rate (%)</label><input value={inputs.rate} onChange={e=>upd("rate",e.target.value)} style={inp}/></div>
      <div><label style={lbl}>Lease Term (years)</label><input value={inputs.term} onChange={e=>upd("term",e.target.value)} style={inp}/></div>
    </div>
    {result&&<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{padding:20,borderRadius:12,background:"linear-gradient(135deg,"+CC.blu+"15,"+CC.blu+"08)",border:"1px solid "+CC.blu+"44",textAlign:"center"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:CC.blu,fontWeight:700}}>£{Math.round(result.rouAsset).toLocaleString()}</div>
          <div style={{fontSize:11,color:CC.dim,fontWeight:600}}>ROU Asset (Initial)</div>
        </div>
        <div style={{padding:20,borderRadius:12,background:"linear-gradient(135deg,"+CC.org+"15,"+CC.org+"08)",border:"1px solid "+CC.org+"44",textAlign:"center"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:CC.org,fontWeight:700}}>£{Math.round(result.leaseLiability).toLocaleString()}</div>
          <div style={{fontSize:11,color:CC.dim,fontWeight:600}}>Lease Liability (Initial)</div>
        </div>
      </div>
      <div style={{overflowX:"auto",borderRadius:8,border:"1px solid "+CC.brd}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr>{["Period","Opening Liability (£)","Interest (£)","Payment (£)","Closing Liability (£)","ROU NBV (£)","Depreciation (£)"].map((h,i)=><th key={i} style={{textAlign:"left",padding:"10px 12px",background:"rgba(255,255,255,0.08)",borderBottom:"2px solid "+CC.acc+"44",fontSize:10,color:CC.acc,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:700}}>{h}</th>)}</tr></thead>
          <tbody>{result.schedule.map((r,i)=><tr key={i} style={{background:i%2===0?"rgba(255,255,255,0.015)":"transparent"}}>
            <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.acc,fontWeight:600}}>{r.period}</td>
            <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.dim}}>£{Math.round(r.opening).toLocaleString()}</td>
            <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.org}}>£{Math.round(r.interest).toLocaleString()}</td>
            <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.dim}}>£{Math.round(r.payment).toLocaleString()}</td>
            <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.tx,fontWeight:500}}>£{Math.round(r.closing).toLocaleString()}</td>
            <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.blu}}>£{Math.round(r.rouNBV).toLocaleString()}</td>
            <td style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)",color:CC.dim}}>£{Math.round(r.depreciation).toLocaleString()}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>}
  </div>;
}

export function BlackScholesCalc({colors}){
  const CC=colors||C;
  const[inputs,setInputs]=useState({S:"10",K:"10",T:"3",r:"4.5",sigma:"30"});
  const upd=(k,v)=>setInputs(p=>({...p,[k]:v}));
  const S=parseFloat(inputs.S)||0;const K=parseFloat(inputs.K)||0;const T=parseFloat(inputs.T)||0;const r=parseFloat(inputs.r)/100;const sigma=parseFloat(inputs.sigma)/100;
  const result=S>0&&K>0&&T>0?calcBlackScholes({S,K,T,r,sigma}):null;
  const inp={width:"100%",padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.14)",color:CC.tx,fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none"};
  const lbl={fontSize:10,color:CC.acc,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6,display:"block",fontWeight:600};
  return<div>
    <div style={{fontSize:14,color:CC.tx,fontWeight:700,marginBottom:4}}>Black-Scholes — IFRS 2 Share-Based Payment</div>
    <div style={{fontSize:11,color:CC.dim,marginBottom:20}}>Fair value of share options for equity-settled share-based payments</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}}>
      {[{k:"S",l:"Spot Price (£)"},{k:"K",l:"Strike Price (£)"},{k:"T",l:"Time to Expiry (yrs)"},{k:"r",l:"Risk-Free Rate (%)"},{k:"sigma",l:"Volatility (%)"}].map(f=><div key={f.k}><label style={lbl}>{f.l}</label><input value={inputs[f.k]} onChange={e=>upd(f.k,e.target.value)} style={inp}/></div>)}
    </div>
    {result&&<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{padding:20,borderRadius:12,background:"linear-gradient(135deg,"+CC.grn+"15,"+CC.grn+"08)",border:"1px solid "+CC.grn+"44",textAlign:"center"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:CC.grn,fontWeight:700}}>£{result.callValue.toFixed(4)}</div>
          <div style={{fontSize:11,color:CC.dim,fontWeight:600}}>Call Option Value</div>
        </div>
        <div style={{padding:20,borderRadius:12,background:"linear-gradient(135deg,"+CC.red+"15,"+CC.red+"08)",border:"1px solid "+CC.red+"44",textAlign:"center"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:CC.red,fontWeight:700}}>£{result.putValue.toFixed(4)}</div>
          <div style={{fontSize:11,color:CC.dim,fontWeight:600}}>Put Option Value</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
        {[{l:"Delta (Call)",v:result.delta.call.toFixed(4)},{l:"Gamma",v:result.gamma.toFixed(4)},{l:"Theta (Call)",v:result.theta.call.toFixed(4)},{l:"Vega",v:result.vega.toFixed(4)},{l:"Rho (Call)",v:result.rho.call.toFixed(4)}].map((g,i)=><div key={i} style={{padding:10,borderRadius:8,background:CC.card,border:"1px solid "+CC.brd,textAlign:"center"}}>
          <div style={{fontSize:16,color:CC.tx,fontWeight:600}}>{g.v}</div>
          <div style={{fontSize:9,color:CC.fnt,marginTop:2}}>{g.l}</div>
        </div>)}
      </div>
    </div>}
  </div>;
}

export function ECLCalc({colors}){
  const CC=colors||C;
  const[stages,setStages]=useState([{pd:"1.5",lgd:"40",ead:"1000000"},{pd:"10",lgd:"45",ead:"500000"},{pd:"50",lgd:"60",ead:"200000"}]);
  const updStage=(i,k,v)=>setStages(p=>{const n=[...p];n[i]={...n[i],[k]:v};return n;});
  const stageData=stages.map(s=>({pd:parseFloat(s.pd)/100||0,lgd:parseFloat(s.lgd)/100||0,ead:parseFloat(s.ead)||0}));
  const result=calcECL({stages:stageData});
  const inp={width:"100%",padding:"12px 14px",borderRadius:8,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.14)",color:CC.tx,fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none"};
  const lbl={fontSize:10,color:CC.acc,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6,display:"block",fontWeight:600};
  return<div>
    <div style={{fontSize:14,color:CC.tx,fontWeight:700,marginBottom:4}}>IFRS 9 — Expected Credit Loss Model</div>
    <div style={{fontSize:11,color:CC.dim,marginBottom:20}}>Three-stage ECL calculation: PD × LGD × EAD per stage</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:20}}>
      {[0,1,2].map(i=><div key={i} style={{marginBottom:12,background:CC.card,borderRadius:10,padding:16,border:"1px solid "+CC.brd}}>
        <div style={{fontSize:11,color:[CC.grn,CC.org,CC.red][i],fontWeight:700,marginBottom:12,textTransform:"uppercase"}}>Stage {i+1} {["(12-month)","(Lifetime — not impaired)","(Lifetime — impaired)"][i]}</div>
        <div><label style={lbl}>PD (%)</label><input value={stages[i].pd} onChange={e=>updStage(i,"pd",e.target.value)} style={inp}/></div>
        <div style={{marginTop:8}}><label style={lbl}>LGD (%)</label><input value={stages[i].lgd} onChange={e=>updStage(i,"lgd",e.target.value)} style={inp}/></div>
        <div style={{marginTop:8}}><label style={lbl}>EAD (£)</label><input value={stages[i].ead} onChange={e=>updStage(i,"ead",e.target.value)} style={inp}/></div>
        <div style={{marginTop:12,padding:10,borderRadius:6,background:[CC.grn,CC.org,CC.red][i]+"15",textAlign:"center"}}>
          <div style={{fontSize:18,color:[CC.grn,CC.org,CC.red][i],fontWeight:700}}>£{Math.round(result.stageResults[i].ecl).toLocaleString()}</div>
          <div style={{fontSize:9,color:CC.fnt}}>Stage {i+1} ECL</div>
        </div>
      </div>)}
    </div>
    <div style={{padding:20,borderRadius:12,background:"linear-gradient(135deg,"+CC.acc+"15,"+CC.acc+"08)",border:"1px solid "+CC.acc+"44",textAlign:"center"}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,color:CC.acc,fontWeight:700}}>£{Math.round(result.totalECL).toLocaleString()}</div>
      <div style={{fontSize:11,color:CC.dim,fontWeight:600}}>Total ECL Provision</div>
    </div>
  </div>;
}

export function IFRS15RevenueCalc({colors}){
  const CC=colors||C;
  const steps=calcIFRS15Revenue();
  const[expanded,setExpanded]=useState(null);
  return<div>
    <div style={{fontSize:14,color:CC.tx,fontWeight:700,marginBottom:4}}>IFRS 15 — 5-Step Revenue Model</div>
    <div style={{fontSize:11,color:CC.dim,marginBottom:20}}>Contract analysis workbook for revenue recognition assessment</div>
    {steps.steps.map((s,i)=><div key={i} style={{marginBottom:12,background:expanded===i?CC.acc+"12":CC.card,border:"1px solid "+(expanded===i?CC.acc+"44":CC.brd),borderRadius:10,overflow:"hidden",cursor:"pointer"}} onClick={()=>setExpanded(expanded===i?null:i)}>
      <div style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:32,height:32,borderRadius:8,background:CC.acc+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:CC.acc,fontWeight:700}}>{s.step}</div>
        <div style={{flex:1}}><div style={{fontSize:13,color:CC.tx,fontWeight:600}}>{s.title}</div><div style={{fontSize:10,color:CC.fnt}}>{s.guidance}</div></div>
        <span style={{fontSize:10,color:CC.fnt}}>{expanded===i?"▼":"▶"}</span>
      </div>
      {expanded===i&&<div style={{padding:"0 18px 16px",borderTop:"1px solid "+CC.brd}}>
        <div style={{marginTop:12}}><div style={{fontSize:10,color:CC.acc,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Assessment Criteria</div>
          {s.criteria.map((c,ci)=><div key={ci} style={{fontSize:12,color:CC.dim,padding:"6px 0 6px 12px",borderLeft:"2px solid "+CC.acc+"33",marginBottom:4}}>• {c}</div>)}
        </div>
      </div>}
    </div>)}
  </div>;
}
