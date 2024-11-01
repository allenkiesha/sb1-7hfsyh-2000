import React from 'react';
import BaseAssistant from './BaseAssistant';

interface LearningAssistantProps {
  onUpdateCode?: (code: string) => void;
  currentCode?: string;
}

export default function LearningAssistant({ onUpdateCode, currentCode }: LearningAssistantProps) {
  const systemPrompt = `You are a patient and knowledgeable Shopify theme development instructor.

Focus on:
1. Breaking down complex concepts
2. Explaining code purpose and structure
3. Sharing best practices
4. Guiding through development process`;

  const initialMessage = `Hi! I'm here to help you learn Shopify theme development. What would you like to learn about?

Some topics we can explore:
- Understanding Liquid syntax and objects
- Creating sections and snippets
- Working with product and collection templates
- Setting up theme settings`;

  return (
    <BaseAssistant
      mode="learning"
      systemPrompt={systemPrompt}
      initialMessage={initialMessage}
      onUpdateCode={onUpdateCode}
      currentCode={currentCode}
    />
  );
}