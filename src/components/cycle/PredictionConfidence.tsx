
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info, TrendingUp, TrendingDown, Minus, Calendar, Target } from 'lucide-react';
import { AdaptivePrediction, getPersonalizedInsights } from '@/utils/adaptivePrediction';
import { format, parseISO } from 'date-fns';

interface PredictionConfidenceProps {
  prediction: AdaptivePrediction;
}

export const PredictionConfidence: React.FC<PredictionConfidenceProps> = ({ prediction }) => {
  const insights = getPersonalizedInsights(prediction.pattern);
  
  const getTrendIcon = () => {
    switch (prediction.pattern.trendDirection) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const formatDateRange = () => {
    const earliest = format(parseISO(prediction.predictionRange.earliest), 'MMM d');
    const latest = format(parseISO(prediction.predictionRange.latest), 'MMM d');
    return `${earliest} - ${latest}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Prediction Intelligence
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Our enhanced adaptive system uses weighted analysis of your recent cycles, 
                  trend detection, and data quality scoring for improved accuracy.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enhanced Confidence Level */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Prediction Confidence</span>
            <Badge 
              variant="outline" 
              className={`${getConfidenceColor(prediction.confidenceLevel)} text-white`}
            >
              {prediction.confidenceLevel.toUpperCase()}
            </Badge>
          </div>
          <Progress value={prediction.confidence} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {prediction.confidence}% confident • Data quality: {prediction.pattern.dataQuality}%
          </p>
        </div>

        {/* New: Prediction Range */}
        <div className="bg-primary/5 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Expected Range</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Most likely: <span className="font-medium">{format(parseISO(prediction.nextPeriodDate), 'MMM d, yyyy')}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Possible range: {formatDateRange()}
          </p>
        </div>

        {/* Enhanced Pattern Analysis */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-accent/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium">Cycle Trend</span>
              {getTrendIcon()}
            </div>
            <p className="text-xs text-muted-foreground">
              {prediction.pattern.trendDirection === 'stable' 
                ? 'Stable pattern' 
                : `${prediction.pattern.trendDirection} length`}
            </p>
          </div>
          
          <div className="bg-accent/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3 w-3" />
              <span className="text-xs font-medium">Variability</span>
            </div>
            <p className="text-xs text-muted-foreground">
              ±{prediction.pattern.cycleVariability} days
            </p>
          </div>
        </div>

        {/* Enhanced Personalized Insights */}
        {insights.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Personalized Insights</h4>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="text-xs p-2 bg-primary/5 rounded text-muted-foreground">
                  {insight}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Pattern Details */}
        <div className="text-xs text-muted-foreground border-t pt-3">
          <p>
            Analysis based on {prediction.pattern.averageCycleLength}-day cycles 
            with {prediction.pattern.averagePeriodLength}-day periods
          </p>
          <p className="mt-1">
            Recent cycles are weighted more heavily for improved accuracy
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
