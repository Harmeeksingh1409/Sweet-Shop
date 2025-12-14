import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const sweets = [
  { name: 'Chocolate Truffle', price: 5.99, category: 'Chocolate', description: 'Rich and creamy chocolate truffle.' },
  { name: 'Strawberry Lollipop', price: 2.49, category: 'Candy', description: 'Sweet and tangy strawberry flavored lollipop.' },
  { name: 'Blueberry Pastry', price: 4.99, category: 'Pastry', description: 'Flaky pastry filled with fresh blueberries.' },
  { name: 'Vanilla Ice Cream', price: 3.99, category: 'Ice Cream', description: 'Creamy vanilla ice cream.' },
  { name: 'Red Velvet Cake', price: 15.99, category: 'Cake', description: 'Moist red velvet cake.' },
  { name: 'Oatmeal Cookie', price: 1.99, category: 'Cookie', description: 'Chewy oatmeal cookie.' },
  { name: 'Mint Chocolate Chip', price: 4.49, category: 'Ice Cream', description: 'Mint ice cream with chocolate chips.' },
  { name: 'Caramel Popcorn', price: 3.99, category: 'Candy', description: 'Buttery caramel coated popcorn.' },
  { name: 'Croissant', price: 2.99, category: 'Pastry', description: 'Buttery and flaky French croissant.' },
  { name: 'Dark Chocolate Bar', price: 6.99, category: 'Chocolate', description: 'Smooth dark chocolate bar.' },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! I\'m your Sweet Shop Assistant. How can I help you today? 🍬', isBot: true }
  ]);
  const [input, setInput] = useState('');

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! Welcome to our sweet shop. What can I help you with today?';
    }

    // Festival recommendations
    if (lowerMessage.includes('diwali') || lowerMessage.includes('festival')) {
      return 'For festivals like Diwali, I recommend our festive sweets: Chocolate Truffle, Red Velvet Cake, or Oatmeal Cookie. Which one interests you?';
    }

    // Sugar-free
    if (lowerMessage.includes('sugar-free') || lowerMessage.includes('diabetic')) {
      return 'We have sugar-free options like our fresh fruits in pastries. Would you like recommendations?';
    }

    // Price inquiries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      const sweet = sweets.find(s => lowerMessage.includes(s.name.toLowerCase()));
      if (sweet) {
        return `${sweet.name} costs $${sweet.price.toFixed(2)}.`;
      }
      return 'Our sweets range from $1.99 to $15.99. Which sweet are you interested in?';
    }

    // Recommendations
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      if (lowerMessage.includes('birthday')) {
        return 'For birthdays, our Red Velvet Cake or Chocolate Truffle would be perfect!';
      }
      if (lowerMessage.includes('wedding')) {
        return 'For weddings, try our elegant pastries or cakes.';
      }
      return 'I recommend trying our Chocolate Truffle or Vanilla Ice Cream. What occasion is this for?';
    }

    // Purchase intent
    if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('order')) {
      const sweet = sweets.find(s => lowerMessage.includes(s.name.toLowerCase()));
      if (sweet) {
        return `Great choice! ${sweet.name} is $${sweet.price.toFixed(2)}. How many would you like? Please use our app to complete the purchase.`;
      }
      return 'I\'d be happy to help you purchase! Which sweet would you like?';
    }

    // List sweets
    if (lowerMessage.includes('list') || lowerMessage.includes('available') || lowerMessage.includes('menu')) {
      return 'We have: Chocolate Truffle ($5.99), Strawberry Lollipop ($2.49), Blueberry Pastry ($4.99), Vanilla Ice Cream ($3.99), Red Velvet Cake ($15.99), Oatmeal Cookie ($1.99), Mint Chocolate Chip ($4.49), Caramel Popcorn ($3.99), Croissant ($2.99), Dark Chocolate Bar ($6.99). What interests you?';
    }

    // Default
    return 'I\'m here to help with sweet recommendations and purchases. Ask me about our sweets, prices, or recommendations for occasions!';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false
    };

    setMessages(prev => [...prev, userMessage]);

    const botResponse = generateResponse(input);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      isBot: true
    };

    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 h-96 z-40 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              🍬 Sweet Shop Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.isBot
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about our sweets..."
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon" variant="ghost">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}