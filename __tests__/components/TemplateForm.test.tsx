import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TemplateForm } from '@/components/features/master/TemplateForm';
import { saveTemplate } from '@/lib/actions/template-pesan';
import { toast } from 'sonner';

// Mock the server action
vi.mock('@/lib/actions/template-pesan', () => ({
  saveTemplate: vi.fn(),
}));

describe('TemplateForm Component', () => {
  const mockTemplates = [
    { id: '1', tipe: 'greeting', konten: 'Halo dari DB', created_at: '', updated_at: '' }
  ];

  it('renders correctly with default greeting tab', () => {
    render(<TemplateForm templates={mockTemplates} />);
    
    // Check if tabs are rendered
    expect(screen.getByRole('tab', { name: 'Sambutan' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Pengingat Jadwal' })).toBeInTheDocument();
    
    // Check if text area is populated with initial data for 'greeting'
    const textarea = screen.getByPlaceholderText(/Ketik pesan Sambutan di sini/i);
    expect(textarea).toHaveValue('Halo dari DB');
  });

  it('inserts variable when clicked', () => {
    render(<TemplateForm templates={mockTemplates} />);
    
    const textarea = screen.getByPlaceholderText(/Ketik pesan Sambutan di sini/i) as HTMLTextAreaElement;
    
    // Click on a variable button
    const timeGreetingBtn = screen.getByText('{{timeGreeting}}');
    fireEvent.click(timeGreetingBtn);
    
    // Check if variable is appended (it should append at cursor, if cursor is at end, but jsdom puts it at 0 by default)
    expect(textarea.value).toContain('{{timeGreeting}}Halo dari DB');
  });

  it('calls saveTemplate on submit and shows toast', async () => {
    // @ts-ignore
    vi.mocked(saveTemplate).mockResolvedValueOnce({ success: true });
    
    render(<TemplateForm templates={mockTemplates} />);
    
    const submitBtn = screen.getByText('Simpan Template');
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(saveTemplate).toHaveBeenCalledWith('greeting', 'Halo dari DB');
      expect(toast.success).toHaveBeenCalledWith('Template berhasil disimpan!');
    });
  });

  it('shows error toast when saveTemplate fails', async () => {
    // @ts-ignore
    vi.mocked(saveTemplate).mockResolvedValueOnce({ success: false, error: 'Network Error' });
    
    render(<TemplateForm templates={mockTemplates} />);
    
    const submitBtn = screen.getByText('Simpan Template');
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Gagal menyimpan template: Network Error');
    });
  });
});
