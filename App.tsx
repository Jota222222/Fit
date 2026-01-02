import React, { useState } from 'react';
import Header from './components/Header';
import Form from './components/Form';
import PlanDisplay from './components/PlanDisplay';
import { UserProfile, WorkoutPlanResponse } from './types';
import { generateWorkoutPlan } from './services/geminiService';

const DEFAULT_PROFILE: UserProfile = {
  age: 0,
  height: 0,
  weight: 0,
  targetWeight: 0,
  timeline: "",
  goal: "Perda de Peso",
  frequency: 3,
  location: "home",
  conditions: "",
};

const App: React.FC = () => {
  const [plan, setPlan] = useState<WorkoutPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserProfile) => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedPlan = await generateWorkoutPlan(data);
      setPlan(generatedPlan);
    } catch (err) {
      console.error(err);
      setError("Não foi possível gerar o plano no momento. Verifique a sua chave de API ou tente novamente em alguns instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold">✕</button>
          </div>
        )}

        {!plan ? (
          <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in-up">
            <div className="text-center max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Recupere a sua forma,<br />
                <span className="text-emerald-600">respeitando o seu corpo.</span>
              </h2>
              <p className="text-lg text-slate-600">
                Planos de treino inteligentes adaptados para a sua coluna.
                Perca peso com segurança, sem comprometer a cervical.
              </p>
            </div>
            <div className="w-full">
              <Form 
                initialData={DEFAULT_PROFILE} 
                onSubmit={handleFormSubmit} 
                isLoading={isLoading} 
              />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
             <PlanDisplay plan={plan} onReset={handleReset} />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} NeuroFit SafePlan. Powered by Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;