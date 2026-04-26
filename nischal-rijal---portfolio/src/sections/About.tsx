import { motion } from 'motion/react';
import { Section } from '../components/ui/Layout';
import { Brain, Code, Rocket } from 'lucide-react';

export function About() {
  const qualities = [
    {
      icon: <Brain className="text-purple-500" />,
      title: 'AI Enthusiast',
      description:
        'Fascinated by the potential of LLMs and AI automation to solve complex problems.',
    },
    {
      icon: <Code className="text-blue-500" />,
      title: 'Builder',
      description:
        'Passionate about creating clean, scalable, and user-centric software solutions.',
    },
    {
      icon: <Rocket className="text-orange-500" />,
      title: 'Fast Learner',
      description:
        'Constantly exploring new technologies and staying ahead of the tech curve.',
    },
  ];

  return (
    <Section
      id="about"
      title="About Me"
      subtitle="A second-year Software Engineering student based in Kathmandu, dedicated to mastering the art of building impactful digital tools."
    >
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {qualities.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="rounded-3xl border border-gray-100 bg-gray-50 p-8 dark:border-white/5 dark:bg-gray-900/50"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-gray-800">
              {item.icon}
            </div>
            <h3 className="mb-3 text-xl font-bold text-black dark:text-white">{item.title}</h3>
            <p className="leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}