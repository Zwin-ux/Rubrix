// Utility functions for form-grader and extension (product-agnostic)
// Example: tokenization, validation, etc.

/**
 * Tokenizes text into words (simple whitespace tokenizer)
 * @param {string} text
 * @returns {string[]}
 */
function tokenize(text) {
  return text.split(/\s+/).filter(Boolean);
}

/**
 * Simple text validation (checks for empty or too short input)
 * @param {string} text
 * @returns {boolean}
 */
function isValidText(text) {
  return typeof text === 'string' && text.trim().length > 2;
}

module.exports = {
  tokenize,
  isValidText,
};
