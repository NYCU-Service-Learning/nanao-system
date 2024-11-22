import * as jieba from 'node-jieba';
import { removeStopwords } from 'stopword';

export const extractKeywords = (text: string): string => {
  const words = jieba.tag(text);

  const filteredKeywords = words
    .filter(({ word, tag }) =>
      tag.startsWith('n') || // Noun
      tag.startsWith('v') || // Verb
      tag.startsWith('a')    // Adjective
    )
    .map(({ word }) => word)
    .filter((word) => word.length > 1); // Exclude single characters

  const keywords = removeStopwords(filteredKeywords, 'zh');

  return keywords.join(' '); // Join keywords with space
};
