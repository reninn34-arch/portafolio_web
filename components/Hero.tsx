import React, { useState, useEffect } from 'react';
import { ArrowDown, Instagram, Linkedin, Mail, Youtube, PenSquare, X, Save, Camera, Image as ImageIcon, Edit } from 'lucide-react';
import { syncToSupabase } from '../services/syncHelper';

interface HeroProps {
  isAdmin: boolean;
}

interface SocialLinks {
  instagram: string;
  youtube: string;
  linkedin: string;
  email: string;
}

interface HeroContent {
  title: string;
  name: string;
  description: string;
  profilePhoto: string;
  backgroundType: 'gradient' | 'image';
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  backgroundImage: string;
}

export const Hero: React.FC<HeroProps> = ({ isAdmin }) => {
  // Default hero content
  const defaultHeroContent: HeroContent = {
    title: 'Full Stack Developer',
    name: 'Erik',
    description: 'Desarrollador especializado en React, TypeScript y aplicaciones web modernas. Experiencia en e-commerce, portafolios interactivos y soluciones SaaS con Supabase, PostgreSQL y APIs REST.',
    profilePhoto: '',
    backgroundType: 'gradient',
    gradientFrom: '#0f172a', // slate-900
    gradientVia: '#1e40af',   // blue-800
    gradientTo: '#1e3a8a',    // blue-900
    backgroundImage: ''
  };

  const [socials, setSocials] = useState<SocialLinks>({
    instagram: '',
    youtube: '',
    linkedin: '',
    email: ''
  });

  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHeroEditModal, setShowHeroEditModal] = useState(false);
  const [tempSocials, setTempSocials] = useState<SocialLinks>(socials);
  const [tempHeroContent, setTempHeroContent] = useState<HeroContent>(heroContent);
  const [activeTab, setActiveTab] = useState<'content' | 'photo' | 'background'>('content');

  // Load socials
  useEffect(() => {
    const savedSocials = localStorage.getItem('dev_portfolio_socials');
    if (savedSocials) {
      setSocials(JSON.parse(savedSocials));
    } else {
      // Defaults (empty)
    }
  }, []);

  const handleEditClick = () => {
    setTempSocials(socials);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    setSocials(tempSocials);
    await syncToSupabase('dev_portfolio_socials', tempSocials);
    setShowEditModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempSocials(prev => ({ ...prev, [name]: value }));
  };

  // Load hero content
  useEffect(() => {
    const savedHeroContent = localStorage.getItem('dev_portfolio_hero_content');
    if (savedHeroContent) {
      try {
        const parsed = JSON.parse(savedHeroContent);
        // Merge saved data with defaults (defaults for missing fields)
        const merged = { ...defaultHeroContent, ...parsed };
        
        // Always use default name if saved name is "Alex"
        if (merged.name === 'Alex') {
          merged.name = 'Erik';
        }
        
        // If description is empty or old default, use new default
        if (!merged.description || merged.description.includes('arquitectura de software')) {
          merged.description = defaultHeroContent.description;
        }
        
        setHeroContent(merged);
        
        // Update localStorage with merged content
        localStorage.setItem('dev_portfolio_hero_content', JSON.stringify(merged));
        syncToSupabase('dev_portfolio_hero_content', merged);
      } catch (e) {
        console.error('Error parsing hero content', e);
        setHeroContent(defaultHeroContent);
      }
    } else {
      // Save default if nothing exists
      setHeroContent(defaultHeroContent);
      localStorage.setItem('dev_portfolio_hero_content', JSON.stringify(defaultHeroContent));
      syncToSupabase('dev_portfolio_hero_content', defaultHeroContent);
    }
  }, []);

  // Hero content handlers
  const handleHeroEditClick = () => {
    setTempHeroContent(heroContent);
    setShowHeroEditModal(true);
    setActiveTab('content');
  };

  const handleHeroSave = async () => {
    setHeroContent(tempHeroContent);
    await syncToSupabase('dev_portfolio_hero_content', tempHeroContent);
    setShowHeroEditModal(false);
  };

  const handleHeroInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempHeroContent(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor sube solo archivos de imagen.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado pesada. El máximo es 5MB.');
      return;
    }

    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (event) => {
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const maxSize = 500;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        
        setTempHeroContent(prev => ({ ...prev, profilePhoto: compressed }));
        console.log('✅ Foto de perfil comprimida');
      };
    };
    
    reader.readAsDataURL(file);
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor sube solo archivos de imagen.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado pesada. El máximo es 5MB.');
      return;
    }

    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (event) => {
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const maxSize = 1200;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        
        setTempHeroContent(prev => ({
          ...prev,
          backgroundImage: compressed,
          backgroundType: 'image'
        }));
        console.log('✅ Imagen de fondo comprimida');
      };
    };
    
    reader.readAsDataURL(file);
  };

  // Generate background style
  const getBackgroundStyle = () => {
    if (heroContent.backgroundType === 'image' && heroContent.backgroundImage) {
      return {
        backgroundImage: `url(${heroContent.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {
      background: `linear-gradient(to bottom right, ${heroContent.gradientFrom}, ${heroContent.gradientVia}, ${heroContent.gradientTo})`
    };
  };

  return (
    <section id="inicio" className="min-h-screen flex flex-col justify-center items-center relative text-white overflow-hidden" style={getBackgroundStyle()}>
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

      {/* Admin Edit Button */}
      {isAdmin && (
        <button
          onClick={handleHeroEditClick}
          className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white/80 hover:text-white transition-all border border-white/20"
          title="Editar Hero"
        >
          <Edit size={18} />
          <span className="text-sm font-medium">Editar Hero</span>
        </button>
      )}

      {/* Content with relative z-10 */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        {/* Profile Photo Circle */}
        <div className="mb-6 flex justify-center">
          <div className="relative group">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-pink-400 shadow-2xl shadow-pink-500/30 bg-slate-800/50 backdrop-blur-sm">
              {heroContent.profilePhoto ? (
                <img
                  src={heroContent.profilePhoto}
                  alt={heroContent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Camera size={48} />
                </div>
              )}
            </div>
            {isAdmin && (
              <>
                {/* Upload button */}
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-500 rounded-full cursor-pointer shadow-lg transition-all">
                  <Camera size={20} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith('image/')) {
                        alert('Por favor sube solo archivos de imagen.');
                        return;
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        alert('La imagen es demasiado pesada. El máximo es 2MB.');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const newContent = { ...heroContent, profilePhoto: reader.result as string };
                        setHeroContent(newContent);
                        localStorage.setItem('lady_portfolio_hero_content', JSON.stringify(newContent));
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </label>

                {/* Delete button - only show when photo exists */}
                {heroContent.profilePhoto && (
                  <button
                    onClick={() => {
                      if (confirm('¿Eliminar foto de perfil?')) {
                        const newContent = { ...heroContent, profilePhoto: '' };
                        setHeroContent(newContent);
                        localStorage.setItem('lady_portfolio_hero_content', JSON.stringify(newContent));
                      }
                    }}
                    className="absolute top-0 left-0 p-2 bg-red-600 hover:bg-red-500 rounded-full shadow-lg transition-all"
                    title="Eliminar foto"
                  >
                    <X size={20} className="text-white" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="inline-block mb-4 px-3 py-1 border border-pink-400 rounded-full text-pink-300 text-sm tracking-widest uppercase font-semibold">
          {heroContent.title}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-purple-200">
          Hola, soy <span className="text-pink-400">{heroContent.name}</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          {heroContent.description}
        </p>

        <div className="flex justify-center mb-12">
          <a
            href="#portfolio-logos"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 cursor-pointer"
          >
            Ver Proyectos
          </a>
        </div>

        <div className="relative inline-block">
          <div className="flex justify-center gap-8 text-slate-300 items-center">
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors transform hover:scale-110" title="Instagram"><Instagram size={28} /></a>
            )}
            {socials.youtube && (
              <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors transform hover:scale-110" title="YouTube"><Youtube size={28} /></a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors transform hover:scale-110" title="LinkedIn"><Linkedin size={28} /></a>
            )}
            {socials.email && (
              <a href={`mailto:${socials.email}`} className="hover:text-white transition-colors transform hover:scale-110" title="Email"><Mail size={28} /></a>
            )}

            {!socials.instagram && !socials.youtube && !socials.linkedin && !socials.email && !isAdmin && (
              <p className="text-slate-500 text-sm">Próximamente redes sociales...</p>
            )}

            {isAdmin && (
              <button
                onClick={handleEditClick}
                className="ml-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors"
                title="Editar enlaces de redes sociales"
              >
                <PenSquare size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 animate-bounce text-slate-400">
        <ArrowDown size={32} />
      </div>

      {/* Edit Socials Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PenSquare size={20} className="text-pink-500" />
                Editar Redes Sociales
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1 flex items-center gap-2">
                  <Instagram size={14} /> Link de Instagram
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={tempSocials.instagram}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:border-pink-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1 flex items-center gap-2">
                  <Youtube size={14} /> Link de YouTube
                </label>
                <input
                  type="url"
                  name="youtube"
                  value={tempSocials.youtube}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:border-pink-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1 flex items-center gap-2">
                  <Linkedin size={14} /> Link de LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={tempSocials.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:border-pink-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1 flex items-center gap-2">
                  <Mail size={14} /> Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={tempSocials.email}
                  onChange={handleInputChange}
                  placeholder="hola@ejemplo.com"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:border-pink-500 outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
              >
                <Save size={18} /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Edit Modal */}
      {showHeroEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Edit size={20} className="text-pink-500" />
                  Editar Hero
                </h3>
                <button onClick={() => setShowHeroEditModal(false)} className="text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'content'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                >
                  Contenido
                </button>
                <button
                  onClick={() => setActiveTab('photo')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'photo'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                >
                  Foto
                </button>
                <button
                  onClick={() => setActiveTab('background')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'background'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                >
                  Fondo
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Título/Categoría</label>
                    <input
                      type="text"
                      name="title"
                      value={tempHeroContent.title}
                      onChange={handleHeroInputChange}
                      placeholder="Diseño Gráfico & Edición de Video"
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Nombre</label>
                    <input
                      type="text"
                      name="name"
                      value={tempHeroContent.name}
                      onChange={handleHeroInputChange}
                      placeholder="Erik Aguirre"
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Descripción</label>
                    <textarea
                      name="description"
                      value={tempHeroContent.description}
                      onChange={handleHeroInputChange}
                      placeholder="Transformo ideas en contenido visual..."
                      rows={4}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-pink-500 outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Photo Tab */}
              {activeTab === 'photo' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-pink-400 shadow-2xl bg-slate-800 mb-4">
                      {tempHeroContent.profilePhoto ? (
                        <img
                          src={tempHeroContent.profilePhoto}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Camera size={64} />
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Camera size={20} />
                      {tempHeroContent.profilePhoto ? 'Cambiar Foto' : 'Subir Foto'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {tempHeroContent.profilePhoto && (
                      <button
                        onClick={() => setTempHeroContent(prev => ({ ...prev, profilePhoto: '' }))}
                        className="mt-3 text-sm text-red-400 hover:text-red-300"
                      >
                        Eliminar foto
                      </button>
                    )}
                    <p className="text-xs text-slate-500 mt-4">Tamaño máximo: 2MB</p>
                  </div>
                </div>
              )}

              {/* Background Tab */}
              {activeTab === 'background' && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <label className="block text-sm text-slate-400 mb-3">Tipo de Fondo</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setTempHeroContent(prev => ({ ...prev, backgroundType: 'gradient' }))}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${tempHeroContent.backgroundType === 'gradient'
                          ? 'border-pink-500 bg-pink-500/10'
                          : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                          }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">🎨</div>
                          <div className="font-medium text-white">Gradiente</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setTempHeroContent(prev => ({ ...prev, backgroundType: 'image' }))}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${tempHeroContent.backgroundType === 'image'
                          ? 'border-pink-500 bg-pink-500/10'
                          : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                          }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">🖼️</div>
                          <div className="font-medium text-white">Imagen</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {tempHeroContent.backgroundType === 'gradient' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Color Inicial</label>
                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={tempHeroContent.gradientFrom}
                            onChange={(e) => setTempHeroContent(prev => ({ ...prev, gradientFrom: e.target.value }))}
                            className="w-16 h-12 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={tempHeroContent.gradientFrom}
                            onChange={(e) => setTempHeroContent(prev => ({ ...prev, gradientFrom: e.target.value }))}
                            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-white focus:border-pink-500 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Color Medio</label>
                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={tempHeroContent.gradientVia}
                            onChange={(e) => setTempHeroContent(prev => ({ ...prev, gradientVia: e.target.value }))}
                            className="w-16 h-12 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={tempHeroContent.gradientVia}
                            onChange={(e) => setTempHeroContent(prev => ({ ...prev, gradientVia: e.target.value }))}
                            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-white focus:border-pink-500 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Color Final</label>
                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={tempHeroContent.gradientTo}
                            onChange={(e) => setTempHeroContent(prev => ({ ...prev, gradientTo: e.target.value }))}
                            className="w-16 h-12 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={tempHeroContent.gradientTo}
                            onChange={(e) => setTempHeroContent(prev => ({ ...prev, gradientTo: e.target.value }))}
                            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-2 text-white focus:border-pink-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="h-32 rounded-lg" style={{
                        background: `linear-gradient(to bottom right, ${tempHeroContent.gradientFrom}, ${tempHeroContent.gradientVia}, ${tempHeroContent.gradientTo})`
                      }}></div>
                    </div>
                  )}

                  {tempHeroContent.backgroundType === 'image' && (
                    <div className="space-y-4">
                      {tempHeroContent.backgroundImage && (
                        <div className="relative h-48 rounded-lg overflow-hidden">
                          <img
                            src={tempHeroContent.backgroundImage}
                            alt="Background preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <label className="cursor-pointer block w-full p-6 border-2 border-dashed border-slate-600 hover:border-pink-500 rounded-lg text-center transition-colors">
                        <ImageIcon size={48} className="mx-auto mb-3 text-slate-400" />
                        <div className="text-white font-medium mb-1">
                          {tempHeroContent.backgroundImage ? 'Cambiar Imagen' : 'Subir Imagen de Fondo'}
                        </div>
                        <div className="text-sm text-slate-400">Tamaño máximo: 2MB</div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBackgroundImageUpload}
                          className="hidden"
                        />
                      </label>
                      {tempHeroContent.backgroundImage && (
                        <button
                          onClick={() => setTempHeroContent(prev => ({ ...prev, backgroundImage: '' }))}
                          className="w-full py-2 text-sm text-red-400 hover:text-red-300"
                        >
                          Eliminar imagen de fondo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowHeroEditModal(false)}
                  className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleHeroSave}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};