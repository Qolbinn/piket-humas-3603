"use client";

import { useState, useTransition, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Info, Eye } from "lucide-react";
import { toast } from "sonner";
import { saveTemplate } from "@/lib/actions/template-pesan";
import WaToolbar from "@/components/features/faq/WaToolbar";
import { parseWaMarkdown } from "@/lib/utils/wa-format";

type TemplateItem = {
  id: string;
  tipe: string;
  konten: string;
};

interface TemplateFormProps {
  templates: TemplateItem[];
}

const TEMPLATE_TYPES = [
  {
    id: "greeting",
    label: "Sambutan",
    desc: "Pesan awal saat pelanggan pertama kali menghubungi nomor WhatsApp Kantor.",
    variables: [
      { id: "{{timeGreeting}}", label: "Waktu Sapaan (Pagi/Siang/Malam)" },
      { id: "{{customerName}}", label: "Nama Pelanggan" }
    ]
  },
  {
    id: "reminder_jadwal",
    label: "Pengingat Jadwal",
    desc: "Pesan pengingat ke petugas piket sebelum jadwalnya.",
    variables: [
      { id: "{{operatorName}}", label: "Nama Petugas Piket" },
      { id: "{{openTicket}}", label: "Jumlah tiket yang berstatus Open (Menunggu)" },
      { id: "{{onProcessTicket}}", label: "Jumlah tiket yang berstatus On Process" }
    ]
  },
  {
    id: "reminder_eskalasi",
    label: "Pengingat Eskalasi",
    desc: "Pesan pengingat ke petugas untuk tiket yang belum diselesaikan.",
    variables: [
      { id: "{{operatorName}}", label: "Nama Petugas Piket" },
      { id: "{{openTicket}}", label: "Jumlah tiket yang berstatus Open (Menunggu)" },
      { id: "{{onProcessTicket}}", label: "Jumlah tiket yang berstatus On Process" }
    ]
  },
  {
    id: "create_ticket",
    label: "Pembuatan Tiket",
    desc: "Pesan saat tiket eskalasi berhasil dibuat.",
    variables: [
      { id: "{{customerName}}", label: "Nama Pelanggan" }
    ]
  },
  {
    id: "feedback",
    label: "Ulasan (Feedback)",
    desc: "Pesan meminta ulasan ke pelanggan setelah tiket selesai.",
    variables: [
      { id: "{{timeGreeting}}", label: "Waktu Sapaan (Pagi/Siang/Malam)" },
      { id: "{{customerName}}", label: "Nama Pelanggan" }
    ]
  }
];

