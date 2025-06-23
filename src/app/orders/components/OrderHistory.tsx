'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useState } from 'react';

type Order = {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled' | 'Returned';
  date: string;
};

type Props = {
  orders: Order[];
};

export function OrderHistory({ orders }: Props) {
  const [orderStatuses, setOrderStatuses] = useState(
    orders.reduce((acc, order) => {
      acc[order.id] = order.status;
      return acc;
    }, {} as Record<string, Order['status']>)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-500';
      case 'Processing':
        return 'text-blue-500';
      case 'Shipped':
        return 'text-indigo-500';
      case 'Delivered':
        return 'text-emerald-500';
      case 'Completed':
        return 'text-green-600';
      case 'Cancelled':
        return 'text-red-600';
      case 'Returned':
        return 'text-orange-500';
      default:
        return '';
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
  };

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
              <TableCell>
                <Select
                  value={orderStatuses[order.id]}
                  onValueChange={(val) => handleStatusChange(order.id, val as Order['status'])}
                >
                  <SelectTrigger className={`w-[140px] ${getStatusColor(orderStatuses[order.id])} font-semibold`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled', 'Returned'].map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{order.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
