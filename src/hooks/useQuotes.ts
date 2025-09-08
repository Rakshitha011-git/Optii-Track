import { useState, useEffect } from 'react';

const quotes = [
  "Your eyes are the windows to your soul - keep them healthy and bright.",
  "Good vision starts with good habits - consistent care makes all the difference.",
  "Taking care of your eyes today ensures clear vision for tomorrow.",
  "Regular eye care is an investment in your future quality of life.",
  "Healthy eyes, healthy life - never underestimate the power of preventive care.",
  "Vision is precious - protect it with regular checkups and proper medication.",
  "Clear sight leads to clear thinking - prioritize your eye health.",
  "Your eyes work hard for you every day - return the favor with proper care.",
];

export const useQuotes = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  const getNewQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  };

  return { quote, getNewQuote };
};