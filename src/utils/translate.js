import axios from 'axios';

const translateText = async (text, targetLanguage) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const url = `https://translation.googleapis.com/language/translate/v2`;

  try {
    const response = await axios.post(url, null, {
      params: {
        q: text,
        target: targetLanguage,
        key: apiKey,
      },
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error during translation:', error);
    return text; // Fallback to original text if translation fails
  }
};

export default translateText;
