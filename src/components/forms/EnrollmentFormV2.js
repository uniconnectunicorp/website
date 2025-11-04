'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {  User, Mail, Phone, Lock, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

// Função para formatar moeda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Schema de validação com Zod
const enrollmentFormSchema = z.object({
  name: z.string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
    
  // email: z.string()
  //   .email({ message: 'Por favor, insira um e-mail válido' }),
    
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
  toast.success('Formulário enviado com sucesso!');
};

const errorToast = () => {
  toast.error('Erro ao enviar formulário');
};

export function EnrollmentFormV2({
  courseName,
  courseTitle,
  coursePrice,
  onSuccess,
  onClose,
  competency,
  compact = false
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      name: '',
      // email: '',
      phone: '',
    },
  });

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = form;

  // Observa mudanças no formulário
  const watchFields = watch();
  const isFormValid = !Object.keys(errors).length && 
                     watchFields.name && 
                    //  watchFields.email && 
                     watchFields.phone;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: data.name,
          // email: data.email,
          phone: data.phone,
          course: courseName,
          modality: competency ? 'Competência' : 'Curso Regular'
        }),
      });
      
      if (response.ok) {
        successToast();
        // Limpa o formulário
        reset();
        router.push('/obrigado');
        // Fecha o modal após 1.5 segundos (tempo para o usuário ver a mensagem de sucesso)
        if (onClose) onClose();
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Erro ao enviar formulário');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      errorToast();
      // Em caso de erro, apenas fecha o modal
      if (onClose) onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative">
      {/* Cabeçalho com informações do curso - apenas se não for compacto */}
      {!compact && (
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 rounded-t-lg -mx-6 -mt-6 mb-6 relative overflow-hidden">
          {/* Animated orb */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full shadow-lg">
              <Sparkles className="w-3 h-3 text-white" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Black November</span>
              <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-full">40% OFF</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">Quase lá!</h2>
            <p className="text-gray-300 text-sm">Preencha o formulário que um de nossos consultores irá entrar em contato e te auxiliar no processo de sua matrícula.</p>
            
            <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-white line-clamp-1">{courseTitle}</h3>
                  <div className="flex items-baseline mt-1 gap-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">{formatCurrency(coursePrice)}</span>
                    <span className="text-gray-400 text-sm line-through">
                      {formatCurrency(coursePrice * 1.67)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">
                    ou 12x de R${competency ? "109,90" : "79,90"} sem juros
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${!compact ? 'px-6 max-md:px-2 pb-6' : 'px-0'}`}>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Nome completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="name"
                placeholder="Digite seu nome completo"
                className={`pl-10 py-5 text-base border-gray-300 focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent ${
                  errors.name ? 'border-red-500 ring-2 ring-red-200' : 'hover:border-blue-400'
                }`}
                {...register('name')}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="h-5 w-5" />
              </div>
              {errors.name && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* <div>
            <div className="flex items-center mb-2">
              <Label htmlFor="email" className="text-sm font-medium text-white">
                E-mail <span className="text-red-500">*</span>
              </Label>
            </div>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className={`pl-10 py-5 text-base border-gray-300 focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent ${
                  errors.email ? 'border-red-500 ring-2 ring-red-200' : 'hover:border-blue-400'
                }`}
                {...register('email')}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              {errors.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="h-4 w-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div> */}

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
              Telefone com DDD <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="phone"
                placeholder="(00) 90000-0000"
                className={`pl-10 pr-8 py-5 text-base border-gray-300 focus:ring-2 focus:ring-[#0b3b75] focus:border-transparent ${
                  errors.phone ? 'border-red-500 ring-2 ring-red-200' : 'hover:border-blue-400'
                }`}
                {...register('phone', {
                  onChange: handlePhoneChange
                })}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone className="h-5 w-5" />
              </div>
              {errors.phone && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="h-4 w-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div className="pt-6 space-y-4">
          <Button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={`w-full flex justify-center items-center py-5 text-base font-bold rounded-lg
              bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black
              focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
              transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/50
              ${(isSubmitting || !isFormValid) ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-5 w-5 mr-2 border-2 border-black border-t-transparent rounded-full"></div>
                Processando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Tenho Interesse
              </>
            )}
          </Button>

          
        </div>
      </form>
    </div>
  );
}
