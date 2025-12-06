import React, { useState } from 'react';
import { Mail, Linkedin, Github, Twitter, Copy, Check } from 'lucide-react';

interface ContactProps {
  isAdmin: boolean;
}

export const Contact: React.FC<ContactProps> = ({ isAdmin }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const contacts = [
    {
      id: 'email',
      label: 'Email',
      value: 'alex@example.com',
      icon: Mail,
      url: 'mailto:alex@example.com',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'github',
      label: 'GitHub',
      value: 'github.com/alex',
      icon: Github,
      url: 'https://github.com',
      color: 'bg-slate-100 text-slate-900'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/alex',
      icon: Linkedin,
      url: 'https://linkedin.com',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'twitter',
      label: 'Twitter/X',
      value: '@alex_dev',
      icon: Twitter,
      url: 'https://twitter.com',
      color: 'bg-sky-100 text-sky-600'
    }
  ];

  const handleCopy = (value: string, id: string) => {
    navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative scroll-mt-20">
      <div className="container mx-auto px-4 max-w-4xl">
      </div>
    </section>
  );
};
