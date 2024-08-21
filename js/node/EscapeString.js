/**
 * Escapes a string for use in a regular expression. ex: escapeRegex('a.b') -> 'a\\.b'
 * @param {string} string The string to escape.   
 * @returns {string} The escaped string.      
 */
export function escapeRegex(string) {
    return string.replace(/[-\\^$*?.()|[\]{}+]/g, '\\$&');
}