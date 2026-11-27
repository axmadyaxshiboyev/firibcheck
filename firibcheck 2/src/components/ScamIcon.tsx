import { BriefcaseBusiness, CreditCard, Gift, Landmark, Link2, Package, ShoppingBag, Smartphone, TrendingUp, Users } from "lucide-react";
import type { ScamType } from "@/lib/scams";

const MAP = { gift: Gift, card: CreditCard, brief: BriefcaseBusiness, trend: TrendingUp, link: Link2, package: Package, phone: Smartphone, users: Users, shop: ShoppingBag, landmark: Landmark };

export function ScamIcon({ name, size = 22 }: { name: ScamType["icon"]; size?: number }) {
  const I = MAP[name];
  return <I size={size} strokeWidth={1.8} />;
}
