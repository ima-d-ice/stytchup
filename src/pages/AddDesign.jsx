import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import { toPaise } from '../utils/pricing';
import { API_URL, DEMO_MODE } from '../lib/api';

const INITIAL_FORM = {
  title: '',
  description: '',
  price: '',
  imageUrl: '',
  type: 'CATALOG',
  material: '',
  sizeGuide: '',
  category: '',
};

export default function AddDesign() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.imageUrl) {
      alert('Please add an image URL first');
      return;
    }

    if (DEMO_MODE) {
      setLoading(true);
      window.setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 600);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/designs/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: toPaise(form.price) }),
      });
      if (res.ok) {
        navigate('/dashboard');
      } else {
        const error = await res.json().catch(() => ({}));
        alert(error.error || 'Failed to create design');
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-paper">
      <div className="container-shop">
        <PageHeader
          crumbs={[{ label: 'Home', to: '/' }, { label: 'Studio', to: '/dashboard' }, { label: 'New design' }]}
          eyebrow="The atelier"
          title="New design"
          intro="Publish a catalog piece or open a custom commission. Add a clear image and honest measurements — clients can ask for the rest."
        />

        <form onSubmit={handleSubmit} className="grid gap-10 py-10 lg:grid-cols-12 lg:gap-14 lg:py-14">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-3">Image</p>
            {form.imageUrl ? (
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-mist">
                <img src={form.imageUrl} alt="Design preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => update('imageUrl', '')}
                  className="absolute right-3 top-3 bg-paper/95 p-2 text-ink transition-colors hover:bg-brand"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.4} />
                </button>
              </div>
            ) : (
              <div className="flex aspect-[3/4] w-full flex-col items-center justify-center border border-dashed border-line bg-mist/60 p-6 text-center">
                <ImagePlus className="h-6 w-6 text-ink/30" strokeWidth={1.2} />
                <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-ink/40">Paste a hosted image URL</p>
                <p className="mt-2 max-w-[200px] text-[10px] leading-relaxed text-ink/30">
                  Use a link from your studio site or a stock library. Direct uploads are coming next.
                </p>
              </div>
            )}

            <div className="mt-4">
              <label htmlFor="design-image" className="field-label">
                Image URL
              </label>
              <input
                id="design-image"
                type="url"
                placeholder="https://…"
                className="field"
                value={form.imageUrl}
                onChange={(event) => update('imageUrl', event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-7 lg:col-span-7">
            <div className="grid gap-7 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="design-title" className="field-label">
                  Title
                </label>
                <input
                  id="design-title"
                  required
                  placeholder="Sculpted wool coat"
                  className="field"
                  value={form.title}
                  onChange={(event) => update('title', event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="design-price" className="field-label">
                  Price (₹)
                </label>
                <input
                  id="design-price"
                  required
                  type="number"
                  min="0"
                  placeholder="0"
                  className="field"
                  value={form.price}
                  onChange={(event) => update('price', event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="design-type" className="field-label">
                  Type
                </label>
                <select
                  id="design-type"
                  className="field cursor-pointer"
                  value={form.type}
                  onChange={(event) => update('type', event.target.value)}
                >
                  <option value="CATALOG">Catalog — made to measure</option>
                  <option value="CUSTOM">Custom — commission</option>
                </select>
              </div>

              <div>
                <label htmlFor="design-category" className="field-label">
                  Category
                </label>
                <input
                  id="design-category"
                  placeholder="Womenswear, Outerwear…"
                  className="field"
                  value={form.category}
                  onChange={(event) => update('category', event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="design-material" className="field-label">
                  Material
                </label>
                <input
                  id="design-material"
                  placeholder="Italian virgin wool"
                  className="field"
                  value={form.material}
                  onChange={(event) => update('material', event.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="design-description" className="field-label">
                Description
              </label>
              <textarea
                id="design-description"
                rows={5}
                placeholder="Describe the cut, the cloth, and how it should feel to wear."
                className="field-area"
                value={form.description}
                onChange={(event) => update('description', event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="design-size" className="field-label">
                Size guide / notes
              </label>
              <textarea
                id="design-size"
                rows={3}
                placeholder="Made to measure. 4–6 weeks. Two fittings included."
                className="field-area"
                value={form.sizeGuide}
                onChange={(event) => update('sizeGuide', event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row">
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-outline flex-1">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-yellow flex-1">
                {loading ? 'Publishing…' : 'Publish design'}
              </button>
            </div>

            {DEMO_MODE && (
              <p className="text-[10px] leading-relaxed text-ink/35">
                Demo mode: publishing is simulated and does not write to the database.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
