import { renderWithProviders } from '@/tests/utils';
import { screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('should render title as h1 element', () => {
    renderWithProviders(<PageHeader title="Settings" />);
    const heading = screen.getByRole('heading', { level: 1, name: 'Settings' });
    expect(heading).toBeInTheDocument();
  });

  it('should render title with correct styling classes', () => {
    renderWithProviders(<PageHeader title="Dashboard" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('font-bold', 'text-2xl');
  });

  it('should render optional description when provided', () => {
    renderWithProviders(
      <PageHeader
        title="Users"
        description="Manage system users and permissions"
      />
    );
    expect(
      screen.getByText('Manage system users and permissions')
    ).toBeInTheDocument();
  });

  it('should render empty paragraph when description is not provided', () => {
    const { container } = renderWithProviders(<PageHeader title="Test" />);
    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('text-muted-foreground', 'text-sm');
  });

  it('should render empty string description with muted styling', () => {
    const { container } = renderWithProviders(
      <PageHeader title="Test" description="" />
    );
    const paragraph = container.querySelector('p');
    expect(paragraph?.textContent).toBe('');
    expect(paragraph).toHaveClass('text-muted-foreground');
  });

  it('should apply default container className', () => {
    const { container } = renderWithProviders(<PageHeader title="Test" />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass('flex', 'flex-col', 'gap-2');
  });

  it('should override container className when provided', () => {
    const { container } = renderWithProviders(
      <PageHeader title="Test" className="gap-4 custom-class" />
    );
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass('custom-class', 'gap-4');
    expect(div).not.toHaveClass('gap-2');
  });

  it('should maintain wrapper structure with both title and description', () => {
    const { container } = renderWithProviders(
      <PageHeader title="Patients" description="View all patient records" />
    );
    const wrapper = container.firstChild as HTMLElement;
    const children = wrapper.children;
    expect(children.length).toBe(2);
    expect(children[0].tagName).toBe('H1');
    expect(children[1].tagName).toBe('P');
  });

  it('should handle long titles without truncation', () => {
    const longTitle =
      'This is a very long page title that should display completely';
    renderWithProviders(<PageHeader title={longTitle} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(longTitle);
  });

  it('should handle descriptions with special characters', () => {
    const specialDescription = 'Manage users & permissions (primary role)';
    renderWithProviders(
      <PageHeader title="Test" description={specialDescription} />
    );
    expect(screen.getByText(specialDescription)).toBeInTheDocument();
  });
});
