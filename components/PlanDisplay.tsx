import React, { useState, useEffect } from 'react';
import { WorkoutPlanResponse, DayPlan, Exercise, NutritionPlan } from '../types';
import { Calendar, Info, CheckCircle2, AlertCircle, Utensils, Dumbbell, Droplets, Flame, Leaf, Eye, Clock, Loader2, Image as ImageIcon } from 'lucide-react';
import { generateExerciseImage } from '../services/geminiService';

interface PlanDisplayProps {
  plan: WorkoutPlanResponse;
  onReset: () => void;
}

const ExerciseItem: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      try {
        // Add a small random delay to avoid hitting rate limits instantly if rendering many items
        await new Promise(r => setTimeout(r, Math.random() * 1500)); 
        const url = await generateExerciseImage(exercise.name, exercise.visualCue);
        if (isMounted) setImageUrl(url);
      } catch (err) {
        console.error("Failed to generate image", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [exercise.name, exercise.visualCue]);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group h-full flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-bold text-slate-800 text-lg pr-2 leading-tight">{exercise.name}</h4>
        <span className="flex-shrink-0 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 whitespace-nowrap">
          {exercise.sets} x {exercise.reps}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-slate-600 mb-2 flex items-start">
           <Eye className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
           <span>{exercise.visualCue}</span>
        </p>
        <div className="flex items-start text-sm text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100">
          <Info className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
          <span className="italic font-medium">{exercise.safetyNote}</span>
        </div>
      </div>

      <div className="mt-auto bg-slate-50 rounded-lg overflow-hidden border border-slate-200 aspect-video flex items-center justify-center relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            <span className="text-xs font-medium">A desenhar exercício...</span>
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt={`Ilustração de ${exercise.name}`}
            className="w-full h-full object-contain p-2 bg-white"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-300 text-xs">
            <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
            <span>Sem imagem disponível</span>
          </div>
        )}
      </div>
    </div>
  );
};

const DayCard: React.FC<{ dayPlan: DayPlan }> = ({ dayPlan }) => (
  <div className="mb-8">
    <div className="flex items-center space-x-3 mb-4 sticky top-16 bg-slate-50/95 backdrop-blur-sm p-3 z-0 border-b border-slate-200 shadow-sm rounded-lg">
      <div className="bg-emerald-600 text-white p-2 rounded-lg shadow-sm">
        <Calendar className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800">{dayPlan.day}</h3>
        <p className="text-sm text-emerald-700 font-medium">Foco: {dayPlan.focus}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
      {dayPlan.exercises.map((exercise, idx) => (
        <ExerciseItem key={idx} exercise={exercise} />
      ))}
    </div>
  </div>
);

