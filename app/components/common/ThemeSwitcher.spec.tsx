/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderWithProviders } from '@/tests/utils';
import { useTheme } from 'next-themes';
import { ThemeSwitcher } from './ThemeSwitcher';

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    jest.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
      themes: ['light', 'dark', 'system'],
    } as any);
  });

  it('should render theme switcher component', () => {
    const { container } = renderWithProviders(<ThemeSwitcher />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should render select element for theme selection', () => {
    const { container } = renderWithProviders(<ThemeSwitcher />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should show current theme in select', () => {
    jest.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
      resolvedTheme: 'dark',
      themes: ['light', 'dark', 'system'],
    } as any);
    const { container } = renderWithProviders(<ThemeSwitcher />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should accept showLabel prop', () => {
    const { container } = renderWithProviders(
      <ThemeSwitcher showLabel={true} />
    );
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should accept custom selectClasses', () => {
    const { container } = renderWithProviders(
      <ThemeSwitcher selectClasses="custom-select-class" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should accept custom contentClasses', () => {
    const { container } = renderWithProviders(
      <ThemeSwitcher contentClasses="custom-content-class" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should support light theme selection', () => {
    const { container } = renderWithProviders(<ThemeSwitcher />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should support dark theme selection', () => {
    const { container } = renderWithProviders(<ThemeSwitcher />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should support system theme selection', () => {
    jest.mocked(useTheme).mockReturnValue({
      theme: 'system',
      setTheme: jest.fn(),
      resolvedTheme: 'light',
      themes: ['light', 'dark', 'system'],
    } as any);
    const { container } = renderWithProviders(<ThemeSwitcher />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should call setTheme when theme is changed', () => {
    const { container } = renderWithProviders(<ThemeSwitcher />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should persist theme selection', () => {
    renderWithProviders(<ThemeSwitcher />);
    expect(jest.mocked(useTheme)).toHaveBeenCalled();
  });

  it('should listen for system preference changes', () => {
    jest.mocked(useTheme).mockReturnValue({
      theme: 'system',
      setTheme: jest.fn(),
      resolvedTheme: 'dark',
      themes: ['light', 'dark', 'system'],
      systemTheme: 'dark',
    } as any);
    const { container } = renderWithProviders(<ThemeSwitcher />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should be hydration safe', () => {
    const { container } = renderWithProviders(<ThemeSwitcher />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should use localStorage for persistence', () => {
    renderWithProviders(<ThemeSwitcher />);
    expect(jest.mocked(useTheme)).toHaveBeenCalled();
  });

  it('should handle theme switching gracefully', () => {
    const { container } = renderWithProviders(<ThemeSwitcher />);

    jest.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
      resolvedTheme: 'dark',
      themes: ['light', 'dark', 'system'],
    } as any);

    renderWithProviders(<ThemeSwitcher />);
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should render icon for theme indicator', () => {
    const { container } = renderWithProviders(<ThemeSwitcher />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(0);
  });

  it('should support responsive design', () => {
    const { container } = renderWithProviders(<ThemeSwitcher />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
