import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Ruler } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import { API_URL, DEMO_MODE } from '../lib/api';

const FIELDS = [
  { name: 'chest', label: 'Chest', hint: { cm: 'e.g. 96', inches: 'e.g. 38' } },
  { name: 'waist', label: 'Waist', hint: { cm: 'e.g. 78', inches: 'e.g. 31' } },
  { name: 'hips', label: 'Hips', hint: { cm: 'e.g. 99', inches: 'e.g. 39' } },
  { name: 'height', label: 'Height', hint: { cm: 'e.g. 178', inches: 'e.g. 70' } },
];

export default function SubmitRequirements() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, status } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ chest: '', waist: '', hips: '', height: '', unit: 'cm', notes: '' });

  useEffect(() => {
    if (status === 'unauthenticated') navigate('/login');
  }, [status, navigate]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    if (DEMO_MODE) {
      window.setTimeout(() => {
        setSubmitting(false);
        navigate('/orders');
      }, 600);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/orders/submit-measurements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: id, measurements: form }),
      });
      if (res.ok) {
        navigate('/orders');
      } else {
        alert('Failed to save measurements. Please try again.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <div className="container-shop py-24 text-center text-sm text-ink/40">Loading…</div>;
  }

  return (
    <div className="bg-paper">
      <div className="container-shop">
        <PageHeader
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Orders', to: '/orders' },
            { label: 'Measurements' },
          ]}
          eyebrow="Final step"
          title="Your measurements."
          intro="Your payment is secure. Share four measurements and the designer can begin cutting your piece."
        />

        <div className="grid gap-10 py-10 lg:grid-cols-12 lg:gap-16 lg:py-14">
          <div className="lg:col-span-4">
            <div className="border-t border-ink pt-5">
              <Ruler className="h-5 w-5 text-brand" strokeWidth={1.3} />
              <h2 className="mt-6 font-display text-2xl leading-tight tracking-[-0.01em]">
                How to measure
              </h2>
              <ol className="mt-5 space-y-4 text-[11px] leading-relaxed text-ink/50">
                <li>
                  <span className="mr-2 text-ink/30">01</span>
                  Wear light clothing and stand naturally, without holding your breath.
                </li>
                <li>
                  <span className="mr-2 text-ink/30">02</span>
                  Keep the tape level and snug — not tight — around the fullest part.
                </li>
                <li>
                  <span className="mr-2 text-ink/30">03</span>
                  If you are between sizes, note it in the comments. Your designer will allow for it.
                </li>
              </ol>
              <p className="mt-6 border-l-2 border-brand pl-3 text-[10px] leading-relaxed text-ink/40">
                You can update these later in your inbox if anything changes before cutting begins.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <p className="eyebrow">Unit</p>
              <div className="flex border border-line">
                {['cm', 'inches'].map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => update('unit', unit)}
                    className={`px-5 py-2 text-[9px] uppercase tracking-[0.16em] transition-colors ${
                      form.unit === unit ? 'bg-ink text-white' : 'bg-transparent text-ink/45 hover:text-ink'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.name}>
                  <label htmlFor={`measure-${field.name}`} className="field-label">
                    {field.label}
                  </label>
                  <input
                    id={`measure-${field.name}`}
                    type="number"
                    required
                    step="0.5"
                    placeholder={field.hint[form.unit]}
                    className="field"
                    value={form[field.name]}
                    onChange={(event) => update(field.name, event.target.value)}
                  />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="measure-notes" className="field-label">
                Notes for the designer (optional)
              </label>
              <textarea
                id="measure-notes"
                rows={3}
                placeholder="Broad shoulders, longer sleeve, preferred fit…"
                className="field-area"
                value={form.notes}
                onChange={(event) => update('notes', event.target.value)}
              />
            </div>

            <div className="border-t border-line pt-6">
              <button type="submit" disabled={submitting} className="btn-yellow w-full sm:w-auto">
                {submitting ? 'Submitting…' : 'Submit measurements & begin'}
              </button>
              <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-ink/30">
                Your designer is notified as soon as this is submitted.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
