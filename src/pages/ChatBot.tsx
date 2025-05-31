import { Button } from "@/components/ui/button";
import { main } from "@/services/chatbot/chatBot.services";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown'

type Message = {
    role: "user" | "bot";
    content: string;
};

export default function ChatBot() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await main(input);
            const botMessage: Message = { role: "bot", content: response };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error al obtener respuesta de Gemini:", error);
            setMessages((prev) => [...prev, { role: "bot", content: "Lo siento, hubo un error. Intenta de nuevo." }]);
        } finally {
            setIsLoading(false);
            setInput("");
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="max-w-3xl mx-auto mt-6 p-6 backdrop-blur-md rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center text-primary">SkinCare Assistant</h2>
            <div className="p-4 h-[480px] overflow-y-auto space-y-2 rounded-lg">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-3 rounded-lg ${msg.role === "user"
                            ? "bg-secondary  ml-auto"
                            : ""
                            } max-w-[80%]`}
                    >
                        <strong>{msg.role === "user" ? "Tú: " : "Asistente: "}</strong>
                        {msg.role === "bot" && messages.length - 1 === idx && isLoading ? (
                            <span className="animate-pulse">Asistente está escribiendo...</span>
                        ) : (
                            <ReactMarkdown>
                                {msg.content}
                            </ReactMarkdown>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="mt-4 flex p-2">
                <input
                    type="text"
                    placeholder="Pregunta sobre el software o dermatología..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow px-4 py-2 border rounded-full outline-none shadow-inner"
                />
                <Button type="submit" className="ml-2 bg-primary text-white rounded-full px-4">
                    Enviar
                </Button>
            </form>
        </div>
    );
}
