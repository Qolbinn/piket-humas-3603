export function parseWaMarkdown(text: string | undefined): string {
  if (!text) return ''
  
  let html = text
    // Monospace: ```code```
    .replace(/```([\s\S]*?)```/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Bold: *bold*
    .replace(/\*([^\*]+)\*/g, '<strong>$1</strong>')
    // Italic: _italic_
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    // Strikethrough: ~strikethrough~
    .replace(/~([^~]+)~/g, '<del>$1</del>')
    // Escaping angle brackets to avoid raw HTML injection issues before applying newlines
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Because we escaped < and > above, our custom tags (strong, em, del, code) would be escaped if we did it out of order.
  // Let's do escaping FIRST, then formatting.
  
  // Safe parsing approach
  const safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  
  const formattedHtml = safeText
    .replace(/```([\s\S]*?)```/g, '<code class="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono">$1</code>')
    .replace(/\*([^\*]+)\*/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/~([^~]+)~/g, '<del>$1</del>')
    .replace(/\n/g, '<br />')
    
  return formattedHtml
}
