import React, { useState } from 'react';
import { Mail, Linkedin, Github, Twitter, Copy, Check, Send, MessageSquare } from 'lucide-react';
import { saveContactMessage } from '../services/supabaseService';

interface ContactProps {
  isAdmin: boolean;
}

export const Contact: React.FC<ContactProps> = ({ isAdmin }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const success = await saveContactMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      if (success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-900 text-white relative scroll-mt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contacto</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            ¿Tienes un proyecto en mente? Hablemos sobre cómo puedo ayudarte.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="text-blue-400" size={24} />
              <h3 className="text-xl font-bold">Envíame un mensaje</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white resize-none"
                  placeholder="Cuéntame sobre tu proyecto..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Enviar Mensaje
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm text-center">
                  ✅ ¡Mensaje enviado correctamente! Te responderé pronto.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm text-center">
                  ❌ Error al enviar. Por favor intenta de nuevo.
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl mb-6">
              <h3 className="text-xl font-bold mb-4">Información de Contacto</h3>
              <div className="space-y-4">
                {contacts.map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors group"
                    >
                      <a
                        href={contact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 flex-1"
                      >
                        <div className={`p-2 rounded-lg ${contact.color}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">{contact.label}</p>
                          <p className="text-white font-medium">{contact.value}</p>
                        </div>
                      </a>
                      <button
                        onClick={() => handleCopy(contact.value, contact.id)}
                        className="p-2 hover:bg-slate-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Copiar"
                      >
                        {copied === contact.id ? (
                          <Check size={18} className="text-green-400" />
                        ) : (
                          <Copy size={18} className="text-slate-400" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 shadow-xl text-center">
              <h3 className="text-xl font-bold mb-2">¿Listo para empezar?</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Trabajo con clientes de todo el mundo. Hablemos de tu proyecto.
              </p>
              <a
                href="mailto:alex@example.com"
                className="inline-block px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Enviar Email Directo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
