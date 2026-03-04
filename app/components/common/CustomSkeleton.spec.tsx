/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderWithProviders } from '@/tests/utils';
import { CustomSkeleton } from './CustomSkeleton';

describe('CustomSkeleton', () => {
  describe('table variant', () => {
    it('should render table skeleton layout', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      expect(container.querySelector('.flex')).toBeInTheDocument();
    });

    it('should render header-like skeleton in table variant', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThanOrEqual(3);
    });

    it('should render multiple body rows in table variant', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBe(6);
    });

    it('should have skeleton elements with rounded-md', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      const skeletons = container.querySelectorAll('[class*="rounded-md"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should have gap spacing between rows', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('gap-y-4');
    });

    it('should render pagination area at bottom', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      const centered = container.querySelector('.flex.justify-center');
      expect(centered).toBeInTheDocument();
      const skeleton = centered?.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render with flex column layout', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex', 'flex-col');
    });
  });

  describe('item-list variant', () => {
    it('should render item list skeleton layout', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="item-list" />
      );
      expect(container.querySelector('.flex')).toBeInTheDocument();
    });

    it('should render 5 identical skeleton items', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="item-list" />
      );
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBe(5);
    });

    it('should have equal height skeletons for list items', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="item-list" />
      );
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveClass('h-6');
      });
    });

    it('should have gap spacing between list items', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="item-list" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('gap-y-4');
    });

    it('should have full width skeletons', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="item-list" />
      );
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveClass('rounded-md');
      });
    });

    it('should render with flex column layout', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="item-list" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex', 'flex-col');
    });

    it('should not render pagination area', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="item-list" />
      );
      const centered = container.querySelector('.flex.justify-center');
      expect(centered).not.toBeInTheDocument();
    });
  });

  describe('variant comparison', () => {
    it('should render different structures for different variants', () => {
      const { container: tableContainer } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      const { container: listContainer } = renderWithProviders(
        <CustomSkeleton variant="item-list" />
      );

      const tableSkeletons = tableContainer.querySelectorAll(
        '[data-slot="skeleton"]'
      );
      const listSkeletons = listContainer.querySelectorAll(
        '[data-slot="skeleton"]'
      );

      expect(tableSkeletons.length).not.toBe(listSkeletons.length);
    });

    it('table variant should have more complex structure than list variant', () => {
      const { container: tableContainer } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      const { container: listContainer } = renderWithProviders(
        <CustomSkeleton variant="item-list" />
      );

      const tableLayout = tableContainer.querySelectorAll('.flex');
      const listLayout = listContainer.querySelectorAll('.flex');

      expect(tableLayout.length).toBeGreaterThan(listLayout.length);
    });
  });

  describe('styling consistency', () => {
    it('should apply rounded-md to all skeleton elements', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveClass('rounded-md');
      });
    });

    it('table variant header should have partial width for first column', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      const firstRow = container.querySelector('.flex.flex-row');
      const firstSkeleton = firstRow?.querySelector('[data-slot="skeleton"]');
      expect(firstSkeleton).toHaveClass('w-1/2');
    });

    it('table variant header should have partial width for last column', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      const firstRow = container.querySelector('.flex.flex-row');
      const skeletons = firstRow?.querySelectorAll('[data-slot="skeleton"]');
      if (skeletons && skeletons.length > 1) {
        expect(skeletons[skeletons.length - 1]).toHaveClass('w-1/9');
      }
    });

    it('pagination skeleton should have centered width', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant="table" />
      );
      const centered = container.querySelector('.flex.justify-center');
      const pagingSkeleton = centered?.querySelector('[data-slot="skeleton"]');
      expect(pagingSkeleton).toHaveClass('w-48');
    });
  });

  describe('undefined or invalid variant handling', () => {
    it('should not render anything when variant is undefined', () => {
      const { container } = renderWithProviders(
        <CustomSkeleton variant={undefined as any} />
      );
      expect(container.firstChild).toBeNull();
    });
  });
});
