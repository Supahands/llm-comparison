import { Message } from "@/lib/types/message";
import { ScrollArea } from "../ui/scroll-area";
import ReactMarkdown from 'react-markdown';

interface ModelResponsesProps {
  messages: Message[];
}

export default function ModelResponses({ messages }: ModelResponsesProps) {
  return (
    <ScrollArea className="flex-grow p-4">
      {messages.map((message) => (
        <div className="grid grid-cols-2 gap-4 mb-5" key={message.id}>
          <div className="model-a-response ">
            <div className="w-fit bg-llm-neutral95 text-black p-1 my-2">
              Model A
            </div>
            <div className="p-2 rounded-lg bg-llm-grey4 border border-solid border-llm-neutral90 text-llm-response">
              <ReactMarkdown className="prose dark:prose-invert">
                {message.responseA}
              </ReactMarkdown>
            </div>
          </div>
          <div className="model-b-response ">
            <div className="w-fit bg-llm-neutral95 text-black p-1 my-2">
              Model B
            </div>
            <div className="p-2 rounded-lg bg-llm-grey4 text-llm-response border border-solid border-llm-neutral90">
              <ReactMarkdown className="prose dark:prose-invert">
                {message.responseB}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}
