import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { Injectable } from '@nestjs/common';
import { ChatDto } from './dtos/chat.dto';
import {
	retrievalTool,
	retrieveSimilarVideosTool,
	retrieveStoredVideosTool,
	triggerYoutubeVideoScrapeTool,
} from './tools';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class AgentService {
	// private readonly llm = new ChatAnthropic({
	// 	modelName: 'claude-3-7-sonnet-latest',
	// });

	private readonly llm = new ChatOpenAI({
		modelName: 'gpt-4.1-mini',
	});

	private readonly memorySaver = new MemorySaver();

	private readonly agent = createReactAgent({
		llm: this.llm,
		tools: [
			retrievalTool,
			triggerYoutubeVideoScrapeTool,
			retrieveSimilarVideosTool,
			retrieveStoredVideosTool,
		],
		checkpointSaver: this.memorySaver,
	});

	async chat(chatDto: ChatDto) {
		const { message, thread_id } = chatDto;

		const results = await this.agent.invoke(
			{
				messages: [{ role: 'user', content: message }],
			},
			{ configurable: { thread_id } }
		);

		return results.messages.at(-1).content;
	}
}
