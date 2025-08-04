import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, GraduationCap, BookOpen, Users, Award, Heart } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Cursos', path: '/courses' },
    { name: 'Sobre Nós', path: '/about' },
    { name: 'Contato', path: '/contact' },
  ];

  const courseCategories = [
    { name: 'Tecnologia', path: '/courses/tech' },
    { name: 'Negócios', path: '/courses/business' },
    { name: 'Design', path: '/courses/design' },
    { name: 'Marketing', path: '/courses/marketing' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#', color: 'hover:text-[#0b3b75]' },
    { name: 'Instagram', icon: Instagram, url: '#', color: 'hover:text-pink-600' },
    { name: 'Twitter', icon: Twitter, url: '#', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, url: '#', color: 'hover:text-[#0b3b75]' },
  ];

  const contactInfo = [
    { 
      icon: Mail, 
      text: 'contato@uniconnect.com',
      href: 'mailto:contato@uniconnect.com'
    },
    { 
      icon: Phone, 
      text: '(11) 99999-9999',
      href: 'tel:5511999999999'
    },
    { 
      icon: MapPin, 
      text: 'Av. Paulista, 1000 - São Paulo, SP',
      href: 'https://maps.google.com?q=Av.+Paulista,+1000+-+Sao+Paulo+SP'
    },
  ];


  return (
    <footer className="relative bg-[#050b17] border-t border-gray-200/50 dark:border-gray-800/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo e descrição */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center">
                
                <div className="flex flex-col">
                  <Image src="/root/logo.webp" alt="Logo" width={200} height={20} />
                  <span className="text-lg font-medium text-gray-400 dark:text-gray-500 mt-1wep">
                    Polo da Unicorp
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                Transformamos vidas através da educação digital de qualidade. Conectamos conhecimento, oportunidades e pessoas para construir um futuro melhor.
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span>Credenciada pelo MEC e Sistec</span>
              </div>
              
             
              
              {/* Redes Sociais */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      className={`p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 ${social.color} shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50`}
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Navegação */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Navegação
              </h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-gray-600 dark:text-gray-300 hover:text-[#ff6600] dark:hover:text-[#ff6600] transition-all duration-300 hover:translate-x-1 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-[#ff6600] to-[#ff6600] transition-all duration-300 mr-0 group-hover:mr-2 rounded-full"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categorias de Cursos */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Categorias
              </h3>
              <ul className="space-y-3">
                {courseCategories.map((category) => (
                  <li key={category.path}>
                    <Link
                      href={category.path}
                      className="text-gray-600 dark:text-gray-300 hover:text-[#0b3b75] dark:hover:text-blue-400 transition-all duration-300 hover:translate-x-1 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-[#0b3b75] to-[#0b3b75] transition-all duration-300 mr-0 group-hover:mr-2 rounded-full"></span>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Contato */}
              <div className="space-y-4 pt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Fale Conosco
                </h4>
                <ul className="space-y-3">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <li key={index}>
                        <a
                          href={info.href}
                          className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-[#0b3b75] dark:hover:text-blue-400 transition-all duration-300 group text-sm"
                        >
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-[#0b3b75]/30 transition-colors duration-300">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="group-hover:translate-x-1 transition-transform duration-300">{info.text}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200/50 dark:border-gray-800/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span> Uniconnect EAD.</span>
              <span className="hidden md:inline">Feito com</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="hidden md:inline">para educação.</span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-[#0b3b75] dark:hover:text-blue-400 transition-colors duration-300"
              >
                Privacidade
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-[#0b3b75] dark:hover:text-blue-400 transition-colors duration-300"
              >
                Termos
              </Link>
              <Link
                href="/cookies"
                className="text-gray-600 dark:text-gray-400 hover:text-[#0b3b75] dark:hover:text-blue-400 transition-colors duration-300"
              >
                Cookies
              </Link>
              <Link
                href="/accessibility"
                className="text-gray-600 dark:text-gray-400 hover:text-[#0b3b75] dark:hover:text-blue-400 transition-colors duration-300"
              >
                Acessibilidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
