'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Clock, Award, CheckCircle, Zap, Target, Brain, Briefcase, GraduationCap, Sparkles, ChevronRight, Star, Gift, Users, Monitor } from 'lucide-react';
import Link from 'next/link';
import { EnrollmentFormV2 } from '@/components/forms/EnrollmentFormV2';

export default function SequentialCoursePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkAndShowPopup = () => {
      const lastShown = localStorage.getItem('sequentialCoursePopupLastShown');
      const today = new Date().toDateString();

      if (lastShown !== today) {
        setTimeout(() => {
          setIsOpen(true);
        }, 3000);
      }
    };

    checkAndShowPopup();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('sequentialCoursePopupLastShown', new Date().toDateString());
  };

  const handleCTA = () => {
    localStorage.setItem('sequentialCoursePopupLastShown', new Date().toDateString());
    setIsOpen(false);
  };

  const highlights = [
    { icon: Award, text: 'Certificado MEC', label: 'Reconhecido' },
    { icon: Clock, text: '4 a 6 meses', label: 'Duração' },
    { icon: Monitor, text: '100% EaD', label: 'Modalidade' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotateX: -20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.7, rotateX: 20 }}
            transition={{ type: "spring", duration: 0.7, bounce: 0.35 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={handleClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-2xl sm:rounded-[2.5rem] shadow-2xl max-w-lg sm:max-w-7xl w-full overflow-hidden max-h-[90vh] sm:max-h-none overflow-y-auto overscroll-contain"
            >
              <motion.div
                className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#0b3b75] via-emerald-600 via-[#0b3b75] to-emerald-600"
                animate={{
                  backgroundPosition: ['0% 50%', '200% 50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 100%'
                }}
              />

              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-[#0b3b75]/20 rounded-full blur-3xl -mr-48 -mt-48 hidden sm:block"
              />
              
              <motion.div
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.2, 0.4, 0.2],
                  rotate: [360, 180, 0]
                }}
                transition={{ 
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#0b3b75]/20 to-emerald-500/20 rounded-full blur-3xl -ml-48 -mb-48 hidden sm:block"
              />

              <button
                onClick={handleClose}
                className="absolute top-5 right-5 z-10 p-3 rounded-full bg-white/90 hover:bg-white shadow-xl transition-all duration-200 hover:scale-110 hover:rotate-90"
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>

              <div className="relative">
                <div className="p-5 sm:p-8 lg:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    <div>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                        className="flex justify-center lg:justify-start mb-4 sm:mb-5 max-md:hidden"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{ 
                              rotate: [0, 10, -10, 0],
                              y: [0, -15, 0]
                            }}
                            transition={{ 
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="bg-gradient-to-br from-[#0b3b75] via-[#0d4d99] to-[#0b3b75] p-5 sm:p-6 rounded-3xl shadow-2xl"
                          >
                            <BookOpen className="h-16 w-16 text-white" />
                          </motion.div>
                          <motion.div
                            animate={{ 
                              scale: [1, 1.4, 1],
                              rotate: [0, 360, 720]
                            }}
                            transition={{ 
                              duration: 6,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="absolute -top-3 -right-3 bg-emerald-600 rounded-full p-2 shadow-lg"
                          >
                            <Zap className="h-7 w-7 text-white" />
                          </motion.div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-center lg:text-left mb-4 sm:mb-6 max-md:pt-4"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring" }}
                          className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm mb-3 sm:mb-4 shadow-lg"
                        >
                          Cursos Sequenciais
                        </motion.div>
                        
                        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight">
                          Formação rápida para o mercado
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6 line-clamp-3">
                          Cursos de 4 a 6 meses, 100% EaD, com 560 horas de carga horária. Invista no seu futuro profissional.
                        </p>

                        <div className="hidden sm:grid grid-cols-3 gap-3 mb-6">
                          {highlights.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + (index * 0.1) }}
                              className="flex flex-col items-center gap-1 p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200"
                            >
                              <item.icon className="h-5 w-5 text-[#0b3b75]" />
                              <span className="text-xs font-medium text-gray-500">{item.label}</span>
                              <span className="text-sm font-bold text-gray-700">{item.text}</span>
                            </motion.div>
                          ))}
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-[#0b3b75]/10 rounded-2xl p-4 border-2 border-emerald-600/30 shadow-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0">
                              <Gift className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-sm line-through text-gray-400">De R$ 1.849,90</h3>
                              <h3 className="text-base font-bold text-gray-900">R$ 1.109,90 à vista <span className="text-xs font-bold text-emerald-600 ml-1">40% OFF</span></h3>
                              <p className="text-xs text-gray-600">
                                ou 12x de R$ 101,90 no cartão
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>

                    <div>
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4 sm:space-y-5"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="bg-gradient-to-br from-white max-md:hidden to-gray-50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 border-gray-200 shadow-xl relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl" />
                          <div className="relative text-center">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[11px] sm:text-xs font-bold mb-3 sm:mb-4"
                            >
                              ATENDIMENTO GRATUITO
                            </motion.div>
                            
                            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
                              Fale com um consultor
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                              Tire dúvidas e receba orientação personalizada
                            </p>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 border-gray-200 shadow-xl"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-[#0b3b75]/10 rounded-2xl p-3 mb-3 border-2 border-emerald-600/30 shadow-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                <Gift className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-sm sm:text-base font-bold text-gray-900">Condições Especiais</h3>
                                <p className="text-xs text-gray-600">
                                  Matrículas abertas com descontos exclusivos
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          <EnrollmentFormV2 
                            courseName="Cursos Sequenciais Uniconnect"
                            courseTitle="Interesse em Cursos Sequenciais"
                            coursePrice={1109.90}
                            aproveitamento={false}
                            onSuccess={handleCTA}
                            blackText={true}
                            compact={true}
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full text-gray-500 hover:text-gray-700 font-medium cursor-pointer mt-6 sm:mt-10 text-sm transition-colors"
                  >
                    Continuar explorando cursos
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
