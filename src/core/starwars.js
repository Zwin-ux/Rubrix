// Star Wars Mode Formatter
// Exports: starWarsFormat(text, options)

const yodaify = sentence => {
  // Simple Yoda-speak: Move last phrase to start, add ", yes." or "Hmm." randomly
  if (!sentence.includes(' ')) return sentence;
  const words = sentence.split(' ');
  if (words.length < 4) return sentence + ', hmm.';
  const split = Math.floor(words.length / 2);
  const first = words.slice(0, split).join(' ');
  const second = words.slice(split).join(' ');
  const yoda = `${second}, ${first}`;
  return Math.random() > 0.5 ? `${yoda}, yes.` : `${yoda}, hmm.`;
};

const starWords = [
  ['student', 'padawan'],
  ['teacher', 'Jedi Master'],
  ['grade', 'rank in the Jedi Order'],
  ['answer', 'transmission'],
  ['score', 'midichlorian count'],
  ['feedback', 'council wisdom'],
  ['AI', 'droid'],
  ['form', 'holocron'],
  ['question', 'trial'],
  ['correct', 'aligned with the Force'],
  ['incorrect', 'fallen to the Dark Side'],
  ['excellent', 'most impressive'],
  ['good', 'strong with the Force'],
  ['bad', 'disturbance in the Force'],
  ['try', 'do or do not, there is no try'],
  ['error', 'disturbance in the Force'],
  ['format', 'align with the Jedi Code']
];

const quotes = [
  'May the Force be with you!',
  'I find your lack of formatting disturbing.',
  'The Force will be with you. Always.',
  'Do or do not. There is no try.',
  'Much to learn, you still have.',
  'In my experience, there is no such thing as luck.',
  'The ability to format does not make you intelligent.'
];

function starWarsify(text) {
  let result = text;
  // Replace words with Star Wars terms
  starWords.forEach(([from, to]) => {
    const re = new RegExp(`\\b${from}\\b`, 'gi');
    result = result.replace(re, to);
  });
  // Yoda-ify some sentences
  result = result.split('.').map(s => Math.random() > 0.6 ? yodaify(s.trim()) : s.trim()).join('. ');
  // Add a random quote at the end
  if (Math.random() > 0.7) {
    result += '\n\n' + quotes[Math.floor(Math.random() * quotes.length)];
  }
  return result;
}

function starWarsFormat(text, options = {}) {
  if (!text) return '';
  let result = starWarsify(text);
  // Optionally, more fun: add emoji
  if (options.emoji) {
    result = '✨🪐 ' + result + ' ✨🪐';
  }
  return result;
}

module.exports = { starWarsFormat };
