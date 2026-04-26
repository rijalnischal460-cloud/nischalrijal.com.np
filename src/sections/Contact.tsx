import { motion } from 'motion/react';
import { Section, Card, Button } from '../components/ui/Layout';
import { Send, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import React, { useState } from 'react';

export function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:horahaina123@gmail.com?subject=Portfolio Contact from ${formState.name}&body=${encodeURIComponent(formState.message)}%0A%0AFrom: ${formState.name} (${formState.email})`;
    
    // Using a temporary anchor element is safer in some iframe environments
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.click();
    
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <Section id="contact" title="Get in Touch" subtitle="Have a project in mind or just want to chat? Reach out through the form below.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        <div className="space-y-8">
          <Card className="p-8 group hover:border-blue-500/50 transition-colors duration-500">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <Mail className="text-gray-500 dark:text-zinc-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 dark:text-zinc-500 mb-1 uppercase tracking-widest">Email</p>
                <a href="mailto:horahaina123@gmail.com" className="text-xl font-bold hover:text-blue-500 transition-colors">horahaina123@gmail.com</a>
              </div>
            </div>
          </Card>
          
          <Card className="p-8 group hover:border-blue-500/50 transition-colors duration-500">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <MapPin className="text-gray-500 dark:text-zinc-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 dark:text-zinc-500 mb-1 uppercase tracking-widest">Location</p>
                <p className="text-xl font-bold">Kathmandu, Nepal</p>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <a 
              href="https://github.com/rijalnischal460-cloud" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1"
            >
              <Button variant="secondary" className="w-full h-16 rounded-3xl">
                <Github className="mr-2" /> GitHub
              </Button>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1"
            >
              <Button variant="secondary" className="w-full h-16 rounded-3xl">
                <Linkedin className="mr-2" /> LinkedIn
              </Button>
            </a>
          </div>
        </div>

        <Card className="p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-500 ml-1 uppercase tracking-widest">Name</label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={e => setFormState({ ...formState, name: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/5 focus:border-blue-500 outline-none transition-all text-black dark:text-white placeholder:text-gray-400"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 dark:text-zinc-500 ml-1 uppercase tracking-widest">Email</label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={e => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/5 focus:border-blue-500 outline-none transition-all text-black dark:text-white placeholder:text-gray-400"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 dark:text-zinc-500 ml-1 uppercase tracking-widest">Message</label>
              <textarea
                required
                rows={4}
                value={formState.message}
                onChange={e => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/5 focus:border-blue-500 outline-none transition-all resize-none text-black dark:text-white placeholder:text-gray-400"
                placeholder="Tell me about your project..."
              />
            </div>
            <Button type="submit" className="w-full py-5 rounded-2xl text-lg" disabled={sent}>
              {sent ? "Opening Mail App..." : "Send Message"}
              <Send className="ml-2" size={18} />
            </Button>
          </form>
        </Card>
      </div>
    </Section>
  );
}
