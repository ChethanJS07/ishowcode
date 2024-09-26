import { unified } from 'unified';
import retextEnglish from 'retext-english';
import retextProfanities from 'retext-profanities';
import { Gen_suggestions } from './genai'; // Import your AI model function

export async function processTextForChat(text) {
  try {
    // Process the text directly (no file system operations)
    const file = await unified()
      .use(retextEnglish)
      .use(retextProfanities)
      .process(text);

    // Extract warnings from retext-profanities
    const warnings = file.messages.map((message) => message.message);

    // Use your AI model to suggest a family-friendly version
    let suggestions = await Gen_suggestions(text);

    // If you need to log or inspect warnings
    console.log("Warnings:", warnings);

    // Return the AI-generated family-friendly version
    return suggestions;

  } catch (error) {
    console.error('Error processing text:', error);
    throw new Error('Failed to process text');
  }
}
