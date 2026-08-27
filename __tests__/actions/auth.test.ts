import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrentPegawai, logoutAction } from '@/lib/actions/auth';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

describe('Auth Actions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = {
      auth: {
        getUser: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    };
    
    // @ts-ignore
    vi.mocked(createClient).mockResolvedValue(mockSupabase);
  });

  describe('getCurrentPegawai', () => {
    it('returns null if no user is authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null } });
      const result = await getCurrentPegawai();
      expect(result).toBeNull();
    });

    it('returns pegawai data if user is authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: { id: 'uuid-123' } } });
      mockSupabase.single.mockResolvedValueOnce({ data: { name: 'Qolbin', role: 'admin' }, error: null });

      const result = await getCurrentPegawai();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('pegawai');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'uuid-123');
      expect(result).toEqual({ name: 'Qolbin', role: 'admin' });
    });
  });

  describe('logoutAction', () => {
    it('calls auth.signOut and redirects to login', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({ error: null });
      
      await logoutAction();
      
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith('/login');
    });
  });
});
