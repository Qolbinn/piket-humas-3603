import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateEskalasiStatus } from '@/lib/actions/eskalasi';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

describe('Eskalasi Actions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    };
    
    // @ts-ignore
    vi.mocked(createClient).mockResolvedValue(mockSupabase);
  });

  describe('updateEskalasiStatus', () => {
    it('updates status and revalidates path on success', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ error: null });

      const result = await updateEskalasiStatus('123', 'ON_PROCESS', 'user-id-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('eskalasi');
      expect(mockSupabase.update).toHaveBeenCalledWith({
        status: 'ON_PROCESS',
        pegawai_id: 'user-id-123',
        resolved_at: null
      });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '123');
      expect(revalidatePath).toHaveBeenCalledWith('/eskalasi');
      expect(result).toEqual({ success: true });
    });

    it('returns error object if update fails', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ error: { message: 'Database Error' } });

      await expect(updateEskalasiStatus('123', 'RESOLVED', 'user-id-123')).rejects.toThrow('Database Error');
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });
});
