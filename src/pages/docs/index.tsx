import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import MarkdownRenderer from '@/components/markdown-renderer';
import DocsNav from './docs-nav';

const DocsPage: React.FC = () => {
  const location = useLocation();
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const docPath = location.pathname
          .replace(/^\/docs(\/|$)/, '')
          .replace(/\/$/, '');

        const path = docPath ? `${docPath}.md` : 'intro.md';

        const response = await fetch(`/documents/${path}`);
        if (!response.ok) {
          throw new Error('Document not found');
        }
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Error loading document:', error);
        setContent('# Documento no encontrado');
      }
    };

    fetchMarkdown();
  }, [location.pathname]);

  return (
    <div className="flex h-screen">
      <DocsNav />
      <div className="flex-1 overflow-y-auto p-4">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
};

export default DocsPage;
