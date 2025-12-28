import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { userService } from '../../services/user.service';
import { toast } from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    preferredLanguage: user?.preferredLanguage || 'fr',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await userService.updateProfile(formData);
      updateUser(updated);
      toast.success('Profil mis à jour');
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('profile.title')}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('profile.personal_info')}</h2>
          <div className="space-y-4">
            <Input
              label={t('profile.full_name')}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <Input
              label={t('profile.email')}
              value={user?.email || ''}
              disabled
            />
            <Input
              label={t('profile.student_id')}
              value={user?.studentId || ''}
              disabled
            />
            <Input
              label={t('profile.phone')}
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">{t('profile.preferences')}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.language')}
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={formData.preferredLanguage}
              onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as any })}
            >
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <Button type="submit" variant="primary" isLoading={isLoading}>
          {t('profile.save_changes')}
        </Button>
      </form>
    </div>
  );
};

