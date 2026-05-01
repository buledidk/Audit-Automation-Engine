import { useAuditHelpers } from "../../hooks/useAuditHelpers";

export default function RegulatoryWP({ wp }) {
  const { _BoundET, _ST } = useAuditHelpers();

    if(wp.id==="reg1")return<div><ST t="Companies House Compliance — CA 2006" color={"#37474F"}/>
      <BoundET id="reg1" headers={["Requirement","Deadline","Status","Evidence","Comment"]} rows={[
        ["Annual accounts filing (s441)","9 months from FYE (private) / 6 months (public)","","",""],
        ["Confirmation statement (s853A)","14 days from review date","","",""],
        ["PSC register (s790M)","Maintain and file changes within 14 days","","",""],
        ["Registered office / SAIL (s87)","Notify changes within 14 days","","",""],
        ["Director appointments/resignations (s167)","14 days of change","","",""],
        ["Allotment of shares (s555)","Within 1 month","","",""],
        ["Special resolutions (s29-30)","15 days of passing","","",""],
        ["Charges register (s859A)","21 days of creation","","",""],
        ["Significant control changes","14 days of change","","",""],
        ["Annual return (micro/small exemptions)","Verify eligibility annually","","",""]
      ]} editable={[2,3,4]}/>
    </div>;
    if(wp.id==="reg2")return<div><ST t="HMRC Compliance" color={"#37474F"}/>
      <BoundET id="reg2" headers={["Tax/Return","Deadline","Status","Amount","Reference","Comment"]} rows={[
        ["CT600 Corporation Tax Return","12 months from period end","","","",""],
        ["Corporation Tax Payment","9 months + 1 day from period end","","","",""],
        ["CT61 (income tax on company payments)","14 days from end of quarter","","","",""],
        ["PAYE RTI — FPS","On or before each payment date","","","",""],
        ["PAYE RTI — EPS","Monthly by 19th","","","",""],
        ["P11D Benefits & expenses","6 July following tax year","","","",""],
        ["VAT Returns (quarterly)","1 month + 7 days from period end","","","",""],
        ["CIS Monthly Return","19th of following month","","","",""],
        ["Annual accounts to HMRC","12 months from period end","","","",""],
        ["iXBRL tagging","All CT600 filings","","","",""],
        ["R&D Tax Credit claim","2 years from period end","","","",""],
        ["Capital allowances","Claimed via CT600","","","",""]
      ]} editable={[2,3,4,5]}/>
    </div>;
    if(wp.id==="reg3")return<div><ST t="FCA Compliance — Financial Services" color={"#37474F"}/>
      <BoundET id="reg3" headers={["Requirement","Frequency","Deadline","Status","Evidence","Comment"]} rows={[
        ["SUP 16 — Regulatory returns (Gabriel/RegData)","Varies by firm type","Per schedule","","",""],
        ["CASS 7 — Client money reconciliation","Daily","T+1","","",""],
        ["CASS 7 — Client money report to FCA","Annual","Per FCA notification","","",""],
        ["Capital adequacy reporting","Quarterly/Annual","Per schedule","","",""],
        ["ICARA (investment firms) / ICAAP (banks)","Annual","Internal deadline","","",""],
        ["FIN returns (balance sheet)","Quarterly","20 business days","","",""],
        ["AML — Annual MLRO report","Annual","Internal deadline","","",""],
        ["Complaints reporting","Bi-annual","Per FCA schedule","","",""],
        ["SM&CR — Annual fitness & propriety","Annual","Internal deadline","","",""],
        ["MIFIDPRU public disclosure (if applicable)","Annual","Per FCA schedule","","",""]
      ]} editable={[3,4,5]}/>
    </div>;
    if(wp.id==="reg4")return<div><ST t="Charity Commission Compliance" color={"#37474F"}/>
      <BoundET id="reg4" headers={["Requirement","Deadline","Status","Evidence","Comment"]} rows={[
        ["Annual return to Charity Commission","10 months from FYE","","",""],
        ["Accounts filing (income > £25k)","10 months from FYE","","",""],
        ["Audit requirement (income > £1m or assets > £3.26m + income > £250k)","Filed with annual return","","",""],
        ["Serious incident reporting (SIR)","As soon as reasonably possible","","",""],
        ["CC3 — Trustee responsibilities (acknowledge)","Ongoing","","",""],
        ["Trustee Annual Declaration of Interests","Annual","","",""],
        ["Charity governance code compliance","Annual review","","",""],
        ["Fundraising Standards Board compliance","Ongoing","","",""],
        ["Gift Aid claims to HMRC","Quarterly recommended","","",""],
        ["Data protection registration (if applicable)","Annual renewal","","",""]
      ]} editable={[2,3,4]}/>
    </div>;

  return null;
}
