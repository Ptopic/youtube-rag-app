import { ChatAnthropic } from '@langchain/anthropic';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { Injectable } from '@nestjs/common';
import { ChatDto } from './dtos/chat.dto';
import { retrievalTool, triggerYoutubeVideoScrapeTool } from './tools';

@Injectable()
export class AgentService {
	private readonly llm = new ChatAnthropic({
		modelName: 'claude-3-5-sonnet-latest',
	});

	async chat(chatDto: ChatDto) {
		const { message, thread_id } = chatDto;

		// Add long-term memory to Agent
		const memorySaver = new MemorySaver();

		const agent = createReactAgent({
			llm: this.llm,
			tools: [retrievalTool, triggerYoutubeVideoScrapeTool],
			checkpointer: memorySaver,
		});

		const results = await agent.invoke(
			{
				messages: [{ role: 'user', content: message }],
			},
			{ configurable: { thread_id } }
		);

		return results.messages.at(-1).content;
	}
}
