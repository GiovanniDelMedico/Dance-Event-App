// src/onboarding/OnboardingWizard.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import StepWelcome from "./steps/StepWelcome";
import StepCategories from "./steps/StepCategories";
import StepAvatar from "./steps/StepAvata";
import StepCTA from "./steps/StepCTA";

export default function OnboardingWizard() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  const steps = [
    <StepWelcome />,
    <StepCategories />,
    <StepAvatar />,
    <StepCTA />,
  ];

  useEffect(() => {
    if (!user) return;

    const key = `onboarding_${user.id}`;
    const completed = localStorage.getItem(key);

    if (!completed) {
      setVisible(true);
    }
  }, [user]);

  function next() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      complete();
    }
  }

  function skip() {
    complete();
  }

  function complete() {
    if (user) {
      localStorage.setItem(`onboarding_${user.id}`, "completed");
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-xl animate-fade-in">
        
        {/* STEP CONTENT */}
        <div className="mb-6">
          {steps[step]}
        </div>

        {/* CONTROLS */}
        <div className="flex justify-between">
          <button
            onClick={skip}
            className="text-zinc-500 hover:text-zinc-700 transition"
          >
            Salta
          </button>

          <button
            onClick={next}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            {step === steps.length - 1 ? "Fine" : "Avanti"}
          </button>
        </div>

        {/* STEP INDICATOR */}
        <div className="mt-4 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition ${
                i === step ? "bg-purple-600" : "bg-zinc-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
