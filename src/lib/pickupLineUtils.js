// src/lib/pickupLineUtils.js
import { useState } from 'react';
import { fetchPickupLines } from './api';

export const usePickupLineGenerator = () => {
  const [sequenceState, setSequenceState] = useState({});
  const [linesCache, setLinesCache] = useState({});

  const getCacheKey = (category, style) => `${category}-${style}`;

  const fetchAndCacheLines = async (category, style) => {
    if (!category || !style) {
      throw new Error('Category and style are required');
    }

    try {
      // Use the existing fetchPickupLines function
      const data = await fetchPickupLines(category, style);
      
      // Handle different possible response formats
      let lines = [];
      if (Array.isArray(data)) {
        lines = data;
      } else if (data.lines && Array.isArray(data.lines)) {
        lines = data.lines;
      } else if (data.text) {
        lines = [data.text];
      } else if (typeof data === 'string') {
        lines = [data];
      } else {
        console.log('API Response:', data); // Debug log
        throw new Error('Invalid response format from API');
      }

      if (lines.length === 0) {
        throw new Error('No pickup lines found for the selected criteria');
      }

      // Format lines if they're objects
      const formattedLines = lines.map(line => {
        if (typeof line === 'string') return line;
        return line.text || JSON.stringify(line);
      });

      const cacheKey = getCacheKey(category, style);
      setLinesCache(prev => ({
        ...prev,
        [cacheKey]: formattedLines
      }));

      return formattedLines;
    } catch (error) {
      console.error('Error in fetchAndCacheLines:', error);
      throw error;
    }
  };

  const getNextInSequence = async (category, style) => {
    if (!category || !style) {
      throw new Error('Category and style are required');
    }

    const cacheKey = getCacheKey(category, style);
    
    try {
      let lines = linesCache[cacheKey];
      if (!lines) {
        lines = await fetchAndCacheLines(category, style);
      }

      let lastIndex = sequenceState[cacheKey] ?? -1;
      const nextIndex = (lastIndex + 1) % lines.length;
      
      setSequenceState(prev => ({
        ...prev,
        [cacheKey]: nextIndex
      }));

      return {
        text: lines[nextIndex],
        index: nextIndex,
        total: lines.length
      };
    } catch (error) {
      console.error('Error in getNextInSequence:', error);
      throw error;
    }
  };

  const resetSequence = (category, style) => {
    if (!category || !style) return;
    const cacheKey = getCacheKey(category, style);
    setSequenceState(prev => ({
      ...prev,
      [cacheKey]: -1
    }));
  };

  const clearCache = () => {
    setLinesCache({});
    setSequenceState({});
  };

  return {
    getNextInSequence,
    resetSequence,
    clearCache,
    hasCache: (category, style) => {
      if (!category || !style) return false;
      return !!linesCache[getCacheKey(category, style)];
    }
  };
};