/**
 * Types for notification data based on notification types.
 * @remarks
 * This file defines the specific data structures for different notification types.
 */

/**
 * Data for expiring product notifications.
 */
export interface ExpiringProductData {
  product: string;
  date: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Data for low stock notifications.
 */
export interface LowStockData {
  product: string;
  quantity: number;
}

/**
 * Data for general info notifications.
 */
export interface InfoNotificationData {
  message: string;
  [key: string]: string | number | boolean;
}

/**
 * Union type for all possible notification data.
 */
export type NotificationData = ExpiringProductData | LowStockData | InfoNotificationData;
