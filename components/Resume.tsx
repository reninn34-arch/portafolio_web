import React, { useState, useEffect } from 'react';
import { Briefcase, GraduationCap, Star, Download, Upload, Trash2, FileText, CheckCircle2, Edit, Plus, Save, X } from 'lucide-react';
import { Experience, Education, Skill } from '../types';

interface ResumeProps {
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  isAdmin: boolean;
  onUpdateExperiences?: (experiences: Experience[]) => void;
  onUpdateEducation?: (education: Education[]) => void;
  onUpdateSkills?: (skills: Skill[]) => void;
}

export const Resume: React.FC<ResumeProps> = ({
  experiences,
  education,
  skills,
  isAdmin,
  onUpdateExperiences,
  onUpdateEducation,
  onUpdateSkills
}) => {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Edit states
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Form states
  const [expForm, setExpForm] = useState<Experience>({ id: '', role: '', company: '', period: '', description: '' });
  const [eduForm, setEduForm] = useState<Education>({ id: '', degree: '', institution: '', year: '' });
  const [skillForm, setSkillForm] = useState<Skill>({ name: '', level: 50 });

  useEffect(() => {
    const savedPdf = localStorage.getItem('dev_portfolio_resume_pdf');
    if (savedPdf) {
      setPdfData(savedPdf);
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert("Por favor sube solo archivos PDF.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert("El PDF es demasiado pesado. El máximo es 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPdfData(base64String);
      localStorage.setItem('dev_portfolio_resume_pdf', base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (pdfData) {
      const link = document.createElement('a');
      link.href = pdfData;
      link.download = 'CV_Developer_Alex.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = () => {
    setPdfData(null);
    localStorage.removeItem('dev_portfolio_resume_pdf');
  };

  // Experience handlers
  const startEditExperience = (exp: Experience) => {
    setExpForm(exp);
    setEditingExperience(exp.id);
  };

  const saveExperience = () => {
    if (!onUpdateExperiences) return;
    const updated = experiences.map(e => e.id === expForm.id ? expForm : e);
    onUpdateExperiences(updated);
    setEditingExperience(null);
  };

  const addExperience = () => {
    if (!onUpdateExperiences) return;
    const newExp = { ...expForm, id: Date.now().toString() };
    onUpdateExperiences([...experiences, newExp]);
    setIsAddingExperience(false);
    setExpForm({ id: '', role: '', company: '', period: '', description: '' });
  };

  const deleteExperience = (id: string) => {
    if (!onUpdateExperiences || !confirm('¿Eliminar esta experiencia?')) return;
    onUpdateExperiences(experiences.filter(e => e.id !== id));
  };

  // Education handlers
  const startEditEducation = (edu: Education) => {
    setEduForm(edu);
    setEditingEducation(edu.id);
  };

  const saveEducation = () => {
    if (!onUpdateEducation) return;
    const updated = education.map(e => e.id === eduForm.id ? eduForm : e);
    onUpdateEducation(updated);
    setEditingEducation(null);
  };

  const addEducation = () => {
    if (!onUpdateEducation) return;
    const newEdu = { ...eduForm, id: Date.now().toString() };
    onUpdateEducation([...education, newEdu]);
    setIsAddingEducation(false);
    setEduForm({ id: '', degree: '', institution: '', year: '' });
  };

  const deleteEducation = (id: string) => {
    if (!onUpdateEducation || !confirm('¿Eliminar esta educación?')) return;
    onUpdateEducation(education.filter(e => e.id !== id));
  };

  // Skill handlers
  const startEditSkill = (skill: Skill) => {
    setSkillForm(skill);
    setEditingSkill(skill.name);
  };

  const saveSkill = () => {
    if (!onUpdateSkills) return;
    const updated = skills.map(s => s.name === editingSkill ? skillForm : s);
    onUpdateSkills(updated);
    setEditingSkill(null);
  };

  const addSkill = () => {
    if (!onUpdateSkills) return;
    onUpdateSkills([...skills, skillForm]);
    setIsAddingSkill(false);
    setSkillForm({ name: '', level: 50 });
  };

  const deleteSkill = (name: string) => {
    if (!onUpdateSkills || !confirm('¿Eliminar esta habilidad?')) return;
    onUpdateSkills(skills.filter(s => s.name !== name));
  };

  return (
    <section id="curriculum" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Currículum Vitae</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Un resumen de mi trayectoria académica y profesional, así como las habilidades técnicas que he desarrollado.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex gap-4 items-center animate-in fade-in slide-in-from-bottom-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition-colors border border-slate-200">
                  <Upload size={18} />
                  {pdfData ? 'Cambiar PDF' : 'Subir PDF'}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {pdfData && (
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Eliminar PDF actual"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Download Button Logic */}
            {pdfData ? (
              <button
                onClick={handleDownload}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="group relative inline-flex items-center gap-3 px-8 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300`}></div>
                <div className="relative flex items-center gap-2">
                  {isHovering ? <Download size={20} className="animate-bounce" /> : <FileText size={20} />}
                  <span>Descargar PDF</span>
                </div>
                <div className="bg-white/20 px-2 py-0.5 rounded text-xs">PDF</div>
              </button>
            ) : (
              isAdmin ? (
                <div className="text-slate-400 text-sm bg-slate-50 px-4 py-2 rounded-lg border border-dashed border-slate-300">
                  Sube un PDF para ver el botón de descarga aquí.
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic mt-2">Versión descargable próximamente.</p>
              )
            )}

            {pdfData && isAdmin && (
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <CheckCircle2 size={12} /> Archivo cargado y listo para descargar
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Experience Column */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Experiencia</h3>
              </div>
              {isAdmin && !isAddingExperience && (
                <button
                  onClick={() => {
                    setIsAddingExperience(true);
                    setExpForm({ id: '', role: '', company: '', period: '', description: '' });
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
                >
                  <Plus size={16} />
                  Agregar
                </button>
              )}
            </div>

            <div className="space-y-8 border-l-2 border-indigo-100 ml-4 pl-8 relative">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative">
                  <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-indigo-500 shadow-sm"></span>

                  {editingExperience === exp.id ? (
                    <div className="bg-indigo-50 p-4 rounded-lg space-y-3 animate-in fade-in">
                      <input
                        type="text"
                        value={expForm.role}
                        onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                        className="w-full border border-indigo-200 rounded px-3 py-2 text-sm"
                        placeholder="Cargo"
                      />
                      <input
                        type="text"
                        value={expForm.company}
                        onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                        className="w-full border border-indigo-200 rounded px-3 py-2 text-sm"
                        placeholder="Empresa"
                      />
                      <input
                        type="text"
                        value={expForm.period}
                        onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                        className="w-full border border-indigo-200 rounded px-3 py-2 text-sm"
                        placeholder="Período (ej: 2022 - Presente)"
                      />
                      <textarea
                        value={expForm.description}
                        onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                        className="w-full border border-indigo-200 rounded px-3 py-2 text-sm"
                        rows={3}
                        placeholder="Descripción"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveExperience}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          <Save size={14} />
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingExperience(null)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-300 text-slate-700 rounded hover:bg-slate-400 text-sm"
                        >
                          <X size={14} />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-2">
                        {exp.period}
                      </span>
                      <h4 className="text-xl font-bold text-slate-800">{exp.role}</h4>
                      <h5 className="text-md font-medium text-slate-500 mb-2">{exp.company}</h5>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {exp.description}
                      </p>
                      {isAdmin && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => startEditExperience(exp)}
                            className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 text-xs"
                          >
                            <Edit size={12} />
                            Editar
                          </button>
                          <button
                            onClick={() => deleteExperience(exp.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-xs"
                          >
                            <Trash2 size={12} />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}

              {/* Add new experience form */}
              {isAddingExperience && (
                <div className="relative bg-indigo-50 p-4 rounded-lg space-y-3 animate-in fade-in slide-in-from-bottom-4">
                  <span className="absolute -left-[41px] top-4 h-5 w-5 rounded-full border-4 border-white bg-indigo-300 shadow-sm"></span>
                  <h4 className="font-bold text-slate-700">Nueva Experiencia</h4>
                  <input
                    type="text"
                    value={expForm.role}
                    onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    className="w-full border border-indigo-200 rounded px-3 py-2 text-sm"
                    placeholder="Cargo"
                  />
                  <input
                    type="text"
                    value={expForm.company}
                    onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    className="w-full border border-indigo-200 rounded px-3 py-2 text-sm"
                    placeholder="Empresa"
                  />
                  <input
                    type="text"
                    value={expForm.period}
                    onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                    className="w-full border border-indigo-200 rounded px-3 py-2 text-sm"
                    placeholder="Período (ej: 2022 - Presente)"
                  />
                  <textarea
                    value={expForm.description}
                    onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                    className="w-full border border-indigo-200 rounded px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Descripción"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addExperience}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
                    >
                      <Save size={14} />
                      Agregar
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingExperience(false);
                        setExpForm({ id: '', role: '', company: '', period: '', description: '' });
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-300 text-slate-700 rounded hover:bg-slate-400 text-sm"
                    >
                      <X size={14} />
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Education & Skills Column */}
          <div className="space-y-12">

            {/* Education */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Educación</h3>
                </div>
                {isAdmin && !isAddingEducation && (
                  <button
                    onClick={() => {
                      setIsAddingEducation(true);
                      setEduForm({ id: '', degree: '', institution: '', year: '' });
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Agregar
                  </button>
                )}
              </div>

              <div className="space-y-6 border-l-2 border-emerald-100 ml-4 pl-8">
                {education.map((edu) => (
                  <div key={edu.id} className="relative">
                    <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500 shadow-sm"></span>

                    {editingEducation === edu.id ? (
                      <div className="bg-emerald-50 p-4 rounded-lg space-y-3 animate-in fade-in">
                        <input
                          type="text"
                          value={eduForm.year}
                          onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                          className="w-full border border-emerald-200 rounded px-3 py-2 text-sm"
                          placeholder="Año"
                        />
                        <input
                          type="text"
                          value={eduForm.degree}
                          onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                          className="w-full border border-emerald-200 rounded px-3 py-2 text-sm"
                          placeholder="Título/Curso"
                        />
                        <input
                          type="text"
                          value={eduForm.institution}
                          onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                          className="w-full border border-emerald-200 rounded px-3 py-2 text-sm"
                          placeholder="Institución"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEducation}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                          >
                            <Save size={14} />
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingEducation(null)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-300 text-slate-700 rounded hover:bg-slate-400 text-sm"
                          >
                            <X size={14} />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm text-emerald-600 font-bold block mb-1">{edu.year}</span>
                        <h4 className="text-lg font-bold text-slate-800">{edu.degree}</h4>
                        <p className="text-slate-500">{edu.institution}</p>
                        {isAdmin && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => startEditEducation(edu)}
                              className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 text-xs"
                            >
                              <Edit size={12} />
                              Editar
                            </button>
                            <button
                              onClick={() => deleteEducation(edu.id)}
                              className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-xs"
                            >
                              <Trash2 size={12} />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}

                {/* Add new education form */}
                {isAddingEducation && (
                  <div className="relative bg-emerald-50 p-4 rounded-lg space-y-3 animate-in fade-in slide-in-from-bottom-4">
                    <span className="absolute -left-[41px] top-4 h-5 w-5 rounded-full border-4 border-white bg-emerald-300 shadow-sm"></span>
                    <h4 className="font-bold text-slate-700">Nueva Educación</h4>
                    <input
                      type="text"
                      value={eduForm.year}
                      onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                      className="w-full border border-emerald-200 rounded px-3 py-2 text-sm"
                      placeholder="Año"
                    />
                    <input
                      type="text"
                      value={eduForm.degree}
                      onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                      className="w-full border border-emerald-200 rounded px-3 py-2 text-sm"
                      placeholder="Título/Curso"
                    />
                    <input
                      type="text"
                      value={eduForm.institution}
                      onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                      className="w-full border border-emerald-200 rounded px-3 py-2 text-sm"
                      placeholder="Institución"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addEducation}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 text-sm"
                      >
                        <Save size={14} />
                        Agregar
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingEducation(false);
                          setEduForm({ id: '', degree: '', institution: '', year: '' });
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-300 text-slate-700 rounded hover:bg-slate-400 text-sm"
                      >
                        <X size={14} />
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                    <Star size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Habilidades</h3>
                </div>
                {isAdmin && !isAddingSkill && (
                  <button
                    onClick={() => {
                      setIsAddingSkill(true);
                      setSkillForm({ name: '', level: 50 });
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Agregar
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    {editingSkill === skill.name ? (
                      <div className="bg-amber-50 p-4 rounded-lg space-y-3 animate-in fade-in">
                        <input
                          type="text"
                          value={skillForm.name}
                          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                          className="w-full border border-amber-200 rounded px-3 py-2 text-sm"
                          placeholder="Nombre de la habilidad"
                        />
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm text-slate-600">Nivel</label>
                            <span className="text-sm font-bold text-amber-600">{skillForm.level}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skillForm.level}
                            onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={saveSkill}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                          >
                            <Save size={14} />
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingSkill(null)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-300 text-slate-700 rounded hover:bg-slate-400 text-sm"
                          >
                            <X size={14} />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-slate-700">{skill.name}</span>
                          <span className="text-xs text-slate-500">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div
                            className="bg-slate-800 h-2.5 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => startEditSkill(skill)}
                              className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 text-xs"
                            >
                              <Edit size={12} />
                              Editar
                            </button>
                            <button
                              onClick={() => deleteSkill(skill.name)}
                              className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-xs"
                            >
                              <Trash2 size={12} />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}

                {/* Add new skill form */}
                {isAddingSkill && (
                  <div className="bg-amber-50 p-4 rounded-lg space-y-3 animate-in fade-in slide-in-from-bottom-4">
                    <h4 className="font-bold text-slate-700">Nueva Habilidad</h4>
                    <input
                      type="text"
                      value={skillForm.name}
                      onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                      className="w-full border border-amber-200 rounded px-3 py-2 text-sm"
                      placeholder="Nombre de la habilidad"
                    />
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-slate-600">Nivel</label>
                        <span className="text-sm font-bold text-amber-600">{skillForm.level}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skillForm.level}
                        onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={addSkill}
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded hover:bg-amber-600 text-sm"
                      >
                        <Save size={14} />
                        Agregar
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingSkill(false);
                          setSkillForm({ name: '', level: 50 });
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-300 text-slate-700 rounded hover:bg-slate-400 text-sm"
                      >
                        <X size={14} />
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};