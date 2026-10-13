import { MessageCircle } from "lucide-react";

interface FloatingChatButtonProps {
  whatsappNumber?: string;
  message?: string;
}

const FloatingChatButton = ({ 
  whatsappNumber = "18019480584", 
  message = "Hello! I'd like to learn more about NerdBatch." 
}: FloatingChatButtonProps) => {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-primary-foreground" fill="currentColor" />
    </a>
  );
};

export default FloatingChatButton;
