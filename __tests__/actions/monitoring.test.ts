import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getKinerjaPetugas, getNotifLogs } from '@/lib/actions/monitoring';
import { createClient } from '@/lib/supabase/server';

describe('Monitoring Actions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    };
    
    // @ts-ignore
    vi.mocked(createClient).mockResolvedValue(mockSupabase);
  });

  describe('getKinerjaPetugas', () => {
    it('fetches kinerja petugas', async () => {
      const mockData = [{ id: '1', name: 'Petugas A', role: 'petugas' }];
      mockSupabase.in.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await getKinerjaPetugas();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('pegawai');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getNotifLogs', () => {
    it('fetches and paginates bot notif logs', async () => {
      const mockData = [{ message: 'Sent reminder' }];
      mockSupabase.limit.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await getNotifLogs();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('bot_notif_log');
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockData);
    });
  });
});
