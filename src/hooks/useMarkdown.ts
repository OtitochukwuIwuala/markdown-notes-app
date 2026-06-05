import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

hljs.registerLanguage('css', css);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);

function getLanguage(className: string): string | undefined {
  const match = className.match(/language-([\w-]+)/);
  return match?.[1];
}

export function useMarkdown(body: string): string {
  return useMemo(() => {
    const parsedHtml = marked.parse(body, { async: false }) as string;
    const sanitizedHtml = DOMPurify.sanitize(parsedHtml);
    const container = document.createElement('div');

    container.innerHTML = sanitizedHtml;

    container.querySelectorAll('pre code').forEach((block) => {
      const code = block.textContent ?? '';
      const requestedLanguage = getLanguage(block.className);
      const language =
        requestedLanguage && hljs.getLanguage(requestedLanguage) ? requestedLanguage : undefined;
      const result = language
        ? hljs.highlight(code, { language, ignoreIllegals: true })
        : hljs.highlightAuto(code);

      block.innerHTML = result.value;
      block.classList.add('hljs');

      if (language) {
        block.classList.add(`language-${language}`);
      }
    });

    return DOMPurify.sanitize(container.innerHTML);
  }, [body]);
}
