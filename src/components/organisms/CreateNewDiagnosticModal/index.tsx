import { Dialog } from '@headlessui/react';
import { cn } from '@/utils/cn';

interface CreateNewDiagnosticModalWithManualProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  className?: string;
}

export const CreateNewDiagnosticModal = ({
  open,
  onOpenChange,
  onSubmit,
  className,
}: CreateNewDiagnosticModalWithManualProps) => {
  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      className={cn('relative z-50', className)}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium">Create New Diagnostic</Dialog.Title>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              This is a placeholder for the diagnostic creation form.
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-[#2A7DE1] px-4 py-2 text-sm font-medium text-white hover:bg-[#2468BE]"
              onClick={onSubmit}
            >
              Create
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
