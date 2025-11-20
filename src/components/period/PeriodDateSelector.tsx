
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCycle } from '@/context/CycleContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface PeriodDateSelectorProps {
  label: string;
  date: Date | null;
  onSelect: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean; // Add the disabled prop to the interface
}

export const PeriodDateSelector: React.FC<PeriodDateSelectorProps> = ({
  label,
  date,
  onSelect,
  minDate,
  maxDate,
  disabled = false, // Default to false if not provided
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled} // Use the disabled prop here
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={(selectedDate) => onSelect(selectedDate || null)}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
