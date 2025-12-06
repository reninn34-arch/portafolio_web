import React, { useState, useEffect } from 'react';
import { Lock, Unlock, X } from 'lucide-react';
import { Hero } from './components/Hero';
import { Brands } from './components/Brands';
import { LogoGallery } from './components/LogoGallery';
import { VideoGallery } from './components/VideoGallery';
import { Resume } from './components/Resume';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Experience, Education, Skill } from './types';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Check if admin session exists on load
  useEffect(() => {
    const adminSession = sessionStorage.getItem('isAdmin');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleLockClick = () => {
    if (isAdmin) {
      setIsAdmin(false);
      sessionStorage.removeItem('isAdmin');
    } else {
      setShowLoginModal(true);
      setLoginError('');
      setPasswordInput('');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalize input: remove spaces and convert to lowercase for better UX
    const normalizedInput = passwordInput.trim().toLowerCase();

    if (normalizedInput === "ladyadmin") {
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
      setShowLoginModal(false);
    } else {
      setLoginError('Contraseña incorrecta. Intenta con: ladyadmin');
    }
  };

  // Lady Mosquera's Resume Data - Default values
  const defaultExperiences: Experience[] = [
    {
      id: '1',
      role: 'Content Creator & Editora de Video',
      company: 'Freelance',
      period: '2022 - Presente',
      description: 'Creación de contenido viral para TikTok e Instagram. Edición dinámica de Reels, corrección de color y diseño de miniaturas atractivas para YouTube.'
    },
    {
      id: '2',
      role: 'Diseñadora Gráfica para Redes',
      company: 'Agencia Digital Creative',
      period: '2020 - 2022',
      description: 'Diseño de parrillas de contenido para Instagram y Facebook. Creación de identidad visual para marcas de moda y belleza.'
    },
    {
      id: '3',
      role: 'Asistente de Producción Audiovisual',
      company: 'Studio Visual Pro',
      period: '2019 - 2020',
      description: 'Apoyo en grabación, iluminación y postproducción de videos corporativos y comerciales.'
    }
  ];

  const defaultEducation: Education[] = [
    {
      id: '1',
      degree: 'Diseño Gráfico Publicitario',
      institution: 'Instituto de Artes Visuales',
      year: '2019'
    },
    {
      id: '2',
      degree: 'Curso Avanzado de Adobe Premiere & After Effects',
      institution: 'Crehana',
      year: '2021'
    }
  ];

  const defaultSkills: Skill[] = [
    { name: 'Adobe Premiere Pro', level: 90 },
    { name: 'Adobe Photoshop', level: 95 },
    { name: 'After Effects', level: 80 },
    { name: 'CapCut / VN', level: 95 },
    { name: 'Canva Pro', level: 100 },
    { name: 'Illustrator', level: 85 }
  ];

  // State for resume data
  const [experiences, setExperiences] = useState<Experience[]>(() => {
    const saved = localStorage.getItem('lady_portfolio_experiences');
    return saved ? JSON.parse(saved) : defaultExperiences;
  });

  const [education, setEducation] = useState<Education[]>(() => {
    const saved = localStorage.getItem('lady_portfolio_education');
    return saved ? JSON.parse(saved) : defaultEducation;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('lady_portfolio_skills');
    return saved ? JSON.parse(saved) : defaultSkills;
  });

  // Update handlers
  const updateExperiences = (newExperiences: Experience[]) => {
    setExperiences(newExperiences);
    localStorage.setItem('lady_portfolio_experiences', JSON.stringify(newExperiences));
  };

  const updateEducation = (newEducation: Education[]) => {
    setEducation(newEducation);
    localStorage.setItem('lady_portfolio_education', JSON.stringify(newEducation));
  };

  const updateSkills = (newSkills: Skill[]) => {
    setSkills(newSkills);
    localStorage.setItem('lady_portfolio_skills', JSON.stringify(newSkills));
  };

  const ownerName = "Lady Mosquera";

  return (
    <div className="font-sans antialiased text-slate-800 bg-slate-50 selection:bg-pink-200 selection:text-pink-900">
      <Hero isAdmin={isAdmin} />

      {/* Brands Section */}
      <Brands isAdmin={isAdmin} />

      {/* Pass isAdmin prop to galleries */}
      <LogoGallery isAdmin={isAdmin} />
      <VideoGallery isAdmin={isAdmin} />

      <Resume
        experiences={experiences}
        education={education}
        skills={skills}
        isAdmin={isAdmin}
        onUpdateExperiences={updateExperiences}
        onUpdateEducation={updateEducation}
        onUpdateSkills={updateSkills}
      />

      <footer className="bg-slate-900 text-slate-400 py-10 text-center relative z-10">
        <p>© {new Date().getFullYear()} {ownerName} Portfolio. Todos los derechos reservados.</p>
        <p className="text-sm mt-2 mb-4">Diseño y Edición de Contenido Digital.</p>

        {/* Admin Toggle Button */}
        <button
          onClick={handleLockClick}
          className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-pink-500 transition-colors opacity-60 hover:opacity-100 p-2"
          title={isAdmin ? "Cerrar sesión admin" : "Acceso Administrador"}
        >
          {isAdmin ? <Unlock size={14} /> : <Lock size={14} />}
          {isAdmin ? "Modo Admin Activo" : "Admin"}
        </button>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Acceso Administrador</h3>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleLoginSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                  placeholder="••••••••"
                  autoFocus
                  autoComplete="current-password"
                />
                {loginError && <p className="text-red-500 text-sm mt-2">{loginError}</p>}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium transition-colors shadow-lg shadow-pink-500/30"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Button replaces AI Chat */}
      <FloatingWhatsApp isAdmin={isAdmin} />
    </div>
  );
};

export default App;