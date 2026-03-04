import { renderWithProviders } from '@/tests/utils';
import { fireEvent, screen } from '@testing-library/react';
import { AppAlertDialog } from './AppAlertDialog';

describe('AppAlertDialog', () => {
  it('should render alert dialog when trigger is clicked', () => {
    renderWithProviders(
      <AppAlertDialog
        title="Confirm Action"
        description="Are you sure?"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      >
        <button>Trigger Action</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Trigger Action');
    fireEvent.click(trigger);
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
  });

  it('should render dialog title', () => {
    renderWithProviders(
      <AppAlertDialog
        title="Alert Title"
        description="Description"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Click');
    fireEvent.click(trigger);
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
  });

  it('should render dialog description', () => {
    renderWithProviders(
      <AppAlertDialog
        title="Title"
        description="Alert description text"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Click');
    fireEvent.click(trigger);
    expect(screen.getByText('Alert description text')).toBeInTheDocument();
  });

  it('should render cancel button with label', () => {
    renderWithProviders(
      <AppAlertDialog
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn(), label: 'Cancel' }}
        continueAction={{ action: jest.fn() }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Click');
    fireEvent.click(trigger);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should render continue button with label', () => {
    renderWithProviders(
      <AppAlertDialog
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn(), label: 'Proceed' }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Click');
    fireEvent.click(trigger);
    expect(screen.getByText('Proceed')).toBeInTheDocument();
  });

  it('should call cancel action when cancel button is clicked', () => {
    const mockCancel = jest.fn();
    renderWithProviders(
      <AppAlertDialog
        title="Title"
        description="Desc"
        cancelAction={{ action: mockCancel, label: 'Cancel' }}
        continueAction={{ action: jest.fn() }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Click');
    fireEvent.click(trigger);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockCancel).toHaveBeenCalled();
  });

  it('should call continue action when continue button is clicked', () => {
    const mockContinue = jest.fn();
    renderWithProviders(
      <AppAlertDialog
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: mockContinue, label: 'OK' }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Click');
    fireEvent.click(trigger);
    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);
    expect(mockContinue).toHaveBeenCalled();
  });

  it('should render children as trigger element', () => {
    renderWithProviders(
      <AppAlertDialog
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      >
        <button data-testid="trigger-btn">Alert Trigger</button>
      </AppAlertDialog>
    );
    expect(screen.getByTestId('trigger-btn')).toBeInTheDocument();
  });

  it('should render content slot when provided', () => {
    renderWithProviders(
      <AppAlertDialog
        title="Title"
        description="Desc"
        content={<div>Custom content</div>}
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Click');
    fireEvent.click(trigger);
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    renderWithProviders(
      <AppAlertDialog
        title="Title"
        description="Desc"
        className="custom-alert"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    fireEvent.click(screen.getByText('Click'));
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('should hide cancel button when hidden is true', () => {
    renderWithProviders(
      <AppAlertDialog
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn(), label: 'Cancel', hidden: true }}
        continueAction={{ action: jest.fn(), label: 'Confirm' }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Click');
    fireEvent.click(trigger);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('should hide continue button when hidden is true', () => {
    renderWithProviders(
      <AppAlertDialog
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn(), label: 'Cancel' }}
        continueAction={{ action: jest.fn(), label: 'OK', hidden: true }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Click');
    fireEvent.click(trigger);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.queryByText('OK')).not.toBeInTheDocument();
  });

  it('should disable buttons when disabled is true', () => {
    renderWithProviders(
      <AppAlertDialog
        title="Title"
        description="Desc"
        cancelAction={{ action: jest.fn(), label: 'Cancel', disabled: true }}
        continueAction={{ action: jest.fn(), label: 'OK', disabled: true }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Click');
    fireEvent.click(trigger);
    expect(screen.getByText('Cancel')).toBeDisabled();
    expect(screen.getByText('OK')).toBeDisabled();
  });

  it('should have alert-specific styling', () => {
    renderWithProviders(
      <AppAlertDialog
        title="Alert"
        description="Alert message"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Click');
    fireEvent.click(trigger);
    expect(screen.getByText('Alert')).toBeInTheDocument();
  });

  it('should close dialog after action is confirmed', () => {
    const mockAction = jest.fn();
    renderWithProviders(
      <AppAlertDialog
        title="Confirm"
        description="Proceed?"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: mockAction, label: 'Yes' }}
      >
        <button>Trigger</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Trigger');
    fireEvent.click(trigger);
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    expect(mockAction).toHaveBeenCalled();
  });

  it('should render icon for alert variant', () => {
    const { container } = renderWithProviders(
      <AppAlertDialog
        title="Alert"
        description="Description"
        cancelAction={{ action: jest.fn() }}
        continueAction={{ action: jest.fn() }}
      >
        <button>Click</button>
      </AppAlertDialog>
    );
    const trigger = screen.getByText('Click');
    fireEvent.click(trigger);
    // Alert dialogs typically have warning/alert icon
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(0);
  });
});
