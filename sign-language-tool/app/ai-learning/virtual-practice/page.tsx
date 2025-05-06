"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Brain, Send, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function VirtualPracticePage() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; }[]>([
    { sender: 'ai', text: 'Hi there! I\'m your virtual practice partner. Try signing phrases like "Hello", "Thank you", or "How are you?" and I\'ll respond!' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate sending a message and getting AI response
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { sender: 'user' as const, text: userInput }];
    setMessages(newMessages);
    setUserInput('');

    // Simulate processing time
    setIsLoading(true);
    
    setTimeout(() => {
      // Common phrases and responses
      const responseMap: Record<string, string> = {
        'hello': 'Hello! 👋 Your signing was clear. Great job!',
        'hi': 'Hi there! 👋 That looked good!',
        'thank you': 'You\'re welcome! 😊 Your "thank you" sign was very clear.',
        'thanks': 'No problem! Your sign looked good!',
        'how are you': 'I\'m good, thanks for asking! Your signing is improving.',
        'good morning': 'Good morning to you too! Nice fluid movement.',
        'good night': 'Good night! Rest well. Your signing is getting better every day.',
        'please': 'Of course! Your "please" sign was polite and clear.',
        'sorry': 'No worries! Your "sorry" sign looked authentic.',
        'yes': 'Yes indeed! Short signs like this need to be precise, and yours was!',
        'no': 'Your "no" sign was definitive and clear. Good job!',
        'help': 'I\'d be happy to help! Your sign was easy to understand.',
        'name': 'Nice to meet you! Your name sign was well-formed.',
        'learn': 'Learning is a journey. Your sign for "learn" shows good progress!',
        'practice': 'Practice makes perfect! Keep it up, your signing is improving.',
      };
      
      let aiResponse = '';
      const userInputLower = userInput.toLowerCase();
      
      // Check if the input matches any known phrases
      Object.keys(responseMap).forEach(phrase => {
        if (userInputLower.includes(phrase)) {
          aiResponse = responseMap[phrase];
        }
      });
      
      // Default response if no match found
      if (!aiResponse) {
        aiResponse = "I'm not sure I understood that sign. Could you try again or try a different phrase?";
      }
      
      // Add AI response
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsLoading(false);
    }, 1500);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Link href="/ai-learning">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to AI Learning
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Virtual Practice Partner</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle>Conversation</CardTitle>
              <CardDescription>
                Practice your sign language with our AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[600px]">
              <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-indigo-50/40 to-purple-50/40">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    <div 
                      className={`inline-block px-4 py-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white border border-indigo-100 text-indigo-800 rounded-tl-none'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-left mb-4">
                    <div className="inline-block px-4 py-3 rounded-lg bg-white border border-indigo-100 text-indigo-800 rounded-tl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 bg-white border-t border-indigo-100">
                <div className="flex space-x-2">
                  <Input
                    value={userInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                    placeholder="Type a sign language phrase you practiced..."
                    className="flex-1"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                <CardTitle>How It Works</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                Our virtual practice partner uses AI to provide feedback on your sign language phrases.
                Type what you signed to receive instant feedback.
              </p>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">1</div>
                  <p className="text-sm">Practice signing a phrase</p>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">2</div>
                  <p className="text-sm">Type what you signed in the chat</p>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">3</div>
                  <p className="text-sm">Receive instant feedback and corrections</p>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                <CardTitle>Suggested Phrases</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                Try signing these common phrases to practice with your virtual partner:
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-indigo-100 hover:bg-indigo-50/50"
                  onClick={() => {
                    setUserInput("Hello, how are you?");
                  }}
                >
                  Hello, how are you?
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-indigo-100 hover:bg-indigo-50/50"
                  onClick={() => {
                    setUserInput("Thank you for your help");
                  }}
                >
                  Thank you for your help
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-indigo-100 hover:bg-indigo-50/50"
                  onClick={() => {
                    setUserInput("My name is...");
                  }}
                >
                  My name is...
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-indigo-100 hover:bg-indigo-50/50"
                  onClick={() => {
                    setUserInput("I am learning sign language");
                  }}
                >
                  I am learning sign language
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-indigo-100 hover:bg-indigo-50/50"
                  onClick={() => {
                    setUserInput("Please help me practice");
                  }}
                >
                  Please help me practice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 