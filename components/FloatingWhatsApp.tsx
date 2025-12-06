import React, { useState, useEffect } from 'react';
import { MessageCircle, Settings, X, Save } from 'lucide-react';
import { syncToSupabase } from '../services/syncHelper';

interface FloatingWhatsAppProps {
  isAdmin: boolean;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ isAdmin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempNumber, setTempNumber] = useState('');

  // Load phone number
  useEffect(() => {
    const savedPhone = localStorage.getItem('dev_portfolio_whatsapp');
    if (savedPhone) {
      setPhoneNumber(savedPhone);
    }
  }, []);

  const handleClick = () => {
    if (isAdmin && !phoneNumber) {
        // If admin and no number set, open edit immediately
        setTempNumber(phoneNumber);
        setIsEditing(true);
    } else if (isAdmin) {
        // If admin, maybe ask if they want to test or edit? 
        // Let's just open whatsapp for convenience, but provide a small gear icon nearby for editing.
        if (phoneNumber) window.open(`https://wa.me/${phoneNumber}`, '_blank');
    } else {
        if (phoneNumber) {
            window.open(`https://wa.me/${phoneNumber}`, '_blank');
        } else {
            alert("El número de WhatsApp no ha sido configurado aún.");
        }
    }
  };

  const handleEditOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempNumber(phoneNumber);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic clean up of number (remove +, spaces, dashes)
    const cleanNumber = tempNumber.replace(/[^0-9]/g, '');
    setPhoneNumber(cleanNumber);
    await syncToSupabase('dev_portfolio_whatsapp', cleanNumber);
    setIsEditing(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col gap-2 group">
        
        {/* Admin Edit Button (appears on hover or if admin) */}
        {isAdmin && (
            <button 
                onClick={handleEditOpen}
                className="bg-slate-800 text-white p-2 rounded-full shadow-lg mb-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0"
                title="Configurar número de WhatsApp"
            >
                <Settings size={16} />
            </button>
        )}

        <button
            onClick={handleClick}
            className="p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center bg-[#25D366] text-white"
            title={isAdmin ? "Click para probar, usa el engranaje para editar" : "Contáctame por WhatsApp"}
        >
            <MessageCircle size={32} />
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#25D366] text-white">
                    <h3 className="font-bold flex items-center gap-2">
                        <MessageCircle size={20} /> Configurar WhatsApp
                    </h3>
                    <button onClick={() => setIsEditing(false)} className="hover:bg-white/20 rounded p-1">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSave} className="p-6">
                    <p className="text-sm text-slate-500 mb-4">Ingresa tu número de teléfono con código de país (sin el +).</p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Número de Celular</label>
                        <input 
                            type="tel" 
                            value={tempNumber}
                            onChange={(e) => setTempNumber(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366] outline-none transition-all"
                            placeholder="Ej: 573001234567"
                            autoFocus
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] font-medium transition-colors shadow-lg flex justify-center items-center gap-2"
                    >
                        <Save size={18} /> Guardar Número
                    </button>
                </form>
            </div>
        </div>
      )}
    </>
  );
};