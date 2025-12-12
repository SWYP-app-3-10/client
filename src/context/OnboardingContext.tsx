import React, {createContext, useContext} from 'react';

interface OnboardingContextType {
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const OnboardingProvider = ({
  children,
  completeOnboarding,
}: {
  children: React.ReactNode;
  completeOnboarding: () => void;
}) => {
  return (
    <OnboardingContext.Provider value={{completeOnboarding}}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
