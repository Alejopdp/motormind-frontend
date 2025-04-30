import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/Dialog';
import { Button } from '@/components/atoms/Button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Textarea } from '@/components/atoms/Textarea';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wasUseful: boolean, ratingNotes: string, callback: () => void) => void;
  isLoading?: boolean;
}

export const RatingModal = ({ isOpen, onClose, onSubmit, isLoading }: RatingModalProps) => {
  const [wasUseful, setWasUseful] = useState<boolean | null>(null);
  const [ratingNotes, setRatingNotes] = useState('');

  const handleSubmit = () => {
    if (wasUseful === null) return;
    onSubmit(wasUseful, ratingNotes, () => '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>¿Te ha sido útil este diagnóstico?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex justify-center gap-4">
            <Button
              variant={wasUseful === true ? 'default' : 'outline'}
              size="lg"
              onClick={() => setWasUseful(true)}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-5 w-5 text-green-500" />
              Sí
            </Button>
            <Button
              variant={wasUseful === false ? 'default' : 'outline'}
              size="lg"
              onClick={() => setWasUseful(false)}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="h-5 w-5 text-red-500" />
              No
            </Button>
          </div>

          <div>
            <p className="mb-1 text-sm">Comentarios sobre el diagnóstico (opcional)</p>
            <Textarea
              value={ratingNotes}
              onChange={(e) => setRatingNotes(e.target.value)}
              placeholder="¿Hay algo que quieras compartir sobre el diagnóstico?"
              className="min-h-[100px] resize-y"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={wasUseful === null || isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar valoración'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
