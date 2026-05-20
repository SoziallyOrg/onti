"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar as CalendarIcon,
  FileText,
  Package,
  MessageSquare,
  BarChart3,
  UserCheck,
  Crown,
  Check,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  Printer,
  Smartphone,
  CheckCircle,
  X,
  Download
} from "lucide-react";
import Link from "next/link";

type Appointment = {
  id: number;
  time: string;
  plate: string;
  service: string;
};

type StockItem = {
  id: number;
  name: string;
  qty: number;
  min: number;
  unit: string;
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 1, time: "09:00", plate: "1-ABC-123", service: "Groot onderhoud" },
  { id: 2, time: "11:30", plate: "2-XYZ-987", service: "Remschijven" },
  { id: 3, time: "14:00", plate: "1-TUV-888", service: "Bandenwissel" },
];

const INITIAL_STOCK: StockItem[] = [
  { id: 1, name: "Castrol EDGE 5W-30", qty: 45, min: 10, unit: "L" },
  { id: 2, name: "Oliefilter Type B", qty: 6, min: 5, unit: "stuks" },
  { id: 3, name: "Remschijven Brembo", qty: 2, min: 3, unit: "sets" },
];

export default function PremiumPage() {
  // 1. Calendar State
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [newPlate, setNewPlate] = useState("");
  const [newTime, setNewTime] = useState("10:00");
  const [newService, setNewService] = useState("Olie verversen");

  // 2. Stock State
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK);

  // 3. SMS Simulator State
  const [smsName, setSmsName] = useState("Peter");
  const [smsPlate, setSmsPlate] = useState("1-VRO-456");
  const [smsService, setSmsService] = useState("Bandenwissel");
  const [smsPrice, setSmsPrice] = useState("145,00");
  const [smsSent, setSmsSent] = useState(false);
  const [smsAnimating, setSmsAnimating] = useState(false);

  // 4. Invoicing State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceKlant, setInvoiceKlant] = useState("BVBA Janssens");
  const [invoicePlate, setInvoicePlate] = useState("1-ABC-123");
  const [invoiceService, setInvoiceService] = useState("Groot onderhoud & Filters");
  const [invoiceAmount, setInvoiceAmount] = useState("380,00");

  // 5. Analytics State
  const [analyticsYear, setAnalyticsYear] = useState<"2025" | "2026">("2026");

  // 6. Portal Simulator State
  const [showPortalModal, setShowPortalModal] = useState(false);
  const [portalPlateInput, setPortalPlateInput] = useState("1-ABC-123");
  const [portalLoggedIn, setPortalLoggedIn] = useState(false);
  const [portalLoggingIn, setPortalLoggingIn] = useState(false);

  // Helpers
  const addAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const plateToUse = newPlate.trim() || "1-VRO-456";
    const serviceToUse = newService.trim() || "Olie verversen";
    const item: Appointment = {
      id: Date.now(),
      time: newTime,
      plate: plateToUse.toUpperCase(),
      service: serviceToUse,
    };
    
    setAppointments((prev) => [...prev, item].sort((a, b) => a.time.localeCompare(b.time)));
    
    // Auto-populate other widgets to show the connected user flow
    setSmsPlate(plateToUse.toUpperCase());
    setSmsService(serviceToUse);
    setInvoicePlate(plateToUse.toUpperCase());
    setInvoiceService(serviceToUse);
    
    setNewPlate("");
  };

  const consumeStock = (id: number) => {
    setStock(
      stock.map((item) => {
        if (item.id === id) {
          return { ...item, qty: Math.max(0, item.qty - 1) };
        }
        return item;
      })
    );
  };

  const triggerSmsSimulation = () => {
    setSmsAnimating(true);
    setSmsSent(false);
    
    // Play a retro computer beep
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Audio context block protection
    }

    setTimeout(() => {
      setSmsAnimating(false);
      setSmsSent(true);
    }, 800);
  };

  const resetAllDemos = () => {
    setAppointments(INITIAL_APPOINTMENTS);
    setStock(INITIAL_STOCK);
    setSmsSent(false);
    setAnalyticsYear("2026");
    setShowPortalModal(false);
    setPortalLoggedIn(false);
  };

  return (
    <main className="w-full px-4 md:px-8 lg:px-12 py-8">
      <div className="flex justify-between items-center mb-4">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link href="/">← Dashboard</Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetAllDemos}
          className="h-8 text-sm inline-flex items-center gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Demo Herstellen
        </Button>
      </div>

      <header className="mb-8">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-warning/10 border border-warning/20">
            <Crown className="h-6 w-6 text-warning" />
          </span>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Onti Pro Live Demo's
              <span className="text-sm font-semibold px-2.5 py-0.5 bg-warning/10 border border-warning/20 text-warning rounded-full">
                Interactief
              </span>
            </h1>
            <p className="text-fg-subtle mt-1 text-sm md:text-base">
              Klik op de knoppen en voeg mock-data toe om de werking van premium modules live te testen.
            </p>
          </div>
        </div>
      </header>

      {/* Grid of Interactive Modules */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        
        {/* 1. Interactive Scheduler */}
        <Card className="flex flex-col h-full border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-warning text-warning-fg text-[10px] font-bold px-2.5 py-1 rounded-bl flex items-center gap-1 uppercase tracking-wider">
            <Crown className="h-3 w-3" /> Pro
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Afspraken & Planning
            </CardTitle>
            <p className="text-sm text-fg-subtle">
              Plan live een afspraak in en zie het direct verschijnen op de dag-as.
            </p>
          </CardHeader>
          <div className="flex-1 px-6 pb-6 pt-2 space-y-4">
            
            {/* Live calendar list */}
            <div className="rounded border border-border bg-muted/30 p-3 space-y-2 text-sm max-h-[180px] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border/50 pb-2 text-fg-subtle font-medium sticky top-0 bg-muted/90 backdrop-blur-sm">
                <span className="text-sm font-semibold">Vandaag</span>
                <span className="text-xs text-success font-semibold">{appointments.length} afspraken</span>
              </div>
              <div className="space-y-2 pt-1">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between rounded bg-bg border border-border/80 p-2.5 shadow-sm animate-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-primary font-bold text-sm">{apt.time}</span>
                      <span className="text-fg font-semibold font-mono text-sm">{apt.plate}</span>
                    </div>
                    <span className="text-fg-subtle text-xs max-w-[120px] truncate">{apt.service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={addAppointment} className="space-y-3 border-t border-border/50 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-fg-subtle font-semibold block mb-1">Nummerplaat</label>
                  <Input
                    size={1}
                    placeholder="1-VRO-456"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    className="h-9 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-fg-subtle font-semibold block mb-1">Tijdstip</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full h-9 rounded border border-border bg-bg px-2 text-sm"
                  >
                    <option value="08:00">08:00 uur</option>
                    <option value="10:00">10:00 uur</option>
                    <option value="13:00">13:00 uur</option>
                    <option value="15:30">15:30 uur</option>
                    <option value="16:45">16:45 uur</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Bijv. Olie verversen"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="h-9 text-sm flex-1"
                />
                <Button type="submit" size="sm" className="h-9 px-4 text-sm inline-flex items-center gap-1.5 shrink-0">
                  <Plus className="h-4 w-4" /> Plan
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* 2. Interactive Invoicing */}
        <Card className="flex flex-col h-full border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-warning text-warning-fg text-[10px] font-bold px-2.5 py-1 rounded-bl flex items-center gap-1 uppercase tracking-wider">
            <Crown className="h-3 w-3" /> Pro
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Facturatiekoppeling
            </CardTitle>
            <p className="text-sm text-fg-subtle">
              Simuleer het genereren en exporteren van een PDF onderhoudsfactuur.
            </p>
          </CardHeader>
          <div className="flex-1 px-6 pb-6 pt-2 space-y-4">
            
            {/* Live form to compile invoice */}
            <div className="space-y-3 border border-border/80 bg-muted/20 p-3 rounded">
              <div>
                <label className="text-xs text-fg-subtle font-semibold block mb-1">Klantnaam</label>
                <Input
                  value={invoiceKlant}
                  onChange={(e) => setInvoiceKlant(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-fg-subtle font-semibold block mb-1">Nummerplaat</label>
                  <Input
                    value={invoicePlate}
                    onChange={(e) => setInvoicePlate(e.target.value)}
                    className="h-9 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-fg-subtle font-semibold block mb-1">Bedrag (€)</label>
                  <Input
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowInvoiceModal(true)}
              variant="outline"
              size="md"
              className="w-full text-sm inline-flex items-center justify-center gap-2 h-10 border-primary/20 text-primary hover:bg-primary/5"
            >
              <Play className="h-4 w-4 fill-current" />
              Genereer Factuur Voorbeeld
            </Button>
          </div>
        </Card>

        {/* 3. Interactive Stock Management */}
        <Card className="flex flex-col h-full border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-warning text-warning-fg text-[10px] font-bold px-2.5 py-1 rounded-bl flex items-center gap-1 uppercase tracking-wider">
            <Crown className="h-3 w-3" /> Pro
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Voorraadbeheer & Alerts
            </CardTitle>
            <p className="text-sm text-fg-subtle">
              Klik op 'Verbruik' om onderdelen te verminderen en test lage voorraad alerts.
            </p>
          </CardHeader>
          <div className="flex-1 px-6 pb-6 pt-2 space-y-4">
            
            {/* Stock list with triggers */}
            <div className="space-y-2">
              {stock.map((item) => {
                const isLow = item.qty < item.min;
                return (
                  <div key={item.id} className="flex justify-between items-center bg-bg p-3 rounded border border-border/80 shadow-sm">
                    <div>
                      <p className="font-semibold text-fg text-sm">{item.name}</p>
                      <p className="text-xs text-fg-subtle mt-0.5">Drempel: {item.min} {item.unit}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-sm ${
                        isLow ? "bg-danger/10 text-danger border border-danger/20" : "bg-success/10 text-success"
                      }`}>
                        {item.qty} {item.unit}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => consumeStock(item.id)}
                        className="h-8 text-xs px-2.5 border border-border hover:bg-muted"
                      >
                        Verbruik
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {stock.some(i => i.qty < i.min) && (
              <div className="flex items-center gap-2 bg-danger/5 border border-danger/20 text-danger text-sm p-3 rounded animate-bounce">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>Kritieke voorraad! E-mail bestelvoorstel automatisch klaargezet.</span>
              </div>
            )}
          </div>
        </Card>

        {/* 4. Interactive SMS Simulator */}
        <Card className="flex flex-col h-full border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-warning text-warning-fg text-[10px] font-bold px-2.5 py-1 rounded-bl flex items-center gap-1 uppercase tracking-wider">
            <Crown className="h-3 w-3" /> Pro
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              SMS Herinneringen
            </CardTitle>
            <p className="text-sm text-fg-subtle">
              Typ uw testgegevens en simuleer de directe ontvangst op een mobiele telefoon.
            </p>
          </CardHeader>
          <div className="flex-1 px-6 pb-6 pt-2 space-y-4">
            
            {/* Input Configurator */}
            <div className="grid grid-cols-2 gap-2 border border-border/60 bg-muted/20 p-3 rounded">
              <div>
                <label className="text-xs text-fg-subtle font-semibold block mb-1">Klantnaam</label>
                <Input
                  value={smsName}
                  onChange={(e) => setSmsName(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-fg-subtle font-semibold block mb-1">Kostprijs (€)</label>
                <Input
                  value={smsPrice}
                  onChange={(e) => setSmsPrice(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <Button
              onClick={triggerSmsSimulation}
              disabled={smsAnimating}
              size="md"
              className="w-full text-sm h-10"
            >
              {smsAnimating ? "Verzenden..." : "Simuleer SMS Verzenden 📱"}
            </Button>

            {/* iPhone Mockup */}
            <div className="flex justify-center">
              {/* Phone outer shell — realistic iPhone 15 proportions (roughly 9:19.5 ratio) */}
              <div className="relative w-[200px] h-[430px] rounded-[40px] bg-[#1a1a1a] shadow-[0_0_0_2px_#3a3a3a,0_20px_56px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden p-[3px]">

                {/* Side buttons */}
                <div className="absolute left-[-3px] top-[80px] w-[3px] h-[24px] bg-[#2a2a2a] rounded-l-sm" />
                <div className="absolute left-[-3px] top-[116px] w-[3px] h-[40px] bg-[#2a2a2a] rounded-l-sm" />
                <div className="absolute left-[-3px] top-[164px] w-[3px] h-[40px] bg-[#2a2a2a] rounded-l-sm" />
                <div className="absolute right-[-3px] top-[120px] w-[3px] h-[52px] bg-[#2a2a2a] rounded-r-sm" />

                {/* Screen */}
                <div className="flex-1 bg-white flex flex-col overflow-hidden rounded-[37px]">

                  {/* Dynamic Island */}
                  <div className="flex justify-center pt-3 pb-1 bg-white">
                    <div className="w-[76px] h-[24px] bg-black rounded-full" />
                  </div>

                  {/* Status bar */}
                  <div className="flex justify-between items-center px-5 py-1 bg-white">
                    <span className="text-[11px] font-semibold text-black">9:41</span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-end gap-[2px]">
                        {[4, 6, 8, 10].map((h, i) => (
                          <div key={i} className="w-[3px] bg-black rounded-sm" style={{ height: `${h}px` }} />
                        ))}
                      </div>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round">
                        <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
                      </svg>
                      <div className="flex items-center gap-[1px]">
                        <div className="w-[20px] h-[10px] border-[1.5px] border-black rounded-[3px] flex items-center px-[2px]">
                          <div className="h-[5px] w-full bg-black rounded-[1px]" />
                        </div>
                        <div className="w-[2px] h-[4px] bg-black rounded-r-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Messages header */}
                  <div className="bg-[#f2f2f7] border-b border-gray-200 px-3 py-2.5 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#34c759] flex items-center justify-center shrink-0">
                      <span className="text-white text-[11px] font-bold">OG</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-black leading-tight">Onti Garage</p>
                      <p className="text-[10px] text-gray-500">SMS</p>
                    </div>
                  </div>

                  {/* Messages area — klant ontvangt bericht, dus LINKS grijs */}
                  <div className="flex-1 bg-white px-3 py-4 flex flex-col justify-end overflow-hidden">
                    {smsSent && !smsAnimating ? (
                      <div className="flex flex-col items-start gap-1.5 animate-in slide-in-from-bottom-4 duration-300">
                        {/* Received message = LEFT side, gray bubble */}
                        <div className="flex items-end gap-1.5 max-w-[90%]">
                          <div className="w-5 h-5 rounded-full bg-[#34c759] flex items-center justify-center shrink-0 mb-0.5">
                            <span className="text-white text-[7px] font-bold">OG</span>
                          </div>
                          <div className="bg-[#e9e9eb] rounded-[18px] rounded-bl-[4px] px-3 py-2.5 shadow-sm">
                            <p className="text-black text-[11px] leading-relaxed">
                              Beste {smsName}, uw wagen ({smsPlate}) is klaar voor afhaling. Reparatie: {smsService}. Totaal: €{smsPrice}. Tot ziens! 🚗
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] text-gray-400 pl-8">Nu</span>
                      </div>
                    ) : smsAnimating ? (
                      /* Typing indicator — LEFT side */
                      <div className="flex items-end gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#34c759] flex items-center justify-center shrink-0">
                          <span className="text-white text-[7px] font-bold">OG</span>
                        </div>
                        <div className="bg-[#e9e9eb] rounded-[18px] rounded-bl-[4px] px-3.5 py-3 flex gap-1 items-center">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-[6px] h-[6px] bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full pb-6">
                        <p className="text-[11px] text-gray-400 italic text-center leading-relaxed">
                          Druk op de knop hierboven<br/>om een SMS te simuleren
                        </p>
                      </div>
                    )}
                  </div>

                  {/* iMessage input bar */}
                  <div className="bg-[#f2f2f7] border-t border-gray-200 px-2.5 py-2 flex items-center gap-2">
                    <div className="flex-1 bg-white border border-gray-300 rounded-full px-3 py-1.5">
                      <span className="text-[10px] text-gray-400">iMessage</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#34c759] flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6"/>
                      </svg>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="bg-white flex justify-center py-2">
                    <div className="w-[80px] h-[4px] bg-black/20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 5. Interactive Analytics Year Selector */}
        <Card className="flex flex-col h-full border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-warning text-warning-fg text-[10px] font-bold px-2.5 py-1 rounded-bl flex items-center gap-1 uppercase tracking-wider">
            <Crown className="h-3 w-3" /> Pro
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Statistieken & Omzet
            </CardTitle>
            <p className="text-sm text-fg-subtle">
              Wissel tussen boekjaren om de geanimeerde rapportage te zien transformeren.
            </p>
          </CardHeader>
          <div className="flex-1 px-6 pb-6 pt-2 space-y-4">

            {/* Year toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-fg font-semibold">Boekjaar:</span>
              <div className="inline-flex rounded-md border border-border p-0.5 bg-muted/40">
                <button
                  onClick={() => setAnalyticsYear("2025")}
                  className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                    analyticsYear === "2025" ? "bg-bg text-fg font-bold shadow-xs" : "text-fg-subtle hover:text-fg"
                  }`}
                >
                  2025
                </button>
                <button
                  onClick={() => setAnalyticsYear("2026")}
                  className={`px-3 py-1 rounded text-sm transition-all duration-200 ${
                    analyticsYear === "2026" ? "bg-bg text-fg font-bold shadow-xs" : "text-fg-subtle hover:text-fg"
                  }`}
                >
                  2026
                </button>
              </div>
            </div>

            {/* KPI cards row */}
            {(() => {
              const data = analyticsYear === "2025"
                ? { omzet: "€ 142.450", orders: "312", gem: "€ 457", groei: "+8%", groeiPos: true }
                : { omzet: "€ 186.200", orders: "401", gem: "€ 464", groei: "+31%", groeiPos: true };
              return (
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-[10px] text-fg-subtle uppercase font-semibold tracking-wide">Totale Omzet</p>
                    <p className="text-xl font-bold text-fg mt-0.5 transition-all duration-500">{data.omzet}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-[10px] text-fg-subtle uppercase font-semibold tracking-wide">Werkorders</p>
                    <p className="text-xl font-bold text-fg mt-0.5 transition-all duration-500">{data.orders}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-[10px] text-fg-subtle uppercase font-semibold tracking-wide">Gem. Orderwaarde</p>
                    <p className="text-xl font-bold text-fg mt-0.5 transition-all duration-500">{data.gem}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-success/5 border-success/20 p-3">
                    <p className="text-[10px] text-fg-subtle uppercase font-semibold tracking-wide">Groei vs vorig jaar</p>
                    <p className={`text-xl font-bold mt-0.5 transition-all duration-500 ${data.groeiPos ? "text-success" : "text-danger"}`}>{data.groei}</p>
                  </div>
                </div>
              );
            })()}

            {/* Animated bar chart - 4 quarters */}
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-[10px] text-fg-subtle uppercase font-semibold tracking-wide mb-3">Omzet per kwartaal</p>
              <div className="h-24 flex items-end gap-2">
                {(analyticsYear === "2025"
                  ? [
                      { q: "Q1", h: 38, val: "31K", color: "bg-primary/30" },
                      { q: "Q2", h: 54, val: "42K", color: "bg-primary/50" },
                      { q: "Q3", h: 62, val: "45K", color: "bg-primary/70" },
                      { q: "Q4", h: 72, val: "24K", color: "bg-primary" },
                    ]
                  : [
                      { q: "Q1", h: 48, val: "41K", color: "bg-primary/30" },
                      { q: "Q2", h: 66, val: "52K", color: "bg-primary/50" },
                      { q: "Q3", h: 82, val: "63K", color: "bg-primary/70" },
                      { q: "Q4", h: 92, val: "30K", color: "bg-primary" },
                    ]
                ).map((bar) => (
                  <div key={bar.q} className="w-full flex flex-col items-center gap-1">
                    <span className="text-[9px] text-fg-subtle font-mono">{bar.val}</span>
                    <div
                      className={`${bar.color} w-full rounded-t transition-all duration-500 ease-out min-w-[20px]`}
                      style={{ height: `${bar.h}%` }}
                    />
                    <span className="text-[10px] text-fg-subtle font-semibold">{bar.q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top services */}
            <div className="space-y-1.5">
              <p className="text-[10px] text-fg-subtle uppercase font-semibold tracking-wide">Top diensten</p>
              {(analyticsYear === "2025"
                ? [
                    { name: "Olie & Filters", pct: 82 },
                    { name: "Remmen", pct: 61 },
                    { name: "APK Keuring", pct: 44 },
                  ]
                : [
                    { name: "Olie & Filters", pct: 90 },
                    { name: "Remmen", pct: 74 },
                    { name: "APK Keuring", pct: 58 },
                  ]
              ).map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="text-xs text-fg w-28 shrink-0">{s.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-fg-subtle w-8 text-right font-mono">{s.pct}%</span>
                </div>
              ))}
            </div>

          </div>
        </Card>

        {/* 6. Interactive Customer Portal Link */}
        <Card className="flex flex-col h-full border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-warning text-warning-fg text-[10px] font-bold px-2.5 py-1 rounded-bl flex items-center gap-1 uppercase tracking-wider">
            <Crown className="h-3 w-3" /> Pro
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Klantenportaal
            </CardTitle>
            <p className="text-sm text-fg-subtle">
              Bekijk wat de klant te zien krijgt via hun unieke, afgeschermde historiek link.
            </p>
          </CardHeader>
          <div className="flex-1 px-6 pb-6 pt-2 space-y-4">
            
            <div className="rounded border border-border bg-muted/30 p-3 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-fg-subtle pb-2 border-b border-border/50">
                <Sparkles className="h-4 w-4 text-warning" />
                <span className="text-sm">Klant Portaal Preview</span>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-fg text-sm">Wagen: 1-ABC-123</p>
                <div className="flex items-center justify-between text-sm text-success font-semibold">
                  <span>Remmen vervangen</span>
                  <span>14/05/2026</span>
                </div>
                <div className="flex items-center justify-between text-sm text-fg-subtle">
                  <span>Olie & filters</span>
                  <span>10/01/2026</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                setShowPortalModal(true);
                setPortalLoggedIn(false);
                setPortalLoggingIn(false);
                setPortalPlateInput("1-ABC-123");
              }}
              variant="outline"
              size="md"
              className="w-full text-sm inline-flex items-center justify-center gap-1.5 h-10"
            >
              Demo Inloggen als Klant
            </Button>
          </div>
        </Card>

      </div>

      {/* Interactive Invoice Modal Simulation */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-bg border border-border rounded-xl w-full max-w-lg p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-4 right-4 text-fg-subtle hover:text-fg hover:bg-muted p-1 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <header className="border-b border-border/80 pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-fg">Onti Factuur Generator</h3>
                  <p className="text-xs text-fg-subtle">Premium Facturatiekoppeling Preview</p>
                </div>
                <span className="bg-warning/10 border border-warning/20 text-warning px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                  Concept
                </span>
              </div>
            </header>

            <div className="space-y-4 text-xs font-sans text-fg bg-muted/20 p-4 rounded border border-border/50 shadow-inner">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <div>
                  <h4 className="font-bold">ONTI GARAGE BVBA</h4>
                  <p className="text-[10px] text-fg-subtle">Kerkstraat 42, 9000 Gent</p>
                  <p className="text-[10px] text-fg-subtle">BTW BE 0789.456.123</p>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-primary">FACTUUR</h4>
                  <p className="text-[10px] text-fg-subtle">Nummer: #2026-981</p>
                  <p className="text-[10px] text-fg-subtle">Datum: 20-05-2026</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-fg-subtle uppercase block font-semibold">Factureer aan:</span>
                  <span className="font-bold">{invoiceKlant}</span>
                </div>
                <div>
                  <span className="text-[10px] text-fg-subtle uppercase block font-semibold">Voertuig details:</span>
                  <span className="font-mono">{invoicePlate}</span>
                </div>
              </div>

              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-fg-subtle text-[10px]">
                    <th className="text-left py-1.5 font-semibold">Omschrijving</th>
                    <th className="text-right py-1.5 font-semibold">Bedrag</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/30">
                    <td className="py-2">{invoiceService}</td>
                    <td className="text-right py-2">€ {invoiceAmount}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-fg-subtle">Milieubijdrage & recyclage</td>
                    <td className="text-right py-2 text-fg-subtle">€ 12,50</td>
                  </tr>
                </tbody>
              </table>

              <div className="border-t border-border/60 pt-2 flex flex-col items-end gap-1">
                <div className="flex gap-4">
                  <span className="text-fg-subtle">Subtotaal:</span>
                  <span>€ {((parseFloat(invoiceAmount.replace(",", ".")) || 0) + 12.5).toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex gap-4 text-xs font-bold border-t border-border/40 pt-1 text-fg">
                  <span>Totaal (incl. 21% BTW):</span>
                  <span>€ {(((parseFloat(invoiceAmount.replace(",", ".")) || 0) + 12.5) * 1.21).toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>

            <footer className="mt-6 flex justify-between items-center gap-2">
              <span className="text-[10px] text-warning font-semibold flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Direct gekoppeld met Yuki
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8 text-xs">
                  <Printer className="h-3.5 w-3.5 mr-1" /> Afdrukken
                </Button>
                <Button size="sm" onClick={() => setShowInvoiceModal(false)} className="h-8 text-xs">
                  Sluiten
                </Button>
              </div>
            </footer>
          </div>
        </div>
      )}
      {/* Interactive Customer Portal Modal Simulation */}
      {showPortalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-bg border border-border rounded-xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowPortalModal(false)}
              className="absolute top-4 right-4 text-fg-subtle hover:text-fg hover:bg-muted p-1 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {!portalLoggedIn ? (
              <div className="space-y-4">
                <header className="border-b border-border pb-3">
                  <h3 className="text-lg font-bold text-fg flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Mijn Onti Garage Portaal
                  </h3>
                  <p className="text-xs text-fg-subtle">Simulatie van de klanten loginpagina</p>
                </header>

                <div className="space-y-3">
                  <div className="rounded bg-primary/5 border border-primary/10 p-3 text-xs text-primary leading-relaxed">
                    <strong>Demo Instructie:</strong> Klanten ontvangen een beveiligde SMS-link. Klik direct op <strong>Inloggen</strong> om te zien wat zij zien, of typ een eigen nummerplaat.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-fg">Nummerplaat</label>
                    <Input
                      placeholder="Bijv. 1-ABC-123"
                      value={portalPlateInput}
                      onChange={(e) => setPortalPlateInput(e.target.value.toUpperCase())}
                      className="font-mono text-center tracking-widest text-lg font-bold h-10 border-border-strong uppercase"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-fg">Unieke Toegangscode</label>
                    <Input
                      type="password"
                      value="••••••"
                      disabled
                      className="text-center text-lg tracking-widest h-10 bg-muted/50"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setPortalLoggingIn(true);
                    setTimeout(() => {
                      setPortalLoggingIn(false);
                      setPortalLoggedIn(true);
                    }, 600);
                  }}
                  disabled={portalLoggingIn || !portalPlateInput.trim()}
                  className="w-full h-10"
                >
                  {portalLoggingIn ? "Beveiligde verbinding opbouwen..." : "Inloggen op Portaal"}
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <header className="border-b border-border pb-3 flex justify-between items-center font-sans">
                  <div>
                    <h3 className="text-base font-bold text-fg font-mono tracking-wide">{portalPlateInput}</h3>
                    <p className="text-[11px] text-fg-subtle">Volkswagen Golf GTI • Historiek</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-success font-semibold bg-success/10 border border-success/20 rounded-full px-2 py-0.5 animate-pulse">
                    🟢 Gereed
                  </span>
                </header>

                {/* Timeline */}
                <div className="space-y-4">
                  <span className="text-[10px] text-fg-subtle uppercase font-bold tracking-wider">Onderhoudshistoriek</span>
                  
                  <div className="relative pl-4 border-l border-border space-y-4">
                    {/* Item 1 */}
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 bg-success rounded-full w-2.5 h-2.5 border-2 border-bg" />
                      <div className="text-xs">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-fg">Remmen vervangen & testrit</span>
                          <span className="text-[10px] text-fg-subtle">Vandaag, 16:42</span>
                        </div>
                        <p className="text-fg-subtle mt-0.5">Remschijven Brembo + blokken voorzijde gemonteerd. Remvloeistof ververst.</p>
                        <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded mt-1 inline-block">45.200 km</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 bg-fg-subtle rounded-full w-2.5 h-2.5 border-2 border-bg" />
                      <div className="text-xs">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-fg">Winterinspectie</span>
                          <span className="text-[10px] text-fg-subtle">10 Jan 2026</span>
                        </div>
                        <p className="text-fg-subtle mt-0.5">Ruitensproeiervloeistof antivries bijgevuld, accu getest (OK), bandenspanning gecorrigeerd.</p>
                        <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded mt-1 inline-block">38.100 km</span>
                      </div>
                    </div>
                  </div>
                </div>

                <footer className="border-t border-border pt-4 flex gap-2 justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setPortalLoggedIn(false)}
                  >
                    Uitloggen
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs h-8 inline-flex items-center gap-1"
                    onClick={() => {
                      alert("PDF Download simulatie gestart. Uw digitale historiek wordt gegenereerd...");
                    }}
                  >
                    <Download className="h-3.5 w-3.5" /> PDF Historiek
                  </Button>
                </footer>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
