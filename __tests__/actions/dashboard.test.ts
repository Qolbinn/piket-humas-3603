import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDashboardStats } from '@/lib/actions/dashboard';
import { createClient } from '@/lib/supabase/server';
import { getCurrentPegawai } from '@/lib/actions/auth';

vi.mock('@/lib/actions/auth', () => ({
  getCurrentPegawai: vi.fn(),
}));

describe('Dashboard Actions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    };
    
    // @ts-ignore
    vi.mocked(createClient).mockResolvedValue(mockSupabase);
  });

  describe('getDashboardStats', () => {
    it('returns stats successfully', async () => {
      // Mock auth to bypass restriction
      // @ts-ignore
      vi.mocked(getCurrentPegawai).mockResolvedValueOnce({ id: 'user-1', role: 'admin' });
      
      // Setup default mock responses
      mockSupabase.eq.mockReturnThis();
      mockSupabase.gte.mockReturnThis();
      mockSupabase.lte.mockResolvedValue({ data: [], error: null, count: 0 });
      
      const result = await getDashboardStats('today');
      
      expect(result).toHaveProperty('totalPercakapan');
      expect(result).toHaveProperty('eskalasiOpen');
      expect(result).toHaveProperty('eskalasiOnProcess');
      expect(result).toHaveProperty('petugas');
      expect(result).toHaveProperty('averageSla');
    });
  });
});
