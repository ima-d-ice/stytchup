import React from 'react';

// 1. Define the shape of your Form Data
export interface ProfileFormData {
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  instagram: string;
  behance: string;
  skills: string;
  avatarUrl: string;
}

// 2. Define props for the Main Component
interface ProfileFormProps {
  formData: ProfileFormData;
  // This type handles events from both <input> and <textarea>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// 3. Define props for the Helper Component
interface InputGroupProps {
  label: string;
  name: keyof ProfileFormData; // This ensures 'name' matches a key in your data object
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string; // Optional property
}

export default function ProfileForm({ formData, onChange }: ProfileFormProps) {
  return (
    <div className="space-y-6">
      
      {/* Bio Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">About You</h3>
        <div className="space-y-4">
          <InputGroup label="Display Name" name="name" value={formData.name} onChange={onChange} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea 
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={onChange}
              placeholder="Tell us about your style..."
              className="w-full border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 transition-colors bg-gray-50 resize-none outline-none"
            />
          </div>

          <InputGroup 
            label="Skills (Comma separated)" 
            name="skills" 
            value={formData.skills} 
            onChange={onChange} 
            placeholder="Logo Design, 3D Modeling"
          />
        </div>
      </div>

      {/* Socials Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Online Presence</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputGroup label="Website" name="website" value={formData.website} onChange={onChange} placeholder="https://" />
          <InputGroup label="Instagram" name="instagram" value={formData.instagram} onChange={onChange} placeholder="@username" />
          <div className="sm:col-span-2">
            <InputGroup label="Behance" name="behance" value={formData.behance} onChange={onChange} placeholder="behance.net/user" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helper for inputs
function InputGroup({ label, name, value, onChange, placeholder }: InputGroupProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input 
        type="text" 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-yellow-400 focus:ring-yellow-400 transition-colors bg-gray-50 outline-none"
      />
    </div>
  )
}