import { Copy, EyeIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DialogBooking() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={'icon'} className="h-9 w-9">
          <EyeIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Informacion Reserva</DialogTitle>
          <DialogDescription>
            El Lunes dia 21 de noviembre, 2024
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
            blanditiis, aliquam itaque magnam repudiandae corrupti aperiam.
            Tempora neque perspiciatis qui voluptatum accusantium aspernatur
            dolore laboriosam esse dolor dolorem, eligendi quod?
          </p>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
