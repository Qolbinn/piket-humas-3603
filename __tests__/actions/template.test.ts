import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTemplates, deleteTemplate } from '@/lib/actions/template';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

describe('Template Piket Actions', () => {
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
  });

  describe('getTemplates', () => {
    it('fetches templates with details', async () => {
      const mockData = [{ id: '1', name: 'Mingguan' }];
      mockSupabase.order.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await getTemplates();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('template_piket');
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockData);
    });
  });

  describe('deleteTemplate', () => {
    it('deletes template and revalidates paths', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ error: null });

      const result = await deleteTemplate('1');
      
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      expect(revalidatePath).toHaveBeenCalledWith('/piket');
      expect(revalidatePath).toHaveBeenCalledWith('/piket/alokasi');
      expect(result).toEqual({ success: true });
    });
  });
});
