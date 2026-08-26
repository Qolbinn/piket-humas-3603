import { getTemplates } from "@/lib/actions/template-pesan";
import { TemplateForm } from "@/components/features/master/TemplateForm";
import PageHeader from "@/components/layout/page-header";
import { MessageSquareCode } from "lucide-react";

export const metadata = {
  title: "Template Chat | Master Data",
};

export default async function TemplatePage() {
  const templates = await getTemplates();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader 
        title="Template Chat" 
        description="Kelola teks otomatis untuk pesan sambutan, pengingat, dan umpan balik." 
        breadcrumbText="Master Data / Template" 
        breadcrumbIcon={MessageSquareCode} 
      />

      <div className="w-full">
        <TemplateForm templates={templates || []} />
      </div>
    </div>
  );
}
