import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Share2, Copy, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import LoadingAnimation from './LoadingAnimation';

const PickupLineResults = ({ lines, loading, onRegenerate, onCopy }) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <LoadingAnimation />
        </CardContent>
      </Card>
    );
  }

  if (lines.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          သင့်အတွက် Pick-up Lines များ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lines.map((line, index) => (
          <Alert key={index} className="flex items-center justify-between bg-white dark:bg-gray-800">
            <AlertDescription className="flex-1 text-lg">
              {line}
            </AlertDescription>
            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onCopy(line)}
                className="hover:bg-purple-50 dark:hover:bg-purple-900"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-purple-50 dark:hover:bg-purple-900"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        ))}
        
        <Button
          className="w-full mt-4 hover:bg-purple-50 dark:hover:bg-purple-900"
          variant="outline"
          onClick={onRegenerate}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          နောက်ထပ် ဖန်တီးမည်
        </Button>
      </CardContent>
    </Card>
  );
};

export default PickupLineResults;