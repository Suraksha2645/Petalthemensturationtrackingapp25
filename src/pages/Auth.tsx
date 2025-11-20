import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MenstruationQuestionnaire, MenstruationFormData } from '@/components/cycle/MenstruationQuestionnaire';
import { PeriodHistoryQuestionnaire } from '@/components/cycle/PeriodHistoryQuestionnaire';
import { LifestyleQuestionnaire, LifestyleFormData } from '@/components/cycle/LifestyleQuestionnaire';
import { predictCycleLengthFromHistory } from '@/utils/cycleCalculations';

const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().optional(),
});

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'signIn' | 'signUp' | 'menstruation' | 'lifestyle' | 'history'>('signIn');
  const [authData, setAuthData] = useState<z.infer<typeof authSchema> | null>(null);
  const [menstruationData, setMenstruationData] = useState<MenstruationFormData | null>(null);
  const [lifestyleData, setLifestyleData] = useState<LifestyleFormData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkUser();
  }, [navigate]);

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof authSchema>) => {
    setIsLoading(true);
    try {
      if (mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (error) throw error;
        toast.success("Successfully signed in to Petal Flow Freely!");
        navigate('/');
      } else {
        // For signup, first store the auth data and show the questionnaire
        setAuthData(values);
        setMode('menstruation');
        setIsLoading(false);
        return;
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during authentication");
      setIsLoading(false);
    }
  };

  const handleMenstruationSubmit = async (menstruationFormData: MenstruationFormData) => {
    setMenstruationData(menstruationFormData);
    setMode('lifestyle');
  };

  const handleLifestyleSubmit = async (lifestyleFormData: LifestyleFormData) => {
    setLifestyleData(lifestyleFormData);
    setMode('history');
  };

  const handleLifestyleSkip = () => {
    setLifestyleData(null);
    setMode('history');
  };

  const handleHistorySubmit = async (periodHistory: { startDate: Date; endDate: Date | null }[]) => {
    if (!authData || !menstruationData) return;
    
    setIsLoading(true);
    
    try {
      // Format period history for calculations
      const historicalPeriods = periodHistory
        .filter(p => p.startDate && p.endDate)
        .map(p => ({
          startDate: p.startDate.toISOString(),
          endDate: p.endDate ? p.endDate.toISOString() : null
        }));
      
      // Always use historical data to predict cycle length instead of asking the user
      const predictedCycleLength = 
        historicalPeriods.length >= 2
          ? predictCycleLengthFromHistory(historicalPeriods)
          : 28; // Use default if not enough history
          
      console.log(`Predicted cycle length from history: ${predictedCycleLength} days`);
          
      // Calculate average period length from historical data
      const periodLengths = historicalPeriods
        .filter(p => p.endDate)
        .map(p => {
          const start = new Date(p.startDate);
          const end = new Date(p.endDate!);
          return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // +1 because both days are inclusive
        });
      
      const avgPeriodLength = 
        periodLengths.length > 0
          ? Math.round(periodLengths.reduce((sum, length) => sum + length, 0) / periodLengths.length)
          : menstruationData.periodLength;

      // Register the user with the calculated data including lifestyle information
      const { error } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
        options: {
          data: {
            full_name: authData.fullName || '',
            // Use last period date from menstruation questionnaire
            last_period_date: menstruationData.lastPeriodDate.toISOString(),
            // Use predicted cycle length from history
            cycle_length: predictedCycleLength,
            // Use average period length from history or questionnaire input
            period_length: avgPeriodLength,
            cycle_regularity: menstruationData.cycleRegularity,
            // Store historical data for future reference
            period_history: historicalPeriods,
            // Store lifestyle data for better predictions
            lifestyle_data: lifestyleData,
          },
        },
      });
      
      if (error) throw error;
      toast.success("Account created successfully! Check your email for verification.");
      
      // We'll also save this data to the local cycle context
      localStorage.setItem('cycleData', JSON.stringify({
        startDate: menstruationData.lastPeriodDate.toISOString(),
        endDate: new Date(new Date(menstruationData.lastPeriodDate).setDate(
          menstruationData.lastPeriodDate.getDate() + avgPeriodLength - 1
        )).toISOString(),
        cycleLength: predictedCycleLength,
        periodLength: avgPeriodLength,
        logs: []
      }));
      
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg">
        {mode === 'history' ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Period History
              </CardTitle>
              <CardDescription className="text-center">
                Help us improve your cycle predictions by sharing your recent period history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PeriodHistoryQuestionnaire 
                onSubmit={handleHistorySubmit}
                isLoading={isLoading}
              />
            </CardContent>
            <CardFooter>
              <Button 
                variant="link" 
                className="w-full" 
                onClick={() => {
                  // Submit with empty history if skipped
                  handleHistorySubmit([]);
                }}
              >
                Skip this step
              </Button>
            </CardFooter>
          </>
        ) : mode === 'lifestyle' ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Lifestyle & Health
              </CardTitle>
              <CardDescription className="text-center">
                This information helps us provide more accurate predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LifestyleQuestionnaire 
                onSubmit={handleLifestyleSubmit}
                onSkip={handleLifestyleSkip}
                isLoading={isLoading}
              />
            </CardContent>
            <CardFooter>
              <Button 
                variant="link" 
                className="w-full" 
                onClick={() => setMode('menstruation')}
              >
                Go back to cycle information
              </Button>
            </CardFooter>
          </>
        ) : mode === 'menstruation' ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Menstrual Cycle Information
              </CardTitle>
              <CardDescription className="text-center">
                Help us personalize your Petal Flow Freely experience by providing some information about your cycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MenstruationQuestionnaire 
                onSubmit={handleMenstruationSubmit}
                isLoading={isLoading}
              />
            </CardContent>
            <CardFooter>
              <Button 
                variant="link" 
                className="w-full" 
                onClick={() => setMode('signUp')}
              >
                Go back to sign up form
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {mode === 'signIn' ? 'Sign In to Petal Flow Freely' : 'Create a Petal Flow Freely Account'}
              </CardTitle>
              <CardDescription className="text-center">
                {mode === 'signIn' ? 'Enter your email and password to sign in' : 'Enter your details to create an account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  {mode === 'signUp' && (
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Processing...' : mode === 'signIn' ? 'Sign In' : 'Continue'}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <Button 
                variant="link" 
                className="w-full" 
                onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
              >
                {mode === 'signIn' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default Auth;
