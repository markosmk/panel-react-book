import * as React from 'react';
import { marked } from 'marked';
import './markdown.css';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="markdown max-w-4xl overflow-hidden">
      <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
    </div>
  );
};

export default MarkdownRenderer;
