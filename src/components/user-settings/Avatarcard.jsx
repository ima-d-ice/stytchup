import { MapPin, Camera } from 'lucide-react';
import { useRef } from 'react';

// React port: UploadThing BFF removed. Accept an image URL directly,
// or pick a local file for an instant preview (sent as preview URL string).
// For production uploads, wire POST /uploads on Express + S3/UploadThing SDK.
export default function AvatarCard({ name, email, location, avatarUrl, onLocationChange, onAvatarChange }) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    onAvatarChange(preview);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center sticky top-8">
      <div className="relative w-32 h-32 mb-4 group">
        <div className="w-full h-full rounded-full bg-yellow-400 flex items-center justify-center border-4 border-white shadow-md overflow-hidden relative z-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="object-cover w-full h-full" />
          ) : (
            <span className="text-4xl font-bold text-white">{name?.charAt(0)?.toUpperCase() || 'U'}</span>
          )}
        </div>

        <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <Camera className="text-white w-8 h-8" />
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 z-20 rounded-full opacity-0 cursor-pointer"
          aria-label="Change avatar"
        />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <h2 className="text-xl font-bold text-gray-900">{name}</h2>
      <p className="text-sm text-gray-500 mb-4">{email}</p>

      <div className="w-full border-t border-gray-100 my-4"></div>

      <div className="w-full text-left">
        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          <MapPin size={14} /> Location
        </label>
        <input
          type="text"
          name="location"
          value={location}
          onChange={onLocationChange}
          placeholder="e.g. New York, USA"
          className="w-full bg-gray-50 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all border border-transparent focus:bg-white"
        />
      </div>

      <div className="w-full text-left mt-4">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Avatar URL</label>
        <input
          type="url"
          value={avatarUrl || ''}
          onChange={(e) => onAvatarChange(e.target.value)}
          placeholder="https://..."
          className="w-full bg-gray-50 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-transparent focus:bg-white"
        />
      </div>
    </div>
  );
}
