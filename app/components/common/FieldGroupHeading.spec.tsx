import { render, screen } from '@testing-library/react';
import { FieldGroupHeading } from './FieldGroupHeading';

describe('FieldGroupHeading', () => {
  it('should render label with provided text', () => {
    render(<FieldGroupHeading text="Personal Information" />);
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('should render as label element', () => {
    render(<FieldGroupHeading text="Test" />);
    const label = screen.getByText('Test');
    expect(label.tagName).toBe('LABEL');
  });

  it('should render separator line', () => {
    const { container } = render(<FieldGroupHeading text="Section" />);
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
  });

  it('should apply default container className', () => {
    const { container } = render(<FieldGroupHeading text="Test" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-2');
  });

  it('should override container className when provided', () => {
    const { container } = render(
      <FieldGroupHeading text="Test" className="custom-flex gap-4" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-flex', 'gap-4');
    expect(wrapper).not.toHaveClass('gap-2');
  });

  it('should render label before separator', () => {
    const { container } = render(<FieldGroupHeading text="Heading" />);
    const wrapper = container.firstChild as HTMLElement;
    const children = wrapper.children;
    expect(children[0].tagName).toBe('LABEL');
    expect(children[1]).toHaveAttribute('data-slot', 'separator');
  });

  it('should render two child elements (label and separator)', () => {
    const { container } = render(<FieldGroupHeading text="Test" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children.length).toBe(2);
  });

  it('should handle long section titles', () => {
    const longTitle = 'Medical History and Previous Treatments';
    render(<FieldGroupHeading text={longTitle} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('should handle special characters in title', () => {
    const specialTitle = 'Patient Info & Consent (Required)';
    render(<FieldGroupHeading text={specialTitle} />);
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });

  it('should render with custom flex direction', () => {
    const { container } = render(
      <FieldGroupHeading text="Test" className="flex-row gap-4" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex-row');
  });

  it('should render with custom gap spacing', () => {
    const { container } = render(
      <FieldGroupHeading text="Test" className="flex flex-col gap-6" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('gap-6');
    expect(wrapper).not.toHaveClass('gap-2');
  });

  it('should accept additional utility classes', () => {
    const { container } = render(
      <FieldGroupHeading
        text="Test"
        className="flex flex-col gap-2 mt-2 mb-4"
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('mb-4', 'mt-2', 'gap-2');
  });

  it('should maintain semantic structure with default className', () => {
    const { container } = render(<FieldGroupHeading text="Test" />);
    const wrapper = container.firstChild as HTMLElement;
    // Flex column creates vertical layout
    expect(wrapper).toHaveClass('flex', 'flex-col');
    expect(wrapper.children.length).toBe(2);
  });

  it('should render separator with proper HTML semantic', () => {
    const { container } = render(<FieldGroupHeading text="Section" />);
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
    // Separator uses data-slot attribute from shadcn/ui
    expect(separator?.getAttribute('data-slot')).toBe('separator');
  });
});
