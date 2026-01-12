'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';

// Array com os números de WhatsApp
const whatsappNumbers = [
  '5531988775149',
  '5531971844456',
  '5531990715637'
];

export const handleWhatsappClick = async () => {
  try {
    // Primeiro, obtém o contador atual
    const getResponse = await fetch('/api/whatsapp-counter');
    const { counter, success } = await getResponse.json();
    
    if (!success) {
      console.error('Erro ao obter contador do WhatsApp');
      // Tenta abrir o primeiro número como fallback
      const message = 'Olá! Gostaria de saber mais informações sobre os cursos.';
      const whatsappUrl = `https://wa.me/${whatsappNumbers[0]}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      return;
    }
    
    const selectedIndex = counter % whatsappNumbers.length;
    const selectedNumber = whatsappNumbers[selectedIndex];
    const message = 'Olá! Gostaria de saber mais informações sobre os cursos.';
    const whatsappUrl = `https://wa.me/${selectedNumber}?text=${encodeURIComponent(message)}`;
    
    // Abre a URL do WhatsApp em uma nova aba
    const newWindow = window.open(whatsappUrl, '_blank');
    
    // Incrementa o contador após o redirecionamento bem-sucedido
    if (newWindow) {
      try {
        const response = await fetch('/api/whatsapp-counter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ number: selectedNumber })
        });
        
        if (!response.ok) {
          console.error('Erro ao registrar o contato no contador');
        }
      } catch (error) {
        console.error('Erro ao registrar o contato:', error);
      }
    }
  } catch (error) {
    console.error('Erro ao abrir o WhatsApp:', error);
    // Fallback para o primeiro número em caso de erro
    const message = 'Olá! Gostaria de saber mais informações sobre os cursos.';
    const whatsappUrl = `https://wa.me/${whatsappNumbers[0]}?text=${encodeURIComponent(message)}`;
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