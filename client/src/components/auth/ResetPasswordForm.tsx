import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { authService } from '../../services/auth.service';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { VerificationCodeInput } from './VerificationCodeInput';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: t('errors.required') });
      return;
    }
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('Code envoyé');
      setStep('code');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (verifiedCode: string) => {
    setIsLoading(true);
    try {
      await authService.verifyResetCode(email, verifiedCode);
      setCode(verifiedCode);
      setStep('reset');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Code invalide');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: t('errors.password_mismatch') });
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword(email, code, password);
      toast.success('Mot de passe réinitialisé');
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'email') {
    return (
      <form onSubmit={handleSendCode} className="space-y-4">
        <Input
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
          {t('auth.send_code') || 'Envoyer le code'}
        </Button>
      </form>
    );
  }

  if (step === 'code') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {t('auth.code_sent')} {email}
        </p>
        <VerificationCodeInput onComplete={handleVerifyCode} />
      </div>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <Input
        label={t('auth.new_password')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Input
        label={t('auth.confirm_password')}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
      />
      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        {t('auth.reset_password')}
      </Button>
    </form>
  );
};

