import { useState } from "react";
import {
  Building2, Shield, Users, CreditCard, Database, Key,
  CheckCircle2, XCircle, Plus, Pencil, Trash2, Save, Wifi, WifiOff
} from "lucide-react";

const DEMO_FIRM = {
  name: "Indus Nexus Audit LLP",
  registrationNumber: "OC123456",
  address: "42 Chancery Lane, London WC2A 1PL",
  phone: "+44 20 7946 0958",
  email: "audit@indusnexus.co.uk",
  website: "www.indusnexus.co.uk",
  rsb: "ICAEW",
  firmNumber: "C001234567",
  dpaReference: "ZA123456",
  mlsNumber: "12345678",
};

const DEMO_PARTNERS = [
  { id: 1, name: "James Parker", email: "jp@indusnexus.co.uk", rsb: "ICAEW", memberNo: "12345678", ri: true, roles: ["Partner", "MLRO"] },
  { id: 2, name: "Helen Cross", email: "hc@indusnexus.co.uk", rsb: "ICAEW", memberNo: "23456789", ri: false, roles: ["Partner", "Ethics"] },
  { id: 3, name: "Raj Patel", email: "rp@indusnexus.co.uk", rsb: "ACCA", memberNo: "34567890", ri: true, roles: ["Partner", "Quality"] },
];

const DEMO_TEAM = [
  { id: 1, name: "Sarah Khan", email: "sk@indusnexus.co.uk", role: "Manager", status: "active" },
  { id: 2, name: "Robert Miles", email: "rm@indusnexus.co.uk", role: "Senior Auditor", status: "active" },
  { id: 3, name: "Alice Wong", email: "aw@indusnexus.co.uk", role: "Audit Assistant", status: "active" },
  { id: 4, name: "David Chen", email: "dc@indusnexus.co.uk", role: "Audit Assistant", status: "active" },
  { id: 5, name: "Lisa Thompson", email: "lt@indusnexus.co.uk", role: "Senior Auditor", status: "active" },
  { id: 6, name: "Tom Jones", email: "tj@indusnexus.co.uk", role: "Audit Assistant", status: "inactive" },
];

const SUBSCRIPTION_TIERS = [
  { tier: "Solo", price: "£99/mo", annual: "£990/yr", users: 1, engagements: 20, ai: false, portal: false, current: false },
  { tier: "Small Firm", price: "£499/mo", annual: "£4,990/yr", users: 10, engagements: 100, ai: true, portal: true, current: true },
  { tier: "Mid-Tier", price: "£1,999/mo", annual: "£19,990/yr", users: 50, engagements: 500, ai: true, portal: true, current: false },
  { tier: "Enterprise", price: "Custom", annual: "£49,990/yr", users: "Unlimited", engagements: "Unlimited", ai: true, portal: true, current: false },
];

