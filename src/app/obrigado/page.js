'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle, MessageCircle, Home, Phone, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Head from '@/components/layout/Head';
import { handleWhatsappClick } from '@/components/layout/Whatsapp';


export default function ObrigadoPage() {
  return (
    <>
    
      <Header />
      <Head title="Uniconnect | Obrigado" description="Obrigado por sua mensagem! Entraremos em contato em breve." />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
        {/* Hero Section */}
        
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Success Icon */}
            {/* <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div> */}

            {/* Main Message */}
            <div className="mb-12">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-[#0b3b75] to-[#1e40af] bg-clip-text text-transparent">
                Obrigado por deixar seu contato!!
                </span>
              </h1>
              <p className="text-xl max-md:text-[1rem] text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Entraremos em contato em breve ou se preferir fale direto com um de nossos consultores agora pelo WhatsApp.
              </p>
            </div>


            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Button
                asChild
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <button
                  onClick={() => handleWhatsappClick()}
                  className="flex items-center py-6 justify-center "
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Chamar no WhatsApp</span>
                </button>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto border-2 border-[#0b3b75] text-[#0b3b75] hover:bg-[#0b3b75] hover:text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Link href="/" className="flex items-center py-[22px] justify-center ">
                  <Home className="h-5 w-5" />
                  <span>Voltar ao Início</span>
                </Link>
              </Button>
            </div>

            
          </div>
        </section>

        
      </main>
      
      <Footer />
    </>
  );
}