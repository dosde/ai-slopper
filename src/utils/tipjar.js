// Supporter Tip Jar
// ─────────────────────────────────────────────────────────────────
// Thin abstraction that works in three environments:
//   1. Android (Capacitor + Play Billing plugin installed) — real IAP
//   2. Capacitor without the plugin — opens external link
//   3. Web / PWA — opens external link (Ko-Fi / BuyMeACoffee / etc.)
//
// To wire up real Play Billing later, install:
//   npm i @capacitor-community/in-app-purchases
// and create three consumable products in the Play Console with IDs:
//   tip_small, tip_medium, tip_large  (see PRODUCT_IDS below)
// then this module will automatically route through the plugin.

const TIPS_KEY = 'slop_royale_tips_v1';

export const TIP_TIERS = [
  {
    id: 'tip_small',
    emoji: '☕',
    label: 'Small coffee',
    amount: '€1.99',
    tagline: 'Thanks for the fun!',
    fallbackAmount: 1.99,
  },
  {
    id: 'tip_medium',
    emoji: '🍕',
    label: 'Slice of pizza',
    amount: '€4.99',
    tagline: 'Powering more rounds',
    fallbackAmount: 4.99,
  },
  {
    id: 'tip_large',
    emoji: '🎮',
    label: 'True patron',
    amount: '€9.99',
    tagline: 'Legend status unlocked',
    fallbackAmount: 9.99,
  },
];

// External fallback URL used on web/PWA or when the native plugin is missing.
// Replace with your actual Ko-Fi / Buy Me a Coffee / PayPal.me link.
const EXTERNAL_TIP_URL = 'https://ko-fi.com/aisloproyale';

// ── Platform detection ──────────────────────────────────────────────────────
const isCapacitorNative = () => {
  try {
    // Capacitor sets window.Capacitor.isNativePlatform() in native builds
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  } catch {
    return false;
  }
};

// Look up the IAP plugin at runtime via Capacitor's plugin registry.
// This avoids a compile-time import (so the web build doesn't break) and
// works with any community Play Billing plugin that registers itself, e.g.:
//   - @capacitor-community/in-app-purchases  → window.Capacitor.Plugins.InAppPurchases
//   - cordova-plugin-purchase                → window.CdvPurchase / window.store
// Install one of them and rebuild the Android app to enable real IAPs.
const getIAPPlugin = () => {
  if (!isCapacitorNative()) return null;
  try {
    const reg = window.Capacitor?.Plugins || {};
    return reg.InAppPurchases || reg.Purchases || reg.Billing || null;
  } catch {
    return null;
  }
};

// ── Persistence ─────────────────────────────────────────────────────────────
const readTips = () => {
  try {
    return JSON.parse(localStorage.getItem(TIPS_KEY) || '{"total":0,"count":0,"tiers":{}}');
  } catch {
    return { total: 0, count: 0, tiers: {} };
  }
};

const writeTips = (data) => {
  try { localStorage.setItem(TIPS_KEY, JSON.stringify(data)); } catch {}
};

export const getTipStats = () => readTips();

export const isSupporter = () => readTips().count > 0;

// Supporter tier badge shown on title screen based on lifetime total.
export const getSupporterBadge = () => {
  const { total } = readTips();
  if (total >= 9.99) return { emoji: '🏆', label: 'LEGEND PATRON', color: '#fbbf24' };
  if (total >= 4.99) return { emoji: '💝', label: 'SUPPORTER',     color: '#ec4899' };
  if (total >= 1.99) return { emoji: '☕', label: 'BACKER',        color: '#a78bfa' };
  return null;
};

const recordTip = (tier) => {
  const data = readTips();
  data.total = Number((data.total + tier.fallbackAmount).toFixed(2));
  data.count += 1;
  data.tiers[tier.id] = (data.tiers[tier.id] || 0) + 1;
  data.lastTipAt = Date.now();
  writeTips(data);
  return data;
};

// ── Public API ──────────────────────────────────────────────────────────────

// Attempt a tip. Returns { status: 'purchased' | 'external' | 'error', ... }
// 'purchased' = native IAP completed. 'external' = opened fallback link. 'error' = failed.
export const tip = async (tier) => {
  const plugin = getIAPPlugin();
  if (plugin) {
    try {
      // Plugin API varies slightly by version — use a forgiving shape.
      const purchase = plugin.purchaseProduct
        ? await plugin.purchaseProduct({ productId: tier.id })
        : plugin.purchase
          ? await plugin.purchase({ productId: tier.id })
          : null;
      if (purchase && (purchase.success || purchase.purchaseToken || purchase.transactionId)) {
        // Consume so the user can tip again later
        try {
          if (plugin.consume) await plugin.consume({ productId: tier.id, purchaseToken: purchase.purchaseToken });
          else if (plugin.finishTransaction) await plugin.finishTransaction({ transactionId: purchase.transactionId });
        } catch {}
        recordTip(tier);
        return { status: 'purchased' };
      }
      return { status: 'error', reason: 'cancelled_or_unknown' };
    } catch (e) {
      return { status: 'error', reason: e?.message || 'iap_error' };
    }
  }
  // Fallback: open external tip page
  try {
    window.open(EXTERNAL_TIP_URL, '_blank', 'noopener,noreferrer');
    // Optimistically record as "external" — don't credit toward supporter badge
    // because we can't verify the transaction actually happened.
    return { status: 'external', url: EXTERNAL_TIP_URL };
  } catch {
    return { status: 'error', reason: 'no_window_open' };
  }
};

// Manual credit — used only by dev/debug path or after verifying an external
// transaction (e.g. via a webhook in the future). Not called by regular flow.
export const creditExternalTip = (tier) => recordTip(tier);
