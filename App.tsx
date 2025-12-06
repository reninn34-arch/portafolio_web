import React, { useState, useEffect } from 'react';
import { Lock, Unlock, X, Download, Upload, Cloud } from 'lucide-react';
import { Hero } from './components/Hero';
import { Brands } from './components/Brands';
import { LogoGallery } from './components/LogoGallery';
import { Resume } from './components/Resume';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Contact } from './components/Contact';
import { Experience, Education, Skill } from './types';
import { fetchPortfolioDataFromGitHub, savePortfolioDataToGitHub } from './services/githubService';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);

  // Check admin session and load data from GitHub JSON on mount
  useEffect(() => {
    const adminSession = sessionStorage.getItem('isAdmin');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }

    const savedToken = localStorage.getItem('github_token');
    if (savedToken) {
      setGithubToken(savedToken);
    }

    // Always try to load from GitHub JSON first
    fetchPortfolioDataFromGitHub()
      .then((data) => {
        if (!data) return;
        
        setExperiences(data.experiences || defaultExperiences);
        setEducation(data.education || defaultEducation);
        setSkills(data.skills || defaultSkills);
        
        // Also update localStorage for admin edits
        localStorage.setItem('dev_portfolio_experiences', JSON.stringify(data.experiences || []));
        localStorage.setItem('dev_portfolio_education', JSON.stringify(data.education || []));
        localStorage.setItem('dev_portfolio_skills', JSON.stringify(data.skills || []));
        localStorage.setItem('dev_portfolio_socials', JSON.stringify(data.socials || {}));
        localStorage.setItem('dev_portfolio_logos', JSON.stringify(data.logos || []));
        localStorage.setItem('dev_portfolio_hero_content', JSON.stringify(data.heroContent || {}));
      })
      .catch(() => {
        // Fallback to localStorage if GitHub fails
        const savedExp = localStorage.getItem('dev_portfolio_experiences');
        const savedEdu = localStorage.getItem('dev_portfolio_education');
        const savedSkills = localStorage.getItem('dev_portfolio_skills');
        
        if (savedExp) setExperiences(JSON.parse(savedExp));
        if (savedEdu) setEducation(JSON.parse(savedEdu));
        if (savedSkills) setSkills(JSON.parse(savedSkills));
      });
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

    if (normalizedInput === "admin") {
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
      setShowLoginModal(false);
    } else {
      setLoginError('Contraseña incorrecta. Intenta con: admin');
    }
  };

  // Developer's Resume Data - Default values
  const defaultExperiences: Experience[] = [
    {
      id: '1',
      role: 'Senior Full Stack Developer',
      company: 'Freelance / Clientes USA & LatAm',
      period: 'Jul 2024 - Presente',
      description: 'Delivery end-to-end de productos web con Next.js 14, React y Tailwind; APIs en Node.js/Express con PostgreSQL y Redis; CI/CD en GitHub Actions y despliegue en Vercel/Docker. Integración de Google Ads API para campañas programáticas. Mentoría a devs junior y definición de arquitectura.'
    },
    {
      id: '2',
      role: 'Full Stack Engineer',
      company: 'SaaS B2B de analítica',
      period: 'Ene 2024 - Jun 2024',
      description: 'Construí dashboards en React/TypeScript y APIs en NestJS con PostgreSQL + Prisma. Implementé autenticación con JWT/OAuth, colas con BullMQ y observabilidad con logs y métricas. Reduje tiempos de respuesta de 900ms a 250ms.'
    },
    {
      id: '3',
      role: 'Frontend Developer',
      company: 'Agencia digital',
      period: '2023',
      description: 'Maquetación y performance para landing pages y micrositios en React y Next.js. SEO técnico, accesibilidad y optimización de Core Web Vitals. Integraciones con CMS headless y APIs de pago.'
    }
  ];

  const defaultEducation: Education[] = [
    {
      id: '1',
      degree: 'Ingeniería en Sistemas/Informática',
      institution: 'Universidad Nacional',
      year: '2019'
    },
    {
      id: '2',
      degree: 'Full Stack Web Development',
      institution: 'Udemy / Codecademy',
      year: '2021'
    }
  ];

  const defaultSkills: Skill[] = [
    { name: 'React / Next.js', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Node.js / Express', level: 90 },
    { name: 'PostgreSQL / MongoDB', level: 85 },
    { name: 'AWS / Cloud', level: 80 },
    { name: 'Docker / Kubernetes', level: 75 },
    { name: 'Git / GitHub', level: 95 },
    { name: 'REST APIs / GraphQL', level: 90 }
  ];

  // State for resume data - start with defaults, will be overwritten by GitHub data
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences);
  const [education, setEducation] = useState<Education[]>(defaultEducation);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);

  // Update handlers
  const updateExperiences = (newExperiences: Experience[]) => {
    setExperiences(newExperiences);
    localStorage.setItem('dev_portfolio_experiences', JSON.stringify(newExperiences));
  };

  const updateEducation = (newEducation: Education[]) => {
    setEducation(newEducation);
    localStorage.setItem('dev_portfolio_education', JSON.stringify(newEducation));
  };

  const updateSkills = (newSkills: Skill[]) => {
    setSkills(newSkills);
    localStorage.setItem('dev_portfolio_skills', JSON.stringify(newSkills));
  };

  const ownerName = "Alex";

  // Export all data as JSON
  const handleExportData = () => {
    const allData = {
      experiences,
      education,
      skills,
      socials: JSON.parse(localStorage.getItem('dev_portfolio_socials') || '{}'),
      logos: JSON.parse(localStorage.getItem('dev_portfolio_logos') || '[]'),
      heroContent: JSON.parse(localStorage.getItem('dev_portfolio_hero_content') || '{}'),
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import data from JSON
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const data = JSON.parse(reader.result as string);
        
        // Load all data into localStorage
        if (data.experiences) {
          localStorage.setItem('dev_portfolio_experiences', JSON.stringify(data.experiences));
          setExperiences(data.experiences);
        }
        if (data.education) {
          localStorage.setItem('dev_portfolio_education', JSON.stringify(data.education));
          setEducation(data.education);
        }
        if (data.skills) {
          localStorage.setItem('dev_portfolio_skills', JSON.stringify(data.skills));
          setSkills(data.skills);
        }
        if (data.socials) localStorage.setItem('dev_portfolio_socials', JSON.stringify(data.socials));
        if (data.logos) localStorage.setItem('dev_portfolio_logos', JSON.stringify(data.logos));
        if (data.heroContent) localStorage.setItem('dev_portfolio_hero_content', JSON.stringify(data.heroContent));
        
        alert('✅ Datos importados correctamente. Recarga la página para ver los cambios.');
        window.location.reload();
      } catch (e) {
        alert('❌ Error al importar. Asegúrate de que el archivo JSON es válido.');
      }
    };
    reader.readAsText(file);
  };

  // Save to GitHub
  const handleSaveToGitHub = async () => {
    if (!githubToken) {
      alert('Primero agrega tu token de GitHub');
      setShowTokenModal(true);
      return;
    }

    const allData = {
      experiences,
      education,
      skills,
      socials: JSON.parse(localStorage.getItem('dev_portfolio_socials') || '{}'),
      logos: JSON.parse(localStorage.getItem('dev_portfolio_logos') || '[]'),
      heroContent: JSON.parse(localStorage.getItem('dev_portfolio_hero_content') || '{}')
    };

    const success = await savePortfolioDataToGitHub(
      allData,
      githubToken,
      `Update portfolio data - ${new Date().toLocaleString()}`
    );

    if (success) {
      alert('✅ Datos guardados en GitHub exitosamente');
    } else {
      alert('❌ Error al guardar. Verifica tu token de GitHub.');
    }
  };

  // Load from GitHub
  const handleLoadFromGitHub = async () => {
    const data = await fetchPortfolioDataFromGitHub();
    if (data) {
      localStorage.setItem('dev_portfolio_experiences', JSON.stringify(data.experiences || []));
      localStorage.setItem('dev_portfolio_education', JSON.stringify(data.education || []));
      localStorage.setItem('dev_portfolio_skills', JSON.stringify(data.skills || []));
      localStorage.setItem('dev_portfolio_socials', JSON.stringify(data.socials || {}));
      localStorage.setItem('dev_portfolio_logos', JSON.stringify(data.logos || []));
      localStorage.setItem('dev_portfolio_hero_content', JSON.stringify(data.heroContent || {}));
      
      setExperiences(data.experiences);
      setEducation(data.education);
      setSkills(data.skills);
      
      alert('✅ Datos cargados desde GitHub');
      window.location.reload();
    } else {
      alert('❌ No se pudo cargar los datos de GitHub');
    }
  };

  return (
    <div className="font-sans antialiased text-slate-800 bg-slate-50 selection:bg-blue-200 selection:text-blue-900">
      <Hero isAdmin={isAdmin} />

      {/* Stack Tecnológico Section */}
      <Brands isAdmin={isAdmin} />

      {/* Proyectos Gallery */}
      <LogoGallery isAdmin={isAdmin} />

      {/* Experiencia y Habilidades */}
      <Resume
        experiences={experiences}
        education={education}
        skills={skills}
        isAdmin={isAdmin}
        onUpdateExperiences={updateExperiences}
        onUpdateEducation={updateEducation}
        onUpdateSkills={updateSkills}
      />

      {/* Contact Section */}
      <Contact isAdmin={isAdmin} />

      <footer className="bg-slate-900 text-slate-400 py-10 text-center relative z-10">
        <p>© {new Date().getFullYear()} {ownerName}. Software Developer Portfolio. Todos los derechos reservados.</p>
        <p className="text-sm mt-2 mb-4">Full Stack Developer | React | Node.js | Cloud</p>

        <div className="flex justify-center gap-3 mt-6 mb-4">
          {/* Admin Data Tools */}
          {isAdmin && (
            <>
              <button
                onClick={handleExportData}
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-green-400 transition-colors p-2 border border-slate-600 rounded hover:border-green-400"
                title="Descargar datos como JSON"
              >
                <Download size={14} />
                Exportar
              </button>
              
              <label className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 transition-colors p-2 border border-slate-600 rounded hover:border-blue-400 cursor-pointer">
                <Upload size={14} />
                Importar
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleSaveToGitHub}
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-purple-400 transition-colors p-2 border border-slate-600 rounded hover:border-purple-400"
                title="Guardar en GitHub"
              >
                <Cloud size={14} />
                Guardar GitHub
              </button>

              <button
                onClick={handleLoadFromGitHub}
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors p-2 border border-slate-600 rounded hover:border-cyan-400"
                title="Cargar desde GitHub"
              >
                <Cloud size={14} />
                Cargar GitHub
              </button>

              <button
                onClick={() => setShowTokenModal(true)}
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-yellow-400 transition-colors p-2 border border-slate-600 rounded hover:border-yellow-400"
                title="Configurar token"
              >
                🔑 Token
              </button>
            </>
          )}
        </div>

        {/* Admin Toggle Button */}
        <button
          onClick={handleLockClick}
          className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-blue-500 transition-colors opacity-60 hover:opacity-100 p-2"
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
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  autoFocus
                  autoComplete="current-password"
                />
                {loginError && <p className="text-red-500 text-sm mt-2">Contraseña incorrecta</p>}
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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-500/30"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GitHub Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">GitHub Token</h3>
              <button onClick={() => setShowTokenModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                Necesitas un token personal de GitHub para sincronizar datos.
              </p>
              <a 
                href="https://github.com/settings/tokens/new?scopes=repo&description=Portfolio%20Sync" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline mb-4 block"
              >
                1. Crea un token aquí (repo scope)
              </a>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="Pega tu token aquí"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (githubToken) {
                      localStorage.setItem('github_token', githubToken);
                      alert('✅ Token guardado');
                      setShowTokenModal(false);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Button replaces AI Chat */}
      <FloatingWhatsApp isAdmin={isAdmin} />
    </div>
  );
};

export default App;