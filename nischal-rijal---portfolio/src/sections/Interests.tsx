import { motion } from 'motion/react';
import { Section, Card } from '../components/ui/Layout';
import { Map, Film } from 'lucide-react';

export function Interests() {
  const interests = [
    {
      title: "Traveling",
      description: "Exploring new places and cultures to find inspiration.",
      icon: <Map className="text-emerald-500" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      title: "Movies",
      description: "Appreciating storytelling and visual arts through cinema.",
      icon: <Film className="text-indigo-500" />,
      bg: "bg-indigo-50 dark:bg-indigo-950/20"
    }
  ];

  return (
    <Section title="Beyond the Code" subtitle="A glimpse into what keeps me inspired outside of software engineering.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {interests.map((interest, idx) => (
          <Card key={interest.title} className="flex gap-8 p-10 items-center">
            <div className={`w-20 h-20 shrink-0 rounded-3xl flex items-center justify-center ${interest.bg}`}>
              {interest.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{interest.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {interest.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
