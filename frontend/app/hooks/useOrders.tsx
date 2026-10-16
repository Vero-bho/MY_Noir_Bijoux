import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Order, OrderItem, OrderStatus } from "~/types";
import { STORAGE_KEYS, readStorage, writeStorage } from "~/lib/storage";

export interface NewOrderInput {
  customerName: string;
  phone: string;
  email?: string;
  deliveryType: Order["deliveryType"];
  deliveryPoint?: string;
  address?: string;
  comment?: string;
  items: OrderItem[];
  total: number;
}

export type PersistedOrderInfo = Pick<Order, "id" | "orderNumber" | "createdAt" | "status" | "total">;

interface OrdersContextValue {
  orders: Order[];
  ready: boolean;
  addOrder: (input: NewOrderInput, persisted?: PersistedOrderInfo) => Order;
  findOrder: (orderNumber: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrders(readStorage<Order[]>(STORAGE_KEYS.orders, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeStorage(STORAGE_KEYS.orders, orders);
  }, [orders, ready]);

  const addOrder = useCallback((input: NewOrderInput, persisted?: PersistedOrderInfo) => {
    const order: Order = {
      id: persisted?.id ?? Date.now(),
      orderNumber: persisted?.orderNumber ?? String(1000 + Math.floor(Math.random() * 9000)),
      createdAt: persisted?.createdAt ?? new Date().toISOString(),
      status: (persisted?.status ?? "new") as OrderStatus,
      ...input,
      total: persisted?.total ?? input.total,
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const findOrder = useCallback(
    (orderNumber: string) => orders.find((order) => order.orderNumber === orderNumber),
    [orders],
  );

  const value: OrdersContextValue = { orders, ready, addOrder, findOrder };
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders должен использоваться внутри <OrdersProvider>");
  }
  return context;
}
