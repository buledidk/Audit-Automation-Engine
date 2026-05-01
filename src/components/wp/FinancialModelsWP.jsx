import { useEngagement } from "../../context/EngagementContext";
import { C } from "../../data";

export default function FinancialModelsWP({ wp }) {
  const { fmUIMod } = useEngagement();
  if(wp.id==="fm1")return<div><ImpairmentDCFCalc colors={C}/></div>;
  if(wp.id==="fm2")return<div><StandaloneDCFCalc colors={C}/></div>;
  if(wp.id==="fm3")return<div><EIRCalc colors={C}/></div>;
  if(wp.id==="fm4")return<div><ProvisionUnwindingCalc colors={C}/></div>;
  if(wp.id==="fm5")return<div><LeaseCalc colors={C}/></div>;
  if(wp.id==="fm6")return<div><BlackScholesCalc colors={C}/></div>;
  if(wp.id==="fm7")return<div><ECLCalc colors={C}/></div>;
  if(wp.id==="fm8")return<div><IFRS15RevenueCalc colors={C}/></div>;
  // Extended financial models (fm9-fm18) — lazy loaded
  if(wp.id.startsWith("fm")&&parseInt(wp.id.slice(2))>=9){
    if(!fmUIMod)return<div style={{color:C.dim,padding:20}}>Loading financial model...</div>;
    const fmMap={fm9:"ImpairmentSensitivityCalc",fm10:"ECLProvisionMatrixCalc",fm11:"LeaseEnhancedCalc",fm12:"SBPCalc",fm13:"EIRAmortisedCostCalc",fm14:"BondValuationCalc",fm15:"PropertyValuationCalc",fm16:"PensionDBOCalc",fm17:"GoodwillImpairmentCalc",fm18:"DeferredTaxCalc"};
    const CompName=fmMap[wp.id];
    const Comp=CompName?fmUIMod[CompName]:null;
    if(Comp)return<div><Comp colors={C}/></div>;
  }
  return null;
}
