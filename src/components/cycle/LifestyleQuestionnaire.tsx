
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const lifestyleSchema = z.object({
  age: z.number().min(10).max(65).optional(),
  stressLevel: z.enum(['low', 'moderate', 'high']),
  exerciseFrequency: z.enum(['none', 'light', 'moderate', 'intense']),
  sleepQuality: z.enum(['poor', 'fair', 'good', 'excellent']),
  contraceptiveType: z.enum(['none', 'pill', 'iud', 'implant', 'patch', 'ring', 'other']),
  healthConditions: z.array(z.string()).optional(),
  medications: z.string().optional(),
  smokingStatus: z.enum(['never', 'former', 'current']),
  dietType: z.enum(['standard', 'vegetarian', 'vegan', 'keto', 'other']),
  weightChanges: z.enum(['stable', 'gaining', 'losing', 'fluctuating']),
  workSchedule: z.enum(['regular', 'shift', 'irregular']),
  travelFrequency: z.enum(['rare', 'occasional', 'frequent']),
  notes: z.string().optional(),
});

export type LifestyleFormData = z.infer<typeof lifestyleSchema>;

interface LifestyleQuestionnaireProps {
  onSubmit: (data: LifestyleFormData) => void;
  isLoading?: boolean;
  onSkip: () => void;
}

export const LifestyleQuestionnaire: React.FC<LifestyleQuestionnaireProps> = ({
  onSubmit,
  isLoading = false,
  onSkip
}) => {
  const form = useForm<LifestyleFormData>({
    resolver: zodResolver(lifestyleSchema),
    defaultValues: {
      stressLevel: 'moderate',
      exerciseFrequency: 'moderate',
      sleepQuality: 'good',
      contraceptiveType: 'none',
      healthConditions: [],
      smokingStatus: 'never',
      dietType: 'standard',
      weightChanges: 'stable',
      workSchedule: 'regular',
      travelFrequency: 'occasional',
    },
  });

  const healthConditionOptions = [
    'PCOS (Polycystic Ovary Syndrome)',
    'Endometriosis',
    'Thyroid disorder',
    'Diabetes',
    'Eating disorder',
    'Chronic stress/anxiety',
    'Depression',
    'Other hormonal disorder'
  ];

  const handleSubmit = (data: LifestyleFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-medium text-primary mb-2">Lifestyle & Health Information</h2>
        <p className="text-muted-foreground text-sm">
          This information helps us provide more accurate cycle predictions by understanding factors that can influence your menstrual cycle.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Age */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="25"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>
                  Age can affect cycle patterns and hormonal changes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stress Level */}
          <FormField
            control={form.control}
            name="stressLevel"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>How would you rate your typical stress level?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="low" />
                      </FormControl>
                      <FormLabel className="font-normal">Low - Generally relaxed and calm</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="moderate" />
                      </FormControl>
                      <FormLabel className="font-normal">Moderate - Some stress but manageable</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="high" />
                      </FormControl>
                      <FormLabel className="font-normal">High - Frequently stressed or overwhelmed</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Exercise Frequency */}
          <FormField
            control={form.control}
            name="exerciseFrequency"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>How often do you exercise?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="none" />
                      </FormControl>
                      <FormLabel className="font-normal">None or rarely</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="light" />
                      </FormControl>
                      <FormLabel className="font-normal">Light (1-2 times per week)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="moderate" />
                      </FormControl>
                      <FormLabel className="font-normal">Moderate (3-4 times per week)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="intense" />
                      </FormControl>
                      <FormLabel className="font-normal">Intense (5+ times per week or competitive)</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sleep Quality */}
          <FormField
            control={form.control}
            name="sleepQuality"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>How would you rate your sleep quality?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="poor" />
                      </FormControl>
                      <FormLabel className="font-normal">Poor - Frequent sleep issues</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="fair" />
                      </FormControl>
                      <FormLabel className="font-normal">Fair - Some sleep difficulties</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="good" />
                      </FormControl>
                      <FormLabel className="font-normal">Good - Generally sleep well</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="excellent" />
                      </FormControl>
                      <FormLabel className="font-normal">Excellent - Consistently great sleep</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contraceptive Type */}
          <FormField
            control={form.control}
            name="contraceptiveType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>What type of contraception do you currently use?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="none" />
                      </FormControl>
                      <FormLabel className="font-normal">None</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="pill" />
                      </FormControl>
                      <FormLabel className="font-normal">Birth control pill</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="iud" />
                      </FormControl>
                      <FormLabel className="font-normal">IUD (hormonal or copper)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="implant" />
                      </FormControl>
                      <FormLabel className="font-normal">Implant</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="patch" />
                      </FormControl>
                      <FormLabel className="font-normal">Patch</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ring" />
                      </FormControl>
                      <FormLabel className="font-normal">Vaginal ring</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="other" />
                      </FormControl>
                      <FormLabel className="font-normal">Other</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Health Conditions */}
          <FormField
            control={form.control}
            name="healthConditions"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
                    Do you have any of these health conditions? (Check all that apply)
                  </FormLabel>
                  <FormDescription>
                    These conditions can affect menstrual cycles
                  </FormDescription>
                </div>
                {healthConditionOptions.map((condition) => (
                  <FormField
                    key={condition}
                    control={form.control}
                    name="healthConditions"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={condition}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(condition)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), condition])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== condition
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {condition}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Work Schedule */}
          <FormField
            control={form.control}
            name="workSchedule"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>What's your typical work schedule?</FormLabel>
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
                      <FormLabel className="font-normal">Regular (9-5 or similar)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="shift" />
                      </FormControl>
                      <FormLabel className="font-normal">Shift work (nights, rotating shifts)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="irregular" />
                      </FormControl>
                      <FormLabel className="font-normal">Irregular schedule</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional notes (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any other information about your health, lifestyle, or cycle that might be relevant..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Share anything else that might affect your menstrual cycle
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Processing..." : "Continue"}
            </Button>
            <Button type="button" variant="outline" onClick={onSkip} disabled={isLoading}>
              Skip
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
