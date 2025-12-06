import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';

interface BrandsProps {
    isAdmin: boolean;
}

interface Brand {
    id: string;
    name: string;
    logo: string; // URL or Base64
}

export const Brands: React.FC<BrandsProps> = ({ isAdmin }) => {
    const [brands, setBrands] = useState<Brand[]>([
        { id: '1', name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
        { id: '2', name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
        { id: '3', name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
        { id: '4', name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
        { id: '5', name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
        { id: '6', name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
    ]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState<string | null>(null);
    const [brandForm, setBrandForm] = useState<Brand>({ id: '', name: '', logo: '' });

    // Load brands from localStorage
    useEffect(() => {
        const savedBrands = localStorage.getItem('dev_portfolio_brands');
        if (savedBrands) {
            setBrands(JSON.parse(savedBrands));
        }
    }, []);

    const saveBrands = (newBrands: Brand[]) => {
        setBrands(newBrands);
        localStorage.setItem('dev_portfolio_brands', JSON.stringify(newBrands));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            setBrandForm(prev => ({ ...prev, logo: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleAddBrand = () => {
        if (!brandForm.name || !brandForm.logo) {
            alert('Por favor completa el nombre y sube un logo.');
            return;
        }

        const newBrand = { ...brandForm, id: Date.now().toString() };
        saveBrands([...brands, newBrand]);
        setShowAddModal(false);
        setBrandForm({ id: '', name: '', logo: '' });
    };

    const handleEditBrand = (brand: Brand) => {
        setBrandForm(brand);
        setEditingBrand(brand.id);
    };

    const handleSaveEdit = () => {
        if (!brandForm.name || !brandForm.logo) {
            alert('Por favor completa el nombre y sube un logo.');
            return;
        }

        const updated = brands.map(b => b.id === brandForm.id ? brandForm : b);
        saveBrands(updated);
        setEditingBrand(null);
        setBrandForm({ id: '', name: '', logo: '' });
    };

    const handleDeleteBrand = (id: string) => {
        if (!confirm('¿Eliminar esta marca?')) return;
        saveBrands(brands.filter(b => b.id !== id));
    };

    const openAddModal = () => {
        setBrandForm({ id: '', name: '', logo: '' });
        setShowAddModal(true);
    };

    if (brands.length === 0 && !isAdmin) {
        return null; // Don't show section if no brands and not admin
    }

    return (
        <section className="py-16 bg-slate-50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Stack Tecnológico
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Tecnologías y herramientas que utilizo para desarrollar soluciones modernas y escalables.
                    </p>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                    {brands.map((brand) => (
                        <div key={brand.id} className="relative group">
                            {editingBrand === brand.id ? (
                                <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-pink-500 animate-in fade-in">
                                    <input
                                        type="text"
                                        value={brandForm.name}
                                        onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm mb-2"
                                        placeholder="Nombre de marca"
                                    />
                                    <label className="cursor-pointer block w-full p-3 border-2 border-dashed border-slate-300 hover:border-pink-500 rounded text-center transition-colors mb-2">
                                        {brandForm.logo ? (
                                            <img src={brandForm.logo} alt="Preview" className="w-full h-20 object-contain" />
                                        ) : (
                                            <Upload size={24} className="mx-auto text-slate-400" />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="flex-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                        >
                                            <Save size={12} className="inline" /> Guardar
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingBrand(null);
                                                setBrandForm({ id: '', name: '', logo: '' });
                                            }}
                                            className="flex-1 px-2 py-1 bg-slate-300 text-slate-700 rounded text-xs hover:bg-slate-400"
                                        >
                                            <X size={12} className="inline" /> Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <div className="aspect-square flex items-center justify-center mb-3">
                                            <img
                                                src={brand.logo}
                                                alt={brand.name}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                        <p className="text-center text-sm font-medium text-slate-700 truncate">
                                            {brand.name}
                                        </p>
                                    </div>

                                    {isAdmin && (
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditBrand(brand)}
                                                className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg"
                                                title="Editar"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBrand(brand.id)}
                                                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}

                    {/* Add Brand Card - Only visible to admin */}
                    {isAdmin && (
                        <button
                            onClick={openAddModal}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-dashed border-slate-300 hover:border-blue-500 flex flex-col items-center justify-center min-h-[180px] group"
                        >
                            <Plus size={48} className="text-slate-400 group-hover:text-blue-500 transition-colors mb-2" />
                            <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                                Agregar Tecnología
                            </span>
                        </button>
                    )}
                </div>

                {brands.length === 0 && isAdmin && (
                    <p className="text-center text-slate-500 text-sm">
                        No hay tecnologías agregadas. Haz clic en "Agregar Tecnología" para comenzar.
                    </p>
                )}
            </div>

            {/* Add Brand Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-900">Agregar Tecnología</h3>
                                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la Tecnología</label>
                                <input
                                    type="text"
                                    value={brandForm.name}
                                    onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                                    placeholder="Ej: React, Node.js, Docker, etc."
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Logo</label>
                                <label className="cursor-pointer block w-full p-8 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg text-center transition-colors">
                                    {brandForm.logo ? (
                                        <div className="space-y-2">
                                            <img src={brandForm.logo} alt="Preview" className="max-h-32 mx-auto object-contain" />
                                            <p className="text-sm text-slate-600">Haz clic para cambiar</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload size={48} className="mx-auto mb-3 text-slate-400" />
                                            <div className="text-slate-700 font-medium mb-1">Subir Logo</div>
                                            <div className="text-sm text-slate-500">PNG, JPG o SVG (máx. 2MB)</div>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 flex gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddBrand}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-500/30"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
