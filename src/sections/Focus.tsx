import { motion } from 'motion/react';
import { Section, Card } from '../components/ui/Layout';
import { Terminal, Layout as LayoutIcon, Wand2 } from 'lucide-react';

export function CurrentFocus() {
  const focuses = [
    {
      title: "Mastering Python",
      description: "Deepening my knowledge of Python for data science and AI automation.",
      icon: <Terminal className="text-yellow-500" />
    },
    {
      title: "Building Modern Web",
      description: "Exploring advanced React patterns and performance optimization techniques.",
      icon: <LayoutIcon className="text-blue-500" />
    },
    {
      title: "AI Integrations",
      description: "Integrating multi-modal AI models into user-friendly web applications.",
      icon: <Wand2 className="text-purple-500" />
    }
  ];

  return (
    <Section title="Current Focus" subtitle="What I'm currently learning and building to expand my horizons.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {focuses.map((item, idx) => (
          <Card key={item.title} className="p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 shadow-xs border border-gray-100 dark:border-white/5">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
