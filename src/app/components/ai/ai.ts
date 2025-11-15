import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Api } from '../../services/api';

@Component({
  selector: 'app-ai',
  standalone: false,
  templateUrl: './ai.html',
  styleUrls: ['./ai.css'],
})
export class Ai implements OnInit {
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  @ViewChild('questionInput') questionInput!: ElementRef;

  question = '';
  sendBtnDisabled = false;
  isChatOpen = false;
  statusText = 'Online';
  statusType = 'online';

  messages: any[] = [{ type: 'ai', content: "Hello! I'm your AI assistant. Ask me about books!" }];

  constructor(private api: Api, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    setTimeout(() => this.scrollToBottom(), 200);
  }

  closeChat() {
    this.isChatOpen = false;
  }

  ask() {
    const query = this.question.trim();
    if (!query) return;

    // Add user message
    this.messages.push({ type: 'user', content: query });
    const thinkingMessage = { type: 'ai', content: '🤔 Thinking...', thinking: true };
    this.messages.push(thinkingMessage);
    this.sendBtnDisabled = true;
    this.question = '';
    this.scrollToBottom();

    this.api.postAI(query).subscribe({
      next: (res: any) => {
        // remove thinking
        this.messages = this.messages.filter((m) => m !== thinkingMessage);
        const text = res?.response || res?.message || (res && res.error) || 'No response';
        const formattedContent = this.formatResponse(text);
        const sanitized = this.sanitizer.sanitize(1, formattedContent) || formattedContent;
        this.messages.push({ type: 'ai', content: sanitized });
      },
      error: (err: any) => {
        this.messages = this.messages.filter((m) => m !== thinkingMessage);
        const msg = err?.error?.error || err?.error?.message || err?.message || 'AI request failed';
        this.messages.push({ type: 'ai', content: `❌ Error: ${msg}` });
      },
      complete: () => {
        this.sendBtnDisabled = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
    });
  }

  handleEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') this.ask();
  }

  searchMessages(evt: KeyboardEvent) {
    // optional: implement search filter
  }

  scrollToBottom() {
    try {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    } catch (e) {}
  }

  /**
   * Format AI response text into HTML with styling:
   * - **text** → <strong>text</strong>
   * - *text* → <em>text</em>
   * - `code` → <code>code</code>
   * - ```code block``` → <pre><code>...</code></pre>
   * - Lines starting with • or - → <ul><li>...</li></ul>
   * - Lines starting with numbers. → <ol><li>...</li></ol>
   */
  formatResponse(text: string): string {
    if (!text) return text;

    // Escape HTML but preserve newlines
    let formatted = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Format code blocks (``` ... ```)
    formatted = formatted.replace(/```(.*?)```/gs, (match, code) => {
      const trimmed = code.trim();
      return `<pre><code>${trimmed}</code></pre>`;
    });

    // Format inline code (`...`)
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Format bold (**...**)
    formatted = formatted.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');

    // Format italics (*...* but not **)
    formatted = formatted.replace(/(?<!\*)\*([^\*]+)\*(?!\*)/g, '<em>$1</em>');

    // Format headings (## text, ### text, etc.)
    formatted = formatted.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
    formatted = formatted.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    formatted = formatted.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

    // Format unordered lists (lines starting with - or •)
    const lines = formatted.split('\n');
    let inList = false;
    let listHtml = '';
    let result = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*[-•]\s/.test(line)) {
        if (!inList) {
          inList = true;
          listHtml = '<ul>';
        }
        const content = line.replace(/^\s*[-•]\s/, '');
        listHtml += `<li>${content}</li>`;
      } else {
        if (inList) {
          inList = false;
          listHtml += '</ul>';
          result += listHtml;
          listHtml = '';
        }
        result += line + '\n';
      }
    }

    if (inList) {
      listHtml += '</ul>';
      result += listHtml;
    }

    formatted = result.trim();

    // Format blockquotes (lines starting with >)
    formatted = formatted.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

    // Format line breaks (preserve paragraph breaks)
    formatted = formatted.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    if (formatted && !formatted.startsWith('<p>')) {
      formatted = '<p>' + formatted + '</p>';
    }

    return formatted;
  }
}
