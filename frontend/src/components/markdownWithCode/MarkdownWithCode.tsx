import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { twMerge } from 'tailwind-merge';

const MarkdownWithCode = ({ markdown }: { markdown: string }) => {
   return (
      <div className='max-w-none break-words'>
         <ReactMarkdown
            components={{
               code(props: any) {
                  const { node, inline, className, children, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                     <div className='my-4 w-full overflow-hidden rounded border border-gray-700'>
                        <div className='overflow-x-auto'>
                           <SyntaxHighlighter
                              style={oneDark as any}
                              language={match[1]}
                              PreTag='div'
                              className='!m-0 !bg-transparent text-sm'
                              customStyle={{
                                 margin: 0,
                                 padding: '12px',
                                 background: 'transparent',
                                 whiteSpace: 'pre',
                                 minWidth: 'max-content',
                              }}
                              codeTagProps={{
                                 style: { background: 'transparent' },
                              }}
                              {...rest}
                           >
                              {children}
                           </SyntaxHighlighter>
                        </div>
                     </div>
                  ) : (
                     <code
                        className={twMerge(
                           className,
                           'rounded-lg border border-gray-600 py-2 font-mono text-sm'
                        )}
                        {...rest}
                     >
                        {children}
                     </code>
                  );
               },
            }}
         >
            {markdown}
         </ReactMarkdown>
      </div>
   );
};

export default MarkdownWithCode;
