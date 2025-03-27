import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export async function POST(request: Request) {
  try {
    const { essay, prompt, guidelines } = await request.json();

    const analysisPrompt = `
      Please analyze this essay based on the following criteria:
      
      Essay Prompt: ${prompt}
      Guidelines/Rubric: ${guidelines}
      Essay: ${essay}
      
      Please provide:
      1. A list of specific suggestions for improvement
      2. A list of thought-provoking questions that could help expand or enhance the essay
      3. Analysis of potential biases or gaps in the argument
      4. Evaluation of how well the essay meets the prompt and guidelines
      
      Format the response as a JSON object with these keys:
      - suggestions: array of improvement suggestions
      - questions: array of thought-provoking questions
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert essay analyst and writing coach. Provide detailed, constructive feedback that helps improve the essay while maintaining the author's voice and intent."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing essay:', error);
    return NextResponse.json(
      { error: 'Failed to analyze essay' },
      { status: 500 }
    );
  }
} 