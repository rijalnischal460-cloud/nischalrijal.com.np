import { motion } from 'motion/react';
import { Section, Card, Badge, Button } from '../components/ui/Layout';
import { ExternalLink, Github } from 'lucide-react';

export function Projects() {
  const projects = [
    {
      title: "Prompt Enhancer",
      description: "A sophisticated Chrome Extension that uses AI to refine and optimize user prompts for better LLM outputs.",
      image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=800",
      tech: ["React", "Chrome Extension", "OpenAI"],
      link: "https://rijalnischal460-cloud.github.io/prompt-enhancer-demo",
      github: "https://github.com/rijalnischal460-cloud/prompt-enhancer"
    },
    {
      title: "AI Video Workflow",
      description: "An automated workflow integrating multiple AI models to generate high-quality video content from text scripts.",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
      tech: ["Python", "FFmpeg", "SDV"],
      link: "https://rijalnischal460-cloud.github.io/ai-video-demo",
      github: "https://github.com/rijalnischal460-cloud/ai-video-workflow"
    },
    {
      title: "Personal Dashboard",
      description: "A customizable productivity dashboard for engineers, featuring real-time metrics, project tracking, and notes.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      tech: ["React", "Tailwind", "Firebase"],
      link: "https://rijalnischal460-cloud.github.io/dashboard-demo",
      github: "https://github.com/rijalnischal460-cloud/personal-dashboard"
    }
  ];

  return (
    <Section id="projects" title="Featured Work" subtitle="A selection of projects that showcase my technical abilities and creative problem-solving approach.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <Card key={project.title} className="group">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="flex gap-2">
                  {project.tech.map(t => <Badge key={t} className="bg-white/20 backdrop-blur-md text-white border-white/20">{t}</Badge>)}
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex gap-4">
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink size={16} className="mr-2" />
                    Live Demo
                  </Button>
                </a>
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="sm" className="w-12 h-10 p-0">
                    <Github size={18} />
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
