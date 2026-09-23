# Surevolt Security Specification & Hardened Test Suite

## 1. Data Invariants

1. **Identity & Authentication Invariant**:
   - Administrative mutations to pricing, settings, catalog, and order status transitions require verified administrator authorization (`chrisaka141@gmail.com` or presence in `/admins/{uid}`).
2. **Order Immutability & Price Integrity**:
   - Clients cannot arbitrarily alter order statuses, bypass delivery fees, or rewrite order history once placed. Overhaul adjustments are strictly administered through workshop inspection logs.
3. **Public Readability with Mutation Restriction**:
   - Equipment catalog (`/products`) and business operational settings (`/settings`) are publicly queryable for real-time customer transparency, while writes require strict admin privilege.
4. **Order Tracking Access**:
   - Customers can create repair orders and look up their specific order timeline via order ID / order number. Bulk listing is restricted to admins or authenticated users listing their own orders.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (Ghost Admin Injection)**: Non-admin user attempts writing to `/admins/{attackerUid}` to elevate privileges.
2. **Payload 2 (Catalog Price Tampering)**: Unauthenticated or non-admin user attempts writing a generator price of ₦10 to `/products/prod-1`.
3. **Payload 3 (Business Settings Wipeout)**: Malicious user attempts modifying `/settings/general` to fake working hours or contact phone numbers.
4. **Payload 4 (Mass Order Scraping / Unrestricted List)**: Unauthenticated user attempting blanket `list` of all customer repair orders.
5. **Payload 5 (Order Status Spoofing)**: Customer attempting to update their own order status directly to `ready_delivered` without engineer sign-off.
6. **Payload 6 (Total Amount Zeroing)**: Customer updating an active order `totalAmount` to 0.
7. **Payload 7 (ID Poisoning Attack)**: Document creation with a 2KB malicious regex-violating document ID.
8. **Payload 8 (Oversized Description Denial of Wallet)**: Injection of 500KB string payload into `issueDescription`.
9. **Payload 9 (Sell Request Offer Tampering)**: Customer attempting to update `offeredPrice` on their own trade-in request.
10. **Payload 10 (Delete Catalog Item)**: Non-admin sending `delete` request to `/products/{productId}`.
11. **Payload 11 (Shadow Field Injection)**: Creating a product document containing an unauthorized system bypass attribute `isVerifiedAdmin: true`.
12. **Payload 12 (Cross-User Profile Hijack)**: User A attempting to update or delete User B's document in `/users/{userB}`.
