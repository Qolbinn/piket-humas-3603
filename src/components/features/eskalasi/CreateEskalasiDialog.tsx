"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createEskalasi } from "@/lib/actions/eskalasi";

interface Props {
  kategoriList: { kode: string; nama: string }[];
}

export function CreateEskalasiDialog({ kategoriList }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const now = new Date();
  const defaultDateTime = format(now, "yyyy-MM-dd'T'HH:mm");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const res = await createEskalasi(formData);
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success("Eskalasi manual berhasil ditambahkan!");
          setOpen(false);
          router.refresh();
        }
      } catch (error: any) {
        toast.error("Terjadi kesalahan: " + error.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-md rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Eskalasi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Eskalasi Manual</DialogTitle>
          <DialogDescription>
            Masukkan keluhan atau pertanyaan pelanggan secara manual.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="created_at">Waktu Laporan *</Label>
            <Input 
              id="created_at" 
              name="created_at" 
              type="datetime-local" 
              defaultValue={defaultDateTime} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nama_pelanggan">Nama Pelanggan *</Label>
            <Input id="nama_pelanggan" name="nama_pelanggan" placeholder="Cth: Budi Santoso" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="channel">Channel *</Label>
            <Select name="channel" defaultValue="kunjungan_langsung" required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="kunjungan_langsung">Kunjungan Langsung</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori_kode">Kategori Layanan *</Label>
            <Select name="kategori_kode" required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kategori Layanan" />
              </SelectTrigger>
              <SelectContent>
                {kategoriList.map((k) => (
                  <SelectItem key={k.kode} value={k.kode}>{k.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail">Detail Keperluan *</Label>
            <Textarea 
              id="detail" 
              name="detail" 
              placeholder="Deskripsikan keluhan atau pertanyaan dengan lengkap..." 
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Eskalasi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
