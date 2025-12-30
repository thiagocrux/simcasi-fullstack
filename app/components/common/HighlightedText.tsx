interface HighlightedTextProps {
  text: string;
  highlight: string;
}

export const HighlightedText = ({ text, highlight }: HighlightedTextProps) => {
  if (!highlight || !highlight.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span
            key={index}
            className="bg-yellow-300 dark:bg-yellow-800 rounded-xs font-medium dark:text-white"
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};
