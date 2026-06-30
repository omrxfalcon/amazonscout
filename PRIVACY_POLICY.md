# Privacy Policy — AmazonScout

**Effective date:** June 30, 2026
**Last updated:** June 30, 2026

---

## 1. Who We Are

AmazonScout ("we", "us", "our") is a Chrome extension that helps Amazon sellers research products by surfacing BSR rankings, estimated sales, FBA fees, and opportunity scores directly on Amazon product pages.

For privacy inquiries, contact us at: **omrx.falcon@gmail.com**

---

## 2. What Data We Collect

### a) Account Information
- **Email address** — collected when you register or sign in. Used solely for authentication and account management.
- **Password** — never stored in plain text. Hashed using bcrypt before being saved to our database.

### b) Product Data
- **Saved products** — if you choose to save a product (Pro feature), we store the ASIN, title, price, BSR, and review count you saved. This data belongs to you and is only accessible by your account.

### c) Usage Data
- We do **not** collect browsing history, Amazon search queries, or any data from pages you visit other than what you explicitly interact with via the extension.
- We do **not** use analytics, tracking pixels, or third-party ad networks.

### d) Payment Information
- Payments are processed by **Stripe**. We never see, store, or transmit your credit card number, CVV, or billing address. Stripe handles all payment data under their own [Privacy Policy](https://stripe.com/privacy). We only store your Stripe subscription status (active / cancelled) to determine your access level.

### e) Local Extension Storage
- A **JWT authentication token** and your email are stored in `chrome.storage.local` on your device. This data never leaves your browser except when making authenticated API requests to our server.
- A **Pro status cache** (valid for 5 minutes) is stored locally to avoid unnecessary network requests.

---

## 3. How We Use Your Data

| Data | Purpose |
|---|---|
| Email address | Account authentication and recovery |
| Hashed password | Verifying your identity on sign-in |
| Saved products | Displaying your saved product list |
| Stripe subscription status | Gating Pro features |
| JWT token (local) | Keeping you signed in between sessions |

We do not sell, rent, or share your personal data with any third party for marketing purposes.

---

## 4. Data Storage and Security

- Your account data is stored in a **Supabase (PostgreSQL)** database hosted on AWS (ap-northeast-2).
- All API communication between the extension and our server uses **HTTPS** (TLS).
- Passwords are hashed with **bcrypt** (cost factor 12) and cannot be reversed.
- Authentication tokens expire after **7 days**.
- Database access is restricted by row-level scoping — you can only access your own data.

---

## 5. Third-Party Services

We use the following third-party services, each governed by their own privacy policies:

| Service | Purpose | Privacy Policy |
|---|---|---|
| **Stripe** | Payment processing and subscription management | [stripe.com/privacy](https://stripe.com/privacy) |
| **Supabase** | Database hosting | [supabase.com/privacy](https://supabase.com/privacy) |
| **Railway** | API server hosting | [railway.app/legal/privacy](https://railway.app/legal/privacy) |

None of these services receive your data for advertising or resale purposes.

---

## 6. Amazon Data

AmazonScout reads publicly visible product information (title, price, BSR, reviews, ratings) from Amazon product pages you visit. This data is:

- Read in real-time from the page and displayed to you
- Only saved to our servers if you explicitly click "Save Product"
- Never sent to any third party

AmazonScout is not affiliated with, endorsed by, or sponsored by Amazon.

---

## 7. Data Retention

- **Account data** is retained for as long as your account is active.
- **Saved products** are retained until you delete them or close your account.
- If you delete your account, all associated data (email, saved products, subscription records) is permanently deleted within 30 days.

To request deletion, email us at **omrx.falcon@gmail.com** with the subject line "Delete My Account".

---

## 8. Your Rights

You have the right to:

- **Access** the personal data we hold about you
- **Correct** inaccurate data
- **Delete** your account and all associated data
- **Export** your saved products list

To exercise any of these rights, contact us at **omrx.falcon@gmail.com**.

---

## 9. Children's Privacy

AmazonScout is intended for use by adults (18+) engaged in Amazon FBA product research. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal data, contact us immediately.

---

## 10. Changes to This Policy

We may update this policy from time to time. We will notify users of material changes by updating the "Last updated" date at the top of this page. Continued use of the extension after changes constitutes acceptance of the revised policy.

---

## 11. Contact

For any privacy-related questions or requests:

**Email:** omrx.falcon@gmail.com
**GitHub:** github.com/omrxfalcon/amazonscout
