'use server'

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function FetchSimilarity(query: string,text: string): Promise<any> {
    const output = await openai.createChatCompletion({
        model:'gpt-4',
        messages: [{"role": "user", "content":`Find and explain the factual similarity between ${query} and ${text}`}],
        n: 1,
        temperature: 0.1,
        frequency_penalty: 0.2,
        presence_penalty: 0.0
    })
    return output.data.choices[0].message?.content
}

async function FetchDissimilarity(query: string,text: string): Promise<any> {
    const output = await openai.createChatCompletion({
        model:'gpt-4',
        messages: [{"role": "user", "content":`Find and explain the factual dissimilarity between ${query} and ${text}`}],
        n: 1,
        temperature: 0.1,
        frequency_penalty: 0.2,
        presence_penalty: 0.0
    })
    return output.data.choices[0].message?.content
}

export async function FetchSim(query: string,text: string): Promise<any> {
    const similarityPromise = FetchSimilarity(query, text);
    const dissimilarityPromise = FetchDissimilarity(query, text);

    const [similarityResult, dissimilarityResult] = await Promise.all([similarityPromise,dissimilarityPromise,]);

    return similarityResult + "\n" + dissimilarityResult;
}

export async function FetchSummary(text: string): Promise<any> {
    const output = await openai.createChatCompletion({
        model:'gpt-4',
        messages: [{"role": "user", "content":`Summarize this ${text}`}],
        n: 1,
        temperature: 0.1,
        frequency_penalty: 0.2,
        presence_penalty: 0.0
    })
    return output.data.choices[0].message?.content
}