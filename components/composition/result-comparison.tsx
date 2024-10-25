import React from "react";
import { Message } from "@/lib/types/message";
import ModelResponses from "./model-responses";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import ReactMarkdown from "react-markdown";

const responseData: Message[] = [
  {
    prompt: "What makes the seasons change?",
    responseA: `The Earth's tilted axis is the primary reason for the seasons. As the Earth orbits the Sun, its tilted axis causes different parts of the Earth to receive varying amounts of sunlight throughout the year.

Here's a breakdown of how this works:

* **Tilt:** The Earth's axis is tilted at approximately 23.5 degrees from the plane of its orbit around the Sun.
* **Orbit:** As the Earth orbits the Sun, one half of the planet is tilted towards the Sun, while the other half is tilted away.
* **Sunlight:** The hemisphere tilted towards the Sun receives more direct sunlight, leading to warmer temperatures and longer days. The hemisphere tilted away from the Sun receives less direct sunlight, resulting in colder temperatures and shorter days.
* **Seasons:** The Earth's tilt and orbit combine to create the four seasons: spring, summer, autumn, and winter.

**Key points to remember:**

* The tilt of the Earth's axis is the primary cause of the seasons.
* The amount of sunlight a region receives varies throughout the year due to the Earth's tilt and orbit.
* The hemisphere tilted towards the Sun experiences warmer temperatures and longer days.
* The hemisphere tilted away from the Sun experiences colder temperatures and shorter days.`,
    responseB: `# What Makes the Seasons Change?

The seasons change primarily due to Earth's tilt and its orbit around the Sun.

## Earth's Tilt
* Earth is tilted 23.5 degrees on its axis
* This tilt stays constant throughout the year
* The tilt determines how much direct sunlight each hemisphere receives

## Orbital Effects
* Earth takes one year to orbit the Sun
* The hemisphere tilted toward the Sun experiences summer
* The hemisphere tilted away experiences winter

## Summer Conditions
* Longer days
* More direct sunlight
* Higher temperatures

## Winter Conditions
* Shorter days
* Less direct sunlight
* Lower temperatures

This explains why the Northern and Southern hemispheres experience opposite seasons - when one hemisphere tilts toward the Sun, the other tilts away.`,
  },
  {
    prompt: "How do different countries celebrate holidays?",
    responseA: `## How Different Countries Celebrate Holidays

Holidays are a time for celebration, reflection, and cultural traditions. The ways in which these special days are observed can vary significantly from country to country. Here are a few examples:

### Religious Holidays
* **Christmas:** While the celebration of Christmas is widespread, customs can differ greatly. In many Western countries, it's associated with Santa Claus, presents, and Christmas trees. In Eastern Orthodox countries, the celebration often occurs later in January and has different traditions.
* **Ramadan:** This Islamic holy month involves fasting during the day and feasting at night. Countries with large Muslim populations, such as Saudi Arabia and Indonesia, have unique customs and traditions during Ramadan.
* **Hanukkah:** This Jewish festival of lights is celebrated with the lighting of candles, traditional foods, and gifts. The customs can vary among different Jewish communities.

### Cultural Holidays
* **Chinese New Year:** This is one of the most important festivals in Chinese culture, celebrated with fireworks, dragon dances, and family gatherings.
* **Día de los Muertos (Day of the Dead):** This Mexican holiday is a colorful celebration of the deceased, featuring altars, offerings, and parades.
* **Oktoberfest:** This German festival is known for its beer, food, and music. It's celebrated in Munich and other cities around the world.

### National Holidays
* **Independence Day:** Many countries celebrate their independence with parades, fireworks, and patriotic events. Examples include the United States on July 4th and India on August 15th.
* **Labor Day:** This holiday celebrates workers and their contributions to society. It's observed in many countries, often with parades and picnics.
* **National Day:** Some countries have a national day to celebrate their foundation or a significant historical event. For example, France celebrates Bastille Day on July 14th.

**Factors that influence holiday celebrations include:**

* **Religion:** Religious holidays often have specific traditions and rituals associated with them.
* **Culture:** Cultural holidays reflect the unique customs and beliefs of a particular society.
* **History:** National holidays often commemorate important historical events.
* **Geography:** The climate and natural resources of a region can influence holiday customs.

Overall, holidays provide an opportunity for people to connect with their culture, traditions, and community. While there may be similarities between different countries, the ways in which holidays are celebrated can be as diverse as the people who observe them.`,
    responseB: `# Holiday Celebrations Around the World

Here are some notable holiday traditions from different cultures:

## China
* **Lunar New Year**
  - Red envelopes (hongbao) with money given to children
  - Family reunions and festive meals
  - Lion dances and fireworks
  - Spring cleaning before the new year

## India
* **Diwali**
  - Festival of lights with oil lamps and lanterns
  - Colorful rangoli designs made on floors
  - Exchanging gifts and sweets
  - New clothes and home decorations

## Mexico
* **Día de los Muertos**
  - Altars with photos of deceased loved ones
  - Traditional foods like pan de muerto
  - Marigold flowers and sugar skulls
  - Cemetery visits and celebrations

## Germany
* **Christmas**
  - Advent calendars and wreaths
  - Christmas markets (Christkindlmarkt)
  - St. Nicholas Day celebrations on December 6
  - Traditional foods like stollen and glühwein

## Japan
* **Shōgatsu (New Year)**
  - Temple visits at midnight
  - Special food boxes called osechi ryōri
  - Traditional games and activities
  - Sending greeting cards (nengajō)

Would you like me to elaborate on any specific country's traditions or explore other cultural celebrations?`,
  },
  {
    prompt: "Why do people speak different languages around the world?",
    responseA: `**The diversity of languages spoken around the world is a result of a complex interplay of historical, geographical, cultural, and social factors.**

### Historical Factors:
* **Migration:** As people migrated across the globe, they brought their languages with them, leading to the spread of different tongues in various regions.
* **Colonization:** Colonial powers often imposed their languages on the territories they conquered, resulting in linguistic influence and sometimes language shift.

### Geographical Factors:
* **Isolation:** Geographical barriers like mountains, rivers, and oceans can isolate communities, leading to the development of distinct dialects and eventually separate languages.
* **Climate:** Different climates can influence the development of language, as people adapt their communication to suit their environment.

### Cultural Factors:
* **Identity:** Language is often a key component of cultural identity, helping people to connect with their heritage and community.
* **Tradition:** Cultural traditions and customs can shape the way people communicate, influencing the development of language.

### Social Factors:
* **Education:** The availability of education and the prevalence of certain languages can influence language choice and usage.
* **Politics:** Government policies and language laws can play a role in promoting or suppressing certain languages.

**Over time, these factors have combined to create the rich tapestry of languages spoken around the world.**`,
    responseB: `# Why People Speak Different Languages

## Historical Development
* Languages evolved separately in different regions
* Communities developed unique ways to communicate
* Isolated populations created distinct vocabularies and grammar
* Migration patterns spread language families

## Geographic Factors
* Mountain ranges and oceans separated populations
* Isolated communities developed unique dialects
* Climate and environment influenced vocabulary
* Trade routes influenced language mixing

## Cultural Influence
* Different societies had unique needs and experiences
* Local customs shaped expression
* Religious and social practices affected language
* Storytelling traditions varied by culture

## Language Evolution
* Started from basic communication
* Grew more complex over time
* Borrowed words from other languages
* Adapted to new technologies and concepts

## Modern Impact
* About 7,000 languages exist today
* Some languages are related in families
* Many languages are endangered
* New dialects continue to develop

## Key Factors in Differences
* Sound systems vary by region
* Grammar structures differ
* Writing systems developed separately
* Vocabulary reflects local environment

These differences show how human communication adapted to diverse needs and circumstances throughout history.`,
  },
];

