import { describe, it, expect, vi, beforeEach } from 'vitest';
import { confirmPresence, getTodaySchedule } from '@/lib/actions/jadwal';
import { createClient } from '@/lib/supabase/server';
import { getCurrentPegawai } from '@/lib/actions/auth';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/actions/auth', () => ({
  getCurrentPegawai: vi.fn(),
}));

describe('Jadwal Piket Actions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    };
    
    // @ts-ignore
    vi.mocked(createClient).mockResolvedValue(mockSupabase);
  });

  describe('confirmPresence', () => {
    it('updates kehadiran and revalidates dashboard', async () => {
      // Setup the first eq to return the chain (mockSupabase), and the second eq to resolve the promise.
      mockSupabase.eq.mockReturnValueOnce(mockSupabase).mockResolvedValueOnce({ error: null });

      const result = await confirmPresence('jadwal-123');
      
      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({ is_hadir: true })
      );
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'jadwal-123');
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
      expect(result).toEqual({ success: true });
    });
  });

  describe('getTodaySchedule', () => {
    it('returns null if no user is authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

      const result = await getTodaySchedule();
      expect(result).toBeNull();
    });

    it('returns schedule data if authenticated and schedule exists', async () => {
      // @ts-ignore
      vi.mocked(getCurrentPegawai).mockResolvedValueOnce({ id: 'user-1' });
      mockSupabase.single.mockResolvedValueOnce({ data: { id: 'jadwal-1' }, error: null });

      const result = await getTodaySchedule();
      
      expect(mockSupabase.eq).toHaveBeenCalledWith('pegawai_id', 'user-1');
      expect(result).toEqual({ id: 'jadwal-1' });
    });
  });
});
