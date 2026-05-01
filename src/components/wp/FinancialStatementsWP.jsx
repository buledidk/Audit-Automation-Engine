import { useEngagement } from "../../context/EngagementContext";
import { useAuditHelpers } from "../../hooks/useAuditHelpers";
import { C } from "../../data";

export default function FinancialStatementsWP({ wp }) {
  const { cfg } = useEngagement();
  const { _BoundET, _ST } = useAuditHelpers();

    if(wp.id==="fs1"){const isIFRS=cfg.framework==="ifrs";return<div><ST t={"Income Statement — "+(isIFRS?"IAS 1":"FRS 102 s5")} color={"#00838F"}/>
      <BoundET id="fs1" headers={["Line Item","Note","CY (£)","PY (£)","Movement","WP Ref"]} rows={[
        ["Revenue","",""," ","","D1"],["Cost of sales","","","","","D3"],["Gross profit","","","","",""],
        ["Distribution costs","","","","","D5"],["Administrative expenses","","","","","D5"],
        ["Other operating income","","","","","D1"],["Operating profit/(loss)","","","","",""],
        ["Finance income","","","","","D6"],["Finance costs","","","","","D11"],
        ["Profit/(loss) before tax","","","","",""],["Tax on profit/(loss)","","","","","D13"],
        ["Profit/(loss) for the financial year","","","","",""]
      ].map(r=>[<span style={{color:C.tx,fontWeight:r[0].includes("profit")||r[0].includes("Profit")||r[0].includes("loss")?700:400}}>{r[0]}</span>,...r.slice(1)])} editable={[1,2,3,4,5]}/>
    </div>}
    if(wp.id==="fs2"){return<div><ST t={"Balance Sheet — "+(cfg.framework==="ifrs"?"IAS 1":"FRS 102 s4")} color={"#00838F"}/>
      <BoundET id="fs2" headers={["Line Item","Note","CY (£)","PY (£)","Movement","WP Ref"]} rows={[
        ["Fixed assets","","","","",""],["Intangible assets","","","","","D8"],["Tangible assets","","","","","D7"],
        ["Investments","","","","","D9"],["","","","","",""],
        ["Current assets","","","","",""],["Stocks","","","","","D3"],["Debtors","","","","","D2"],
        ["Cash at bank and in hand","","","","","D6"],["","","","","",""],
        ["Creditors: amounts falling due within one year","","","","","D4"],
        ["Net current assets/(liabilities)","","","","",""],["Total assets less current liabilities","","","","",""],
        ["Creditors: amounts falling due after more than one year","","","","","D11"],
        ["Provisions for liabilities","","","","","D12"],["","","","","",""],
        ["Net assets","","","","",""],["","","","","",""],
        ["Capital and reserves","","","","",""],["Called up share capital","","","","","D10"],
        ["Share premium account","","","","","D10"],["Profit and loss account","","","","","D10"],
        ["Shareholders' funds","","","","",""]
      ].map(r=>[<span style={{color:C.tx,fontWeight:r[0].includes("Net")||r[0].includes("Total")||r[0]==="Shareholders' funds"?700:r[0]===""?300:400}}>{r[0]}</span>,...r.slice(1)])} editable={[1,2,3,4,5]}/>
    </div>}
    if(wp.id==="fs3"){return<div><ST t={"Statement of Changes in Equity — "+(cfg.framework==="ifrs"?"IAS 1":"FRS 102 s6")} color={"#00838F"}/>
      <BoundET id="fs3" headers={["","Share Capital (£)","Share Premium (£)","Retained Earnings (£)","Other Reserves (£)","Total (£)","WP Ref"]} rows={[
        ["Balance at start of year","","","","","","D10"],["Profit/(loss) for the year","","","","","","FS1"],
        ["Dividends paid","","","","","","D10"],["Share issues","","","","","","D10"],
        ["Other comprehensive income","","","","","",""],["Balance at end of year","","","","","","D10"]
      ].map(r=>[<span style={{color:C.tx,fontWeight:r[0].includes("Balance")?700:400}}>{r[0]}</span>,...r.slice(1)])} editable={[1,2,3,4,5,6]}/>
    </div>}
    if(wp.id==="fs4"){return<div><ST t={"Cash Flow Statement — "+(cfg.framework==="ifrs"?"IAS 7":"FRS 102 s7")} color={"#00838F"}/>
      <BoundET id="fs4" headers={["Line Item","Note","CY (£)","PY (£)","WP Ref"]} rows={[
        ["Cash flows from operating activities","","","",""],["Profit/(loss) for the year","","","","FS1"],
        ["Adjustments for:","","","",""],["Depreciation of tangible assets","","","","D7"],
        ["Amortisation of intangible assets","","","","D8"],["Finance costs","","","","D11"],
        ["Finance income","","","","D6"],["Tax expense","","","","D13"],
        ["(Increase)/decrease in stocks","","","","D3"],["(Increase)/decrease in debtors","","","","D2"],
        ["Increase/(decrease) in creditors","","","","D4"],["Cash generated from operations","","","",""],
        ["Tax paid","","","","D13"],["Net cash from operating activities","","","",""],
        ["","","","",""],["Cash flows from investing activities","","","",""],
        ["Purchase of tangible assets","","","","D7"],["Purchase of intangible assets","","","","D8"],
        ["Proceeds from sale of assets","","","","D7"],["Net cash from investing activities","","","",""],
        ["","","","",""],["Cash flows from financing activities","","","",""],
        ["Proceeds from borrowings","","","","D11"],["Repayment of borrowings","","","","D11"],
        ["Dividends paid","","","","D10"],["Net cash from financing activities","","","",""],
        ["","","","",""],["Net increase/(decrease) in cash","","","",""],
        ["Cash at beginning of year","","","","D6"],["Cash at end of year","","","","D6"]
      ].map(r=>[<span style={{color:C.tx,fontWeight:r[0].includes("Net cash")||r[0].includes("Cash at")||r[0].includes("Cash generated")?700:r[0]===""?300:400}}>{r[0]}</span>,...r.slice(1)])} editable={[1,2,3,4]}/>
    </div>}

  return null;
}
