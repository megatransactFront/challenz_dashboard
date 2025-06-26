'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

type Order = {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  status: 'PENDING_PAYMENT'| 'AWAITING_FULFILLMENT' | 'FULFILLED' | 'SHIPPED' | 'DELIVERED' | 'PAYMENT_FAILED' | 'CANCELED' | 'RETURN_REQUESTED' | 'REFUNDED' | 'NO_REFUND';
  date: string;
};

type Props = {
  orders: Order[];
};

export function OrderHistory({ orders }: Props) {

  return (
    <div className="w-full bg-white rounded-xl shadow p-6 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.product}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
