import { ChevronDown, PlayCircle, Clock } from 'lucide-react';
import { useState } from 'react';


export function CourseContentSection({ 
  modules = [], 
  totalDuration, 
  totalLessons 
}) {
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (moduleName) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleName]: !prev[moduleName]
    }));
  };

  return (
    <section id="conteudo" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Conteúdo do Curso</h2>
          <div className="mt-4 flex justify-center items-center space-x-6 text-gray-600">
            <div className="flex items-center">
              <PlayCircle className="h-5 w-5 mr-2 text-[#0b3b75]" />
              <span>{totalLessons} módulos</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-[#0b3b75]" />
              <span>{totalDuration} horas de conteúdo</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {modules.map((module, moduleIndex) => (
            <div key={module.nome} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleModule(module.nome)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">
                    {module.nome}
                  </span>
                  <span className="ml-3 text-sm text-gray-500">
                    {module.lessons.length} aulas • {module.carga_horaria} horas
                  </span>
                </div>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-500 transition-transform ${expandedModules[module.nome] ? 'transform rotate-180' : ''}`} 
                />
              </button>
              
              {expandedModules[module.nome] && (
                <div className="bg-gray-50 px-6 py-4">
                  <ul className="space-y-3">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lesson.nome} className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                          <PlayCircle className="h-5 w-5 text-[#0b3b75]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {lesson.nome}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500">{lesson.carga_horaria} horas</span>
                            {lesson.preview && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                Visualização
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
