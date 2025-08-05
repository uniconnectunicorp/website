'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Award, CheckCircle, QrCode, Shield, Star } from 'lucide-react';
import Link from 'next/link';
import QRCode from "react-qr-code";

export default function SistecAndMec() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50  border border-blue-100 mb-6"
          >
            <Shield className="w-4 h-4 text-[#0b3b75]" />
            <p className="text-sm font-semibold text-[#0b3b75]">Credenciamentos Oficiais</p>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Qualidade <span className="text-[#0b3b75]">Reconhecida</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Nossos cursos possuem credenciamento oficial do SISTEC e MEC, garantindo certificados válidos em todo território nacional.
          </motion.p>
        </div>

        {/* Credential Cards - Side by Side */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          {/* SISTEC Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="bg-gradient-to-br from-[#0b3b75] via-[#0b3b75] to-[#0b3b75] rounded-3xl p-10 text-white relative overflow-hidden h-full shadow-2xl hover:shadow-[#0b3b75]/25 transition-all duration-500 group-hover:scale-[1.02] border border-[#0b3b75]/20">
              {/* Enhanced Background Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-20 translate-x-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-16 -translate-x-16" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b3b75]/20 to-transparent" />
              
              {/* Floating Elements */}
              <div className="absolute top-6 right-6 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
              <div className="absolute top-12 right-12 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-20 left-8 w-2 h-2 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Enhanced Header */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-white/25 to-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                  <div className="mb-4">
                    <h3 className="text-3xl font-black mb-2 tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">SISTEC</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-white/60 to-transparent mx-auto rounded-full" />
                  </div>
                  <p className="text-blue-100 text-lg leading-relaxed font-medium px-2">Sistema Nacional de Informações da Educação Profissional e Tecnológica</p>
                </div>
                
                {/* Enhanced QR Code */}
                <div className="flex-1 flex flex-col items-center justify-center mb-8">
                  <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 text-center shadow-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                        <QrCode className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-white tracking-wide">QR CODE</span>
                    </div>
                    <div className="w-36 h-36 mx-auto bg-white rounded-2xl border-4 border-white/30 flex items-center justify-center mb-3 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <div className="w-32 h-32 bg-gray-900 rounded-xl shadow-inner" style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='qr-sistec' width='8' height='8' patternUnits='userSpaceOnUse'%3e%3crect width='4' height='4' fill='%23000'/%3e%3crect x='4' y='4' width='4' height='4' fill='%23000'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100' height='100' fill='url(%23qr-sistec)'/%3e%3c/svg%3e")`,
                        backgroundSize: 'cover'
                      }} >
                        <QRCode size={128} className='rounded-lg' value="https://sistec.mec.gov.br/consultapublicaunidadeensino/" />
                        </div>
                    </div>
                    <p className="text-xs text-white/80 font-semibold tracking-wider uppercase">Acesso Instantâneo</p>
                  </div>
                </div>
                
                {/* Enhanced Button */}
                <Link
                  href="https://sistec.mec.gov.br/consultapublicaunidadeensino/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#0b3b75] font-black py-4 px-8 rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-2 hover:scale-105 border-2 border-white/20 group-hover:border-white/40"
                >
                  <span className="text-lg">Verificar Credenciamento</span>
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* MEC Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="bg-gradient-to-br from-[#ff6600] to-[#ff6600] rounded-3xl p-10 text-white relative overflow-hidden h-full shadow-2xl hover:shadow-[#ff6600]/25 transition-all duration-500 group-hover:scale-[1.02] border border-[#ff6600]/20">
              {/* Enhanced Background Elements */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-20 -translate-x-20" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/5 to-transparent rounded-full translate-y-16 translate-x-16" />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent" />
              
              {/* Floating Elements */}
              <div className="absolute top-6 left-6 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
              <div className="absolute top-12 left-12 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
              <div className="absolute bottom-20 right-8 w-2 h-2 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Enhanced Header */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-white/25 to-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                  <div className="mb-4">
                    <h3 className="text-3xl font-black mb-2 tracking-tight bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">MEC</h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-white/60 to-transparent mx-auto rounded-full" />
                  </div>
                  <p className="text-orange-100 text-lg leading-relaxed font-medium px-2">Ministério da Educação</p>
                </div>
                
                {/* Enhanced QR Code */}
                <div className="flex-1 flex flex-col items-center justify-center mb-8">
                  <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 text-center shadow-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                        <QrCode className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-white tracking-wide">QR CODE</span>
                    </div>
                    <div className="w-36 h-36 mx-auto bg-white rounded-2xl border-4 border-white/30 flex items-center justify-center mb-3 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <div className="w-32 h-32 bg-gray-900 rounded-xl shadow-inner" style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='qr-mec' width='8' height='8' patternUnits='userSpaceOnUse'%3e%3crect width='4' height='4' fill='%23000'/%3e%3crect x='4' y='4' width='4' height='4' fill='%23000'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100' height='100' fill='url(%23qr-mec)'/%3e%3c/svg%3e")`,
                        backgroundSize: 'cover'
                      }} >
                        <QRCode size={128} className='rounded-lg' value="https://emec.mec.gov.br/emec/consulta-cadastro/detalhamento/d96957f455f6405d14c6542552b0f6eb/MjI5NzU=" />
                        </div>
                    </div>
                    <p className="text-xs text-white/80 font-semibold tracking-wider uppercase">Acesso Instantâneo</p>
                  </div>
                </div>
                
                {/* Enhanced Button */}
                <Link
                  href="https://emec.mec.gov.br/emec/consulta-cadastro/detalhamento/d96957f455f6405d14c6542552b0f6eb/MjI5NzU="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-white text-orange-800 font-black py-4 px-8 rounded-2xl hover:bg-orange-50 transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-2 hover:scale-105 border-2 border-white/20 group-hover:border-white/40"
                >
                  <span className="text-lg">Verificar Credenciamento</span>
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
              <h4 className="text-2xl font-bold text-gray-900">Certificação de Excelência</h4>
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Com nossos credenciamentos oficiais, você tem a garantia de receber uma educação de qualidade superior, 
              com certificados reconhecidos nacionalmente e aceitos em todo mercado de trabalho brasileiro.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}