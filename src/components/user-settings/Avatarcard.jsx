import { Camera, MapPin } from 'lucide-react';
import { useRef } from 'react';

export default function AvatarCard({ name, email, location, avatarUrl, onLocationChange, onAvatarChange }) {
  const fileRef = useRef(null);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onAvatarChange(URL.createObjectURL(file));
  };

  return (
    <div className="sticky top-28">
      <div className="group relative h-28 w-28 overflow-hidden bg-mist">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name ? `${name} avatar` : 'Avatar'} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-4xl text-ink/25">
            {name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-ink/45 text-white opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Change avatar"
        >
          <Camera className="h-5 w-5" strokeWidth={1.3} />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <h2 className="mt-5 font-display text-3xl leading-none tracking-[-0.02em]">{name || 'Your name'}</h2>
      <p className="mt-2 text-[12px] text-ink/40">{email}</p>

      <div className="mt-8 border-t border-line pt-5">
        <label htmlFor="profile-location" className="field-label flex items-center gap-2">
          <MapPin className="h-3 w-3" strokeWidth={1.4} />
          Location
        </label>
        <input
          id="profile-location"
          type="text"
          name="location"
          value={location}
          onChange={onLocationChange}
          placeholder="City, country"
          className="field"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="profile-avatar" className="field-label">
          Avatar URL
        </label>
        <input
          id="profile-avatar"
          type="url"
          value={avatarUrl || ''}
          onChange={(event) => onAvatarChange(event.target.value)}
          placeholder="https://…"
          className="field"
        />
        <p className="mt-2 text-[9px] leading-relaxed text-ink/30">
          Upload a file for a preview, or paste a hosted image URL to save it.
        </p>
      </div>
    </div>
  );
}
