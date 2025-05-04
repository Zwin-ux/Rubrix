// Content detection and analysis logic for form-grader and extension (product-agnostic)
// Exports: detectLanguage, detectContentType, detectTone, extractTechnicalTerms

/**
 * Detects the language of the text (supports en, fr, ja, es, de)
 * @param {string} text
 * @returns {string}
 */
function detectLanguage(text) {
  if (/\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Han}/u.test(text)) return 'ja';
  if (/\b(le|la|les|un|une|des|est|et|à|de|du|pour|avec|sans|sur)\b/i.test(text)) return 'fr';
  if (/\b(el|la|los|las|un|una|unos|unas|es|y|de|por|para|con)\b/i.test(text)) return 'es';
  if (/\b(der|die|das|und|ist|mit|auf|zu|von|für|ein|eine)\b/i.test(text)) return 'de';
  return 'en';
}

/**
 * Detects the content type (code, email, note, comment, markdown, html, plain)
 * @param {string} text
 * @returns {string}
 */
function detectContentType(text) {
  if (/^\s*def |function |class |#include |import |public |private |var |let |const |console\.log|System\.out|print\(|=>|<>/m.test(text)) return 'code';
  if (/^\s*From: |Subject: |@|To: |Cc: |Bcc:/m.test(text)) return 'email';
  if (/^\s*[-*] |\d+\.|\[[ xX]\]/m.test(text)) return 'note';
  if (/^\s*>|^\/\/|^#|^<!--/m.test(text)) return 'comment';
  if (/^\s*<html>|<body>|<div>|<span>|<p>/im.test(text)) return 'html';
  if (/^\s*# |## |\*\*|__|\[.*\]\(.*\)/m.test(text)) return 'markdown';
  return 'plain';
}

/**
 * Detects the tone of the text (formal, casual, neutral)
 * @param {string} text
 * @returns {string}
 */
function detectTone(text) {
  if (/\b(regards|sincerely|please find attached|thank you for your consideration)\b/i.test(text)) return 'formal';
  if (/\b(hey|lol|btw|gonna|wanna|cool|awesome|thx|cheers)\b/i.test(text)) return 'casual';
  return 'neutral';
}

/**
 * Extracts technical terms (CamelCase, ALL_CAPS, numbers/symbols)
 * @param {string} text
 * @returns {string[]}
 */
function extractTechnicalTerms(text) {
  const matches = text.match(/\b([A-Z][a-z0-9]+[A-Z][a-zA-Z0-9]*|[A-Z0-9_]{2,}|\w+\d+|\w+_\w+)\b/g);
  return matches ? Array.from(new Set(matches)) : [];
}

module.exports = {
  detectLanguage,
  detectContentType,
  detectTone,
  extractTechnicalTerms,
};
