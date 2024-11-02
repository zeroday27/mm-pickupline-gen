import React from 'react';
import { Brain } from 'lucide-react';

const LoadingAnimation = () => {
  const thinkingMessages = [
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
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="animate-bounce">
        <Brain className="w-12 h-12 text-purple-500" />
      </div>
      <div className="animate-pulse text-purple-600 dark:text-purple-400 text-lg font-medium text-center">
        {thinkingMessages[messageIndex]}
      </div>
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};
export default LoadingAnimation;