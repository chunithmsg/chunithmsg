import fs from 'fs';
import ReactMarkdown from 'react-markdown';
import path from 'path';
import remarkGfm from 'remark-gfm';

const Rules = () => {
  return (
    <>
      <h1>Rules</h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {fs.readFileSync(path.join(process.cwd(), 'src', 'app', 'rules', 'rules.md'), 'utf8')}
      </ReactMarkdown>
    </>
  );
}

export default Rules;
