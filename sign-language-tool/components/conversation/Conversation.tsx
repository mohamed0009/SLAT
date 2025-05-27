'use client';

import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, HandMetal } from "lucide-react";
import chatbotService from '@/services/chatbot';
import { ScrollableContainer } from '@/components/ui/scrollable-container';

interface Message {
  text: string;
  type: 'user' | 'bot' | 'detection';
  suggestions?: string[];
}

export interface ConversationHandle {
  handleSignDetection: (gesture: string, confidence: number) => void;
}

export const Conversation = forwardRef<ConversationHandle>((_, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(true);

  useEffect(() => {
    // Send welcome message when component mounts
    const initChat = async () => {
      const response = await chatbotService.processMessage('welcome');
      setMessages([{ text: response.text, type: 'bot', suggestions: response.suggestions }]);
    };
    initChat();
  }, []);

  useEffect(() => {
    // Only scroll to bottom when messages change if it's not a detection message
    // or if shouldScroll is true
    if (shouldScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldScroll]);

  useImperativeHandle(ref, () => ({
    handleSignDetection: (gesture: string, confidence: number) => {
      // Don't auto-scroll for detection updates
      setShouldScroll(false);
      
      setMessages(prev => [...prev, {
        text: `Detected sign: ${gesture} (${(confidence * 100).toFixed(1)}% confidence)`,
        type: 'detection'
      }]);
    }
  }));

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Enable scrolling for user messages
    setShouldScroll(true);

    // Add user message
    const userMessage = { text: inputText, type: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Get chatbot response
    const response = await chatbotService.processMessage(inputText);
    setMessages(prev => [...prev, {
      text: response.text,
      type: 'bot',
      suggestions: response.suggestions
    }]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  // Manual scroll button to let users see new messages when they want
  const scrollToBottom = () => {
    setShouldScroll(true);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">SLAT Assistant</h3>
        </div>
        
        {/* Show scroll button only when there are detection messages */}
        {messages.some(m => m.type === 'detection') && (
          <button 
            onClick={scrollToBottom}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
          >
            <HandMetal className="h-3 w-3" /> 
            <span>View latest signs</span>
          </button>
        )}
      </div>

      <div className="flex flex-col h-[400px]">
        <ScrollableContainer 
          maxHeight="332px" 
          padding="md" 
          fadeEdges
          className="flex-1 space-y-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : message.type === 'detection'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                    : 'glass shadow-sm dark:glass-dark'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-sm bg-white/10 hover:bg-white/20 rounded px-2 py-1 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollableContainer>

        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about SLAT..."
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              className="rounded-full flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});

Conversation.displayName = 'Conversation';

export default Conversation; 