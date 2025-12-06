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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contacto</h2>
          <p className="text-slate-400">
            Puedes contactarme a través de cualquiera de estos medios
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
          {contacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <div
                key={contact.id}
                className="bg-slate-800 rounded-lg p-6 flex items-center gap-4 hover:bg-slate-700 transition-colors group"
              >
                <div className={`p-3 rounded-lg ${contact.color}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-400 mb-1">{contact.label}</h3>
                  <a
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    {contact.value}
                  </a>
                </div>
                <button
                  onClick={() => handleCopy(contact.value, contact.id)}
                  className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                  title="Copiar"
                >
                  {copied === contact.id ? (
                    <Check size={20} className="text-green-400" />
                  ) : (
                    <Copy size={20} className="text-slate-400" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
