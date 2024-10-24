"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Send } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import ReactMarkdown from "react-markdown";
import PromptSelector from "./promp-selector";

type Message = {
  id: number;
  prompt: string;
  responseA: string;
  responseB: string;
};
const generateMessages = (): Message[] => {
  const messages: Message[] = [];
  const topics = [
    "weather",
    "movies",
    "food",
    "travel",
    "technology",
    "sports",
    "music",
    "books",
    "pets",
    "hobbies",
  ];

  for (let i = 0; i < 10; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const prompt = `What do you think about ${topic}?`;
    let responseA = "";
    let responseB = "";

    switch (topic) {
      case "weather":
        responseA =
          "## Weather Patterns\n\nThe weather has been quite unpredictable lately. It's always a good idea to check the forecast before making plans.\n\n### Today's Forecast:\n* Rain: 30% chance\n* Temperature: 15°C - 22°C\n* Wind: 10-15 km/h\n\n> \"Climate is what we expect, weather is what we get.\" - Mark Twain";
        responseB =
          "# Climate Change Impact\n\nClimate change is affecting weather patterns globally. We should be mindful of our environmental impact.\n\n## Action Items:\n1. Reduce carbon footprint\n2. Support renewable energy\n3. Practice water conservation\n\n```\nCO2 levels: 415 ppm\nGlobal temperature rise: 1.1°C\nSea level rise: 3.3 mm/year\n```";
        break;
      case "movies":
        responseA =
          "# Evolution of the Film Industry\n\nThe film industry is constantly evolving, with streaming services now producing high-quality content alongside traditional studios.\n\n## Top Genres\n1. Action\n2. Drama\n3. Sci-Fi\n\n### Streaming vs. Traditional\n| Platform | Pros | Cons |\n|----------|------|------|\n| Streaming | Convenience, Variety | Internet Dependent |\n| Theater | Immersive Experience | Higher Cost |";
        responseB =
          "## Movies as a Cultural Mirror\n\nMovies are a great form of entertainment and can also be educational. They often reflect societal issues and cultural trends.\n\n> \"Cinema is a matter of what's in the frame and what's out\" - Martin Scorsese\n\n### Recent Trends\n- Diversity in casting and storytelling\n- Increased focus on mental health\n- Integration of social media themes\n\n**Did you know?** The first film ever made was less than 2 seconds long!";
        break;
      case "food":
        responseA =
          "# Global Culinary Traditions\n\nCulinary traditions vary greatly around the world. Exploring different cuisines can be a delightful way to learn about other cultures.\n\n## Popular Cuisines\n1. Italian 🍝\n2. Japanese 🍣\n3. Indian 🍛\n\n### Recipe: Simple Pasta\n```\nIngredients:\n- 200g pasta\n- 2 cloves garlic\n- 2 tbsp olive oil\n- Salt and pepper to taste\n\nInstructions:\n1. Boil pasta\n2. Sauté garlic in oil\n3. Mix and season\n```";
        responseB =
          '## Sustainable Food Industry\n\nThe food industry is facing challenges with sustainability and ethical production. Many people are turning to plant-based diets.\n\n### Key Issues:\n- Organic farming\n- Reducing food waste\n- Supporting local producers\n\n> "Let food be thy medicine and medicine be thy food." - Hippocrates\n\n#### Carbon Footprint (kg CO2 per kg of food)\n| Food | Footprint |\n|------|----------|\n| Beef | 60 |\n| Cheese | 21 |\n| Eggs | 4.5 |\n| Tofu | 2 |';
        break;
      case "travel":
        responseA =
          "# The Joy of Travel\n\nTravel broadens one's perspective and allows for unique experiences. It's important to respect local customs when visiting new places.\n\n## Travel Tips\n1. Learn basic phrases\n2. Try local cuisine\n3. Be open-minded\n\n### Packing Checklist\n- [ ] Passport\n- [ ] Travel insurance\n- [ ] Adaptors\n- [ ] First-aid kit\n\n> \"The world is a book, and those who do not travel read only one page.\" - Saint Augustine";
        responseB =
          '## Sustainable Tourism\n\nThe tourism industry is adapting to more sustainable practices. Eco-tourism and responsible travel are becoming increasingly popular.\n\n### Sustainable Travel Practices\n- Carbon offset programs\n- Supporting local communities\n- Minimizing environmental impact\n\n```python\ndef calculate_carbon_offset(distance_km):\n    return distance_km * 0.15  # kg of CO2\n\nflight_distance = 1000\noffset = calculate_carbon_offset(flight_distance)\nprint(f"Carbon to offset: {offset} kg")\n```';
        break;
      case "technology":
        responseA =
          "# Technological Advancements\n\nTechnological advancements are rapidly changing various industries. AI and machine learning are at the forefront of this revolution.\n\n## Key Areas of Innovation\n1. Artificial Intelligence\n2. Internet of Things (IoT)\n3. Blockchain\n\n### Simple AI Example\n```python\ndef hello_ai():\n    print('Hello, AI world!')\n\nhello_ai()\n```\n\n> \"The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.\" - Bill Gates";
        responseB =
          "## Ethical Considerations in Tech\n\nWhile technology offers many benefits, it's crucial to consider its ethical implications and potential societal impacts.\n\n### Key Concerns\n1. Data privacy\n2. Job displacement\n3. Digital divide\n\n#### AI Ethics Principles\n- Fairness\n- Transparency\n- Privacy\n- Human-centeredness\n\n**Did you know?** The term 'artificial intelligence' was first coined in 1956 at a conference at Dartmouth College.";
        break;
      case "sports":
        responseA =
          '# The Impact of Sports\n\nSports play a significant role in many cultures, promoting physical fitness and teamwork. They can also unite people across diverse backgrounds.\n\n## Popular Sports\n1. Football (Soccer) ⚽\n2. Basketball 🏀\n3. Cricket 🏏\n\n### Benefits of Sports\n- Physical fitness\n- Mental well-being\n- Social skills development\n\n> "I\'ve failed over and over and over again in my life. And that is why I succeed." - Michael Jordan';
        responseB =
          "## Evolution of the Sports Industry\n\nThe sports industry is evolving with new technologies for training and performance analysis. E-sports are also gaining popularity.\n\n### Technological Advancements\n1. Virtual reality training\n2. Data analytics\n3. Wearable tech\n\n#### E-sports Revenue Growth\n```\nYear | Revenue (billion $)\n-----|---------------------\n2018 | 0.9\n2019 | 1.1\n2020 | 1.1\n2021 | 1.3\n2022 | 1.8\n```\n\n**Fun fact:** The first Olympic Games were held in 776 BC in Olympia, Greece.";
        break;
      case "music":
        responseA =
          '# The Universal Language of Music\n\nMusic is a universal language that can evoke emotions and bring people together. It\'s constantly evolving with new genres and fusion styles.\n\n## Musical Elements\n1. Rhythm\n2. Melody\n3. Harmony\n\n### Famous Composers\n- Ludwig van Beethoven\n- Wolfgang Amadeus Mozart\n- Johann Sebastian Bach\n\n> "Music is the soundtrack of your life." - Dick Clark\n\n#### Simple Musical Scale\n```\nC D E F G A B C\ndo re mi fa sol la ti do\n```';
        responseB =
          '## Digital Revolution in Music\n\nThe music industry has been transformed by digital streaming, changing how artists produce and distribute their work.\n\n### Key Changes\n1. Streaming platforms\n2. Independent artists\n3. AI-generated music\n\n#### Streaming Market Share\n| Platform | Market Share |\n|----------|---------------|\n| Spotify  | 31% |\n| Apple Music | 15% |\n| Amazon Music | 13% |\n| Others | 41% |\n\n**Did you know?** The longest officially released song is "The Rise and Fall of Bossanova (A 13:23:32 song)" by PC III, which lasts 13 hours, 23 minutes, and 32 seconds.';
        break;
      case "books":
        responseA =
          '# The Magic of Books\n\nReading books can transport us to different worlds and perspectives. They\'re an invaluable source of knowledge and imagination.\n\n## Benefits of Reading\n- Improves vocabulary\n- Reduces stress\n- Enhances empathy\n\n### Types of Books\n1. Fiction\n   - Novels\n   - Short stories\n2. Non-fiction\n   - Biographies\n   - Self-help\n\n> "A reader lives a thousand lives before he dies . . . The man who never reads lives only one." - George R.R. Martin';
        responseB =
          "## The Evolving Publishing Industry\n\nThe publishing industry is adapting to digital formats, but physical books still hold a special place for many readers.\n\n### Modern Publishing Trends\n1. E-books\n2. Audiobooks\n3. Print-on-demand\n\n#### E-book vs Physical Book Sales\n```\nYear | E-books | Physical Books\n-----|---------|----------------\n2018 | 20%     | 80%\n2019 | 23%     | 77%\n2020 | 27%     | 73%\n2021 | 25%     | 75%\n2022 | 23%     | 77%\n```\n\n**Fun fact:** The first e-book is considered to be the U.S. Declaration of Independence, which was digitized in 1971 as the first Project Gutenberg text.";
        break;
      case "pets":
        responseA =
          '# The Joy of Pet Ownership\n\nPets can provide companionship and have been shown to have positive effects on mental health. Responsible pet ownership is crucial.\n\n## Popular Pets\n1. Dogs 🐕\n2. Cats 🐈\n3. Fish 🐠\n\n### Benefits of Pet Ownership\n- Reduced stress\n- Increased physical activity\n- Companionship\n\n> "Until one has loved an animal, a part of one\'s soul remains unawakened." - Anatole France\n\n#### Basic Dog Commands\n```\nsit\nstay\ncome\nheel\ndown\n```';
        responseB =
          "## The Growing Pet Industry\n\nThe pet industry is growing, with increased focus on animal welfare and ethical breeding practices.\n\n### Industry Trends\n- Adoption programs\n- Sustainable pet products\n- Pet health insurance\n\n#### U.S. Pet Industry Expenditure\n| Year | Expenditure (billion $) |\n|------|-------------------------|\n| 2018 | 90.5 |\n| 2019 | 97.1 |\n| 2020 | 103.6 |\n| 2021 | 123.6 |\n\n**Did you know?** The oldest recorded age for a cat is 38 years and 3 days, held by Creme Puff who lived from 1967 to 2005.";
        break;
      case "hobbies":
        responseA =
          '# The Importance of Hobbies\n\nHobbies are a great way to relax, express creativity, and develop new skills. They can also be a source of social connection.\n\n## Popular Hobbies\n1. Gardening 🌱\n2. Photography 📷\n3. Cooking 👨‍🍳\n\n### Benefits of Hobbies\n- Stress relief\n- Skill development\n- Social connections\n\n> "The secret of happiness is freedom, the secret of freedom is courage." - Carrie Jones\n\n#### Simple Origami Crane\n```\n1. Start with a square paper\n2. Fold in half diagonally\n3. Unfold and fold in half the other way\n4. Lift the top edge to the center crease\n5. Fold the sides in to form the head and tail\n```';
        responseB =
          "## The Digital Age of Hobbies\n\nThe internet has made it easier to learn and share hobbies. Many people are turning their passions into side businesses.\n\n### Online Hobby Resources\n- Online tutorials\n- Social media showcasing\n- E-commerce platforms\n\n#### Popular Hobby Hashtags\n| Platform | Hashtag | Posts |\n|----------|---------|-------|\n| Instagram | #DIY | 41M+ |\n| TikTok | #crafts | 22B+ views |\n| Twitter | #photography | 1M+ tweets/day |\n\n**Fun fact:** The term 'hobby' is believed to have originated from the word 'hobyn', which was a small horse or pony. It later evolved to mean a toy horse, and eventually any pastime or leisure activity.";
        break;
    }

    messages.push({
      id: i + 1,
      prompt,
      responseA,
      responseB,
    });
    
  }
  console.log('messages', messages)
  return messages;
};