export function TemplateForm({ templates }: TemplateFormProps) {
  const [activeTab, setActiveTab] = useState("greeting");
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isTabLoading, setIsTabLoading] = useState(false);

  // Preview state per tab
  const [isPreview, setIsPreview] = useState<{ [key: string]: boolean }>({});

  const [contents, setContents] = useState<{ [key: string]: string }>(() => {
    const initial: { [key: string]: string } = {
      greeting: "",
      reminder_jadwal: "",
      reminder_eskalasi: "",
      create_ticket: "",
      feedback: ""
    };
    templates.forEach(t => {
      if (initial[t.tipe] !== undefined) {
        initial[t.tipe] = t.konten;
      }
    });
    return initial;
  });

  const handleChange = (type: string, value: string) => {
    setContents(prev => ({ ...prev, [type]: value }));
  };

  const handleTabChange = (val: string) => {
    if (val === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(val);
    // Simulate network fetch delay
    setTimeout(() => {
      setIsTabLoading(false);
    }, 400);
  };

  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = contents[activeTab] || "";

    const newVal = currentVal.substring(0, start) + variable + currentVal.substring(end);

    handleChange(activeTab, newVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  const togglePreview = (type: string) => {
    setIsPreview(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSave = () => {
    const contentToSave = contents[activeTab];

    startTransition(async () => {
      const result = await saveTemplate(activeTab, contentToSave || "");
      if (result.success) {
        toast.success("Template berhasil disimpan!");
      } else {
        toast.error("Gagal menyimpan template: " + result.error);
      }
    });
  };

  return (
    <div className="w-full pb-10">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="inline-flex w-full lg:w-fit flex-wrap lg:flex-nowrap mb-5 bg-muted/60 p-1.5 rounded-xl gap-1">
          {TEMPLATE_TYPES.map(type => (
            <TabsTrigger
              key={type.id}
              value={type.id}
              className="flex-1 lg:flex-none data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground rounded-lg px-4 py-2 text-sm font-medium transition-all"
            >
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TEMPLATE_TYPES.map(type => {
          const previewMode = isPreview[type.id];

          return (
            <TabsContent key={type.id} value={type.id} className="focus-visible:outline-none focus-visible:ring-0">
              {isTabLoading ? (
                <div className="flex flex-col items-center justify-center h-[450px] text-muted-foreground border rounded-xl bg-muted/5 animate-pulse">
                  <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary/50" />
                  <p className="text-sm">Menyiapkan editor template...</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold tracking-tight">{type.label}</h3>
                    <p className="text-sm text-muted-foreground">{type.desc}</p>
                  </div>

                  {/* Variables section */}
                  <div className="space-y-3 p-4.5 border border-primary/25 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-2xs">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary">
                      <Info className="h-4 w-4 text-primary" />
                      <span>Variabel Otomatis (Klik untuk menyisipkan ke pesan):</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <TooltipProvider delayDuration={200}>
                        {type.variables.map(v => (
                          <Tooltip key={v.id}>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => insertVariable(v.id)}
                                className="text-xs font-mono font-bold h-8.5 rounded-xl bg-background/80 hover:bg-primary text-foreground hover:text-primary-foreground border-primary/30 shadow-2xs transition-all gap-1.5"
                                disabled={previewMode}
                              >
                                <span>{v.id}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs font-semibold rounded-lg">
                              {v.label}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Editor Section */}
                  <div className="flex flex-col space-y-2 mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div className="min-h-[36px]">
                        {!previewMode && (
                          <WaToolbar
                            textareaRef={textareaRef}
                            onFormat={(val) => handleChange(type.id, val)}
                          />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant={previewMode ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => togglePreview(type.id)}
                        className="h-9 rounded-xl shadow-xs px-4 font-bold gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{previewMode ? 'Tutup Preview' : 'Preview WhatsApp'}</span>
                      </Button>
                    </div>

                    {previewMode ? (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 min-h-[350px] h-full overflow-y-auto text-sm leading-relaxed shadow-xs relative">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 pb-2 border-b border-emerald-500/20 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          Simulasi Tampilan Pesan Bot WhatsApp
                        </div>
                        <div 
                          className="prose prose-sm dark:prose-invert max-w-none text-foreground font-sans"
                          dangerouslySetInnerHTML={{ __html: parseWaMarkdown(contents[type.id]) || '<span class="text-muted-foreground italic">Belum ada konten template...</span>' }}
                        />
                      </div>
                    ) : (
                      <Textarea
                        ref={(el) => {
                          if (activeTab === type.id) textareaRef.current = el;
                        }}
                        value={contents[type.id]}
                        onChange={(e) => handleChange(type.id, e.target.value)}
                        placeholder={`Ketik pesan ${type.label} di sini...`}
                        className="min-h-[350px] resize-y font-mono text-sm leading-relaxed rounded-2xl focus-visible:ring-primary/30 p-5 shadow-xs border border-border/80"
                      />
                    )}

                    {!previewMode && (
                      <p className="text-[11px] text-muted-foreground pt-1 pl-1">
                        Gunakan *tebal*, _miring_, atau ~coret~.
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-6">
                    <Button onClick={handleSave} disabled={isPending} className="rounded-xl px-8 shadow-md">
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Simpan Template
                        </>
                      )}
                    </Button>
                  </div>

                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
