'use client';

import useChat from '@api/agent/hooks/useLogin';
import { useEffect, useRef, useState } from 'react';

interface Message {
   id: number;
   text: string;
   isUser: boolean;
}

const HomePage = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [inputText, setInputText] = useState('');
   const [threadId, setThreadId] = useState<number>(Date.now());
   const messagesEndRef = useRef<HTMLDivElement>(null);

   const { mutate: sendChatMessage, isPending: isChatPending } = useChat();

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputText(e.target.value);
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         sendMessage();
      }
   };

   const sendMessage = async () => {
      if (inputText.trim() === '') return;

      const userMessage = {
         id: Date.now(),
         text: inputText.trim(),
         isUser: true,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputText('');

      sendChatMessage(
         {
            message: inputText.trim(),
            thread_id: threadId.toString(),
         },
         {
            onSuccess: (data) => {
               console.log(data);
               const aiMessage = {
                  id: Date.now(),
                  text: data,
                  isUser: false,
               };

               setMessages((prev) => [...prev, aiMessage]);
            },
            onError: (error) => {
               console.error('Error sending chat message:', error);

               const errorMessage = {
                  id: Date.now(),
                  text: 'Sorry, there was an error processing your request.',
                  isUser: false,
               };

               setMessages((prev) => [...prev, errorMessage]);
            },
         }
      );
   };

   const resetChat = () => {
      setMessages([]);
      setThreadId(Date.now());
   };

   return (
      <div className='mx-auto flex h-[100dvh] max-w-4xl flex-col px-4'>
         {/* Chat Header */}
         <header className='border-border flex items-center justify-between border-b py-4'>
            <h1 className='text-text text-2xl font-medium'>AI Chat</h1>
            <button
               className='bg-transparent border-border text-text flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-sm transition-colors hover:bg-white hover:bg-opacity-5'
               onClick={resetChat}
            >
               <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
               >
                  <path
                     d='M8 3V1L4 5L8 9V7C10.21 7 12 8.79 12 11C12 13.21 10.21 15 8 15C5.79 15 4 13.21 4 11H2C2 14.31 4.69 17 8 17C11.31 17 14 14.31 14 11C14 7.69 11.31 5 8 5V3Z'
                     fill='currentColor'
                  />
               </svg>
               New Chat
            </button>
         </header>

         {/* Messages Container */}
         <div className='flex flex-1 flex-col gap-4 overflow-y-auto py-4'>
            {messages.length === 0 ? (
               <div className='text-text-secondary flex h-full flex-col items-center justify-center p-8 text-center'>
                  <p>Start your conversation with the AI</p>
               </div>
            ) : (
               messages.map((message) => (
                  <div
                     key={message.id}
                     className={`animate-fade-in flex max-w-full gap-3 rounded-lg p-3 ${
                        message.isUser
                           ? 'bg-user-message self-end'
                           : 'bg-ai-message self-start'
                     }`}
                  >
                     <div className='text-primary bg-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-opacity-10 text-xs font-semibold'>
                        {message.isUser ? 'You' : 'AI'}
                     </div>
                     <div className='text-text whitespace-pre-wrap break-words'>
                        {message.text}
                     </div>
                  </div>
               ))
            )}
            {isChatPending && (
               <div className='animate-fade-in bg-ai-message flex max-w-full gap-3 self-start rounded-lg p-3'>
                  <div className='text-primary bg-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-opacity-10 text-xs font-semibold'>
                     AI
                  </div>
                  <div className='flex items-center gap-1.5'>
                     <span className='bg-text-secondary animate-pulse-dot h-2 w-2 rounded-full'></span>
                     <span className='bg-text-secondary animate-pulse-dot-delay-1 h-2 w-2 rounded-full'></span>
                     <span className='bg-text-secondary animate-pulse-dot-delay-2 h-2 w-2 rounded-full'></span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* Input Container */}
         <div className='border-border flex gap-2 border-t py-4'>
            <textarea
               value={inputText}
               onChange={handleInputChange}
               onKeyDown={handleKeyDown}
               placeholder='Type your message...'
               disabled={isChatPending}
               rows={1}
               className='bg-surface text-text border-border focus:border-primary placeholder:text-text-secondary min-h-[48px] flex-1 resize-none rounded-lg border px-4 py-3 font-sans text-base outline-none transition-colors disabled:opacity-50'
            />
            <button
               className='bg-primary text-black disabled:bg-disabled flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border-none transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
               onClick={sendMessage}
               disabled={inputText.trim() === '' || isChatPending}
            >
               <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
               >
                  <path
                     d='M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z'
                     fill='currentColor'
                  />
               </svg>
            </button>
         </div>
      </div>
   );
};

export default HomePage;
