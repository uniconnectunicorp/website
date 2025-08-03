export default function BrandsSection() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
          Reconhecido pelas melhores empresas do mercado
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-center opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
              <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
