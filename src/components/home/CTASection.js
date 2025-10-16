'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';



const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  // email: z.string().email({ message: 'Por favor, insira um e-mail válido' }),
  phone: z.string()
    .min(13, { message: 'Telefone inválido' })
    .refine((val) => {
      const numbers = val.replace(/\D/g, '');
      return numbers.length >= 10;
    }, {
      message: 'O número é inválido',
    })
});

const successToast = () => {
  toast.success('Formulário enviado com sucesso!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });};

const errorToast = () => {
  toast.error('Erro ao enviar formulário', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export default function CTASection({ courseName, competency }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  // Função para formatar telefone
  const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, '');
    
    if (numbers.length >= 3) {
      const thirdDigit = numbers[2];
      
      if (thirdDigit === '3') {
        // Telefone fixo: (XX) XXXX-XXXX
        numbers = numbers.substring(0, 10);
        return numbers
          .replace(/^(\d{2})(\d)/g, '($1) $2')
          .replace(/(\d{4})(\d{1,4})/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
      } else if (thirdDigit === '9') {
        // Celular: (XX) XXXXX-XXXX
        numbers = numbers.substring(0, 11);
        return numbers
          .replace(/^(\d{2})(\d)/g, '($1) $2')
          .replace(/(\d{5})(\d{1,4})/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
      }
    }
    
    // Formato padrão enquanto digita
    numbers = numbers.substring(0, 11);
    return numbers
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{4,5})(\d{1,4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };
  
  const handlePhoneChange = (e) => {
    const formattedValue = formatPhone(e.target.value);
    setValue('phone', formattedValue, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: courseName ? JSON.stringify({ 
          name: data.name,
          // email: data.email,
          phone: data.phone,
          course: courseName,
          modality: competency ? 'Competência' : 'Curso Regular'
         }) : JSON.stringify(data),
      });
      
      if (response.ok) {
        successToast();
        reset();
        router.push('/obrigado');
      } else {
        throw new Error('Erro ao enviar formulário');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      errorToast();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0b3b75] text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] bg-center"></div>
      </div>
      <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[#0b3b75]/20"></div>
      <div className="absolute -left-40 -bottom-40 h-80 w-80 rounded-full bg-[#0b3b75]/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Form Section - Left */}
          <motion.div 
            initial={{ opacity: 0, x: -20, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            transition={{ 
              duration: 0.6,
              type: 'spring',
              bounce: 0.2,
              hover: { duration: 0.2 }
            }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#0b3b75]/30 to-[#0b3b75]/40 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl shadow-[#0b3b75]/30"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 mb-2">
                Solicite mais informações
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-[#ff6600] to-[#ff6600] mx-auto rounded-full"></div>
            </motion.div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="nome" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <Input
                    id="nome"
                    placeholder="Seu nome"
                    className={`pl-10 pr-4 py-6 bg-white/5 border-2 border-white/10 text-white text-base rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[#ff6600] focus:border-transparent ${
                      errors.name ? 'border-red-400/80 ring-2 ring-red-400/30' : 'hover:border-white/20'
                    }`}
                    {...register('name')}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                {errors.name && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.name.message}
                  </motion.p>
                )}
              </motion.div>
              
              {/* <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                  E-mail
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className={`pl-10 pr-4 py-6 bg-white/5 border-2 border-white/10 text-white text-base rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[#ff6600] focus:border-transparent ${
                      errors.email ? 'border-red-400/80 ring-2 ring-red-400/30' : 'hover:border-white/20'
                    }`}
                    {...register('email')}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div> */}
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="phone" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                  Telefone com DDD <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="phone"
                    placeholder="(00) 90000-0000"
                    className={`pl-10 pr-4 py-6 bg-white/5 border-2 border-white/10 text-white text-base rounded-xl transition-all duration-300 focus:ring-2 focus:ring-[#ff6600] focus:border-transparent ${
                      errors.phone ? 'border-red-400/80 ring-2 ring-red-400/30' : 'hover:border-white/20'
                    }`}
                    {...register('phone', {
                      onChange: handlePhoneChange
                    })}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                {errors.phone && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.phone.message}
                  </motion.p>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-[#ff6600] hover:bg-orange-700 text-white py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#ff6600]/20 transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span>Enviar mensagem</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </Button>
              </motion.div>
              

              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-xs text-blue-200/80 text-center mt-6 flex items-center justify-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#0b3b75]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Seus dados estão seguros conosco. Não compartilhamos suas informações.</span>
              </motion.p>
            </form>
          </motion.div>
          
          {/* Content Section - Right */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6"
            >
              <p className="text-sm font-medium text-white/90">Comece Agora</p>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
            >
              Transforme seu futuro profissional
              <span className="text-[#FF6B00]"> hoje mesmo</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl text-blue-100 mb-10"
            >
              Junte-se a milhares de alunos que já estão construindo carreiras de sucesso com nossos cursos técnicos reconhecidos no mercado.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 max-w-md mx-auto lg:mx-0"
            >
              <Link 
                href="/cursos"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#ff6600] hover:bg-[#ff6600] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Encontre seu curso ideal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              {/* <Link 
                href="/contato"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-transparent border-2 border-white/20 hover:bg-white/10 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                Fale com um consultor
              </Link> */}
            </motion.div>
        
            
          </div>
        </div>
      </div>
    </section>
  );
}
