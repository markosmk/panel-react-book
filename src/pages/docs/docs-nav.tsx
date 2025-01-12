import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Document {
  name: string;
  path?: string;
  title: string;
  children?: Document[];
}

const DocsNav: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await fetch('/documents/index.json');
      const data = await response.json();
      setDocuments(data.documents);
    };

    fetchDocuments();
  }, []);

  const renderDocuments = (docs: Document[]) => {
    return docs.map((doc) => (
      <li key={doc.name} className="my-2">
        {doc.path ? (
          <Link
            to={`/docs/${doc.path.replace('.md', '')}`}
            className="text-muted-foreground transition-colors duration-150 hover:text-primary"
          >
            {doc.title}
          </Link>
        ) : (
          <span>{doc.title}</span>
        )}
        {doc.children && <ul>{renderDocuments(doc.children)}</ul>}
      </li>
    ));
  };

  return (
    <nav className="w-60 overflow-y-auto border-r border-border p-4">
      <h2>Documentación</h2>
      <ul>
        {/* <li>
          <Link to="/docs">Inicio</Link>
        </li> */}
        {renderDocuments(documents)}
      </ul>
    </nav>
  );
};

export default DocsNav;
