import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Share2, Copy, RefreshCw, Heart, Sparkles, Facebook, MessageCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import LoadingAnimation from './LoadingAnimation';

const PickupLineResults = ({ lines, loading, onRegenerate, onCopy }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    onCopy(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShare = async (text) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pick-up Line',
          text: text,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const handleFacebookShare = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy before Facebook share:', err);
    }

    const shareUrl = encodeURIComponent(window.location.href);
    const quote = encodeURIComponent(text);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${quote}`, '_blank');
  };

  const handleMessengerShare = (text) => {
    const url = encodeURIComponent(text);
    window.open(`fb-messenger://share?link=${url}`, '_blank');
  };

  if (loading) {
    return (
      <Card className="mt-6 shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <Sparkles className="h-8 w-8 mx-auto text-purple-500 animate-pulse" />
            <p className="text-purple-600 dark:text-purple-400 mt-2 font-medium">
              Generating your pickup line...
            </p>
          </div>
          <LoadingAnimation />
        </CardContent>
      </Card>
    );
  }

  if (lines.length === 0) return null;

  return (
    <Card className="mt-6 shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-center gap-2">
          <Heart className="h-5 w-5 text-pink-500 animate-pulse" />
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Pick-up Line
          </CardTitle>
          <Heart className="h-5 w-5 text-pink-500 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {lines.map((line, index) => (
          <div key={index} className="relative">
            <Alert
              className={`
                bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30
                border-2 border-purple-200 dark:border-purple-700
                transition-all duration-300 hover:shadow-lg
                ${line.isAI ? 'border-l-4 border-l-pink-500' : ''}
              `}
            >
              <AlertDescription className="flex-1 text-lg py-2 px-3">
                {typeof line === 'string' ? line : line.text}
              </AlertDescription>

              {/* AI Badge */}
              {line.isAI && (
                <div className="absolute -top-2 -right-2">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="h-3 w-3" />
                    AI
                  </span>
                </div>
              )}
            </Alert>

            {line?.insight && (
              <div className="mt-3 rounded-lg border border-purple-200 dark:border-purple-700 bg-white/70 dark:bg-gray-900/60 p-3 space-y-2">
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  <strong>Why this works:</strong> {line.insight.whyItWorks}
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  <strong>Best used when:</strong> {line.insight.bestUsedWhen}
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  <strong>Suggested follow-up:</strong> {line.insight.followUp}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(typeof line === 'string' ? line : line.text, index)}
                className="flex-1 sm:flex-none bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900 border-purple-200 dark:border-purple-700"
              >
                {copiedIndex === index ? (
                  <>
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare(typeof line === 'string' ? line : line.text)}
                className="flex-1 sm:flex-none bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-700"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFacebookShare(typeof line === 'string' ? line : line.text)}
                className="bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-700"
              >
                <Facebook className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMessengerShare(typeof line === 'string' ? line : line.text)}
                className="bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-700"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Regenerate Button */}
        <Button
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          onClick={onRegenerate}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate Another
        </Button>
      </CardContent>
    </Card>
  );
};
export default PickupLineResults;
