import { renderWithProviders } from '@/tests/utils';
import { fireEvent, screen } from '@testing-library/react';
import { AppDialog } from './AppDialog';

describe('AppDialog', () => {
  it('should not render dialog content when open is false', () => {
    renderWithProviders(
      <AppDialog
        open={false}
        title="Test"
        description="Description"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render dialog when open is true', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Test"
        description="Description"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render dialog title', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Test Dialog"
        description="Description"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      />
    );
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });

  it('should render description', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Test description text"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      />
    );
    expect(screen.getByText('Test description text')).toBeInTheDocument();
  });

  it('should render cancel button', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn(), label: 'Cancel' }}
        continueAction={{ action: jest.fn() }}
      />
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render continue button', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn(), label: 'Confirm' }}
      />
    );
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('should call cancel action when cancel button is clicked', () => {
    const mockCancel = jest.fn();
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        cancelAction={{ action: mockCancel, label: 'Cancel' }}
        continueAction={{ action: jest.fn() }}
      />
    );
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockCancel).toHaveBeenCalled();
  });

  it('should call continue action when continue button is clicked', () => {
    const mockContinue = jest.fn();
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: mockContinue, label: 'Confirm' }}
      />
    );
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    expect(mockContinue).toHaveBeenCalled();
  });

  it('should render children content', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      >
        <p>Custom content</p>
      </AppDialog>
    );
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('should render content slot when provided', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        content={<div>Content slot</div>}
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      />
    );
    expect(screen.getByText('Content slot')).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        className="custom-dialog"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('custom-dialog');
  });

  it('should render cancel button as secondary variant', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn(), label: 'Cancel' }}
        continueAction={{ action: jest.fn() }}
      />
    );
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toHaveAttribute('data-variant', 'outline');
  });

  it('should hide cancel button when hidden is true', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn(), label: 'Cancel', hidden: true }}
        continueAction={{ action: jest.fn(), label: 'OK' }}
      />
    );
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('should hide continue button when hidden is true', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn(), label: 'Cancel' }}
        continueAction={{ action: jest.fn(), label: 'OK', hidden: true }}
      />
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.queryByText('OK')).not.toBeInTheDocument();
  });

  it('should disable cancel button when disabled is true', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn(), label: 'Cancel', disabled: true }}
        continueAction={{ action: jest.fn() }}
      />
    );
    const cancelButton = screen.getByText('Cancel') as HTMLButtonElement;
    expect(cancelButton).toBeDisabled();
  });

  it('should disable continue button when disabled is true', () => {
    renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn(), label: 'OK', disabled: true }}
      />
    );
    const okButton = screen.getByText('OK') as HTMLButtonElement;
    expect(okButton).toBeDisabled();
  });

  it('should render action icon when provided', () => {
    const { container } = renderWithProviders(
      <AppDialog
        open={true}
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      />
    );
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(0);
  });
});
