import { Product } from "./products";

export type FlashSaleProduct = {
  flashsaleproductsid: string;
  region: string;
  bonus_promo_discount: number;
  products: Product;
};

export type FlashSale = {
  flashsalesid: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  created_at: string;
};
