import { motion } from 'motion/react';
import { Section } from '../components/ui/Layout';
import { Brain, Code, Rocket } from 'lucide-react';

export function About() {
  const qualities = [
    {
      icon: <Brain className="text-purple-500" />,
      title: "AI Enthusiast",
      description: "Fascinated by the potential of LLMs and AI automation to solve complex problems."
    },
    {
      icon: <Code className="text-blue-500" />,
      title: "Builder",
      description: "Passionate about creating clean, scalable, and user-centric software solutions."
    },
    {
      icon: <Rocket className="text-orange-500" />,
      title: "Fast Learner",
      description: "Constantly exploring new technologies and staying ahead of the tech curve."
    }
  ];

  return (
    <Section id="about" title="About Me" subtitle="A second-year Software Engineering student based in Kathmandu, dedicated to mastering the art of building impactful digital tools.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {qualities.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-white/5"
          >
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm mb-6">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