const ResultComparison = () => {
  return (
    <div className="flex-row w-full border flex-grow bg-white rounded-xl">
      <Carousel>
        <CarouselContent>
          {responseData.map((item, index) => (
            <CarouselItem>
              <div className="flex flex-col w-full p-5">
                <div className="mt-2 flex-1">
                  {item.prompt && (
                    <div className="bg-llm-grey4 p-1 mx-auto w-full text-center border border-solid border-llm-neutral90 rounded-xl text-llm-grey1 h-fit">
                      {item.prompt}
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="w-full space-y-1">
                    <div className="model-b-response ">
                      <div className="w-fit bg-llm-neutral95 text-black p-1 my-2">
                        Model A
                      </div>
                      <div className="p-2 rounded-lg bg-llm-grey4 text-llm-response border border-solid border-llm-neutral90">
                        <ReactMarkdown className="prose dark:prose-invert">
                          {item.responseA}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                  <div className="w-full space-y-1 ">
                    <div className="model-b-response ">
                      <div className="w-fit bg-llm-neutral95 text-black p-1 my-2">
                        Model B
                      </div>
                      <div className="p-2 rounded-lg bg-llm-grey4 text-llm-response border border-solid border-llm-neutral90">
                        <ReactMarkdown className="prose dark:prose-invert">
                          {item.responseB}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ResultComparison;
