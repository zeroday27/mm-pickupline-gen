// src/components/PickupLineResults.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Share2, Copy, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export default function PickupLineResults({ lines, loading, onRegenerate, onCopy }) {
  if (lines.length === 0) return null;

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 transition-colors">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-center dark:text-gray-200">
          သင့်အတွက် Pick-up Lines များ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lines.map((line, index) => (
          <Alert 
            key={index} 
            className="flex items-center justify-between bg-white dark:bg-gray-700 dark:border-gray-600 p-4 sm:p-6"
          >
            <AlertDescription className="flex-1 text-sm sm:text-base md:text-lg dark:text-gray-200 mr-4">
              {line}
            </AlertDescription>
            <div className="flex gap-2 ml-2 sm:ml-4 flex-shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onCopy(line)}
                className="hover:bg-purple-50 dark:hover:bg-purple-900 dark:border-gray-600 transition-colors"
              >
                <Copy className="h-4 w-4 dark:text-gray-200" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-purple-50 dark:hover:bg-purple-900 dark:border-gray-600 transition-colors"
              >
                <Share2 className="h-4 w-4 dark:text-gray-200" />
              </Button>
            </div>
          </Alert>
        ))}
        
        <Button
          className="w-full mt-6 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
          variant="outline"
          onClick={onRegenerate}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-base">နောက်ထပ် ဖန်တီးမည်</span>
        </Button>

        <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
          Pick-up lines များကို Copy နှင့် Share ပြုလုပ်နိုင်ပါသည်
        </div>
      </CardContent>
    </Card>
  );
}