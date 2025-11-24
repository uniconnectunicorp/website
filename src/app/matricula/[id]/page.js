import { notFound } from 'next/navigation';
import { sellers } from '@/data/sellers';
import EnrollmentClient from './EnrollmentClient';
import Head from '@/components/layout/Head';

export default async function EnrollmentPage({ params }) {
  const { id } = await params;

  let sellerId;

  if (id === "black-friday") {
     sellerId = id;
  }
  else {
     sellerId = parseInt(id);
  }
  
  const seller = sellers.find(s => s.id === sellerId);

  
  if (!seller) {
    return notFound();
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Head 
        title={`Matrícula - Uniconnect`} 
        description="Complete sua matrícula e comece sua jornada profissional hoje mesmo!"
      />
      <EnrollmentClient seller={seller} />
    </div>
  );
}

export async function generateStaticParams() {
  return sellers.map((seller) => ({
    id: seller.id.toString(),
  }));
}
