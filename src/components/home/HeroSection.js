'use client';

import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Star, BookOpen, Zap, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';
import StatsSection from './StatsSection';

export default function HeroSection({ isBlackNovember = false }) {
  return (
    <section className={`relative w-full overflow-hidden flex flex-col items-center ${
      isBlackNovember 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
        : 'bg-gradient-to-b from-white to-primary'
    }`}>
      {/* Background Pattern */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isBlackNovember ? 0.1 : 0.05 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center"
      />
      
      {/* Black November Special Effects */}
      {isBlackNovember && (
        <>
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          {/* Floating sparkles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}
      <div className="relative max-w-7xl w-full px-4 pt-24 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-md:mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 text-left"
            >
              {isBlackNovember ? (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 shadow-lg shadow-orange-500/50"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                  <p className="text-sm font-bold text-white uppercase tracking-wider">Black November 2025</p>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Zap className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="inline-block px-4 py-1.5 rounded-full bg-secondary-50 border border-secondary-100"
                >
                  <p className="text-sm font-medium text-secondary">Cursos Técnicos 100% Online</p>
                </motion.div>
              )}
              
              <motion.h1 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${
                  isBlackNovember ? 'text-white' : 'text-gray-900'
                }`}
              >
                {isBlackNovember ? (
                  <>
                    Transforme sua carreira com{' '}
                    <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 text-transparent bg-clip-text animate-pulse">
                      40% OFF
                    </span>
                    {' '}em todos os cursos técnicos
                  </>
                ) : (
                  <>
                    Formação profissional de <span className="text-primary">alta qualidade</span> para o mercado de trabalho
                  </>
                )}
              </motion.h1>
              
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className={`text-lg ${
                  isBlackNovember ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {isBlackNovember ? (
                  <>
                    <span className="font-semibold text-yellow-400">Oferta exclusiva de Black November!</span> Cursos técnicos reconhecidos pelo MEC com descontos imperdíveis. Invista no seu futuro agora!
                  </>
                ) : (
                  <>
                    Cursos técnicos reconhecidos pelo MEC com certificação válida em todo o Brasil. 
                    Aprenda com especialistas e dê um salto na sua carreira profissional.
                  </>
                )}
              </motion.p>
              
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {isBlackNovember && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black border-2 border-yellow-400 rounded-lg"
                  >
                    <Tag className="w-5 h-5 text-yellow-400" />
                    <div className="text-left">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Desconto de até</p>
                      <p className="text-2xl font-black text-yellow-400">40% OFF</p>
                    </div>
                  </motion.div>
                )}
                <Link
                  href="/cursos"
                  className={`inline-flex z-10 items-center justify-center px-8 py-4 text-base font-bold rounded-lg transition-all duration-300 shadow-lg hover:scale-[1.05] ${
                    isBlackNovember
                      ? 'text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 shadow-yellow-500/50'
                      : 'text-white bg-[#ff6600] hover:bg-[#ff6600] hover:shadow-orange-200'
                  }`}
                >
                  {isBlackNovember ? 'Aproveitar Oferta Agora' : 'Conheça Nossos Cursos'}
                  <motion.span 
                    animate={{ x: [0, 4, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatType: "reverse",
                      duration: 1.5
                    }}
                    className="ml-2"
                  >
                    <ArrowRight className="h-5 w-5" />
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
      {!isBlackNovember && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-24 bg-[url('/images/wave.svg')] bg-cover bg-bottom opacity-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.3, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        />
      )}
    </section>  
  );
}
