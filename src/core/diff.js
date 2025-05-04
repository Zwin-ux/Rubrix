// Word-level diff logic for before/after comparison (product-agnostic)
// Exports: diffWords

/**
 * Returns HTML with diff highlighting for before/after text comparison
 * @param {string} oldStr
 * @param {string} newStr
 * @returns {string}
 */
function diffWords(oldStr, newStr) {
  const oldWords = oldStr.split(/(\s+)/);
  const newWords = newStr.split(/(\s+)/);
  let result = '';
  let i = 0, j = 0;
  while (i < oldWords.length && j < newWords.length) {
    if (oldWords[i] === newWords[j]) {
      result += oldWords[i];
      i++; j++;
    } else if (newWords[j] && !oldWords.includes(newWords[j])) {
      result += `<span class=\"diff-added\" data-original=\"${oldWords[i] ? oldWords[i].replace(/\"/g, '&quot;') : ''}\">${newWords[j]}</span>`;
      j++;
    } else if (oldWords[i] && !newWords.includes(oldWords[i])) {
      result += `<span class=\"diff-removed\" data-replaced=\"${newWords[j] ? newWords[j].replace(/\"/g, '&quot;') : ''}\">${oldWords[i]}</span>`;
      i++;
    } else {
      result += newWords[j];
      i++; j++;
    }
  }
  while (j < newWords.length) {
    result += `<span class=\"diff-added\" data-original=\"\">${newWords[j++]}</span>`;
  }
  while (i < oldWords.length) {
    result += `<span class=\"diff-removed\" data-replaced=\"\">${oldWords[i++]}</span>`;
  }
  return result;
}

module.exports = {
  diffWords,
};
