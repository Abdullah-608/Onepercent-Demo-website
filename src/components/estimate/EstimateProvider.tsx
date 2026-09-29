"use client";
import { createContext, useCallback, useContext, useState } from "react";
import EstimateDrawer from "@/components/estimate/EstimateDrawer";
import { initialAnswers, type Answers } from "@/lib/estimate";

type Ctx = { open: () => void };
const EstimateContext = createContext<Ctx>({ open: () => {} });

export const useEstimate = () => useContext(EstimateContext);

// Holds the wizard's answers above the page, so closing the drawer or changing pages keeps
// the visitor's progress.
export default function EstimateProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [step, setStep] = useState(0);
  const open = useCallback(() => setOpen(true), []);

  return (
    <EstimateContext.Provider value={{ open }}>
      {children}
      <EstimateDrawer
        open={isOpen}
        onClose={() => setOpen(false)}
        answers={answers}
        setAnswers={setAnswers}
        step={step}
        setStep={setStep}
        onReset={() => {
          setAnswers(initialAnswers);
          setStep(0);
        }}
      />
    </EstimateContext.Provider>
  );
}
