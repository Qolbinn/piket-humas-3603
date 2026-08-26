"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTemplates() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("template_pesan")
    .select("*");

  if (error) {
    console.error("Error fetching templates:", error);
    return [];
  }

  return data;
}

export async function saveTemplate(tipe: string, konten: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("template_pesan")
    .upsert(
      { tipe, konten, updated_at: new Date().toISOString() },
      { onConflict: "tipe" }
    );

  if (error) {
    console.error("Error saving template:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/master/template");
  return { success: true };
}
