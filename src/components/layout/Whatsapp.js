'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';
import { getLeadSessionId, getLeadResponsavel, setLeadSession } from '@/lib/cookies';

// Mapeamento de responsáveis para números de WhatsApp
const responsavelToNumber = {
  'Clara': '5531988775149',
  'Lidiane': '5531971844456',
  'Jaiany': '5531990715637'
};

// Fallback para o primeiro número
const defaultNumber = '5531988775149';

export const handleWhatsappClick = async () => {
  try {
    // Verifica se já tem sessão (cookie ou localStorage)
    let sessionId = getLeadSessionId();
    let responsavel = getLeadResponsavel();
    
    // Se não tem sessão, cria uma nova
    if (!sessionId || !responsavel) {
      const headers = {};
      if (sessionId) {
        headers['x-lead-session'] = sessionId;
      }
      
      const response = await fetch('/api/lead-session', { headers });
      const data = await response.json();
      
      if (data.success) {
        sessionId = data.sessionId;
        responsavel = data.responsavel;
        
        // Salva em cookie + localStorage
        setLeadSession(sessionId, responsavel);
      }
    }
    
    // Obtém o número do WhatsApp baseado no responsável
    const selectedNumber = responsavelToNumber[responsavel] || defaultNumber;
    const message = 'Olá! Gostaria de saber mais informações sobre os cursos.';
    const whatsappUrl = `https://wa.me/${selectedNumber}?text=${encodeURIComponent(message)}`;
    
    // Abre a URL do WhatsApp em uma nova aba
    const newWindow = window.open(whatsappUrl, '_blank');
    
    // Registra o log do WhatsApp
    if (newWindow) {
      try {
        await fetch('/api/whatsapp-counter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ number: selectedNumber })
        });
      } catch (error) {
        console.error('Erro ao registrar o contato:', error);
      }
    }
  } catch (error) {
    console.error('Erro ao abrir o WhatsApp:', error);
    // Fallback para o primeiro número em caso de erro
    const message = 'Olá! Gostaria de saber mais informações sobre os cursos.';
    const whatsappUrl = `https://wa.me/${defaultNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
};

const WhatsappFloat = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Não mostrar o WhatsApp na página de matrícula e Black Friday
  const isEnrollmentPage = pathname?.startsWith('/matricula');
  const isBlackFridayPage = pathname?.startsWith('/blackfriday');

  useEffect(() => {
    // Mostrar o botão após um pequeno delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



  // Não renderizar o componente na página de matrícula e Black Friday
  if (isEnrollmentPage || isBlackFridayPage) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-6 right-6  z-50 transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {/* Efeito sutil de pulso */}
      <div className="absolute inset-0 rounded-full bg-green-500 animate-slow-pulse opacity-20"></div>
      
      {/* Botão principal */}
      <button
        onClick={handleWhatsappClick}
        id="whatsapp-button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center cursor-pointer justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ease-out transform hover:scale-105 group"
        aria-label="Falar no WhatsApp"
      >
        <FaWhatsapp className="text-xl" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Fale conosco no WhatsApp
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
        </div>
      </button>
      
      {/* Texto animado (opcional)
      <div
        className={`absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg px-4 py-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}
      >
        <p className="text-gray-800 text-sm font-medium whitespace-nowrap">
          💬 Precisa de ajuda?
        </p>
        <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-4 border-transparent border-l-white"></div>
      </div> */}
    </div>
  );
};

export default WhatsappFloat;