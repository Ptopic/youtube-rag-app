import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownWithCode = ({ markdown }: { markdown: string }) => {
   return (
      <ReactMarkdown
         components={{
            code(props: any) {
               const { node, inline, className, children, ...rest } = props;
               const match = /language-(\w+)/.exec(className || '');
               return !inline && match ? (
                  <SyntaxHighlighter
                     style={oneDark as any}
                     language={match[1]}
                     PreTag='div'
                     {...rest}
                  >
                     {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
               ) : (
                  <code className={className} {...rest}>
                     {children}
                  </code>
               );
            },
         }}
      >
         {markdown}
      </ReactMarkdown>
   );
};

export default MarkdownWithCode;
