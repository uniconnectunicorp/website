'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form' // Assumindo que o shadcn crie um componente Form
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  // email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  phone: z.string().min(13, { message: 'Telefone inválido' }).refine((val) => {
    const numbers = val.replace(/\D/g, '');
    return numbers.length >= 10;
  }, { message: 'O número é inválido' }),
  subject: z.string().min(5, { message: 'O assunto deve ter pelo menos 5 caracteres.' }),
  message: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres.' }).max(500, { message: 'A mensagem não pode ter mais de 500 caracteres.' }),
})

export function ContactForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      // email: '',
      phone: '',
      subject: '',
      message: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values) // Em um projeto real, você enviaria isso para um backend
   
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="seu.email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => {
            const formatPhone = (value: string) => {
              let numbers = value.replace(/\D/g, '');
              
              if (numbers.length >= 3) {
                const thirdDigit = numbers[2];
                
                if (thirdDigit === '3') {
                  numbers = numbers.substring(0, 10);
                  return numbers
                    .replace(/^(\d{2})(\d)/g, '($1) $2')
                    .replace(/(\d{4})(\d{1,4})/, '$1-$2')
                    .replace(/(-\d{4})\d+?$/, '$1');
                } else if (thirdDigit === '9') {
                  numbers = numbers.substring(0, 11);
                  return numbers
                    .replace(/^(\d{2})(\d)/g, '($1) $2')
                    .replace(/(\d{5})(\d{1,4})/, '$1-$2')
                    .replace(/(-\d{4})\d+?$/, '$1');
                }
              }
              
              numbers = numbers.substring(0, 11);
              return numbers
                .replace(/^(\d{2})(\d)/g, '($1) $2')
                .replace(/(\d{4,5})(\d{1,4})/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
            };
            
            return (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(00) 90000-0000" 
                    {...field}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assunto</FormLabel>
              <FormControl>
                <Input placeholder="Sobre o que você gostaria de falar?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite sua mensagem aqui..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Enviar Mensagem</Button>
      </form>
    </Form>
  )
}