const NutritionView: React.FC<{ nutrition: NutritionPlan }> = ({ nutrition }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Macro Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
          <div className="bg-orange-100 p-3 rounded-full mb-3">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800">{nutrition.dailyCalories}</h3>
          <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">Kcal Médias</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            <Droplets className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{nutrition.hydrationGoal}</h3>
          <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">Água / Dia</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-full text-sm font-medium text-slate-600 space-y-3">
            <div className="flex justify-between border-b border-slate-50 pb-2">
               <span>Proteína 🥩</span> <span className="font-bold text-emerald-600">{nutrition.macros.protein}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
               <span>Hidratos 🥔</span> <span className="font-bold text-emerald-600">{nutrition.macros.carbs}</span>
            </div>
            <div className="flex justify-between">
               <span>Gordura 🥑</span> <span className="font-bold text-emerald-600">{nutrition.macros.fats}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Anti-inflammatory Tips */}
      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
        <div className="flex items-center space-x-2 mb-4">
          <Leaf className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-emerald-900">Dicas Anti-inflamatórias (Foco na Hérnia)</h3>
        </div>
        <ul className="space-y-3">
          {nutrition.antiInflammatoryTips.map((tip, idx) => (
            <li key={idx} className="flex items-start text-emerald-800 text-sm bg-white/50 p-2 rounded-lg">
              <span className="mr-2 text-emerald-500 font-bold">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Meal Plan - Weekly Cycle */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 px-2 flex items-center">
          <Utensils className="w-5 h-5 mr-2 text-emerald-600" />
          Ciclo de Ementa (7 Dias)
        </h3>
        
        {/* Day Selector */}
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
          {nutrition.weeklyMenu.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDayIndex === idx
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {day.dayName}
            </button>
          ))}
        </div>

        <div className="animate-fade-in">
          <h4 className="text-lg font-semibold text-emerald-800 mb-3 px-1">
            {nutrition.weeklyMenu[selectedDayIndex].dayName}
          </h4>
          
          <div className="space-y-3">
            {nutrition.weeklyMenu[selectedDayIndex].meals.map((meal, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center">
                  <span>{meal.time}</span>
                </div>
                <div className="p-4 space-y-4">
                  {meal.options.map((option, optIdx) => (
                    <div key={optIdx} className="text-sm border-l-2 border-emerald-200 pl-3">
                      <span className="font-bold text-emerald-700 block mb-1 text-base">{option.optionName}</span>
                      <span className="text-slate-600 leading-relaxed">{option.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onReset }) => {
  const [activeTab, setActiveTab] = useState<'workout' | 'nutrition'>('workout');
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{plan.planName}</h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-4">{plan.description}</p>
        
        <div className="inline-block bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800 max-w-xl mx-auto">
          <div className="flex items-center justify-center font-bold mb-1">
            <Clock className="w-4 h-4 mr-1.5" />
            Recomendação de Duração
          </div>
          {plan.planDurationAdvice}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-200/50 p-1.5 rounded-xl flex space-x-2">
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === 'workout' 
                ? 'bg-white text-emerald-700 shadow-md ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <Dumbbell className="w-4 h-4 mr-2" />
            Treino (Periodizado)
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === 'nutrition' 
                ? 'bg-white text-emerald-700 shadow-md ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <Utensils className="w-4 h-4 mr-2" />
            Nutrição (Ciclo)
          </button>
        </div>
      </div>

      {activeTab === 'workout' ? (
        <div className="space-y-6 animate-fade-in">
          
          {/* Phase Selector */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {plan.phases.map((phase, idx) => (
               <button
                 key={idx}
                 onClick={() => setActivePhaseIndex(idx)}
                 className={`relative px-4 py-3 rounded-xl border-2 transition-all duration-200 flex-1 md:flex-none text-left md:text-center ${
                   activePhaseIndex === idx 
                     ? 'border-emerald-500 bg-emerald-50 text-emerald-900' 
                     : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200'
                 }`}
               >
                 <div className="text-xs font-bold uppercase tracking-wider mb-1">Fase {idx + 1}</div>
                 <div className="font-semibold">{phase.phaseName}</div>
               </button>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-sm text-slate-600">
             <span className="font-bold text-slate-800">Foco desta fase:</span> {plan.phases[activePhaseIndex].description}
          </div>

          <div className="space-y-2">
            {plan.phases[activePhaseIndex].schedule.map((day, idx) => (
              <DayCard key={idx} dayPlan={day} />
            ))}
          </div>
        </div>
      ) : (
        <NutritionView nutrition={plan.nutrition} />
      )}

      <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start space-x-4 shadow-sm">
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-amber-800 text-lg mb-1">Aviso Importante</h4>
          <p className="text-amber-700 text-sm leading-relaxed">
            Este plano (treino e dieta) foi gerado por Inteligência Artificial. 
            Embora as diretrizes de segurança tenham sido aplicadas, 
            <strong> consulte sempre o seu médico, fisioterapeuta e nutricionista antes de iniciar.</strong> 
            A perda de peso rápida exige acompanhamento profissional.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="text-slate-500 hover:text-emerald-600 font-medium transition underline"
        >
          Gerar Novo Plano
        </button>
      </div>
    </div>
  );
};

export default PlanDisplay;