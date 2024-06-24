import { SslFinalsController } from '@/controllers/sslFinalsController';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const sslFinalsController = new SslFinalsController();

  await sslFinalsController.initialise();
  const sslFinalsDetails = await sslFinalsController.getFinalsDetails();

  return NextResponse.json(sslFinalsDetails);
};
