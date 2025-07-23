import { Body, Controller, Post } from '@nestjs/common';
import { AgentService } from './agent.service';
import { ChatDto } from './dtos/chat.dto';
import { addYTVideoToVectorStore } from './embeddings';

@Controller('agent')
export class AgentController {
	constructor(private readonly agentService: AgentService) {}

	@Post('chat')
	chat(@Body() body: ChatDto) {
		return this.agentService.chat(body);
	}

	@Post('webhook')
	async webhook(@Body() body: any) {
		console.log('webhook triggered');

		await Promise.all(
			body.map(async (video: any) => {
				await addYTVideoToVectorStore(video);
			})
		);

		return { message: 'Ok' };
	}
}
