import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFaqMenus, deleteFaqMenu } from '@/lib/actions/faq';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentPegawai } from '@/lib/actions/auth';

vi.mock('@/lib/actions/auth', () => ({
  getCurrentPegawai: vi.fn(),
}));

describe('FAQ Menu Actions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
    };
    
    // @ts-ignore
    vi.mocked(createClient).mockResolvedValue(mockSupabase);
    // @ts-ignore
    vi.mocked(getCurrentPegawai).mockResolvedValue({ id: 'admin-id', role: 'admin' });
  });

  describe('getFaqMenus', () => {
    it('fetches and orders FAQ menus correctly', async () => {
      const mockData = [{ id: '1', title: 'Menu Utama' }];
      mockSupabase.order.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await getFaqMenus();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('faq_menu');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.order).toHaveBeenCalledWith('kode', { ascending: true });
      expect(result).toEqual(mockData);
    });
  });

  describe('deleteFaqMenu', () => {
    it('deletes menu and revalidates path on success', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ error: null });

      const result = await deleteFaqMenu('1');
      
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      expect(revalidatePath).toHaveBeenCalledWith('/master/faq');
      expect(result).toEqual({ success: true });
    });

    it('returns error if delete fails', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ error: { message: 'Delete constraint error' } });

      const result = await deleteFaqMenu('1');
      
      expect(result).toEqual({ error: 'Delete constraint error' });
    });
  });
});
