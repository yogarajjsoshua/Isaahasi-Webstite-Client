import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main role="main" className="flex-1 pt-[174px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
