'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AvatarCard from '../../components/user-settings/Avatarcard';
import ProfileForm from '../../components/user-settings/Profileform';

export default function AccountSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    instagram: '',
    behance: '',
    skills: '', 
    avatarUrl: '', // This will hold the Base64 string or URL
  });

  // 1. Fetch Data on Mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:4000/profile/settings', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (res.ok) {
          const data = await res.json();
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
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 2. Handle Text Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Image Change (URL from UploadThing)
  const handleAvatarChange = (url: string) => {
    setFormData(prev => ({ ...prev, avatarUrl: url }));
  };

  // 4. Submit (Single Endpoint)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('http://localhost:4000/profile/update', {
        method: 'PUT',
        credentials: 'include', // Important for NextAuth cookies
        headers: {
          'Content-Type': 'application/json',
        },
        // We send the entire formData, including the large Base64 avatarUrl string
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        
        router.refresh();
      } else {
        const errData = await res.json();
        alert(`Failed: ${errData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500">Manage your profile and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column Component */}
          <div className="md:col-span-1">
            <AvatarCard 
              name={formData.name}
              email={formData.email}
              location={formData.location}
              avatarUrl={formData.avatarUrl}
              onLocationChange={handleChange}
              onAvatarChange={handleAvatarChange}
            />
          </div>

          {/* Right Column Component */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <ProfileForm 
              formData={formData}
              onChange={handleChange}
            />

            {/* Save Buttons */}
            <div className="flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => router.back()}
                className="px-6 py-3 rounded-full font-bold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={saving}
                className="px-8 py-3 rounded-full font-bold text-black bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-400/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}