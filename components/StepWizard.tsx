import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, Wrench, Thermometer, Hammer, ShowerHead, HelpCircle,
  Camera, ChevronRight, ChevronLeft, CheckCircle2,
  Loader2, MapPin, Phone, User, Clock, Info,
  Bath, Sparkles, Accessibility, Banknote
} from 'lucide-react';
import { LeadFormData, RepairCategory, Urgency, ProjectType, RemodelGoal, AiAnalysisResult } from '../types';
import { analyzePlumbingIssue } from '../services/geminiService';

const REPAIR_CATEGORIES = [
  { id: RepairCategory.LEAK, icon: Droplets, label: 'Leak' },
  { id: RepairCategory.CLOG, icon: Wrench, label: 'Clog' },
  { id: RepairCategory.TEMPERATURE, icon: Thermometer, label: 'Temp Issue' },
  { id: RepairCategory.BROKEN_PART, icon: Hammer, label: 'Broken Part' },
  { id: RepairCategory.INSTALLATION, icon: ShowerHead, label: 'Part Install' },
  { id: RepairCategory.OTHER, icon: HelpCircle, label: 'Other' },
];

const REMODEL_GOALS = [
  { id: RemodelGoal.TUB_TO_SHOWER, icon: Bath, label: 'Tub to Shower', desc: 'Convert old tub' },
  { id: RemodelGoal.SAFETY, icon: Accessibility, label: 'Safety / Aging', desc: 'Low entry, grab bars' },
  { id: RemodelGoal.DESIGN, icon: Sparkles, label: 'Modern Look', desc: 'Luxury update' },
  { id: RemodelGoal.VALUE, icon: Banknote, label: 'Home Value', desc: 'Resale boost' },
];

const URGENCIES = [
  { id: Urgency.EMERGENCY, label: 'As Soon As Possible', sub: 'Urgent request', color: 'red' },
  { id: Urgency.THIS_WEEK, label: 'Within 2 Weeks', sub: 'Flexible schedule', color: 'blue' },
  { id: Urgency.FLEXIBLE, label: 'Planning Stage', sub: 'Just browsing', color: 'green' },
];

