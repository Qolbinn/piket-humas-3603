import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTemplates, saveTemplate } from '@/lib/actions/template-pesan';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

describe('Template Pesan Actions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
    };
    
    // @ts-ignore
    vi.mocked(createClient).mockResolvedValue(mockSupabase);
  });

  describe('getTemplates', () => {
    it('returns data when successful', async () => {
      const mockData = [{ tipe: 'greeting', konten: 'hello' }];
      mockSupabase.select.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await getTemplates();

      expect(mockSupabase.from).toHaveBeenCalledWith('template_pesan');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockData);
    });

    it('returns empty array and logs error on failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockSupabase.select.mockResolvedValueOnce({ data: null, error: new Error('DB Error') });

      const result = await getTemplates();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('saveTemplate', () => {
    it('upserts data and revalidates path on success', async () => {
      mockSupabase.upsert.mockResolvedValueOnce({ error: null });

      const result = await saveTemplate('greeting', 'Hello {{timeGreeting}}');

      expect(mockSupabase.from).toHaveBeenCalledWith('template_pesan');
      expect(mockSupabase.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ tipe: 'greeting', konten: 'Hello {{timeGreeting}}' }),
        { onConflict: 'tipe' }
      );
      expect(revalidatePath).toHaveBeenCalledWith('/master/template');
      expect(result).toEqual({ success: true });
    });

    it('returns error object if upsert fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockSupabase.upsert.mockResolvedValueOnce({ error: { message: 'Upsert Error' } });

      const result = await saveTemplate('greeting', 'Test');

      expect(result).toEqual({ success: false, error: 'Upsert Error' });
      expect(revalidatePath).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});