const prompts = ['What are the most popular car brands in Japan?', 'Gather the top insights on the Southeast Asian vehicle market', 'Give me the latest updates on the US Presidential elections', 'Compare the education system in the UK vs the USA']

export default function Comparison() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages(generateMessages());
  }, []);

  const [newMessage, setNewMessage] = useState<string>("");

  return (
    <div className="mx-auto mt-8">
      <Card className=" w-full mx-auto border rounded-lg  bg-white">
        <CardContent className="flex flex-col h-[600px] overflow-hidden p-1">
          <ScrollArea className="flex-grow p-4">
            {messages.map((message) => (
              <div className="grid grid-cols-2 gap-4 mb-5" key={message.id}>
                <div className="model-a-response ">
                  <div className="w-fit bg-llm-neutral95 text-black p-1 my-2">
                    Model A
                  </div>
                  <div className="p-2 rounded-lg bg-llm-grey4 text-llm-response">
                    <ReactMarkdown className="prose dark:prose-invert">
                      {message.responseA}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="model-b-response ">
                  <div className="w-fit bg-llm-neutral95 text-black p-1 my-2">
                    Model B
                  </div>
                  <div className="p-2 rounded-lg bg-llm-grey4 text-llm-response">
                    <ReactMarkdown className="prose dark:prose-invert">
                      {message.responseB}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <PromptSelector prompts={prompts} />
          <div
            onSubmit={(e) => {
              e.preventDefault();
              // handleSendMessage()
            }}
            className="relative w-full "
          >
            <Input
              type="text"
              placeholder="Select a question to get started or ask your own here"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full pr-12 h-fit px-5 py-4 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-llm-primary50"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
