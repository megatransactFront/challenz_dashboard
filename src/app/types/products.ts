export type Product = {
  id: string
  name: string
  description: string
  type: string
  price_usd: number
  stock: number | null
  uwc_discount_enabled: boolean | null
  image_url: string | null
  is_active: boolean | null
  manufacturer_id: string
  created_at: string
  region: string  
}