export default function SettingsFirmSetup() {
  const [firm, setFirm] = useState(DEMO_FIRM);
  const [supabaseConnected, setSupabaseConnected] = useState(true);
  const [apiKeys, _setApiKeys] = useState([
    { id: 1, name: "Production API Key", key: "ae_live_**********************3f9a", created: "2026-01-15", lastUsed: "2026-03-31" },
    { id: 2, name: "Development API Key", key: "ae_test_**********************8b2c", created: "2026-02-01", lastUsed: "2026-03-28" },
  ]);

  return (
    <div className="min-h-screen bg-ae-bg p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-white">Settings</h1>
        <p className="text-ae-dim text-sm mt-1">Firm registration, licensing, team management, and platform configuration</p>
      </div>

      <Tabs defaultValue="firm" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 max-w-3xl">
          <TabsTrigger value="firm">Firm</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="subscription">Plan</TabsTrigger>
          <TabsTrigger value="connection">Database</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        {/* Firm Registration Tab */}
        <TabsContent value="firm">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Firm Registration
              </CardTitle>
              <CardDescription>From enterpriseIdentitySystem — firm identity and regulatory registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Firm Name</Label>
                  <Input value={firm.name} onChange={(e) => setFirm({ ...firm, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input value={firm.registrationNumber} onChange={(e) => setFirm({ ...firm, registrationNumber: e.target.value })} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Registered Address</Label>
                  <Input value={firm.address} onChange={(e) => setFirm({ ...firm, address: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={firm.phone} onChange={(e) => setFirm({ ...firm, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={firm.email} onChange={(e) => setFirm({ ...firm, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={firm.website} onChange={(e) => setFirm({ ...firm, website: e.target.value })} />
                </div>
              </div>

              <div className="border-t border-ae-border mt-6 pt-6">
                <h3 className="text-sm font-semibold text-white mb-4">Regulatory Registrations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Recognised Supervisory Body (RSB)</Label>
                    <Select value={firm.rsb} onValueChange={(v) => setFirm({ ...firm, rsb: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ICAEW">ICAEW</SelectItem>
                        <SelectItem value="ACCA">ACCA</SelectItem>
                        <SelectItem value="ICAS">ICAS</SelectItem>
                        <SelectItem value="CAI">Chartered Accountants Ireland</SelectItem>
                        <SelectItem value="AAPA">AAPA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Firm Registration Number</Label>
                    <Input value={firm.firmNumber} onChange={(e) => setFirm({ ...firm, firmNumber: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>ICO DPA Reference</Label>
                    <Input value={firm.dpaReference} onChange={(e) => setFirm({ ...firm, dpaReference: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>HMRC MLR Number</Label>
                    <Input value={firm.mlsNumber} onChange={(e) => setFirm({ ...firm, mlsNumber: e.target.value })} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Partner Licensing
                </CardTitle>
                <CardDescription>RSB membership, RI status, and roles</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-3 w-3" /> Add Partner
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DEMO_PARTNERS.map((partner) => (
                  <div key={partner.id} className="p-4 rounded-lg border border-ae-border bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{partner.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{partner.name}</div>
                        <div className="text-[10px] text-ae-dim">{partner.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {partner.roles.map((role) => (
                          <Badge key={role} variant="outline" className="text-[10px]">{role}</Badge>
                        ))}
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-3 pl-14">
                      <div>
                        <div className="text-[10px] text-ae-dim">RSB</div>
                        <div className="text-xs text-slate-200">{partner.rsb}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-ae-dim">Membership No.</div>
                        <div className="text-xs text-slate-200 font-mono">{partner.memberNo}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-ae-dim">RI Status</div>
                        <Badge variant={partner.ri ? "success" : "secondary"} className="text-[10px]">
                          {partner.ri ? "Responsible Individual" : "Non-RI"}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-[10px] text-ae-dim">Status</div>
                        <Badge variant="success" className="text-[10px]">Active</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Management Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" /> Team Management
                </CardTitle>
                <CardDescription>{DEMO_TEAM.filter((t) => t.status === "active").length} active users</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-3 w-3" /> Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ae-border">
                      <th className="text-left py-3 text-xs text-brand uppercase tracking-wider font-semibold">Name</th>
                      <th className="text-left py-3 text-xs text-brand uppercase tracking-wider font-semibold">Email</th>
                      <th className="text-left py-3 text-xs text-brand uppercase tracking-wider font-semibold">Role</th>
                      <th className="text-center py-3 text-xs text-brand uppercase tracking-wider font-semibold">Status</th>
                      <th className="text-right py-3 text-xs text-brand uppercase tracking-wider font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_TEAM.map((member) => (
                      <tr key={member.id} className="border-b border-ae-border/50 hover:bg-white/[0.03]">
                        <td className="py-3 text-slate-200 font-medium">{member.name}</td>
                        <td className="py-3 text-ae-dim text-xs">{member.email}</td>
                        <td className="py-3"><Badge variant="secondary" className="text-[10px]">{member.role}</Badge></td>
                        <td className="py-3 text-center">
                          <Badge variant={member.status === "active" ? "success" : "secondary"} className="text-[10px]">
                            {member.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7">
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-ae-red hover:text-ae-red">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUBSCRIPTION_TIERS.map((plan) => (
              <Card key={plan.tier} className={plan.current ? "border-brand ring-1 ring-brand" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{plan.tier}</CardTitle>
                    {plan.current && <Badge>Current</Badge>}
                  </div>
                  <div className="text-2xl font-bold text-white mt-2">{plan.price}</div>
                  <div className="text-[10px] text-ae-dim">{plan.annual}</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-ae-green" />
                      <span className="text-slate-300">{plan.users} users</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-ae-green" />
                      <span className="text-slate-300">{plan.engagements} engagements</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {plan.ai ? (
                        <CheckCircle2 className="h-4 w-4 text-ae-green" />
                      ) : (
                        <XCircle className="h-4 w-4 text-ae-dim" />
                      )}
                      <span className={plan.ai ? "text-slate-300" : "text-ae-dim"}>AI Agents (8 engines)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {plan.portal ? (
                        <CheckCircle2 className="h-4 w-4 text-ae-green" />
                      ) : (
                        <XCircle className="h-4 w-4 text-ae-dim" />
                      )}
                      <span className={plan.portal ? "text-slate-300" : "text-ae-dim"}>Client Portal</span>
                    </div>
                    {plan.tier === "Enterprise" && (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-ae-green" />
                          <span className="text-slate-300">SSO & white-label</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-ae-green" />
                          <span className="text-slate-300">On-premise option</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.current ? "secondary" : "outline"}
                    className="w-full"
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : plan.tier === "Enterprise" ? "Contact Sales" : "Upgrade"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Database Connection Tab */}
        <TabsContent value="connection">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4" /> Supabase Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-ae-border bg-white/[0.02]">
                  {supabaseConnected ? (
                    <Wifi className="h-6 w-6 text-ae-green" />
                  ) : (
                    <WifiOff className="h-6 w-6 text-ae-red" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      {supabaseConnected ? "Connected" : "Disconnected"}
                    </div>
                    <div className="text-[10px] text-ae-dim">
                      {supabaseConnected ? "Supabase PostgreSQL — real-time sync active" : "Falling back to localStorage"}
                    </div>
                  </div>
                  <Badge variant={supabaseConnected ? "success" : "destructive"}>
                    {supabaseConnected ? "Online" : "Offline"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Supabase URL</Label>
                    <Input type="text" placeholder="https://xxxxx.supabase.co" defaultValue="https://******.supabase.co" />
                  </div>
                  <div className="space-y-2">
                    <Label>Anon Key</Label>
                    <Input type="password" placeholder="eyJ..." defaultValue="eyJ************************" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-ae-border text-center">
                    <div className="text-lg font-bold text-white">5</div>
                    <div className="text-[10px] text-ae-dim">Tables</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-ae-border text-center">
                    <div className="text-lg font-bold text-white">12</div>
                    <div className="text-[10px] text-ae-dim">RLS Policies</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-ae-border text-center">
                    <div className="text-lg font-bold text-white">2.4MB</div>
                    <div className="text-[10px] text-ae-dim">DB Size</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-ae-border text-center">
                    <div className="text-lg font-bold text-white">99.9%</div>
                    <div className="text-[10px] text-ae-dim">Uptime</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" onClick={() => setSupabaseConnected(!supabaseConnected)}>
                Test Connection
              </Button>
              <Button className="gap-2">
                <Save className="h-4 w-4" /> Save
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4" /> API Keys
                </CardTitle>
                <CardDescription>Manage API keys for external integrations</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-3 w-3" /> Generate Key
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiKeys.map((ak) => (
                  <div key={ak.id} className="flex items-center gap-4 p-4 rounded-lg border border-ae-border bg-white/[0.02]">
                    <Key className="h-4 w-4 text-ae-dim" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{ak.name}</div>
                      <div className="font-mono text-xs text-ae-dim mt-0.5">{ak.key}</div>
                    </div>
                    <div className="text-right text-[10px] text-ae-dim">
                      <div>Created: {ak.created}</div>
                      <div>Last used: {ak.lastUsed}</div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-ae-red hover:text-ae-red">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
