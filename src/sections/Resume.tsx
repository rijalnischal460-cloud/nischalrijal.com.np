import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Mail, MapPin, Globe } from 'lucide-react';
import { Button } from '../components/ui/Layout';

interface ResumeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Resume({ isOpen, onClose }: ResumeProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 neon:bg-black overflow-y-auto px-6 py-12"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-12 print:hidden">
              <Button variant="ghost" onClick={onClose} className="rounded-full">
                <X className="mr-2" size={20} /> Close
              </Button>
              <Button onClick={handlePrint} className="rounded-full px-8">
                <Download className="mr-2" size={18} />
                Print / Save
              </Button>
            </div>

            <div className="print:m-0">
              {/* Simple Header */}
              <div className="mb-12 border-b border-gray-100 dark:border-white/10 pb-8">
                <h1 className="text-5xl font-bold mb-2 tracking-tight">Nischal Rijal</h1>
                <p className="text-xl text-blue-600 font-medium mb-6">Software Engineering Student</p>
                
                <div className="flex flex-wrap gap-6 text-gray-500 dark:text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={16} /> <span>horahaina123@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} /> <span>Kathmandu, Nepal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={16} /> <span>nischalrijal.com.np</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-12">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">Education</h3>
                    <div>
                      <div className="flex justify-between mb-1">
                        <h4 className="font-bold text-lg">BE in Software Engineering</h4>
                        <span className="text-sm text-gray-500">2023 — Present</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">PCPS College</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">Projects</h3>
                    <div className="space-y-8">
                      <div>
                        <h4 className="font-bold text-lg">Modern Portfolio Engine</h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">A high-performance portfolio template built with React and Tailwind CSS.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Nexus UI Library</h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Custom component library for rapid web prototyping.</p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="space-y-12">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">Skills</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-bold mb-2">Development</p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">TypeScript, React, Node.js, Python, Tailwind CSS, Git</p>
                      </div>
                      <div>
                        <p className="font-bold mb-2">Design</p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Figma, UI/UX Principles, Prototyping</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">Languages</h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>English</span>
                        <span className="text-gray-500">Fluent</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nepali</span>
                        <span className="text-gray-500">Native</span>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
