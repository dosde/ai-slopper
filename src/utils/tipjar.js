// Supporter Tip Jar
// ─────────────────────────────────────────────────────────────────
// Routing:
//   1. Native (Capacitor + RevenueCat SDK initialised) — real IAP via Play / App Store
//   2. Web / PWA / Capacitor without RevenueCat configured — opens external link
//
// Wire-up:
//   npm install @revenuecat/purchases-capacitor
//   Set VITE_REVENUECAT_ANDROID_KEY / VITE_REVENUECAT_IOS_KEY in .env
//   Configure products with IDs tip_small / tip_medium / tip_large in
//   Play Console + App Store Connect + RevenueCat dashboard.
//   initIAP() is called once from main.jsx on app boot.

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

// RevenueCat SDK cache — loaded on demand so the web bundle doesn't import
// native-only modules at build time.
let _rcPromise = null;
const loadRevenueCat = () => {
  if (!isCapacitorNative()) return Promise.resolve(null);
  if (_rcPromise) return _rcPromise;
  _rcPromise = import(
    /* @vite-ignore */
    '@revenuecat/purchases-capacitor'
  ).then(mod => mod?.Purchases || null).catch(() => null);
  return _rcPromise;
};

// Track SDK configuration status — must call Purchases.configure() once before
// any other API. initIAP() below sets this.
let _iapReady = false;

// Cache the three StoreProduct objects once fetched. RevenueCat requires the
// actual StoreProduct (not just an ID) to be passed to purchaseStoreProduct().
const _productCache = new Map(); // productId -> StoreProduct

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

// Called once from main.jsx on app boot. No-op on web.
// Picks the right RevenueCat API key based on platform.
export const initIAP = async () => {
  if (!isCapacitorNative()) return;
  const Purchases = await loadRevenueCat();
  if (!Purchases) return;
  try {
    const platform = window.Capacitor?.getPlatform?.() ?? 'android';
    const apiKey = platform === 'ios'
      ? import.meta.env.VITE_REVENUECAT_IOS_KEY
      : import.meta.env.VITE_REVENUECAT_ANDROID_KEY;
    if (!apiKey) return; // no key configured → fall back to external URL
    await Purchases.configure({ apiKey });
    _iapReady = true;
    // Pre-fetch products so the first tap doesn't need to round-trip the store.
    try {
      const ids = TIP_TIERS.map(t => t.id);
      const res = await Purchases.getProducts({ productIdentifiers: ids });
      const products = res?.products ?? res ?? [];
      for (const p of products) _productCache.set(p.identifier, p);
    } catch { /* non-fatal; we'll retry at purchase time */ }
  } catch { /* swallow; tip() will fall back to external URL */ }
};

// Attempt a tip. Returns { status: 'purchased' | 'external' | 'cancelled' | 'error', ... }
export const tip = async (tier) => {
  if (isCapacitorNative() && _iapReady) {
    const Purchases = await loadRevenueCat();
    if (Purchases) {
      try {
        let product = _productCache.get(tier.id);
        if (!product) {
          const res = await Purchases.getProducts({ productIdentifiers: [tier.id] });
          const products = res?.products ?? res ?? [];
          product = products[0];
          if (product) _productCache.set(tier.id, product);
        }
        if (!product) return { status: 'error', reason: 'product_not_found' };

        const purchase = await Purchases.purchaseStoreProduct({ product });
        // RevenueCat responses vary by platform; accept any truthy transaction indicator.
        const ok = !!(purchase?.transaction || purchase?.customerInfo || purchase?.productIdentifier);
        if (ok) {
          recordTip(tier);
          return { status: 'purchased' };
        }
        return { status: 'error', reason: 'unknown_result' };
      } catch (e) {
        // RevenueCat throws with userCancelled flag on cancel
        if (e?.userCancelled || e?.code === 'PURCHASE_CANCELLED') {
          return { status: 'cancelled' };
        }
        return { status: 'error', reason: e?.message || 'iap_error' };
      }
    }
  }
  // Fallback: open external tip page (web, or native without RevenueCat configured)
  try {
    window.open(EXTERNAL_TIP_URL, '_blank', 'noopener,noreferrer');
    return { status: 'external', url: EXTERNAL_TIP_URL };
  } catch {
    return { status: 'error', reason: 'no_window_open' };
  }
};

// Manual credit — used only by dev/debug path or after verifying an external
// transaction (e.g. via a webhook in the future). Not called by regular flow.
export const creditExternalTip = (tier) => recordTip(tier);
