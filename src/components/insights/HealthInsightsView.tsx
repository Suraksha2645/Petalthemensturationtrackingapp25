import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { BookOpen, Activity, AlertTriangle, Check } from 'lucide-react';
import { useCycle } from '@/context/CycleContext';
import { analyzeCycleData, analyzeSymptoms, CycleAnalysis } from '@/utils/cycleInsightsUtils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const HealthInsightsView: React.FC = () => {
  const { cycleData, predictedCycles, symptoms, symptomLogs } = useCycle();
  const [analysis, setAnalysis] = useState<CycleAnalysis | null>(null);
  const [symptomInsights, setSymptomInsights] = useState<string[]>([]);
  
  // Perform analysis when cycle data changes
  useEffect(() => {
    const cycleAnalysis = analyzeCycleData(cycleData, predictedCycles);
    setAnalysis(cycleAnalysis);
    
    const insights = analyzeSymptoms(symptomLogs, symptoms);
    setSymptomInsights(insights);
  }, [cycleData, predictedCycles, symptomLogs, symptoms]);

  return (
    <div className="space-y-6">
      <div className="bg-accent p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Health & Education Insights</h1>
        <p className="text-muted-foreground">
          Learn about reproductive health, menstrual cycles, and get personalized insights
        </p>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="analysis">Your Insights</TabsTrigger>
          <TabsTrigger value="cycles">Cycle Basics</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="fertility">Fertility</TabsTrigger>
          <TabsTrigger value="health">Health & Wellness</TabsTrigger>
        </TabsList>
        
        {/* New Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Your Cycle Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!cycleData.startDate ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>No cycle data yet</AlertTitle>
                  <AlertDescription>
                    Start tracking your period to receive personalized insights and recommendations.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Cycle Regularity</h3>
                    <div className={`px-3 py-1 rounded-full text-xs ${analysis?.isRegular ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {analysis?.isRegular ? 'Regular' : 'Irregular Patterns Detected'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Cycle Length</div>
                      <div className="text-2xl font-bold">{cycleData.cycleLength} days</div>
                      {analysis?.averageCycleLength !== cycleData.cycleLength && (
                        <div className="text-sm text-muted-foreground">
                          Average: {analysis?.averageCycleLength} days
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Period Length</div>
                      <div className="text-2xl font-bold">{cycleData.periodLength} days</div>
                    </div>
                  </div>
                  
                  {analysis?.irregularPatterns && analysis.irregularPatterns.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium text-amber-800 mb-2">Detected Patterns</h3>
                      <ul className="space-y-2">
                        {analysis.irregularPatterns.map((pattern, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                            <span>{pattern}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="font-medium mb-2">Recommendations</h3>
                    <ul className="space-y-2">
                      {analysis?.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {symptomInsights.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-medium mb-2">Symptom Insights</h3>
                        <ul className="space-y-2">
                          {symptomInsights.map((insight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">
                        <strong>Please note:</strong> These insights are generated based on your tracked data and general guidelines.
                      </p>
                      <p>
                        They should not replace professional medical advice. If you have concerns about your cycle regularity or symptoms, 
                        please consult a healthcare provider.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Understanding Your Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">What is a "regular" cycle?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    A regular cycle typically lasts between 21-35 days, with the period lasting 3-7 days. 
                    Cycle lengths may vary by a few days from cycle to cycle, but variations greater than 7-9 days 
                    might indicate irregularity.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">What causes irregular cycles?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Irregular cycles can be caused by stress, significant weight changes, excessive exercise, 
                    hormonal conditions like PCOS, thyroid disorders, or perimenopause.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">When should I see a doctor?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Consider consulting a healthcare provider if you regularly experience:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-1 text-sm text-muted-foreground">
                    <li>Cycles shorter than 21 days or longer than 35 days</li>
                    <li>Periods lasting longer than 7 days</li>
                    <li>Very heavy bleeding (soaking through protection every 1-2 hours)</li>
                    <li>Severe pain that interferes with daily activities</li>
                    <li>No period for more than 90 days (if not pregnant)</li>
                    <li>Bleeding between periods</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Keep existing tabs */}
        <TabsContent value="cycles" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Understanding Your Menstrual Cycle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The menstrual cycle is a natural process that occurs in people with uteruses. It's regulated by hormones and prepares the body for potential pregnancy each month.
              </p>
              
              <h3 className="font-medium text-lg mt-4">The Four Phases</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-cycle-lightPink/30 p-4 rounded-lg">
                  <h4 className="font-medium text-cycle-pink">1. Menstruation</h4>
                  <p className="text-sm mt-1">
                    The cycle begins with menstruation (your period), when the uterine lining sheds. This typically lasts 3-7 days.
                  </p>
                </div>
                
                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium text-secondary">2. Follicular Phase</h4>
                  <p className="text-sm mt-1">
                    The pituitary gland releases FSH, stimulating follicle growth in the ovaries. Estrogen levels rise.
                  </p>
                </div>
                
                <div className="bg-cycle-lavender/30 p-4 rounded-lg">
                  <h4 className="font-medium text-cycle-purple">3. Ovulation</h4>
                  <p className="text-sm mt-1">
                    A surge of LH causes a mature egg to be released from the ovary. This typically occurs around day 14 in a 28-day cycle.
                  </p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium">4. Luteal Phase</h4>
                  <p className="text-sm mt-1">
                    The follicle transforms into the corpus luteum, producing progesterone to prepare for pregnancy. If no pregnancy occurs, this phase ends with menstruation.
                  </p>
                </div>
              </div>
              
              <h3 className="font-medium text-lg mt-4">Cycle Length</h3>
              <p>
                A typical menstrual cycle lasts about 28 days, but cycles between 21-35 days are considered normal. The length can vary due to factors like stress, diet, exercise, and health conditions.
              </p>
              
              <Separator className="my-4" />
              
              <h3 className="font-medium text-lg">Did You Know?</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>The average person will experience about 450 periods in their lifetime</li>
                <li>Cycle length and flow can change throughout life</li>
                <li>Ovulation typically occurs 14 days before the next period, not necessarily on day 14</li>
                <li>Many people experience symptoms like mood changes, bloating, and breast tenderness due to hormone fluctuations</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Common Cycle Variations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                While a "textbook" cycle is often described as 28 days with ovulation on day 14, everyone's cycle is unique. Here are some common variations:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Short Cycles (21-24 days)</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Shorter cycles often mean a shorter follicular phase, while the luteal phase remains relatively constant. This can be normal or may indicate issues like hormonal imbalances.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Long Cycles (35-40 days)</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Longer cycles usually mean a longer follicular phase, with ovulation occurring later. This can be normal or relate to conditions like PCOS.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Irregular Cycles</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cycles that vary in length by more than 7-9 days are considered irregular. This can be caused by stress, weight changes, excessive exercise, or medical conditions.
                  </p>
                </div>
              </div>
              
              <div className="bg-accent p-4 rounded-lg mt-6">
                <h4 className="font-medium">When to Consult a Healthcare Provider:</h4>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Periods that suddenly become irregular after having been regular</li>
                  <li>Very heavy bleeding or periods lasting more than 7 days</li>
                  <li>Very painful periods that interfere with daily activities</li>
                  <li>No period for 90+ days (if not pregnant, breastfeeding, or in menopause)</li>
                  <li>Bleeding between periods</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="symptoms" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Menstrual Symptoms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Most people experience some symptoms before and during their periods. These are caused by hormonal fluctuations throughout the menstrual cycle.
              </p>
              
              <h3 className="font-medium text-lg mt-4">Common Physical Symptoms</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium">Cramps (Dysmenorrhea)</h4>
                  <p className="text-sm mt-1">
                    Caused by uterine contractions that help expel the uterine lining. Can range from mild to severe.
                  </p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Relief tips:</span> Heat therapy, gentle exercise, over-the-counter pain relievers, staying hydrated
                  </div>
                </div>
                
                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium">Breast Tenderness</h4>
                  <p className="text-sm mt-1">
                    Often occurs during the luteal phase due to increased progesterone and fluid retention.
                  </p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Relief tips:</span> Supportive bra, reducing salt intake, limiting caffeine
                  </div>
                </div>
                
                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium">Bloating</h4>
                  <p className="text-sm mt-1">
                    Water retention caused by hormonal changes, making you feel puffy or swollen.
                  </p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Relief tips:</span> Reducing salt intake, regular physical activity, avoiding carbonated drinks
                  </div>
                </div>
                
                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium">Headaches</h4>
                  <p className="text-sm mt-1">
                    Often linked to estrogen fluctuations, particularly the drop before menstruation starts.
                  </p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Relief tips:</span> Staying hydrated, adequate sleep, stress management, over-the-counter pain relievers
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium text-lg mt-6">Common Emotional Symptoms</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="bg-cycle-lavender/30 p-4 rounded-lg">
                  <h4 className="font-medium">Mood Swings</h4>
                  <p className="text-sm mt-1">
                    Rapid changes in mood related to fluctuating hormones, particularly estrogen and progesterone.
                  </p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Management:</span> Regular exercise, adequate sleep, mindfulness practices
                  </div>
                </div>
                
                <div className="bg-cycle-lavender/30 p-4 rounded-lg">
                  <h4 className="font-medium">Irritability</h4>
                  <p className="text-sm mt-1">
                    Feeling easily annoyed or frustrated, often in the days leading up to menstruation.
                  </p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Management:</span> Stress reduction techniques, communicating needs to others
                  </div>
                </div>
              </div>
              
              <div className="bg-cycle-lightPink/30 p-4 rounded-lg mt-6">
                <h4 className="font-medium">Premenstrual Syndrome (PMS)</h4>
                <p className="text-sm mt-2">
                  PMS refers to a combination of symptoms that occur 1-2 weeks before menstruation. About 75% of menstruating people experience some form of PMS.
                </p>
                <p className="text-sm mt-2">
                  Symptoms can include mood swings, irritability, anxiety, fatigue, food cravings, bloating, breast tenderness, and headaches.
                </p>
                <div className="mt-3 text-sm">
                  <span className="font-medium">Management:</span> Regular exercise, adequate sleep, balanced diet, stress reduction, and in some cases, medication prescribed by a healthcare provider.
                </div>
              </div>
              
              <div className="bg-destructive/10 p-4 rounded-lg mt-4">
                <h4 className="font-medium text-destructive">When to Seek Medical Help</h4>
                <p className="text-sm mt-1">
                  While many menstrual symptoms are normal, severe symptoms that disrupt daily life may require medical attention. Consider consulting a healthcare provider if you experience:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                  <li>Severe pain that doesn't improve with over-the-counter medication</li>
                  <li>Heavy bleeding (soaking through a pad/tampon every 1-2 hours)</li>
                  <li>Severe mood changes that interfere with relationships or daily activities</li>
                  <li>Symptoms of PMDD (Premenstrual Dysphoric Disorder), a more severe form of PMS</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fertility" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Fertility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium text-lg">The Fertile Window</h3>
              <p>
                The "fertile window" is the time during your menstrual cycle when pregnancy is possible. It includes the days leading up to and including ovulation.
              </p>
              <div className="mt-4">
                <div className="relative">
                  <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="w-1/4 border-r border-dashed border-gray-300 flex items-center justify-center text-xs">
                        Period
                      </div>
                      <div className="w-2/4 border-r border-dashed border-gray-300 flex items-center justify-center text-xs">
                        Follicular Phase
                      </div>
                      <div className="w-1/20 bg-cycle-purple/50 flex items-center justify-center text-xs text-white">
                        O
                      </div>
                      <div className="flex-grow flex items-center justify-center text-xs">
                        Luteal Phase
                      </div>
                    </div>
                  </div>
                  <div className="absolute h-10 bg-cycle-lavender/50 rounded-full top-[-2px] left-[40%] w-[20%]" style={{zIndex: -1}}>
                  </div>
                </div>
                <div className="text-xs text-center mt-1 text-muted-foreground">
                  Fertile Window (typically days 10-15 in a 28-day cycle)
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium">Key Facts About Fertility:</h4>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>An egg lives for only about 24 hours after ovulation</li>
                  <li>Sperm can live in the reproductive tract for up to 5 days</li>
                  <li>The fertile window is typically about 6 days (the 5 days before ovulation plus the day of ovulation)</li>
                  <li>Ovulation usually occurs about 14 days before the start of the next period (not necessarily on day 14 of the cycle)</li>
                </ul>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="font-medium text-lg">Signs of Ovulation</h3>
              <p className="mb-4">
                Being aware of ovulation signs can help with both conception planning and contraception.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium">Cervical Mucus Changes</h4>
                  <p className="text-sm mt-1">
                    As ovulation approaches, cervical mucus becomes clearer, slippery, and stretchy (similar to raw egg white). This helps sperm travel to the egg.
                  </p>
                </div>
                
                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium">Basal Body Temperature (BBT)</h4>
                  <p className="text-sm mt-1">
                    Body temperature rises slightly (about 0.4°F/0.2°C) after ovulation due to increased progesterone. Tracking BBT can help identify when ovulation has occurred.
                  </p>
                </div>
                
                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium">Mittelschmerz</h4>
                  <p className="text-sm mt-1">
                    Some people experience mild pain or cramping on one side of the lower abdomen during ovulation. This is called "mittelschmerz" (German for "middle pain").
                  </p>
                </div>
                
                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium">Other Signs</h4>
                  <p className="text-sm mt-1">
                    Increased sex drive, slight spotting, breast tenderness, and increased sense of smell can also indicate ovulation.
                  </p>
                </div>
              </div>
              
              <div className="bg-cycle-lightPink/30 p-4 rounded-lg mt-6">
                <h4 className="font-medium">Fertility Awareness Methods (FAMs)</h4>
                <p className="text-sm mt-2">
                  FAMs involve tracking fertility signs to identify fertile and infertile days. They can be used to either achieve or avoid pregnancy.
                </p>
                <p className="text-sm mt-2">
                  Common methods include the Calendar Method, BBT Method, Cervical Mucus Method, and the Symptothermal Method (combining multiple indicators).
                </p>
                <p className="text-sm mt-2 italic">
                  Note: FAMs require consistent tracking and understanding of your cycle. When used for contraception, they're most effective when used perfectly and may require periods of abstinence.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trying to Conceive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you're trying to conceive, understanding your fertile window is crucial. Here are some tips:
              </p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">Time intercourse around ovulation:</span>
                  <p className="text-sm mt-1">
                    Having sex every 1-2 days during your fertile window (typically 5 days before and the day of ovulation) maximizes your chances of conception.
                  </p>
                </li>
                
                <li>
                  <span className="font-medium">Maintain a healthy lifestyle:</span>
                  <p className="text-sm mt-1">
                    Regular exercise, balanced nutrition, adequate sleep, and stress management can all support fertility.
                  </p>
                </li>
                
                <li>
                  <span className="font-medium">Take prenatal vitamins:</span>
                  <p className="text-sm mt-1">
                    Start taking prenatal vitamins with folic acid 3 months before trying to conceive to help prevent neural tube defects.
                  </p>
                </li>
                
                <li>
                  <span className="font-medium">Limit alcohol and avoid smoking:</span>
                  <p className="text-sm mt-1">
                    Both can impact fertility and pregnancy outcomes.
                  </p>
                </li>
                
                <li>
                  <span className="font-medium">Seek help if needed:</span>
                  <p className="text-sm mt-1">
                    If you're under 35 and have been trying for 12 months without success (or 6 months if over 35), consider consulting a fertility specialist.
                  </p>
                </li>
              </ul>
              
              <div className="mt-6">
                <Button variant="default" className="w-full">
                  Switch to Pregnancy Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="health" className="space-y-4 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Menstrual Health & Wellness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Taking care of your menstrual health is an important part of your overall wellbeing. Here are some tips and insights for maintaining good menstrual health.
              </p>
              
              <h3 className="font-medium text-lg mt-4">Diet & Nutrition</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-cycle-lightTeal/50 p-4 rounded-lg">
                  <h4 className="font-medium">Iron-Rich Foods</h4>
                  <p className="text-sm mt-1">
                    Menstruation can deplete iron stores, so include iron-rich foods like lean red meat, spinach, beans, and fortified cereals in your diet.
                  </p>
                </div>
                
                <div className="bg-cycle-lightTeal/50 p-4 rounded-lg">
                  <h4 className="font-medium">Anti-Inflammatory Foods</h4>
                  <p className="text-sm mt-1">
                    Foods rich in omega-3 fatty acids (like fatty fish, walnuts, and flaxseeds) can help reduce inflammation and menstrual pain.
                  </p>
                </div>
                
                <div className="bg-cycle-lightTeal/50 p-4 rounded-lg">
                  <h4 className="font-medium">Calcium & Vitamin D</h4>
                  <p className="text-sm mt-1">
                    These nutrients may help reduce PMS symptoms. Sources include dairy products, fortified plant milks, and leafy greens.
                  </p>
                </div>
                
                <div className="bg-cycle-lightTeal/50 p-4 rounded-lg">
                  <h4 className="font-medium">Hydration</h4>
                  <p className="text-sm mt-1">
                    Staying well-hydrated can help reduce bloating and alleviate headaches associated with menstruation.
                  </p>
                </div>
              </div>
              
              <h3 className="font-medium text-lg mt-6">Exercise & Movement</h3>
              <p className="mb-4">
                Regular physical activity can help manage menstrual symptoms and support overall reproductive health.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium">Gentle Exercise During Your Period</h4>
                  <p className="text-sm mt-1">
                    Light activities like walking, swimming, or gentle yoga can help alleviate cramps by increasing blood flow and releasing endorphins.
                  </p>
                </div>
                
                <div className="bg-accent/30 p-4 rounded-lg">
                  <h4 className="font-medium">Exercise Throughout Your Cycle</h4>
                  <p className="text-sm mt-1">
                    Some research suggests that you might perform better at different types of exercise during different phases of your cycle due to hormonal fluctuations.
                  </p>
                </div>
              </div>
              
              <h3 className="font-medium text-lg mt-6">Mental & Emotional Wellbeing</h3>
              <div className="bg-cycle-lavender/30 p-4 rounded-lg mt-2">
                <p className="text-sm">
                  Hormonal fluctuations throughout the menstrual cycle can affect mood and emotional wellbeing. Practices that may help include:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                  <li>Mindfulness meditation</li>
                  <li>Adequate sleep (7-9 hours)</li>
                  <li>Stress management techniques</li>
                  <li>Social support</li>
                  <li>Tracking your symptoms to identify patterns</li>
                </ul>
              </div>
              
              <h3 className="font-medium text-lg mt-6">Menstrual Products</h3>
              <p className="mb-4">
                There are many options for managing menstrual flow. Finding what works best for you is important for comfort and health.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border p-4 rounded-lg">
                  <h4 className="font-medium">Disposable Options</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                    <li>Pads (with wings, overnight, etc.)</li>
                    <li>Tampons (with or without applicators)</li>
                    <li>Period underwear (absorbent, reusable)</li>
                  </ul>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <h4 className="font-medium">Reusable Options</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                    <li>Menstrual cups (silicone or rubber)</li>
                    <li>Cloth pads</li>
                    <li>Period underwear</li>
                    <li>Menstrual discs</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-destructive/10 p-4 rounded-lg mt-6">
                <h4 className="font-medium text-destructive">Important Health Considerations</h4>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                  <li>Change tampons every 4-8 hours to prevent toxic shock syndrome (TSS)</li>
                  <li>Wash reusable products thoroughly according to manufacturer instructions</li>
                  <li>If using menstrual cups or discs, clean and sanitize as directed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Common Menstrual Disorders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                While variations in menstrual cycles are normal, some conditions require medical attention. Being aware of these conditions can help you know when to seek care.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium">Polycystic Ovary Syndrome (PCOS)</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    A hormonal disorder causing enlarged ovaries with small cysts. Symptoms include irregular periods, excess hair growth, acne, and weight gain.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Endometriosis</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    A condition where tissue similar to the uterine lining grows outside the uterus, causing severe pain, heavy periods, and sometimes infertility.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Premenstrual Dysphoric Disorder (PMDD)</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    A severe form of PMS causing extreme mood shifts, depression, anxiety, and physical symptoms that significantly disrupt daily life.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Primary Dysmenorrhea</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Painful periods without an underlying medical condition, caused by strong uterine contractions from prostaglandins.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Secondary Dysmenorrhea</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Period pain caused by a disorder in the reproductive organs, such as endometriosis or fibroids.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Menorrhagia (Heavy Bleeding)</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Unusually heavy or prolonged menstrual bleeding, which can be caused by hormonal imbalances, fibroids, polyps, or other conditions.
                  </p>
                </div>
              </div>
              
              <div className="bg-destructive/10 p-4 rounded-lg mt-6">
                <h4 className="font-medium text-destructive">When to See a Healthcare Provider</h4>
                <p className="text-sm mt-1">
                  Consider consulting a healthcare provider if you experience:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
                  <li>Periods that consistently last longer than 7 days</li>
                  <li>Cycles shorter than 21 days or longer than 35 days</li>
                  <li>Bleeding between periods</li>
                  <li>Severe pain that interferes with daily activities</li>
                  <li>Heavy bleeding (soaking through a pad/tampon every 1-2 hours)</li>
                  <li>No period for 90+ days (if not pregnant, breastfeeding, or in menopause)</li>
                  <li>Sudden changes in your cycle</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
