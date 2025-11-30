interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: unknown) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: unknown;
  theme?: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}