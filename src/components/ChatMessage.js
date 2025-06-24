import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // optional styling

const ChatMessage = ({ role, content, isLoading = false }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex w-full my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex max-w-3xl w-full">
        {/* Avatar */}
        <div className="flex-shrink-0 mr-3 mt-1">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            <span className="text-white text-sm font-semibold">
              {isUser ? 'You' : 'AI'}
            </span>
          </div>
        </div>

        {/* Message bubble */}
        <div className="flex-1">
          <div className={`
            px-4 py-3 rounded-xl text-sm leading-relaxed shadow-sm
            prose dark:prose-invert max-w-none
            ${isUser 
              ? 'bg-blue-50 text-blue-900' 
              : 'bg-white text-gray-900 border border-gray-200'
            }
            dark:${isUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-[#1E1E1E] text-gray-100 border-gray-700'
            }
          `}>
            {isLoading ? (
              <div className="flex items-center space-x-1">
                <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            ) : (
              <ReactMarkdown
  className="prose dark:prose-invert max-w-none"
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeHighlight]}
  components={{
    h1: ({ children }) => <p className="font-bold">{children}</p>,
    h2: ({ children }) => <p className="font-bold">{children}</p>,
    h3: ({ children }) => <p className="font-bold">{children}</p>,
    h4: ({ children }) => <p className="font-bold">{children}</p>,
    h5: ({ children }) => <p className="font-bold">{children}</p>,
    h6: ({ children }) => <p className="font-bold">{children}</p>
  }}
>
  {content}
</ReactMarkdown>

            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
