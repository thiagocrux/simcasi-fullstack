/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { HighlightedText } from './HighlightedText';

describe('HighlightedText', () => {
  it('should render text without highlight when highlight is empty', () => {
    render(<HighlightedText text="Hello World" highlight="" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render text without highlight when highlight is whitespace only', () => {
    render(<HighlightedText text="Test Text" highlight="  " />);
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  it('should return plain text when highlight does not match', () => {
    const { container } = render(
      <HighlightedText text="Hello World" highlight="xyz" />
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(container.querySelectorAll('span').length).toBeGreaterThanOrEqual(1);
  });

  it('should highlight single matching word', () => {
    const { container } = render(
      <HighlightedText text="Hello World" highlight="Hello" />
    );
    const highlightedSpan = container.querySelector(
      '.bg-yellow-300'
    ) as HTMLElement;
    expect(highlightedSpan).toHaveTextContent('Hello');
  });

  it('should highlight matching text with yellow background', () => {
    const { container } = render(
      <HighlightedText text="The quick brown fox" highlight="quick" />
    );
    const highlighted = container.querySelector('.bg-yellow-300');
    expect(highlighted).toHaveTextContent('quick');
    expect(highlighted).toHaveClass('dark:bg-yellow-800');
  });

  it('should apply font-medium to highlighted text', () => {
    const { container } = render(
      <HighlightedText text="Important text" highlight="Important" />
    );
    const highlighted = container.querySelector('.font-medium');
    expect(highlighted).toHaveTextContent('Important');
  });

  it('should apply dark mode text color to highlighted', () => {
    const { container } = render(
      <HighlightedText text="Dark mode test" highlight="Dark" />
    );
    const highlighted = container.querySelector('.dark\\:text-white');
    expect(highlighted).toBeInTheDocument();
  });

  it('should be case-insensitive in highlighting', () => {
    const { container } = render(
      <HighlightedText text="Hello WORLD hello" highlight="hello" />
    );
    const highlighted = container.querySelectorAll('.bg-yellow-300');
    expect(highlighted.length).toBeGreaterThanOrEqual(2);
  });

  it('should highlight all occurrences of matching text', () => {
    const { container } = render(
      <HighlightedText text="cat cat dog cat" highlight="cat" />
    );
    const highlighted = container.querySelectorAll('.bg-yellow-300');
    expect(highlighted.length).toBe(3);
  });

  it('should preserve non-highlighted text between matches', () => {
    const { container } = render(
      <HighlightedText text="a1b1c1" highlight="1" />
    );
    expect(container.textContent).toBe('a1b1c1');
    const spans = container.querySelectorAll('span > span');
    expect(spans.length).toBeGreaterThan(0);
  });

  it('should handle partial word matches', () => {
    const { container } = render(
      <HighlightedText text="testing tested tester" highlight="test" />
    );
    const highlighted = container.querySelectorAll('.bg-yellow-300');
    expect(highlighted.length).toBe(3);
  });

  it('should handle special regex characters in highlight', () => {
    // This tests that special regex chars don't break the component
    render(<HighlightedText text="price is $50" highlight="$" />);
    expect(screen.getByText(/price is/)).toBeInTheDocument();
  });

  it('should render highlighted text correctly with multiple matches in sequence', () => {
    const { container } = render(
      <HighlightedText text="aaabbbccc" highlight="a" />
    );
    const highlighted = container.querySelectorAll('.bg-yellow-300');
    expect(highlighted.length).toBe(3);
  });

  it('should handle empty text', () => {
    const { container } = render(<HighlightedText text="" highlight="test" />);
    expect(container).toBeInTheDocument();
  });

  it('should handle very long text with highlights', () => {
    const longText =
      'word '.repeat(100) + 'special word ' + 'word '.repeat(100);
    const { container } = render(
      <HighlightedText text={longText} highlight="special" />
    );
    const highlighted = container.querySelector('.bg-yellow-300');
    expect(highlighted).toHaveTextContent('special');
  });

  it('should render container span element', () => {
    const { container } = render(<HighlightedText text="Test" highlight="T" />);
    const span = container.querySelector('span');
    expect(span?.tagName).toBe('SPAN');
  });

  it('should not render when highlight is null-like value', () => {
    const { container } = render(
      <HighlightedText text="Hello" highlight={undefined as any} />
    );
    expect(container.textContent).toBe('Hello');
  });

  it('should handle highlight with numeric values', () => {
    const { container } = render(
      <HighlightedText text="Phone: 123-456-7890" highlight="123" />
    );
    const highlighted = container.querySelector('.bg-yellow-300');
    expect(highlighted).toHaveTextContent('123');
  });
});
