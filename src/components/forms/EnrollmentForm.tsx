"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';

type EnrollmentFormProps = {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  onSuccess: () => void;
  onClose: () => void;
};

export function EnrollmentForm({
  courseId,
  courseTitle,
  coursePrice,
  onSuccess,
  onClose,
}: EnrollmentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // TODO: Implement actual enrollment logic
      console.log('Enrolling with:', { courseId, name, email });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSuccess();
    } catch (err) {
      setError('Ocorreu um erro ao processar sua matrícula. Tente novamente.');
      console.error('Enrollment error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Curso: {courseTitle}</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {formatCurrency(coursePrice)}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processando...' : 'Confirmar Matrícula'}
        </Button>
      </div>
    </form>
  );
}
