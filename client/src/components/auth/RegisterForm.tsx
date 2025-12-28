import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = t('errors.required');
    if (!formData.email) {
      newErrors.email = t('errors.required');
    } else if (!/^[\w-\.]+@ehtp\.ac\.ma$/.test(formData.email)) {
      newErrors.email = t('errors.invalid_email');
    }
    if (!formData.studentId) {
      newErrors.studentId = t('errors.required');
    } else if (!/^EHTP-\d{4}$/i.test(formData.studentId)) {
      newErrors.studentId = t('errors.invalid_student_id');
    }
    if (!formData.password) {
      newErrors.password = t('errors.required');
    } else if (formData.password.length < 8) {
      newErrors.password = t('errors.password_min');
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.password_mismatch');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const { confirmPassword, ...registerData } = formData;
      register(registerData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('auth.full_name')}
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        error={errors.fullName}
        autoComplete="name"
      />

      <Input
        label={t('auth.email')}
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        placeholder="nom@ehtp.ac.ma"
        autoComplete="email"
      />

      <Input
        label={t('auth.student_id')}
        value={formData.studentId}
        onChange={(e) => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
        error={errors.studentId}
        placeholder="EHTP-1234"
      />

      <Input
        label={t('auth.password')}
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
        autoComplete="new-password"
      />

      <Input
        label={t('auth.confirm_password')}
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <Input
        label={t('auth.phone')}
        type="tel"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        placeholder="+212 6XX XXX XXX"
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        {t('auth.sign_up')}
      </Button>

      <p className="text-center text-sm text-gray-600">
        {t('auth.have_account')}{' '}
        <Link to="/auth/login" className="text-primary hover:underline">
          {t('auth.sign_in')}
        </Link>
      </p>
    </form>
  );
};

