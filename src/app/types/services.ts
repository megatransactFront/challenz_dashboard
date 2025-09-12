export type Service = {
  id: string;
  name: string;
  region: string;
  description: string;
  created_at: string;
  standardPrice: number;
  discountedPrice: number | null;
  duration_months: number;
  uwaciCoinsRequired: number;
  cancellationPolicy: string;
  minimum_term: number;
  image_url: string;
};
