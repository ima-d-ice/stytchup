import React from 'react';
import Image from 'next/image';
import { MapPin, Camera } from 'lucide-react';
import { UploadButton } from "@/utils/uploadthing"; // Ensure this path matches your project structure

interface AvatarCardProps {
  name: string;
  email: string;
  location: string;
  avatarUrl?: string;
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange: (url: string) => void; 
}

export default function AvatarCard({ 
  name, email, location, avatarUrl, onLocationChange, onAvatarChange 
}: AvatarCardProps) {

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center sticky top-8">
      
      {/* Avatar Container with Upload Overlay */}
      <div className="relative w-32 h-32 mb-4 group">
        
        {/* 1. The Visual Avatar */}
        <div className="w-full h-full rounded-full bg-yellow-400 flex items-center justify-center border-4 border-white shadow-md overflow-hidden relative z-0">
          {avatarUrl ? (
            <Image 
              src={avatarUrl} 
              alt="Avatar" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 128px"
            />
          ) : (
            <span className="text-4xl font-bold text-white">
              {name.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
        </div>

        {/* 2. Hover Overlay (Visual Cue) */}
        <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <Camera className="text-white w-8 h-8" />
        </div>

        {/* 3. Invisible Upload Button Trigger */}
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full overflow-hidden">
           <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                onAvatarChange(res[0].url);
              }
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            appearance={{
              button: "w-[500px] h-[500px] opacity-0 cursor-pointer", // Oversized to ensure coverage
              container: "w-full h-full overflow-hidden flex justify-center items-center",
              allowedContent: "hidden"
            }}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900">{name}</h2>
      <p className="text-sm text-gray-500 mb-4">{email}</p>
      
      <div className="w-full border-t border-gray-100 my-4"></div>
      
      {/* Location Input */}
      <div className="w-full text-left">
        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          <MapPin size={14}/> Location
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
    </div>
  );
}
