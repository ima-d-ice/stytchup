function Field({ label, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label htmlFor={`profile-${name}`} className="field-label">
        {label}
      </label>
      <input
        id={`profile-${name}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="field"
      />
    </div>
  );
}

export default function ProfileForm({ formData, onChange }) {
  return (
    <div className="space-y-10">
      <section>
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl leading-none tracking-[-0.01em]">About you</h2>
          <span className="text-[9px] uppercase tracking-[0.14em] text-ink/30">01</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Display name" name="name" value={formData.name} onChange={onChange} placeholder="Your name" />
          <Field label="Email" name="email" value={formData.email} onChange={onChange} type="email" placeholder="you@example.com" />
        </div>

        <div className="mt-6">
          <label htmlFor="profile-bio" className="field-label">
            Bio
          </label>
          <textarea
            id="profile-bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={onChange}
            placeholder="Tell designers about your style and what you are looking for."
            className="field-area"
          />
        </div>

        <div className="mt-6">
          <Field
            label="Skills (comma separated)"
            name="skills"
            value={formData.skills}
            onChange={onChange}
            placeholder="Couture tailoring, suede, silk"
          />
        </div>
      </section>

      <section className="border-t border-line pt-10">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl leading-none tracking-[-0.01em]">Online presence</h2>
          <span className="text-[9px] uppercase tracking-[0.14em] text-ink/30">02</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Website" name="website" value={formData.website} onChange={onChange} placeholder="https://" type="url" />
          <Field label="Instagram" name="instagram" value={formData.instagram} onChange={onChange} placeholder="@username" />
          <div className="sm:col-span-2">
            <Field label="Behance" name="behance" value={formData.behance} onChange={onChange} placeholder="behance.net/username" />
          </div>
        </div>
      </section>

      <section className="border-t border-line pt-10">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl leading-none tracking-[-0.01em]">Privacy</h2>
          <span className="text-[9px] uppercase tracking-[0.14em] text-ink/30">03</span>
        </div>
        <p className="max-w-lg text-[11px] leading-relaxed text-ink/40">
          Your email and measurements are shared only with the designer fulfilling your order. StytchUp never
          sells client data.
        </p>
      </section>
    </div>
  );
}
