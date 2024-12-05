// hooks/useTranslator.js
import { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import translateText from '@/utils/translateService';

const useTranslator = (text) => {
  const { language } = useStore();
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    const translate = async () => {
      const result = await translateText(text, language);
      setTranslatedText(result);
    };

    if (language !== 'en') {
      translate();
    } else {
      setTranslatedText(text); // Default to English text
    }
  }, [language, text]);

  return translatedText;
};

export default useTranslator;
