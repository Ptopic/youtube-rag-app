import { ICallableRequestBuilder } from '@api/requestBuilder/types';

import config from '@shared/config';
import { IAgentChatDto } from './types';

export const chat =
   (request: ICallableRequestBuilder<any>) => async (chatDto: IAgentChatDto) =>
      request.call(`${config.apiUrl}/agent/chat`, (init) => ({
         ...init,
         method: 'POST',
         headers: {
            ...init.headers,
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(chatDto),
      }));
