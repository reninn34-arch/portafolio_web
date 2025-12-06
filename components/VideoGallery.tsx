import React, { useState, useEffect } from 'react';
import { Youtube, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoGalleryProps {
  isAdmin: boolean;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ isAdmin }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    const savedVideos = localStorage.getItem('lady_portfolio_videos');
    if (savedVideos) {
      try {
        setVideos(JSON.parse(savedVideos));
      } catch(e) { console.error(e); }
    } else {
        // Defaults for Lady Mosquera
        setVideos([
            { id: '1', title: 'Reel de Moda & Lifestyle', youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ', videoId: 'LXb3EKWsInQ' },
            { id: '2', title: 'Edición Dinámica para YouTube', youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', videoId: 'ScMzIvxBSi4' },
            { id: '3', title: 'Intro para Canal de Vlogs', youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', videoId: 'aqz-KE-bpKQ' }
        ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lady_portfolio_videos', JSON.stringify(videos));
  }, [videos]);

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(newUrl);
    if (!videoId) {
      alert("Por favor ingresa una URL válida de YouTube.");
      return;
    }

    const newVideo: VideoItem = {
      id: Date.now().toString(),
      title: newTitle || 'Nuevo Video',
      youtubeUrl: newUrl,
      videoId: videoId
    };

    setVideos(prev => [newVideo, ...prev]);
    setNewUrl('');
    setNewTitle('');
    setIsAdding(false);
  };

  const requestDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setVideos(prev => prev.filter(v => v.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <section id="portfolio-videos" className="py-20 bg-slate-900 text-white relative scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Youtube className="text-red-500" size={32} />
              Galería de Video
            </h2>
            <p className="text-slate-400 mt-2">Reels, TikToks, Vlogs y Contenido Promocional.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
            >
              {isAdding ? 'Cancelar' : <><Plus size={20} /> Añadir Video</>}
            </button>
          )}
        </div>

        {isAdding && isAdmin && (
          <form onSubmit={handleAddVideo} className="mb-12 bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4">
            <h3 className="text-xl font-bold mb-4">Añadir video de YouTube</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Título</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Promo Verano 2024"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">URL de YouTube</label>
                <input 
                  type="url" 
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors">
                Guardar Video
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 group hover:border-pink-500 transition-colors relative">
              <div className="relative aspect-video bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg leading-tight">{video.title}</h3>
                  <p className="text-slate-500 text-xs mt-1">YouTube Video</p>
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => requestDelete(video.id)}
                    className="text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition-colors shadow-lg z-10"
                    title="Eliminar video"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {videos.length === 0 && (
             <div className="col-span-full text-center py-20 text-slate-600">
              No hay videos añadidos. {isAdmin ? 'Usa el botón "Añadir Video" para empezar.' : 'Vuelve pronto para ver contenido.'}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¿Eliminar video?</h3>
              <p className="text-slate-400 mb-6">¿Estás segura de que quieres eliminar este video? Desaparecerá de tu portafolio.</p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setDeletingId(null)}
                  className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 font-medium transition-colors"
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