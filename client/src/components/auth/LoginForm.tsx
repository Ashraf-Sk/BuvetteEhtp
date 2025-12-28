import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    studentId: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.studentId) {
      newErrors.studentId = t('errors.required');
    }
    if (!formData.password) {
      newErrors.password = t('errors.required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      login(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('auth.student_id') || 'Student ID'}
        value={formData.studentId}
        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
        error={errors.studentId}
        placeholder="EHTP-1234"
        autoComplete="username"
      />

      <Input
        label={t('auth.password')}
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <Link
          to="/auth/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          {t('auth.forgot_password_link')}
        </Link>
      </div>

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        {t('auth.sign_in')}
      </Button>

      <p className="text-center text-sm text-gray-600">
        {t('auth.no_account')}{' '}
        <Link to="/auth/register" className="text-primary hover:underline">
          {t('auth.sign_up')}
        </Link>
      </p>
    </form>
  );
};

