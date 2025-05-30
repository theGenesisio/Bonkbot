/**
 * Checks if the input string contains exactly 12 words.
 * @param {string} phrase - The string to check.
 * @returns {boolean} True if it has exactly 12 words, false otherwise.
 */
const isTwelveWords = (phrase) => {
    if (typeof phrase !== 'string') return false;

    const words = phrase.trim().split(/\s+/);
    return words.length === 12;
};

export default isTwelveWords;
