// Helper to check if string has at least 6 words separated by whitespace
function hasAtLeastSixWords(str) {
    // Trim and split on whitespace, filter out empty strings
    const words = str.trim().split(/\s+/).filter(Boolean);
    return words.length >= 6;
}
export default hasAtLeastSixWords;