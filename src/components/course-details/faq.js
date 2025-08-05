'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

const faqData = [
  {
    question: 'Qual é o tempo mínimo para conclusão do curso?',
    answer:
      'O tempo mínimo para conclusão do curso varia de acordo com o curso. Nossos cursos técnicos geralmente têm uma duração de 6 a 12 meses. Você pode encontrar a informação específica na página de detalhes de cada curso.',
  },
  {
    question: 'O curso é totalmente online?',
    answer:
      'Sim, todos os nossos cursos técnicos são reconhecidos pelo MEC, garantindo a validade do seu certificado em todo o território nacional., o curso é 100% online, oferecendo flexibilidade para que você estude de qualquer lugar e no horário que melhor se adapte à sua rotina.',
  },
  {
    question: 'Consigo obter o registro após a conclusão do curso?',
    answer:
      'Sim, após a conclusão do curso técnico, você poderá solicitar o registro no conselho responsável pela sua área de atuação. O curso atende aos requisitos necessários para esse registro.',
  },
  {
    question: 'O curso é reconhecido pelo MEC?',
    answer:
      'Sim, é reconhecido pelo MEC (Ministério da Educação), o que garante a validade do seu diploma em todo o território nacional.',
  },
  {
    question: 'O curso é cadastrado no SISTEC?',
    answer:
      'Sim, o curso técnico é cadastrado no SISTEC (Sistema Nacional de Informações da Educação Profissional e Tecnológica), o que assegura a regularidade e a qualidade da formação oferecida.',
  },
  
]

const AccordionItem = ({ item, isOpen, onClick }) => (
  <div
    className={clsx(
      'rounded-lg shadow-md mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg',
      {
        'bg-[#0b3b75] text-white': isOpen,
        'bg-white ': !isOpen,
      },
    )}
  >
    <motion.header
      initial={false}
      onClick={onClick}
      className="flex justify-between items-center cursor-pointer p-6"
    >
      <h3
        className={clsx('text-lg font-semibold', {
          'text-white': isOpen,
          'text-gray-800 ': !isOpen,
        })}
      >
        {item.question}
      </h3>
      <motion.div
        animate={{
          rotate: isOpen ? 180 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <ChevronDown
          className={clsx('h-6 w-6', {
            'text-white': isOpen,
            'text-gray-500': !isOpen,
          })}
        />
      </motion.div>
    </motion.header>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.section
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="overflow-hidden"
        >
          <p
            className={clsx('px-6 pb-6', {
              'text-gray-100': isOpen,
              'text-gray-600 dark:text-gray-300': !isOpen,
            })}
          >
            {item.answer}
          </p>
        </motion.section>
      )}
    </AnimatePresence>
  </div>
)

export function CourseFAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900  sm:text-4xl">
          Perguntas Frequentes
        </h2>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Tire suas dúvidas sobre nossos cursos e plataforma.
        </p>
      </div>
      <div className="mt-8">
        {faqData.map((item, index) => (
          <AccordionItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </div>
  )
}