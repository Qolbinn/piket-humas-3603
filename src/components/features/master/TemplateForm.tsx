"use client";

import { useState, useTransition, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  { id: "greeting", label: "Sambutan", desc: "Pesan awal saat eskalasi baru masuk melalui WhatsApp." },
  { id: "reminder_jadwal", label: "Pengingat Jadwal", desc: "Pesan pengingat ke petugas piket sebelum jadwalnya." },
  { id: "reminder_eskalasi", label: "Pengingat Eskalasi", desc: "Pesan pengingat ke petugas untuk tiket yang belum diselesaikan." },
  { id: "create_ticket", label: "Pembuatan Tiket", desc: "Pesan saat tiket eskalasi berhasil dibuat." },
  { id: "feedback", label: "Ulasan (Feedback)", desc: "Pesan meminta ulasan ke pelanggan setelah tiket selesai." }
];

const VARIABLES = [
  { id: "{{nama_pelanggan}}", label: "Nama Pelanggan" },
  { id: "{{nomor_tiket}}", label: "Nomor Tiket" },
  { id: "{{kategori_layanan}}", label: "Kategori Layanan" },
  { id: "{{nama_petugas}}", label: "Nama Petugas" },
  { id: "{{waktu}}", label: "Waktu (Jam)" },
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
              <div className="space-y-3 p-4 border rounded-xl bg-muted/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Variabel Tersedia (Klik untuk menyisipkan):</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {VARIABLES.map(v => (
                    <Button
                      key={v.id}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => insertVariable(v.id)}
                      className="text-xs h-8 hover:bg-primary/10 hover:text-primary transition-colors border shadow-sm"
                      disabled={previewMode}
                    >
                      {v.id}
                    </Button>
                  ))}
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
                    className="h-9 rounded-xl shadow-sm px-4"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {previewMode ? 'Tutup Preview' : 'Preview WA'}
                  </Button>
                </div>
                
                {previewMode ? (
                  <div 
                    className="rounded-xl border min-h-[350px] h-full overflow-y-auto p-5 text-sm bg-muted/10 leading-relaxed shadow-inner"
                    dangerouslySetInnerHTML={{ __html: parseWaMarkdown(contents[type.id]) || '<span class="text-muted-foreground italic">Belum ada konten...</span>' }}
                  />
                ) : (
                  <Textarea
                    ref={(el) => {
                      if (activeTab === type.id) textareaRef.current = el;
                    }}
                    value={contents[type.id]}
                    onChange={(e) => handleChange(type.id, e.target.value)}
                    placeholder={`Ketik pesan ${type.label} di sini...`}
                    className="min-h-[350px] resize-y font-mono text-sm leading-relaxed rounded-xl focus-visible:ring-primary/30 p-5 shadow-sm"
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
