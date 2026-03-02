/**
 * Mock implementation of react-markdown for tests.
 * Strips markdown syntax and renders plain text for test assertions.
 */
const React = require('react');

module.exports = function ReactMarkdown({ children }) {
  if (!children) return null;

  // Strip markdown syntax: **text** => text, _text_ => text, etc.
  const plainText = String(children)
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold: **text** -> text
    .replace(/\*(.+?)\*/g, '$1') // Italic: *text* -> text
    .replace(/__(.+?)__/g, '$1') // Bold: __text__ -> text
    .replace(/_(.+?)_/g, '$1') // Italic: _text_ -> text
    .replace(/~~(.+?)~~/g, '$1') // Strikethrough: ~~text~~ -> text
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Links: [text](url) -> text
    .replace(/`(.+?)`/g, '$1'); // Code: `text` -> text

  // Return a React fragment with the plain text
  // This allows getByText to find text even if wrapped in tags
  return React.createElement(React.Fragment, null, plainText);
};