export const StepWizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<LeadFormData>({
    projectType: null,
    repairCategory: null,
    remodelGoal: null,
    urgency: null,
    description: '',
    image: null,
    name: '',
    phone: '',
    address: '',
    zipCode: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Trigger AI analysis at the contact step
    if (step === 3 && !aiAnalysis && !isAnalyzing) {
      // Only analyze if we have enough info
      if (formData.projectType === ProjectType.REPAIR && formData.repairCategory) {
         runAiAnalysis();
      } else if (formData.projectType === ProjectType.REMODEL && formData.remodelGoal) {
         runAiAnalysis();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const runAiAnalysis = async () => {
    if (!formData.projectType) return;
    
    setIsAnalyzing(true);
    const categoryOrGoal = formData.projectType === ProjectType.REPAIR 
      ? formData.repairCategory! 
      : formData.remodelGoal!;

    const result = await analyzePlumbingIssue(
      formData.projectType, 
      categoryOrGoal, 
      formData.description
    );
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  // Logic to determine completion
  const canProceed = () => {
    if (step === 0) return !!formData.projectType;
    if (step === 1) {
      if (formData.projectType === ProjectType.REPAIR) return !!formData.repairCategory;
      if (formData.projectType === ProjectType.REMODEL) return !!formData.remodelGoal;
      return false;
    }
    if (step === 2) return !!formData.urgency; // Timeline
    if (step === 3) return formData.name && formData.phone.length > 5 && formData.zipCode.length >= 5; // Contact
    return true;
  };

  // Helper for Option Selection
  const OptionCard = ({ selected, onClick, icon: Icon, label, desc }: any) => (
    <button
      onClick={onClick}
      className={`relative w-full text-left p-5 rounded-xl border transition-all duration-200 group ${
        selected
          ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500'
          : 'border-slate-200 bg-white hover:border-blue-300'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full transition-colors ${
          selected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'
        }`}>
          <Icon size={24} />
        </div>
        <div>
          <div className={`font-bold text-lg leading-tight ${selected ? 'text-blue-900' : 'text-slate-800'}`}>
            {label}
          </div>
          {desc && <div className="text-sm text-slate-500 mt-1">{desc}</div>}
        </div>
        {selected && (
          <div className="absolute top-5 right-5 text-blue-500">
            <CheckCircle2 size={20} className="fill-blue-100" />
          </div>
        )}
      </div>
    </button>
  );

  const steps = [
    // Step 0: Project Type (The "Walk-in" Pivot)
    <div key="step0" className="space-y-6 pt-2">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900">How can we help?</h2>
        <p className="text-slate-500">Choose a service to get started.</p>
      </div>

      <div className="space-y-4">
        <OptionCard
          selected={formData.projectType === ProjectType.REMODEL}
          onClick={() => setFormData({ ...formData, projectType: ProjectType.REMODEL })}
          icon={Sparkles}
          label="Remodel / Walk-In Shower"
          desc="Tub-to-shower, safety upgrades, & renovations."
        />
        <OptionCard
          selected={formData.projectType === ProjectType.REPAIR}
          onClick={() => setFormData({ ...formData, projectType: ProjectType.REPAIR })}
          icon={Wrench}
          label="Shower Repair"
          desc="Fix leaks, clogs, or broken parts."
        />
      </div>
    </div>,

    // Step 1: Details (Dynamic based on Step 0)
    <div key="step1" className="space-y-6 pt-2">
      <h2 className="text-2xl font-extrabold text-slate-900">
        {formData.projectType === ProjectType.REMODEL ? "What is your primary goal?" : "What is the problem?"}
      </h2>
      
      {formData.projectType === ProjectType.REMODEL ? (
        <div className="grid grid-cols-1 gap-3">
           {REMODEL_GOALS.map((goal) => (
             <OptionCard
               key={goal.id}
               selected={formData.remodelGoal === goal.id}
               onClick={() => setFormData({ ...formData, remodelGoal: goal.id })}
               icon={goal.icon}
               label={goal.label}
               desc={goal.desc}
             />
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {REPAIR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFormData({ ...formData, repairCategory: cat.id })}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 text-center ${
                formData.repairCategory === cat.id
                  ? 'border-blue-500 bg-blue-50 text-blue-800 font-medium ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
              }`}
            >
              <cat.icon size={28} className={`mb-3 ${formData.repairCategory === cat.id ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="text-sm leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Optional Description Field */}
      <div className="mt-6 pt-6 border-t border-slate-100">
         <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Details (Optional)</label>
         <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder={formData.projectType === ProjectType.REMODEL ? "Tell us about your dream bathroom..." : "Describe the leak or issue..."}
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24 bg-slate-50 text-slate-800 text-sm resize-none"
         />
      </div>
    </div>,

    // Step 2: Urgency / Timeline
    <div key="step2" className="space-y-6 pt-2">
      <h2 className="text-2xl font-extrabold text-slate-900">When do you need this?</h2>
      <div className="space-y-3">
        {URGENCIES.map((opt) => (
          <OptionCard
            key={opt.id}
            selected={formData.urgency === opt.id}
            onClick={() => setFormData({ ...formData, urgency: opt.id })}
            icon={Clock}
            label={opt.label}
            desc={opt.sub}
          />
        ))}
      </div>
      
      {/* Image Upload - Moved here to balance steps */}
      <div className="mt-6 pt-6 border-t border-slate-100">
         <label className="block text-sm font-semibold text-slate-700 mb-3">Upload Photo (Helpful for accuracy)</label>
         <div className="relative">
            <input
              type="file"
              accept="image/*"
              // @ts-ignore
              capture="environment"
              onChange={(e) => e.target.files && setFormData({...formData, image: e.target.files[0]})}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="flex items-center gap-4 w-full p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 cursor-pointer active:bg-slate-100 transition-colors">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                 <Camera className="text-slate-400" size={20} />
               </div>
               <div className="flex-1">
                 {formData.image ? (
                   <span className="text-green-600 font-medium flex items-center gap-2">
                     <CheckCircle2 size={16}/> Photo Added
                   </span>
                 ) : (
                   <span className="text-slate-500 font-medium">Take or Upload Photo</span>
                 )}
                 <p className="text-xs text-slate-400 mt-0.5">We'll identify the model/parts.</p>
               </div>
            </label>
        </div>
      </div>
    </div>,

    // Step 3: Contact (Lead Gen)
    <div key="step3" className="space-y-6 pt-2">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900">See Your Estimate</h2>
        <p className="text-slate-500 text-sm mt-1">Where should we send your quote?</p>
      </div>

      {/* AI Insight Card */}
      <AnimatePresence>
        {(isAnalyzing || aiAnalysis) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm mb-6"
          >
            <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
               <Sparkles size={12} className="text-blue-600"/> 
               HomeBuddy AI Analysis
            </div>
            
            {isAnalyzing ? (
              <div className="flex items-center gap-2 text-slate-500 text-sm py-2">
                <Loader2 className="animate-spin text-blue-600" size={16} />
                <span className="animate-pulse">Analyzing your request...</span>
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-800 text-sm">{aiAnalysis.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{aiAnalysis.content}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-md text-xs font-medium text-blue-700 border border-blue-100 shadow-sm">
                  <Info size={12}/> {aiAnalysis.highlight}
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div>
           <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Full Name</label>
           <div className="relative">
             <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="First and Last Name"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
             />
           </div>
        </div>

        <div>
           <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Zip Code</label>
           <div className="relative">
             <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={formData.zipCode}
              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
              placeholder="12345"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
             />
           </div>
        </div>

        <div>
           <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Phone Number</label>
           <div className="relative">
             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="(555) 123-4567"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
              inputMode="tel"
             />
           </div>
           <p className="text-[10px] text-slate-400 mt-2 px-1 text-center leading-tight">
             By clicking "Get Quote", I agree to receive calls/texts from HomeBuddy at the number provided.
           </p>
        </div>
      </div>
    </div>
  ];

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in bg-white rounded-3xl my-4 mx-4 shadow-sm border border-slate-100">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Confirmed!</h2>
        <p className="text-slate-500 mb-8 max-w-[260px] mx-auto text-sm leading-relaxed">
          Thanks, {formData.name}. We have sent your details to a specialist in <span className="font-semibold text-slate-700">{formData.zipCode}</span>. Expect a call shortly!
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-slate-100 text-slate-700 font-bold py-3.5 px-8 rounded-full hover:bg-slate-200 transition-colors text-sm"
        >
          Start New Request
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div ref={topRef} />
      
      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-100">
        <div 
          className="h-full bg-green-500 transition-all duration-500 ease-out"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 px-5 pb-32 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Navigation - Matches HomeBuddy Mobile CTA style */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-slate-100 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          <button
            onClick={step === steps.length - 1 ? handleSubmit : handleNext}
            disabled={!canProceed() || isSubmitting}
            className={`flex-1 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${
              !canProceed() || isSubmitting
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/30'
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : step === steps.length - 1 ? (
              'Get Free Quote'
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};