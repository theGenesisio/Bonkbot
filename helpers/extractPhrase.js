/**
 * Extracts the wallet phrase from a Telegram command like:
 * /phrase word1 word2 ... word12
 * or /phrase [word1 word2 ... word12]
 *
 * @param {string} text - The full command message text.
 * @returns {string|null} The extracted phrase or null if not found.
 */
const extractPhrase = (text) => {
    // Remove the command and optional brackets, capturing the phrase
    const match = text.match(/\/phrase\s+(?:\[)?([a-zA-Z\s]+)(?:\])?/i);
    if (!match || !match[1]) return null;

    // Normalize whitespace and return trimmed phrase
    return match[1].trim().replace(/\s+/g, " ");
};

export default extractPhrase;
