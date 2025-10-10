let counter = 0;

export async function GET() {
  const currentCounter = counter;
  counter++;
  
  return Response.json({ counter: currentCounter });
}