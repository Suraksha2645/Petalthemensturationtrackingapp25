import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Baby, Calendar, Check, Info, PillBottle } from "lucide-react";

interface PregnancyResourcesProps {
  currentWeek: number;
}

export const PregnancyResources: React.FC<PregnancyResourcesProps> = ({ currentWeek }) => {
  return (
    <Tabs defaultValue="weekly" className="w-full">
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="weekly" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Weekly Guide</span>
        </TabsTrigger>
        <TabsTrigger value="nutrition" className="flex items-center gap-2">
          <PillBottle className="h-4 w-4" />
          <span className="hidden sm:inline">Nutrition</span>
        </TabsTrigger>
        <TabsTrigger value="exercise" className="flex items-center gap-2">
          <Baby className="h-4 w-4" />
          <span className="hidden sm:inline">Exercise</span>
        </TabsTrigger>
        <TabsTrigger value="visits" className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">Doctor Visits</span>
        </TabsTrigger>
        <TabsTrigger value="prepare" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">Prepare</span>
        </TabsTrigger>
      </TabsList>
      
      {/* Weekly Development Tab */}
      <TabsContent value="weekly" className="mt-0">
        <Card className="bg-gradient-to-br from-card to-background border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Development Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentWeek > 0 && currentWeek <= 40 ? (
              <div>
                <h3 className="text-xl font-medium mb-2">Week {currentWeek}</h3>
                <div className="p-4 rounded-lg bg-accent/30 mb-4">
                  <p className="text-muted-foreground">
                    {currentWeek <= 13 ? (
                      "During the first trimester, your baby is developing all essential organs and structures. Your body is adjusting to pregnancy hormones."
                    ) : currentWeek <= 27 ? (
                      "In the second trimester, your baby is growing quickly and you might start feeling movements. This is often called the 'golden period' of pregnancy."
                    ) : (
                      "In the third trimester, your baby is gaining weight and preparing for birth. You might feel more tired and experience Braxton Hicks contractions."
                    )}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-primary mb-2">Baby's Development:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {currentWeek <= 4 ? (
                        <>
                          <li>The fertilized egg implants in your uterus</li>
                          <li>The embryo develops three layers that will become different organs</li>
                          <li>The neural tube (future brain and spinal cord) begins to form</li>
                          <li>Heart tissue begins to develop</li>
                        </>
                      ) : currentWeek <= 8 ? (
                        <>
                          <li>Heart begins to beat and can be detected on ultrasound</li>
                          <li>Limb buds that will become arms and legs appear</li>
                          <li>Brain, lungs, and digestive tract begin to form</li>
                          <li>Facial features start developing including eyes and ears</li>
                        </>
                      ) : currentWeek <= 12 ? (
                        <>
                          <li>All essential organs have formed</li>
                          <li>External genitalia start to develop</li>
                          <li>Fingers and toes are formed</li>
                          <li>Baby can make tiny movements (though you can't feel them yet)</li>
                        </>
                      ) : currentWeek <= 16 ? (
                        <>
                          <li>Baby can make facial expressions</li>
                          <li>Hair pattern on scalp develops</li>
                          <li>Heartbeat may be audible with doppler</li>
                          <li>Bones are becoming harder and skeletal system develops</li>
                        </>
                      ) : currentWeek <= 20 ? (
                        <>
                          <li>You might feel baby movements ("quickening")</li>
                          <li>Baby can hear sounds outside the womb</li>
                          <li>Vernix (waxy coating) develops on skin</li>
                          <li>Baby is about 10 inches long and weighs around 10 ounces</li>
                        </>
                      ) : currentWeek <= 24 ? (
                        <>
                          <li>Baby has a regular sleep-wake cycle</li>
                          <li>Taste buds are forming</li>
                          <li>Hand and startle reflexes develop</li>
                          <li>Baby's movements become stronger and more frequent</li>
                        </>
                      ) : currentWeek <= 28 ? (
                        <>
                          <li>Brain is developing rapidly</li>
                          <li>Eyelids can open and close</li>
                          <li>Lungs are developing surfactant</li>
                          <li>If born now, baby would have a chance of survival with intensive care</li>
                        </>
                      ) : currentWeek <= 32 ? (
                        <>
                          <li>Baby practices breathing movements</li>
                          <li>Can distinguish light and dark</li>
                          <li>Gaining weight rapidly</li>
                          <li>Baby is getting into position for birth</li>
                        </>
                      ) : currentWeek <= 36 ? (
                        <>
                          <li>Most internal systems are well-developed</li>
                          <li>Baby is running out of room to move</li>
                          <li>Preparing for birth by moving head down</li>
                          <li>Baby gains about half a pound each week</li>
                        </>
                      ) : (
                        <>
                          <li>Lungs are nearly fully mature</li>
                          <li>Baby continues to gain weight (about 1/2 pound per week)</li>
                          <li>Baby settles into birth position</li>
                          <li>Getting ready for birth and life outside the womb</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-primary mb-2">Your Body:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {currentWeek <= 13 ? (
                        <>
                          <li>You may experience morning sickness, fatigue, and breast tenderness</li>
                          <li>Your body is producing more blood</li>
                          <li>Hormonal changes may cause mood swings</li>
                        </>
                      ) : currentWeek <= 27 ? (
                        <>
                          <li>You may feel baby movements</li>
                          <li>Your energy levels likely improve</li>
                          <li>Your belly becomes more visible</li>
                        </>
                      ) : (
                        <>
                          <li>You may experience Braxton Hicks contractions</li>
                          <li>Shortness of breath as baby pushes on diaphragm</li>
                          <li>Increased back pain and difficulty sleeping</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" disabled={currentWeek <= 1}>
                    Previous Week
                  </Button>
                  <Button variant="outline" size="sm" disabled={currentWeek >= 40}>
                    Next Week
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Enter your due date above to see weekly development information.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Nutrition Tab */}
      <TabsContent value="nutrition" className="mt-0">
        <Card className="bg-gradient-to-br from-card to-background border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PillBottle className="h-5 w-5" />
              Pregnancy Nutrition Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Alert variant="info" className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Always consult with your healthcare provider for personalized nutritional advice during pregnancy.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-primary">Essential Nutrients</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Folate/Folic Acid</h4>
                      <p className="text-sm text-muted-foreground">
                        Crucial for preventing neural tube defects. Found in leafy greens, fortified cereals, and prenatal vitamins.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Iron</h4>
                      <p className="text-sm text-muted-foreground">
                        Prevents anemia and supports oxygen delivery. Found in lean meats, beans, spinach, and fortified cereals.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Calcium</h4>
                      <p className="text-sm text-muted-foreground">
                        Builds baby's bones and teeth. Found in dairy products, fortified plant milks, tofu, and leafy greens.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Omega-3 Fatty Acids</h4>
                      <p className="text-sm text-muted-foreground">
                        Support baby's brain and eye development. Found in fatty fish, walnuts, flaxseeds, and chia seeds.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-primary">Foods to Avoid</h3>
                  <ul className="list-disc pl-5 space-y-2 text-destructive">
                    <li>High-mercury fish (shark, swordfish, king mackerel)</li>
                    <li>Raw or undercooked meat, poultry, eggs, and seafood</li>
                    <li>Unpasteurized dairy products and juices</li>
                    <li>Raw sprouts</li>
                    <li>Excess caffeine (limit to 200mg daily)</li>
                    <li>Alcohol (no safe amount during pregnancy)</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium text-primary mt-4">Trimester-Specific Needs</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">First trimester:</span> Focus on small, frequent meals to manage nausea.</p>
                    <p><span className="font-medium">Second trimester:</span> Increase calories by about 340 calories per day.</p>
                    <p><span className="font-medium">Third trimester:</span> Increase calories by about 450 calories per day.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-medium text-primary mb-2">Meal Planning Tips</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Aim for 5-6 small meals throughout the day</li>
                  <li>Include protein with each meal (eggs, lean meat, beans, dairy)</li>
                  <li>Choose whole grains over refined grains</li>
                  <li>Eat a variety of fruits and vegetables</li>
                  <li>Stay well-hydrated with water (about 8-10 glasses daily)</li>
                  <li>Take prenatal vitamins as recommended by your healthcare provider</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Exercise Tab */}
      <TabsContent value="exercise" className="mt-0">
        <Card className="bg-gradient-to-br from-card to-background border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5" />
              Safe Exercise During Pregnancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Alert variant="info" className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Before You Begin</AlertTitle>
                <AlertDescription>
                  Always get approval from your healthcare provider before starting any exercise routine during pregnancy.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-primary mb-3">Recommended Exercises</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Walking</h4>
                      <p className="text-sm text-muted-foreground">
                        Low-impact, easy to do, and can be continued throughout pregnancy. Aim for 20-30 minutes most days.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Swimming</h4>
                      <p className="text-sm text-muted-foreground">
                        Excellent full-body workout with no pressure on joints. The buoyancy supports your growing belly.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Prenatal Yoga</h4>
                      <p className="text-sm text-muted-foreground">
                        Improves flexibility, strengthens muscles, and teaches breathing techniques useful for labor.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Stationary Cycling</h4>
                      <p className="text-sm text-muted-foreground">
                        Good cardiovascular workout with minimal risk of falling or joint stress.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-primary mb-3">Activities to Avoid</h3>
                  <ul className="list-disc pl-5 space-y-2 text-destructive">
                    <li>Contact sports or activities with high risk of falling</li>
                    <li>Activities that involve lying flat on your back after first trimester</li>
                    <li>Hot yoga or exercises in hot, humid environments</li>
                    <li>High-altitude exercise (above 6,000 feet) if not acclimatized</li>
                    <li>Scuba diving</li>
                    <li>Activities with jarring motions or rapid changes in direction</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium text-primary mt-4">Warning Signs to Stop Exercise</h3>
                  <ul className="list-disc pl-5 space-y-1 text-destructive">
                    <li>Vaginal bleeding or fluid leaking</li>
                    <li>Dizziness or feeling faint</li>
                    <li>Increased shortness of breath</li>
                    <li>Chest pain</li>
                    <li>Headache</li>
                    <li>Muscle weakness</li>
                    <li>Calf pain or swelling</li>
                    <li>Regular painful contractions</li>
                    <li>Decreased fetal movement</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-primary mb-2">Exercise Tips by Trimester</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-medium">First Trimester</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Continue your pre-pregnancy routine if comfortable</li>
                      <li>Stay hydrated and wear loose clothing</li>
                      <li>Avoid overheating</li>
                      <li>Listen to your body if fatigue or nausea occurs</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-medium">Second Trimester</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Modify exercises as your center of gravity changes</li>
                      <li>Avoid exercises that involve lying flat on your back</li>
                      <li>Consider using a maternity support belt</li>
                      <li>Focus on pelvic floor exercises</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-medium">Third Trimester</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Lower intensity as needed</li>
                      <li>Avoid activities that challenge your balance</li>
                      <li>Focus on exercises that prepare for labor</li>
                      <li>Swimming may be especially comfortable now</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Doctor Visits Tab */}
      <TabsContent value="visits" className="mt-0">
        <Card className="bg-gradient-to-br from-card to-background border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Doctor Visit Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Alert variant="success" className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Regular Checkups</AlertTitle>
                <AlertDescription>
                  Regular prenatal visits are essential for monitoring your baby's development and your health.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-primary">Visit Schedule</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Weeks 4-28</h4>
                      <p className="text-sm text-muted-foreground">
                        One visit every 4 weeks
                      </p>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Weeks 28-36</h4>
                      <p className="text-sm text-muted-foreground">
                        One visit every 2 weeks
                      </p>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Weeks 36-birth</h4>
                      <p className="text-sm text-muted-foreground">
                        One visit every week
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-primary mb-2">What to Bring</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>List of questions or concerns</li>
                      <li>Insurance card</li>
                      <li>Previous medical records (if first visit)</li>
                      <li>List of medications and supplements</li>
                      <li>Support person (partner, friend, family member)</li>
                      <li>Urine sample (if required)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-primary">Key Appointments</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">First Visit (6-8 weeks)</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Confirm pregnancy</li>
                        <li>Complete medical history</li>
                        <li>Physical exam</li>
                        <li>Blood tests</li>
                        <li>Due date calculation</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">NT Scan (11-13 weeks)</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Nuchal translucency ultrasound</li>
                        <li>Screening for chromosomal abnormalities</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Anatomy Scan (18-22 weeks)</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Detailed ultrasound of baby's anatomy</li>
                        <li>Gender determination (if desired)</li>
                        <li>Check placenta position</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Glucose Screen (24-28 weeks)</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Screen for gestational diabetes</li>
                        <li>Blood test after consuming glucose solution</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Group B Strep Test (35-37 weeks)</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Vaginal and rectal swab</li>
                        <li>Tests for bacteria that can be passed to baby during birth</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-primary mb-2">Questions to Ask Your Provider</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">First Trimester</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>How to manage morning sickness?</li>
                      <li>What prenatal vitamins do you recommend?</li>
                      <li>Which foods should I avoid?</li>
                      <li>Is my exercise routine safe to continue?</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Second Trimester</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>What prenatal tests are recommended?</li>
                      <li>When should I start looking for pediatricians?</li>
                      <li>What pregnancy symptoms need immediate attention?</li>
                      <li>How much weight should I gain?</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Third Trimester</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>What are signs of labor?</li>
                      <li>What are my pain management options?</li>
                      <li>What is your C-section rate?</li>
                      <li>When should I go to the hospital?</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Birth Plan Discussion</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Who can be present during delivery?</li>
                      <li>What are your policies on intervention?</li>
                      <li>Can I move around during labor?</li>
                      <li>What happens if complications arise?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Prepare for Baby Tab */}
      <TabsContent value="prepare" className="mt-0">
        <Card className="bg-gradient-to-br from-card to-background border-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Preparing for Baby
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-primary">Essential Baby Items</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Sleep</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Crib or bassinet with firm mattress</li>
                        <li>2-4 fitted crib sheets</li>
                        <li>Baby monitor</li>
                        <li>Swaddles or sleep sacks</li>
                        <li>Pacifiers (if desired)</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Feeding</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>For breastfeeding: Nursing bras, breast pump, nursing pads</li>
                        <li>For formula: Bottles, formula, bottle brush</li>
                        <li>Burp cloths</li>
                        <li>High chair (needed later)</li>
                        <li>Bibs</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <h4 className="font-medium">Bathing</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Baby bathtub</li>
                        <li>Baby-friendly soap and shampoo</li>
                        <li>Baby washcloths and towels</li>
                        <li>Baby lotion</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <h4 className="font-medium">Diapering</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Diapers (newborn and size 1)</li>
                      <li>Wipes and diaper cream</li>
                      <li>Changing pad or table</li>
                      <li>Diaper pail or bin</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-primary">Before Baby Arrives</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <h4 className="font-medium">Third Trimester Tasks</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Set up nursery</li>
                        <li>Install car seat (have it inspected)</li>
                        <li>Pack hospital bag</li>
                        <li>Take childbirth and infant care classes</li>
                        <li>Create birth plan</li>
                        <li>Choose pediatrician</li>
                        <li>Prepare and freeze meals</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <h4 className="font-medium">Hospital Bag Checklist</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Insurance card and ID</li>
                        <li>Birth plan</li>
                        <li>Comfortable clothes for labor</li>
                        <li>Nursing bras and pads</li>
                        <li>Toiletries and personal items</li>
                        <li>Going home outfit for baby</li>
                        <li>Phone charger</li>
                        <li>Snacks for support person</li>
                        <li>Car seat (installed in car)</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <h4 className="font-medium">Postpartum Preparation</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Arrange help for first few weeks</li>
                        <li>Stock up on postpartum supplies</li>
                        <li>Set up diaper changing stations</li>
                        <li>Research lactation consultants if planning to breastfeed</li>
                        <li>Plan for pet adjustments if applicable</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-primary mb-2">Financial Planning</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <h4 className="font-medium">Insurance and Benefits</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Review health insurance coverage</li>
                      <li>Understand maternity leave benefits</li>
                      <li>Research disability insurance</li>
                      <li>Update life insurance</li>
                      <li>Create or update will</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-accent/20 rounded-lg">
                    <h4 className="font-medium">Budgeting for Baby</h4>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Create a baby budget</li>
                      <li>Research childcare costs</li>
                      <li>Start a college savings plan (529 plan)</li>
                      <li>Plan for potential income changes</li>
                      <li>Build emergency fund</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <Alert variant="info" className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Remember</AlertTitle>
                <AlertDescription>
                  Every baby and family is unique. While this list covers the essentials, your specific needs may vary. Focus on safety, comfort, and what works best for your family situation.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
