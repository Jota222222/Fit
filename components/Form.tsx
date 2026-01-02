import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AlertTriangle, ChevronRight, Loader2, Target, Home } from 'lucide-react';

interface FormProps {
  initialData: UserProfile;
  onSubmit: (data: UserProfile) => void;
  isLoading: boolean;
}

const Form: React.FC<FormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserProfile>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' || name === 'frequency' || name === 'targetWeight'
        ? (value === '' ? '' : Number(value)) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800">O seu Perfil Biométrico</h2>
        <p className="text-sm text-slate-500">Preencha os seus dados para gerar o plano ideal.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Idade</label>
            <input
              type="number"
              name="age"
              value={formData.age || ''}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Peso (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight || ''}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Altura (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height || ''}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              required
            />
          </div>
        </div>

        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2 mb-3">
             <Target className="w-4 h-4 text-emerald-600" />
             <h3 className="text-sm font-semibold text-emerald-800">O seu Objetivo</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Meta de Peso (kg)</label>
               <input
                 type="number"
                 name="targetWeight"
                 value={formData.targetWeight || ''}
                 onChange={handleChange}
                 placeholder="Ex: 90"
                 className="w-full px-4 py-2 bg-white text-slate-900 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Prazo / Data Alvo</label>
               <input
                 type="text"
                 name="timeline"
                 value={formData.timeline || ''}
                 onChange={handleChange}
                 placeholder="Ex: 30 Dias"
                 className="w-full px-4 py-2 bg-white text-slate-900 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
               />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Frequência (dias/sem)</label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            >
              <option value={3}>3 Dias</option>
              <option value={4}>4 Dias</option>
              <option value={5}>5 Dias</option>
              <option value={6}>6 Dias</option>
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Local de Treino</label>
            <div className="relative">
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition appearance-none"
              >
                <option value="home">Em Casa</option>
                <option value="gym">Ginásio</option>
              </select>
              <Home className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Objetivo Principal</label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            >
              <option value="Perda de Peso">Perda de Peso</option>
              <option value="Fortalecimento">Fortalecimento</option>
              <option value="Mobilidade">Mobilidade</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Condições Médicas / Restrições
          </label>
          <div className="relative">
            <textarea
              name="conditions"
              value={formData.conditions}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-red-200 bg-red-50 text-red-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition placeholder-red-300"
              placeholder="Descreva lesões (ex: Hérnia discal, dor no joelho...)"
              required
            />
            <div className="absolute top-3 right-3 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-1 text-xs text-red-600">
            * Estas informações são cruciais para a IA evitar exercícios perigosos.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center shadow-lg shadow-emerald-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              A analisar com IA...
            </>
          ) : (
            <>
              Gerar Plano Personalizado
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Form;