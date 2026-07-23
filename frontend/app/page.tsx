import { Hero } from '@/components/Home/Hero';
import { Appiments } from '@/components/Home/Appiments';
import { Servcies1 } from '@/components/Home/Servcies1';
import { About } from '@/components/Home/About';
import { Services } from '@/components/Home/Services';
import { SpecialistDoctors } from '@/components/Home/Specialist Doctors';
import React from 'react';

export default function Home() {
  return (
    <>
      <Hero />
      <Appiments />
      <Servcies1 />
      <About />
      <Services />
      <SpecialistDoctors />
    </>
  );
}
