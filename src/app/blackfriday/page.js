'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Gift, Clock, Users, CheckCircle2, Flame, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Head from '@/components/layout/Head';
import Image from 'next/image';
import Link from 'next/link';

export default function BlackFridayPage() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown para 27 e 28 de novembro de 2025
  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      // Data alvo: 28 de novembro de 2025, 23:59:59
      const targetDate = new Date('2025-11-28T23:59:59-03:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    // Atualiza imediatamente
    setTimeLeft(calculateTimeLeft());

    // Atualiza a cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://chat.whatsapp.com/Dtgv4K3OYSMDdSc6QpR3le', '_blank');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <Head />
      
      {/* Background Effects - Otimizado */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center"></div>
      </div>
      
      {/* Static gradient orbs - Sem animação para melhor performance */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl max-md:hidden" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl max-md:hidden" />

      {/* Logo Header */}
      <div className="relative pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center justify-center gap-4 group">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="/root/logo.webp"
                width={180}
                height={60}
                alt="Uniconnect Logo"
                className="object-contain h-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </motion.div>
           
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center py-12">
        <div className="w-full text-center space-y-12">
          
          {/* Badge */}
        
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
              <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 text-transparent bg-clip-text">
                100 Bolsas
              </span>
              <br />
              com{' '}
              <span className="relative inline-block">
                <span className="text-yellow-400">60% OFF</span>
              </span>
            </h1>

            <div className="space-y-4">
              <p className="text-lg md:text-xl text-yellow-400 font-bold">
                27 e 28/11 - Limitado às 100 primeiras matrículas
              </p>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Oferta exclusiva para quem estiver no nosso <span className="font-bold text-yellow-400">grupo do WhatsApp</span>. Oportunidade imperdível para iniciar o técnico dos seus sonhos ainda em 2025.
              </p>
              <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
                Curso Técnico 100% Online | Formação a partir de 6 meses | Reconhecidos MEC e SISTEC
              </p>
            </div>
          </motion.div>

          {/* Countdown Timer */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center"
            >
              <div className="bg-black/50 backdrop-blur-lg border-2 border-yellow-400/30 rounded-2xl p-8 shadow-2xl shadow-yellow-500/20">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <p className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">Tempo restante</p>
                </div>
                <div className="grid grid-cols-4 gap-4 md:gap-6">
                  {[
                    { label: 'Dias', value: timeLeft.days },
                    { label: 'Horas', value: timeLeft.hours },
                    { label: 'Min', value: timeLeft.minutes },
                    { label: 'Seg', value: timeLeft.seconds }
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-4 md:p-6 min-w-[70px] md:min-w-[90px] shadow-lg">
                        <span className="text-3xl md:text-4xl font-black text-black">
                          {String(item.value).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-xs md:text-sm text-gray-400 mt-2 font-medium uppercase tracking-wide">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Gift, title: '100 Bolsas', description: 'Vagas limitadas exclusivas' },
              { icon: Users, title: 'Grupo VIP', description: 'Acesso prioritário às ofertas' },
              { icon: Zap, title: '60% OFF', description: 'Desconto imperdível' }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-black/40 backdrop-blur-lg border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="space-y-6"
          >
            <motion.button
              onClick={handleWhatsAppClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center justify-center max-md:w-full max-md:px-3 py-6 text-xl font-black rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all duration-300 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <MessageCircle className="w-6 h-6 mr-3 relative z-10" />
              <span className="relative z-10 ">ENTRAR NO GRUPO VIP</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10 ml-3"
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </motion.button>

           
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 max-w-2xl mx-auto"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h4 className="text-lg font-bold text-white mb-2">⚠️ Atenção!</h4>
                <p className="text-gray-300 leading-relaxed">
                  As bolsas serão distribuídas <span className="font-bold text-yellow-400">somente para quem estiver no grupo</span>. Garanta sua vaga antes que acabe! A liberação acontece nos dias <span className="font-bold text-yellow-400">27 e 28 de novembro</span>, limitado às 100 primeiras matrículas.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left"
          >
            {[
              'Cursos técnicos reconhecidos pelo MEC',
              'Certificação válida em todo o Brasil',
              'Estude 100% online no seu ritmo',
              'Professores especialistas atuantes no mercado',
              'Material didático completo incluso',
              'Suporte especializado durante todo o curso'
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + index * 0.05 }}
                className="flex items-center gap-3 text-gray-300"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
