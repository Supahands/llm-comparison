import { Message } from "@/lib/types/message";
import { ScrollArea } from "../ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "../ui/skeleton";

interface ModelResponsesProps {
  messages: Message[];
  isPendingModel1: boolean;
  isPendingModel2: boolean;
}

export default function ModelResponses({
  messages,
  isPendingModel1,
  isPendingModel2,
}: ModelResponsesProps) {
  return (
    <ScrollArea className="flex-grow p-4">
      {(isPendingModel1 || isPendingModel2) && (
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="model-a-skeleton">
            {isPendingModel1 && (
              <Skeleton className="w-full h-96 rounded-lg bg-llm-neutral90" />
            )}
          </div>
          <div className="model-b-skeleton">
            {isPendingModel2 && (
              <Skeleton className="w-full h-96 rounded-lg bg-llm-neutral90" />
            )}
          </div>
        </div>
      )}

      {!isPendingModel1 &&
        !isPendingModel2 &&
        messages.map((message) => (
          <div className="grid grid-cols-2 gap-4 mb-5" key={message.id}>
            <div className="model-a-response">
              <div className="w-fit bg-llm-neutral95 text-black p-1 my-2">
                Model A
              </div>
              <div className="p-2 rounded-lg bg-llm-grey4 border border-solid border-llm-neutral90 text-llm-response">
                <ReactMarkdown className="prose dark:prose-invert">
                  {message.responseA}
                </ReactMarkdown>
              </div>
            </div>
            <div className="model-b-response">
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
