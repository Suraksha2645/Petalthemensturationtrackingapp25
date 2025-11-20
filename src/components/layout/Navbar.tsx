
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, ThermometerSun, HeartPulse, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCycle } from '@/context/CycleContext';
import { ProfileButton } from '@/components/auth/ProfileButton';

export const Navbar: React.FC = () => {
  const { pregnancyMode } = useCycle();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Calendar },
    { name: pregnancyMode ? 'Pregnancy' : 'Period & Fertility', href: '/period', icon: ThermometerSun },
    { name: 'Symptoms', href: '/symptoms', icon: HeartPulse },
    { name: 'Insights', href: '/insights', icon: BookOpen },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-10 lg:hidden">
        <div className="flex justify-around items-center h-16">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive(item.href)
                  ? 'text-primary'
                  : 'text-gray-400 hover:text-primary'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="cycle-container flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cycle-purple to-cycle-pink flex items-center justify-center text-white font-bold text-lg mr-3">
                P
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
                Petal Flow Freely
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-gray-500 hover:text-primary hover:bg-accent/50'
                }`}
              >
                <item.icon className="mr-2" size={18} />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Profile Button */}
          <div className="flex items-center">
            <ProfileButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative"
              aria-label="Menu"
            >
              <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block h-0.5 w-5 bg-current my-1 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};
