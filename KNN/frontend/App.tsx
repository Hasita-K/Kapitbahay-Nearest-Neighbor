import { useState } from 'react';
import { LoginScreen } from './Loginpage';
import { SignupScreen } from './SignupScreen';

type Mode = 'login' | 'signup';

export default function App() {
  const [mode, setMode] = useState<Mode>('login');

  return mode === 'login' ? (
    <LoginScreen onEnter={() => {}} onSwitchToSignup={() => setMode('signup')} />
  ) : (
    <SignupScreen onEnter={() => {}} onSwitchToLogin={() => setMode('login')} />
  );
}