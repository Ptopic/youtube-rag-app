import { tool } from '@langchain/core/tools';
import z from 'zod';
import { getVectorStore } from '../embeddings';
import { triggerYoutubeVideoScrape } from '../scrape';

export const triggerYoutubeVideoScrapeTool = tool(
	async (url: string) => {
		console.log('Triggering youtube video scrape');
		return triggerYoutubeVideoScrape(url);
	},
	{
		name: 'triggerYoutubeVideoScrape',
		description: `Trigger the scraping of a youtube video using the url. 
         The tool will start a scraping job that usually takes around 7 seconds.
         The tool will return a snapsho/job id, that can be used to check the status of a scraping job.
         Make sure that the video is not already in the vector store before calling this tool.
         If video is already in vector store, do not call this tool.
         `,
		schema: z.object({
			url: z.string(),
		}),
	}
);

export const retrievalTool = tool(
	async ({ query, video_id }: { query: string; video_id: string }) => {
		const vectorStore = await getVectorStore();

		const retrievedDocs = await vectorStore.similaritySearch(query, 3, {
			video_id,
		});

		console.log('RETRIEVED DOCS--------------------');
		console.log(retrievedDocs.length);

		const serializedDocs = retrievedDocs
			.map((doc) => doc.pageContent)
			.join('\n ');

		return serializedDocs;
	},
	{
		name: 'retrieval',
		description: `Retrieve the most relevant chunks of the text from the transcript of a youtube video.
         If you call this tool from triggerYoutubeVideoScrape tool, make sure that the video is finished processing/scraping.
         Check if video is in vector store after 10 seconds. If not, retry the function.
         Do a max of 3 retries.
         `,
		schema: z.object({
			query: z.string(),
			video_id: z.string().describe('The id of the video to retrieve'),
		}),
	}
);

export const retrieveSimilarVideosTool = tool(
	async ({ query }) => {
		const vectorStore = await getVectorStore();

		const retrievedDocs = await vectorStore.similaritySearch(query, 30);

		const ids = retrievedDocs.map((doc) => doc.metadata.video_id).join('\n ');

		return ids;
	},
	{
		name: 'retrieveSimilarVideos',
		description: 'Retrieve the ids of the most similar videos to the query',
		schema: z.object({
			query: z.string(),
		}),
	}
);

export const retrieveStoredVideosTool = tool(
	async ({ query }) => {
		const vectorStore = await getVectorStore();

		const retrievedDocs = await vectorStore.similaritySearch(query, 30);

		const ids = retrievedDocs.map((doc) => doc.metadata.video_id).join('\n ');

		return ids;
	},
	{
		name: 'retrieveStoredVideos',
		description: 'Retrieve the ids of the stored videos in the vector store',
		schema: z.object({
			query: z.string(),
		}),
	}
);
