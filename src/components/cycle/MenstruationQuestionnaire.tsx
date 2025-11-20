
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const menstruationSchema = z.object({
  lastPeriodDate: z.date({
    required_error: "Please select the date of your last period",
  }),
  periodLength: z.number({
    required_error: "Please enter your average period length",
  }).min(2, {
    message: "Period length must be at least 2 days",
  }).max(10, {
    message: "Period length must be at most 10 days",
  }),
  cycleRegularity: z.enum(['regular', 'somewhat-regular', 'irregular']),
});

export type MenstruationFormData = z.infer<typeof menstruationSchema>;

interface MenstruationQuestionnaireProps {
  onSubmit: (data: MenstruationFormData) => void;
  isLoading?: boolean;
}

export const MenstruationQuestionnaire: React.FC<MenstruationQuestionnaireProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const form = useForm<MenstruationFormData>({
    resolver: zodResolver(menstruationSchema),
    defaultValues: {
      lastPeriodDate: subDays(new Date(), 14),
      periodLength: 5,
      cycleRegularity: 'regular',
    },
  });

  const handleSubmit = (data: MenstruationFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-medium text-primary">Menstrual Cycle Information</h2>
      <p className="text-muted-foreground">
        Please provide some information about your menstrual cycle to help us personalize your experience.
        We'll automatically calculate your average cycle length based on your period history in the next step.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="lastPeriodDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>When did your last period start?</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This helps us calculate your cycle predictions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="periodLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Period Length (days)</FormLabel>
                <FormControl>
                  <Input
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  How many days your period typically lasts
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cycleRegularity"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>How regular are your cycles?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="regular" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Regular (variation of 1-2 days)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="somewhat-regular" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Somewhat regular (variation of 3-7 days)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="irregular" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Irregular (variation of more than 7 days)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-sm text-muted-foreground p-3 bg-primary/5 rounded-md">
            <p>Your cycle length will be automatically calculated based on your period history data in the next step.</p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Continue to Period History"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
