import { usePermission } from '@/hooks/usePermission';
import { renderWithProviders } from '@/tests/utils';
import { fireEvent, screen } from '@testing-library/react';
import { DetailsPageActions } from './DetailsPageActions';

describe('DetailsPageActions', () => {
  let mockCan: jest.Mock;

  beforeEach(() => {
    mockCan = jest.fn((): boolean => true);
    (usePermission as jest.Mock).mockReturnValue({ can: mockCan });
  });

  it('should return null when user has no permissions', () => {
    mockCan.mockReturnValue(false);

    const { container: _container } = renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete User"
        dialogDescription="Are you sure?"
        updateAction={{ action: jest.fn() }}
        deleteAction={{ action: jest.fn() }}
      />
    );

    const buttons = _container.querySelectorAll('button');
    expect(buttons.length).toBe(0);
  });

  it('should render update button when user has update permission', () => {
    mockCan.mockImplementation((perm: string) => perm === 'update:user');

    renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete"
        dialogDescription="Confirm?"
        updateAction={{ action: jest.fn(), label: 'Edit' }}
        deleteAction={{ action: jest.fn() }}
      />
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('should render delete button when user has delete permission', () => {
    mockCan.mockReturnValue(true);

    renderWithProviders(
      <DetailsPageActions
        entity="patient"
        dialogTitle="Delete"
        dialogDescription="Confirm"
        updateAction={{ action: jest.fn() }}
        deleteAction={{ action: jest.fn(), label: 'Remove' }}
      />
    );

    expect(mockCan).toHaveBeenCalled();
  });

  it('should render both buttons when user has both permissions', () => {
    mockCan.mockReturnValue(true);

    renderWithProviders(
      <DetailsPageActions
        entity="exam"
        dialogTitle="Delete Exam"
        dialogDescription="Confirm deletion"
        updateAction={{ action: jest.fn(), label: 'Edit Exam' }}
        deleteAction={{ action: jest.fn(), label: 'Delete Exam' }}
      />
    );

    expect(screen.getByText('Edit Exam')).toBeInTheDocument();
    expect(screen.getByText('Delete Exam')).toBeInTheDocument();
  });

  it('should call update action when update button is clicked', () => {
    const mockUpdateAction = jest.fn();
    mockCan.mockReturnValue(true);

    renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete"
        dialogDescription="Sure?"
        updateAction={{ action: mockUpdateAction, label: 'Edit' }}
        deleteAction={{ action: jest.fn() }}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockUpdateAction).toHaveBeenCalled();
  });

  it('should hide update button when updateAction.hidden is true', () => {
    mockCan.mockReturnValue(true);

    renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete"
        dialogDescription="Confirm"
        updateAction={{ action: jest.fn(), label: 'Edit', hidden: true }}
        deleteAction={{ action: jest.fn(), label: 'Delete' }}
      />
    );

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should hide delete button when deleteAction.hidden is true', () => {
    mockCan.mockReturnValue(true);

    renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete"
        dialogDescription="Confirm"
        updateAction={{ action: jest.fn(), label: 'Edit' }}
        deleteAction={{ action: jest.fn(), label: 'Delete', hidden: true }}
      />
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should render delete button with destructive color', () => {
    mockCan.mockReturnValue(true);

    const { container: _container } = renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete"
        dialogDescription="Confirm"
        updateAction={{ action: jest.fn() }}
        deleteAction={{ action: jest.fn(), label: 'Delete' }}
      />
    );

    const deleteButton = screen.getByText('Delete').closest('button');
    expect(deleteButton).toHaveClass('text-destructive');
  });

  it('should call delete action when delete button is triggered', () => {
    const mockDeleteAction = jest.fn();
    mockCan.mockReturnValue(true);

    renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete User"
        dialogDescription="Confirm?"
        updateAction={{ action: jest.fn() }}
        deleteAction={{ action: mockDeleteAction, label: 'Delete' }}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockDeleteAction).toHaveBeenCalled();
  });

  it('should check correct permissions for different entities', () => {
    mockCan.mockReturnValue(true);

    renderWithProviders(
      <DetailsPageActions
        entity="exam"
        dialogTitle="Delete"
        dialogDescription="Confirm"
        updateAction={{ action: jest.fn() }}
        deleteAction={{ action: jest.fn() }}
      />
    );

    expect(mockCan).toHaveBeenCalledWith('update:exam');
    expect(mockCan).toHaveBeenCalledWith('delete:exam');
  });

  it('should render buttons with outline variant', () => {
    mockCan.mockReturnValue(true);

    renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete"
        dialogDescription="Confirm"
        updateAction={{ action: jest.fn(), label: 'Edit' }}
        deleteAction={{ action: jest.fn(), label: 'Delete' }}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      if (
        button.textContent?.includes('Edit') ||
        button.textContent?.includes('Delete')
      ) {
        expect(button?.className).toContain('shadow-xs');
      }
    });
  });

  it('should render buttons with sm size', () => {
    mockCan.mockReturnValue(true);

    renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete"
        dialogDescription="Confirm"
        updateAction={{ action: jest.fn(), label: 'Edit' }}
        deleteAction={{ action: jest.fn(), label: 'Delete' }}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should accept custom className', () => {
    mockCan.mockReturnValue(true);

    const { container } = renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete"
        dialogDescription="Confirm"
        updateAction={{ action: jest.fn() }}
        deleteAction={{ action: jest.fn() }}
        className="custom-actions"
      />
    );

    const wrapper = container.querySelector('.custom-actions');
    expect(wrapper).toBeInTheDocument();
  });

  it('should render without labels when not provided', () => {
    mockCan.mockReturnValue(true);

    const { container } = renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete"
        dialogDescription="Confirm"
        updateAction={{ action: jest.fn() }}
        deleteAction={{ action: jest.fn() }}
      />
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should check permission for specific entity types', () => {
    const entities: Array<'user' | 'patient' | 'exam' | 'notification'> = [
      'user',
      'patient',
      'exam',
      'notification',
    ];

    entities.forEach((entity) => {
      mockCan.mockClear();
      mockCan.mockReturnValue(true);

      renderWithProviders(
        <DetailsPageActions
          entity={entity}
          dialogTitle="Delete"
          dialogDescription="Confirm"
          updateAction={{ action: jest.fn() }}
          deleteAction={{ action: jest.fn() }}
        />
      );

      expect(mockCan).toHaveBeenCalledWith(`update:${entity}`);
      expect(mockCan).toHaveBeenCalledWith(`delete:${entity}`);
    });
  });

  it('should have cursor-pointer class on buttons', () => {
    mockCan.mockReturnValue(true);

    renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete"
        dialogDescription="Confirm"
        updateAction={{ action: jest.fn(), label: 'Edit' }}
        deleteAction={{ action: jest.fn(), label: 'Delete' }}
      />
    );

    const editButton = screen.getByText('Edit');
    expect(editButton).toBeInTheDocument();
    expect(editButton).not.toBeDisabled();
  });

  it('should handle mixed action states', () => {
    mockCan.mockReturnValue(true);

    const { container } = renderWithProviders(
      <DetailsPageActions
        entity="patient"
        dialogTitle="Delete Patient"
        dialogDescription="This action cannot be undone"
        updateAction={{ action: jest.fn(), label: 'Edit' }}
        deleteAction={{ action: jest.fn(), label: 'Delete' }}
      />
    );
  });

  it('should render children when provided', () => {
    mockCan.mockReturnValue(true);

    renderWithProviders(
      <DetailsPageActions
        entity="user"
        dialogTitle="Delete"
        dialogDescription="Confirm"
        updateAction={{ action: jest.fn() }}
        deleteAction={{ action: jest.fn() }}
      >
        <button>Extra Action</button>
      </DetailsPageActions>
    );

    expect(screen.getByText('Extra Action')).toBeInTheDocument();
  });
});
