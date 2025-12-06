import React, { useState, useEffect } from 'react';
import { Trash2, Upload, Plus, AlertTriangle } from 'lucide-react';
import { LogoItem } from '../types';

interface LogoGalleryProps {
  isAdmin: boolean;
}

export const LogoGallery: React.FC<LogoGalleryProps> = ({ isAdmin }) => {
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedLogos = localStorage.getItem('lady_portfolio_logos');
    if (savedLogos) {
      try {
        setLogos(JSON.parse(savedLogos));
      } catch (e) {
        console.error("Error parsing logos", e);
      }
    } else {
        // Default initial data for Lady Mosquera
        setLogos([
            { id: '1', title: 'Kit de Marca Personal', imageUrl: 'https://picsum.photos/400/300?random=10', date: '2023-10-01' },
            { id: '2', title: 'Posts Instagram Belleza', imageUrl: 'https://picsum.photos/400/400?random=11', date: '2023-11-15' },
            { id: '3', title: 'Banners YouTube', imageUrl: 'https://picsum.photos/400/300?random=12', date: '2024-01-20' },
            { id: '4', title: 'Flyers Eventos', imageUrl: 'https://picsum.photos/400/400?random=13', date: '2024-02-10' },
        ]);
    }
  }, []);

  // Save to LocalStorage whenever logos change
  useEffect(() => {
    localStorage.setItem('lady_portfolio_logos', JSON.stringify(logos));
  }, [logos]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert("El archivo es demasiado grande. Por favor usa una imagen menor a 2MB para evitar llenar el almacenamiento local.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newLogo: LogoItem = {
        id: Date.now().toString(),
        title: file.name.split('.')[0],
        imageUrl: base64String,
        date: new Date().toISOString().split('T')[0]
      };
      setLogos(prev => [newLogo, ...prev]);
      setIsUploading(false);
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
            <h2 className="text-3xl font-bold text-slate-800">Diseños & Branding</h2>
            <p className="text-slate-500 mt-2">Logos, piezas para redes sociales y material publicitario.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsUploading(!isUploading)}
              className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              {isUploading ? 'Cancelar' : <><Plus size={20} /> Subir Diseño</>}
            </button>
          )}
        </div>

        {isUploading && isAdmin && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border-2 border-dashed border-pink-200 animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-col items-center justify-center text-center">
              <Upload size={48} className="text-pink-400 mb-4" />
              <p className="mb-4 text-slate-600">Sube tu imagen (JPG, PNG). Máximo 2MB.</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-pink-50 file:text-pink-700
                  hover:file:bg-pink-100"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {logos.map((logo) => (
            <div key={logo.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img 
                  src={logo.imageUrl} 
                  alt={logo.title} 
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 truncate">{logo.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{logo.date}</p>
              </div>
              {isAdmin && (
                <button 
                  onClick={() => requestDelete(logo.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-100 shadow-md hover:bg-red-600 transition-colors z-10"
                  title="Eliminar logo"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          {logos.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-400">
              No hay diseños aún. {isAdmin ? '¡Sube el primero!' : 'Vuelve pronto para ver contenido.'}
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
    </section>
  );
};