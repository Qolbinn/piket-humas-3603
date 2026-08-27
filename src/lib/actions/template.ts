"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTemplates() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("template_piket")
    .select(`
      *,
      template_piket_detail(
        *,
        pegawai(*)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching piket templates:", error);
    return [];
  }
  return data;
}

export async function getTemplateById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("template_piket")
    .select(`
      *,
      template_piket_detail(
        *,
        pegawai(*)
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching template by id:", error);
    return null;
  }
  return data;
}

export async function createTemplate(data: any) {
  const supabase = await createClient();
  
  // insert template
  const { data: newTemplate, error: tError } = await supabase
    .from("template_piket")
    .insert({ name: data.name })
    .select()
    .single();
    
  if (tError) throw new Error(tError.message);
  
  // insert details
  if (data.details && data.details.length > 0) {
    const detailsToInsert = data.details.map((d: any) => ({
      template_id: newTemplate.id,
      day_of_week: d.day_of_week,
      pegawai_id: d.pegawai_id
    }));
    
    const { error: dError } = await supabase
      .from("template_piket_detail")
      .insert(detailsToInsert);
      
    if (dError) throw new Error(dError.message);
  }
  
  revalidatePath("/piket");
  revalidatePath("/piket/alokasi");
  return newTemplate;
}

export async function updateTemplate(id: string, data: any) {
  const supabase = await createClient();
  
  // update name
  const { error: tError } = await supabase
    .from("template_piket")
    .update({ name: data.name })
    .eq("id", id);
    
  if (tError) throw new Error(tError.message);
  
  // To update details easily, we can delete old ones and insert new ones
  const { error: delError } = await supabase
    .from("template_piket_detail")
    .delete()
    .eq("template_id", id);
    
  if (delError) throw new Error(delError.message);
  
  if (data.details && data.details.length > 0) {
    const detailsToInsert = data.details.map((d: any) => ({
      template_id: id,
      day_of_week: d.day_of_week,
      pegawai_id: d.pegawai_id
    }));
    
    const { error: dError } = await supabase
      .from("template_piket_detail")
      .insert(detailsToInsert);
      
    if (dError) throw new Error(dError.message);
  }
  
  revalidatePath("/piket");
  revalidatePath("/piket/alokasi");
  return { success: true };
}

export async function deleteTemplate(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("template_piket")
    .delete()
    .eq("id", id);
    
  if (error) throw new Error(error.message);
  
  revalidatePath("/piket");
  revalidatePath("/piket/alokasi");
  return { success: true };
}
