import { motion } from 'motion/react';
import { Section, Card } from '../components/ui/Layout';
import { 
  Code2, 
  Globe, 
  Wrench, 
  Sparkles, 
  Zap 
} from 'lucide-react';

export function Skills() {
  const skillCategories = [
    {
      title: "Programming",
      icon: <Code2 size={24} />,
      skills: ["Python", "Java"]
    },
    {
      title: "Web Development",
      icon: <Globe size={24} />,
      skills: ["HTML", "CSS", "React"]
    },
    {
      title: "Tools",
      icon: <Wrench size={24} />,
      skills: ["Git", "VS Code", "Chrome Extensions"]
    },
    {
      title: "AI & Automation",
      icon: <Sparkles size={24} />,
      skills: ["Prompt Engineering", "AI Workflow Tooling"]
    },
    {
      title: "Soft Skills",
      icon: <Zap size={24} />,
      skills: ["Problem Solving", "Fast Learner", "Communication"]
    },
    {
      title: "UI/UX Design",
      icon: <Sparkles size={24} />,
      skills: ["Figma", "Interaction Design", "Prototyping"]
    }
  ];

  return (
    <Section id="skills" title="Expertise" subtitle="A comprehensive set of technical and interpersonal skills honed through academic projects and self-driven explorations.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, idx) => (
          <Card key={category.title} className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-black dark:text-white">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <motion.span
                  key={skill}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
