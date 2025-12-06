import React, { useState, useEffect } from 'react';
import { Trash2, Upload, Plus, AlertTriangle, ExternalLink } from 'lucide-react';
import { LogoItem } from '../types';
import { syncToSupabase } from '../services/syncHelper';

interface LogoGalleryProps {
  isAdmin: boolean;
}

const normalizeLink = (url: string) => url.startsWith('http') ? url : `https://${url}`;

export const LogoGallery: React.FC<LogoGalleryProps> = ({ isAdmin }) => {
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLink, setPreviewLink] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newLink, setNewLink] = useState('');

  // Load from LocalStorage on mount
  useEffect(() => {
    const loadLogos = async () => {
      // Try localStorage first
      const savedLogos = localStorage.getItem('dev_portfolio_logos');
      if (savedLogos) {
        try {
          const parsed: LogoItem[] = JSON.parse(savedLogos);
          if (parsed && parsed.length > 0) {
            setLogos(parsed.map((item) => ({
              ...item,
              link: item.link ? normalizeLink(item.link) : undefined,
            })));
            return;
          }
        } catch (e) {
          console.error("Error parsing logos", e);
        }
      }
      
      // If no logos in localStorage, use defaults
      const defaultLogos: LogoItem[] = [
        { id: '1', title: 'E-Commerce Platform', imageUrl: 'https://picsum.photos/400/300?random=10', date: '2023-10-01', link: 'https://example.com/shop' },
        { id: '2', title: 'Task Management App', imageUrl: 'https://picsum.photos/400/400?random=11', date: '2023-11-15', link: 'https://example.com/tasks' },
        { id: '3', title: 'Social Network MVP', imageUrl: 'https://picsum.photos/400/300?random=12', date: '2024-01-20', link: 'https://example.com/social' },
        { id: '4', title: 'AI Chat Dashboard', imageUrl: 'https://picsum.photos/400/400?random=13', date: '2024-02-10', link: 'https://example.com/chat' },
      ];
      setLogos(defaultLogos);
      localStorage.setItem('dev_portfolio_logos', JSON.stringify(defaultLogos));
      await syncToSupabase('dev_portfolio_logos', defaultLogos);
    };
    
    loadLogos();
  }, []);

  // Save to LocalStorage and Supabase whenever logos change
  useEffect(() => {
    if (logos.length > 0) {
      syncToSupabase('dev_portfolio_logos', logos);
    }
  }, [logos]);

  const handleProjectClick = (logo: LogoItem) => {
    if (!isAdmin && logo.link) {
      window.open(normalizeLink(logo.link), '_blank', 'noopener,noreferrer');
      return;
    }
    setPreviewUrl(logo.imageUrl);
    setPreviewLink(logo.link ?? null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit for original file
      alert("El archivo es demasiado grande. Por favor usa una imagen menor a 5MB.");
      return;
    }

    // Compress image before storing
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      
      img.onload = () => {
        // Create canvas for compression
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Calculate new dimensions (max 800px width/height)
        const maxSize = 800;
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
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
        
        // Check final size
        const sizeInBytes = (compressedBase64.length * 3) / 4;
        const sizeInKB = sizeInBytes / 1024;
        
        if (sizeInKB > 500) {
          alert(`La imagen comprimida aún es muy grande (${Math.round(sizeInKB)}KB). Intenta con una imagen más pequeña.`);
          return;
        }
        
        const linkValue = newLink.trim() ? normalizeLink(newLink.trim()) : undefined;
        const titleValue = newTitle.trim() || file.name.split('.')[0] || 'Proyecto';
        const newLogo: LogoItem = {
          id: Date.now().toString(),
          title: titleValue,
          imageUrl: compressedBase64,
          date: new Date().toISOString().split('T')[0],
          link: linkValue,
        };
        
        setLogos(prev => [newLogo, ...prev]);
        setIsUploading(false);
        setNewTitle('');
        setNewLink('');
        
        console.log(`✅ Imagen comprimida: ${Math.round(sizeInKB)}KB`);
      };
    };
    
    reader.readAsDataURL(file);
  };

  const requestDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setLogos(prev => prev.filter(l => l.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <section id="portfolio-logos" className="py-20 bg-slate-50 relative scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Proyectos Destacados</h2>
            <p className="text-slate-500 mt-2">Aplicaciones y soluciones desarrolladas con tecnologías modernas.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsUploading(!isUploading)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isUploading ? 'Cancelar' : <><Plus size={20} /> Subir Diseño</>}
            </button>
          )}
        </div>

        {isUploading && isAdmin && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border-2 border-dashed border-blue-200 animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col items-center justify-center text-center">
              <Upload size={48} className="text-blue-400 mb-4" />
              <p className="mb-4 text-slate-600">Sube la captura de pantalla de tu proyecto (JPG, PNG). Máximo 2MB.</p>
              <div className="grid md:grid-cols-2 gap-4 w-full mb-4 text-left">
                <label className="flex flex-col gap-2 text-sm text-slate-700">
                  Nombre del proyecto
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej. Dashboard de ventas"
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-700">
                  Enlace público (opcional)
                  <input
                    type="url"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="https://tu-proyecto.com"
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {logos.map((logo) => (
            <div key={logo.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <button
                type="button"
                onClick={() => handleProjectClick(logo)}
                className="h-64 w-full bg-slate-100 flex items-center justify-center overflow-hidden focus:outline-none"
                title={logo.link ? 'Abrir proyecto' : 'Ver grande'}
              >
                <img 
                  src={logo.imageUrl} 
                  alt="Proyecto"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </button>
              {logo.link && (
                <div className="p-4">
                  <a
                    href={normalizeLink(logo.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                    title="Abrir sitio"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                    Ver proyecto
                  </a>
                </div>
              )}
              {isAdmin && (
                <button 
                  onClick={(e) => { e.stopPropagation(); requestDelete(logo.id); }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-100 shadow-md hover:bg-red-600 transition-colors z-10"
                  title="Eliminar proyecto"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          {logos.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-400">
              No hay proyectos aún. {isAdmin ? '¡Sube el primero!' : 'Vuelve pronto para ver contenido.'}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">¿Eliminar diseño?</h3>
              <p className="text-slate-500 mb-6">¿Estás segura de que quieres eliminar esta imagen? Esta acción no se puede deshacer.</p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-lg shadow-red-500/30"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => { setPreviewUrl(null); setPreviewLink(null); }}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setPreviewUrl(null); setPreviewLink(null); }}
              className="absolute -top-3 -right-3 bg-white text-slate-800 rounded-full p-2 shadow-lg hover:shadow-xl"
              aria-label="Cerrar"
            >
              <span className="text-lg">×</span>
            </button>
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <img src={previewUrl} alt="Vista previa" className="w-full h-full object-contain max-h-[80vh]" />
            </div>
            {previewLink && (
              <div className="mt-4 flex justify-end">
                <a
                  href={normalizeLink(previewLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={16} />
                  Abrir proyecto
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};