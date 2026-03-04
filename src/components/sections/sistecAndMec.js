'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Award, CheckCircle, QrCode, Shield, Star } from 'lucide-react';
import Link from 'next/link';
import QRCode from "react-qr-code";

const SISTEC_URL = "https://sistec.mec.gov.br/consultapublicaunidadeensino";

/**
 * instructions: {
 *   titulo?: string,        // ex: "NOSSO CREDENCIAMENTO NO SISTEC - NOVA UNIDADE ESTADO DO PARÁ"
 *   estado: string,
 *   municipio: string,
 *   codigo: string,
 *   nomeEscola: string,
 * }
 */
export default function SistecAndMec({ instructions }) {
  const inst = instructions || {
    estado: "Paraíba",
    municipio: "João Pessoa",
    codigo: "49045",
    nomeEscola: "UNICORP CURSOS E CONSULTORIA EDUCACIONAL",
  };

  const steps = [
    `Acesse o site lendo o QR Code ou Clicando no Link.`,
    `Selecione o Estado ${inst.estado === "Paraíba" ? "da" : "do"} ${inst.estado}.`,
    `Selecione o Município de ${inst.municipio}.`,
    `Aperte CTRL + F para abrir o localizador.`,
    `Digite o código da Escola "${inst.codigo}" ou digite "${inst.nomeEscola}".`,
  ];

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6"
          >
            <Shield className="w-4 h-4 text-[#0b3b75]" />
            <p className="text-sm font-semibold text-[#0b3b75]">Credenciamento Oficial</p>
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

        {/* Single SISTEC Card + Instructions */}
        <div className="grid md:grid-cols-2 gap-8 mb-10 items-start">
          {/* SISTEC QR Code Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="bg-gradient-to-br from-[#0b3b75] via-[#0b3b75] to-[#0b3b75] rounded-2xl p-6 text-white relative overflow-hidden h-full shadow-xl hover:shadow-[#0b3b75]/25 transition-all duration-500 group-hover:scale-[1.02] border border-[#0b3b75]/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b3b75]/20 to-transparent" />
              <div className="absolute top-6 right-6 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
              <div className="absolute top-12 right-12 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-20 left-8 w-2 h-2 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

              <div className="relative z-10 flex flex-col h-full">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-white/25 to-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                  <div className="mb-3">
                    <h3 className="text-2xl font-black mb-2 tracking-tight">SISTEC</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-white/60 to-white/30 mx-auto rounded-full mb-3" />
                    <p className="text-base font-semibold text-white/90 tracking-wide">
                      Sistema Nacional de Informações da Educação Profissional e Tecnológica
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center mb-6">
                  <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 text-center shadow-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                        <QrCode className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-bold text-white tracking-wide">QR CODE</span>
                    </div>
                    <div className="w-36 h-36 mx-auto bg-white rounded-2xl border-4 border-white/30 flex items-center justify-center mb-3 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <div className="w-32 h-32 flex items-center justify-center">
                        <QRCode size={128} className="rounded-lg" value={SISTEC_URL} />
                      </div>
                    </div>
                    <p className="text-xs text-white/80 font-semibold tracking-wider uppercase">Acesso Instantâneo</p>
                  </div>
                </div>

                <Link
                  href={SISTEC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#0b3b75] font-black py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-white/25 transform hover:-translate-y-1 hover:scale-105 border-2 border-white/20 group-hover:border-white/40"
                >
                  <span className="text-base">Verificar Credenciamento</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Instructions Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-blue-100 shadow-lg h-full">
              {inst.titulo && (
                <div className="mb-5 px-4 py-2 bg-[#0b3b75] text-white rounded-xl text-center text-sm font-bold tracking-wide">
                  {inst.titulo}
                </div>
              )}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0b3b75] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Como Consultar</h3>
                  <p className="text-sm text-gray-500">Confira nossa autorização passo a passo</p>
                </div>
              </div>

              <ol className="space-y-4">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-[#0b3b75] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 text-sm leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Código da Escola</span>
                </div>
                <p className="text-2xl font-black text-[#0b3b75]">{inst.codigo}</p>
                <p className="text-xs text-gray-500 mt-1">{inst.nomeEscola}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <h4 className="text-xl font-bold text-gray-900">Certificação de Excelência</h4>
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            </div>
            <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Com nosso credenciamento oficial no SISTEC, você tem a garantia de receber uma educação de qualidade superior,
              com certificados reconhecidos nacionalmente e aceitos em todo o mercado de trabalho brasileiro.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}