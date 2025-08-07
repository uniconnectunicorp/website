'use client';

import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Star, BookOpen } from 'lucide-react';
import Link from 'next/link';
import StatsSection from './StatsSection';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-white to-primary overflow-hidden flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center"
      />
      <div className="relative max-w-7xl w-full px-4 pt-24 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-md:mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 text-left"
            >
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-block px-4 py-1.5 rounded-full bg-secondary-50 border border-secondary-100"
              >
                <p className="text-sm font-medium text-secondary">Cursos Técnicos 100% Online</p>
              </motion.div>
              
              <motion.h1 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900"
              >
                Formação profissional de <span className="text-primary">alta qualidade</span> para o mercado de trabalho
              </motion.h1>
              
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg text-gray-600"
              >
                Cursos técnicos reconhecidos pelo MEC com certificação válida em todo o Brasil. 
                Aprenda com especialistas e dê um salto na sua carreira profissional.
              </motion.p>
              
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/cursos"
                  className="inline-flex z-10 items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#ff6600] hover:bg-[#ff6600] rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] hover:shadow-orange-200"
                >
                  Conheça Nossos Cursos
                  <motion.span 
                    animate={{ x: [0, 4, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatType: "reverse",
                      duration: 1.5
                    }}
                    className="ml-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <div className="flex items-center bg-white/50 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-gray-100">
                <div className="flex -space-x-2">
                  {["women/44", "men/32", "women/68"].map((img, i) => (
                    <motion.img 
                      key={img}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + (i * 0.1), type: "spring", stiffness: 100 }}
                      className="h-10 w-10 rounded-full border-2 border-white shadow-md" 
                      src={`https://randomuser.me/api/portraits/${img}.jpg`} 
                      alt="" 
                    />
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">+5.000 alunos formados</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.9 + (i * 0.1), type: "spring" }}
                      >
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="ml-1 text-sm text-gray-500"
                    >
                      4.9/5.0
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div> */}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            className="relative w-full h-full"
          >
            <motion.div 
              className="relative w-full h-full"
              
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <motion.img 
                src="/root/student.png" 
                alt="Estudantes em ambiente de aprendizado online" 
                className="w-full h-full object-contain absolute -bottom-26 scale-x-[-1]"
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1, scale: 1.25 }}
                transition={{ delay: 0.6, duration: 1, type: "spring" }}
              />
              {/* <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-[#ff6600]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Cursos Técnicos</p>
                    <p className="text-lg font-bold text-[#0b3b75]">+20 disponíveis</p>
                  </div>
                </div>
              </div> */}
            </motion.div>
          </motion.div>
        </div>
      </div>
      {/* Ondas decorativas */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-24 bg-[url('/images/wave.svg')] bg-cover bg-bottom opacity-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ delay: 0.8, duration: 1.2 }}
      />
    </section>  
  );
}
