'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, BookOpen, ArrowLeft, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Header isBlackNovember={true} />
      
      <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"
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
            className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"
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
          
          {/* Floating elements */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
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
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 404 Number */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="mb-8"
            >
              <h1 className="text-[180px] md:text-[250px] font-black leading-none bg-gradient-to-br from-[#0b3b75] via-[#1e40af] to-[#0b3b75] text-transparent bg-clip-text drop-shadow-2xl">
                404
              </h1>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">Ops!</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Página Não Encontrada
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Parece que você se perdeu no caminho. A página que você está procurando não existe ou foi movida.
              </p>
            </motion.div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-9xl"
                >
                  📚
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [-10, 10],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 text-6xl"
                >
                  🔍
                </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0b3b75] to-[#1e40af] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Voltar para Home
              </Link>
              
              <Link
                href="/cursos"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0b3b75] rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-[#0b3b75]"
              >
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Ver Cursos
              </Link>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <p className="text-sm text-gray-600 mb-4">Você também pode estar procurando por:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { label: 'Sobre Nós', href: '/sobre' },
                  { label: 'Contato', href: '/contato' },
                  { label: 'Cursos Técnicos', href: '/cursos' },
                  { label: 'Por Competência', href: '/cursos/competencia' },
                ].map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Error Code */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12"
            >
              <p className="text-xs text-gray-400 font-mono">
                ERROR_CODE: PAGE_NOT_FOUND_404
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
