import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPegawai, updatePegawai } from '@/lib/actions/pegawai';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Mock the admin client used for pimpinan role swap
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockResolvedValue({ error: null }),
  })),
}));

describe('Pegawai Actions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'admin-1' } } }),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
    };
    
    // @ts-ignore
    vi.mocked(createClient).mockResolvedValue(mockSupabase);
  });

  describe('getPegawai', () => {
    it('returns list of pegawai successfully', async () => {
      const mockData = [{ id: '1', name: 'Petugas A' }];
      mockSupabase.order.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await getPegawai();
      
      expect(mockSupabase.from).toHaveBeenCalledWith('pegawai');
      expect(result).toEqual(mockData);
    });
  });

  describe('updatePegawai', () => {
    it('updates pegawai data and revalidates path on success', async () => {
      mockSupabase.eq.mockReturnValueOnce(mockSupabase).mockResolvedValueOnce({ error: null });

      const updateData = new FormData();
      updateData.append('name', 'Petugas B');
      updateData.append('username', 'petugasb');
      updateData.append('phone', '0812345678');
      updateData.append('lid_wa', '123@s.whatsapp.net');
      updateData.append('gender', 'L');
      updateData.append('role', 'petugas');

      const result = await updatePegawai('1', updateData);
      
      expect(mockSupabase.update).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      expect(revalidatePath).toHaveBeenCalledWith('/pegawai');
      expect(result).toEqual({ success: true });
    });

    it('returns error if update fails', async () => {
      mockSupabase.eq.mockReturnValueOnce(mockSupabase).mockResolvedValueOnce({ error: { message: 'Update failed' } });

      const updateData = new FormData();
      updateData.append('name', 'Petugas B');
      updateData.append('username', 'petugasb');
      updateData.append('phone', '0812345678');
      updateData.append('lid_wa', '123@s.whatsapp.net');
      updateData.append('gender', 'L');
      updateData.append('role', 'petugas');

      const result = await updatePegawai('1', updateData);
      
      expect(result).toEqual({ error: 'Update failed' });
    });
  });
});
