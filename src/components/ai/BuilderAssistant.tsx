import React from 'react';
import BaseAssistant from './BaseAssistant';

interface BuilderAssistantProps {
  onUpdateCode?: (code: string) => void;
  currentCode?: string;
}

export default function BuilderAssistant({ onUpdateCode, currentCode }: BuilderAssistantProps) {
  const systemPrompt = `You are an expert Shopify theme developer specializing in Liquid templates.

When writing code:
1. Use proper Liquid syntax and Shopify objects
2. Follow Shopify theme best practices
3. Use Tailwind CSS for styling
4. Include complete schema blocks for sections
5. Write production-ready code`;

  const initialMessage = `Hi! I can help you write Shopify Liquid template code. Try asking:
- "Create a featured collection section"
- "Add a product recommendations section"
- "Create a newsletter signup form snippet"`;

  return (
    <BaseAssistant
      mode="builder"
      systemPrompt={systemPrompt}
      initialMessage={initialMessage}
      onUpdateCode={onUpdateCode}
      currentCode={currentCode}
    />
  );
}