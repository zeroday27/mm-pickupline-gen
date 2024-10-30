// src/components/PickupLineResults.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PickupLineResults({ lines, loading, onRegenerate, onCopy }) {
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
          <Alert key={index} className="flex items-center justify-between">
            <AlertDescription className="flex-1 text-lg">
              {line}
            </AlertDescription>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onCopy(line)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        ))}
        
        <Button
          className="w-full mt-4"
          variant="outline"
          onClick={onRegenerate}
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          နောက်ထပ် ဖန်တီးမည်
        </Button>
      </CardContent>
    </Card>
  );
}
