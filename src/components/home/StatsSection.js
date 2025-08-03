import { motion } from 'framer-motion';


const stats = [
  { label: 'Alunos', value: '10.000+', description: 'Já se matricularam em nossos cursos' },
  { label: 'Cursos', value: '50+', description: 'Diversas áreas de atuação' },
  { label: 'Instrutores', value: '100+', description: 'Especialistas no mercado' },
  { label: 'Satisfação', value: '98%', description: 'Índice de satisfação dos alunos' },
];

export default function StatsSection() {
  return (
    <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          viewport={{ once: true }}
        >
          <div className="text-2xl md:text-3xl font-bold text-yellow-300">{stat.value}</div>
          <div className="text-sm text-blue-100 mt-1">{stat.label}</div>
          <div className="text-xs text-blue-200/70 mt-1">{stat.description}</div>
        </motion.div>
      ))}
    </div>
  );
}
