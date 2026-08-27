import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getKategoriLayanan, createKategoriLayanan, updateKategoriLayanan, deleteKategoriLayanan } from '@/lib/actions/layanan';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentPegawai } from '@/lib/actions/auth';

vi.mock('@/lib/actions/auth', () => ({
  getCurrentPegawai: vi.fn(),
}));

describe('Layanan Actions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    };
    
    // @ts-ignore
    vi.mocked(createClient).mockResolvedValue(mockSupabase);
    // @ts-ignore
    vi.mocked(getCurrentPegawai).mockResolvedValue({ id: 'admin-id', role: 'admin' });
  });

  describe('getKategoriLayanan', () => {
    it('fetches ordered data successfully', async () => {
      const mockData = [{ id: '1', nama: 'Konsultasi' }];
      mockSupabase.order.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await getKategoriLayanan();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('kategori_layanan');
      expect(mockSupabase.order).toHaveBeenCalledWith('nama', { ascending: true });
      expect(result).toEqual(mockData);
    });
  });

  describe('createKategoriLayanan', () => {
    it('inserts new data', async () => {
      mockSupabase.single.mockResolvedValueOnce({ error: null });
      
      // Mock FormData
      const formData = new FormData();
      formData.append('nama', 'Baru');
      formData.append('kode', 'B');
      
      const result = await createKategoriLayanan(formData);
      
      expect(mockSupabase.insert).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/master/layanan');
      expect(result).toEqual({ success: true });
    });
  });

  describe('updateKategoriLayanan', () => {
    it('updates existing data when id is provided', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ error: null });
      
      const formData = new FormData();
      formData.append('nama', 'Baru');
      formData.append('kode', 'B');
      
      const result = await updateKategoriLayanan('1', formData);
      
      expect(mockSupabase.update).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      expect(result).toEqual({ success: true });
    });
  });

  describe('deleteKategoriLayanan', () => {
    it('deletes data and revalidates', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ error: null });
      
      const result = await deleteKategoriLayanan('1');
      
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      expect(revalidatePath).toHaveBeenCalledWith('/master/layanan');
      expect(result).toEqual({ success: true });
    });
  });
});
