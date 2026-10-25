import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AvatarCard from '../components/user-settings/Avatarcard';
import ProfileForm from '../components/user-settings/Profileform';
import PageHeader from '../components/ui/PageHeader';
import { API_URL, DEMO_MODE, getProfileSettings } from '../lib/api';

const INITIAL = {
  name: '',
  email: '',
  bio: '',
  location: '',
  website: '',
  instagram: '',
  behance: '',
  skills: '',
  avatarUrl: '',
};

export default function AccountSettings() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState(INITIAL);

  useEffect(() => {
    if (!token) return;
    let active = true;

    getProfileSettings(token)
      .then((data) => {
        if (!active || !data) return;
        const profile = data.profile || {};
        const socials = profile.socialLinks || {};
        setFormData({
          name: data.name || '',
          email: data.email || '',
          bio: profile.bio || '',
          location: profile.location || '',
          website: profile.website || '',
          instagram: socials.instagram || '',
          behance: socials.behance || '',
          skills: profile.skills ? profile.skills.join(', ') : '',
          avatarUrl: profile.avatarUrl || '',
        });
      })
      .catch((error) => console.error('Failed to load settings', error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSaved(false);
  };

  const handleAvatarChange = (url) => {
    setFormData((current) => ({ ...current, avatarUrl: url }));
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);

    if (DEMO_MODE) {
      window.setTimeout(() => {
        setSaving(false);
        setSaved(true);
      }, 500);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        const error = await res.json().catch(() => ({}));
        alert(`Failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-shop py-24">
        <div className="mx-auto max-w-4xl animate-pulse space-y-4">
          <div className="h-10 w-1/3 bg-mist" />
          <div className="h-3 w-2/3 bg-mist" />
          <div className="h-64 w-full bg-mist" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper">
      <div className="container-shop">
        <PageHeader
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Account settings' }]}
          eyebrow="Client area"
          title="Account."
          intro="Keep your details current so designers can reach you and cut to the right measurements. Your measurements live with each order."
        />

        <form onSubmit={handleSubmit} className="grid gap-10 py-10 lg:grid-cols-12 lg:gap-16 lg:py-14">
          <div className="lg:col-span-4">
            <AvatarCard
              name={formData.name}
              email={formData.email}
              location={formData.location}
              avatarUrl={formData.avatarUrl}
              onLocationChange={handleChange}
              onAvatarChange={handleAvatarChange}
            />
          </div>

          <div className="lg:col-span-8">
            <ProfileForm formData={formData} onChange={handleChange} />

            <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-[10px] uppercase tracking-[0.14em] text-ink/35">
                {saved ? 'Changes saved.' : 'Changes are saved to your profile.'}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => navigate(-1)} className="btn-outline flex-1 sm:flex-none">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-yellow flex-1 sm:flex-none">
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
