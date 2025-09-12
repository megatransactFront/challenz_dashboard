import { Product } from "./products";
import { Service } from "./services";

export type FlashSaleProduct = {
  flashsaleproductsid: string;
  region: string;
  bonus_promo_discount: number;
  products: Product;
};

export type FlashSaleService = {
  flashsaleserviceid: string;
  region: string;
  bonus_promo_discount: number;
  services: Service;
};

export type FlashSale = {
  flashsalesid: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  created_at: string;
};
