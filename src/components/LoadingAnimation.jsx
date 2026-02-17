import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

const LoadingAnimation = () => {
  const thinkingMessages = [
    "Thinking...",
    "Finding the perfect pickup line...",
    "Making it special for you..."
  ];

  const burmeseMessages = [
    "စဉ်းစားနေပါတယ်...",
    "အကောင်းဆုံး pickup line ရွေးနေပါတယ်...",
    "နှလုံးသားလေး ခုန်မြန်လာအောင် ကြိုးစားနေပါတယ်..."
  ];

  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % thinkingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Animated Icons */}
      <div className="relative">
        <Heart className="w-12 h-12 text-pink-500 animate-pulse" />
        <Sparkles className="w-6 h-6 text-purple-500 absolute -top-2 -right-2 animate-bounce" />
      </div>

      {/* Loading dots */}
      <div className="flex space-x-3">
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
      </div>

      {/* Thinking message */}
      <div className="text-center space-y-1">
        <p className="text-purple-600 dark:text-purple-400 font-medium animate-pulse">
          {thinkingMessages[messageIndex]}
        </p>
        <p className="text-pink-500 dark:text-pink-400 text-sm">
          {burmeseMessages[messageIndex]}
        </p>
      </div>
    </div>
  );
};
export default LoadingAnimation;
