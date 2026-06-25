# SafeSnack Electric Pantry UI Redesign

Date: 2026-06-25  
Status: Approved visual direction  
Scope: Frontend presentation only

## 1. Objective

Rebuild SafeSnack's entire visual experience as a distinctive 2026 health-food commerce brand for Hyderabad. The result must feel energetic, trustworthy, tactile, and product-led without resembling a generic beige wellness template or a dark AI landing page.

The redesign covers public storefront, authentication, cart, checkout, account, admin, and staff surfaces. It changes layout, typography, colors, spacing, responsive behavior, components, visual states, animation, and interaction feedback.

It does not change backend logic, database schema, Supabase behavior, Razorpay integration, API routes, analytics events, URLs, form field names, fulfillment logic, product data contracts, or authorization rules.

## 2. Design Read

SafeSnack is a premium but approachable sugar-free snack store serving diabetic, keto, and health-conscious shoppers. Trust and clarity matter as much as appetite appeal.

Visual direction: **Electric Pantry**

- Design variance: 8/10
- Motion intensity: 6/10
- Visual density: 4/10
- Theme: light, cool, high-contrast
- Foundation: Next.js, Tailwind CSS, native CSS, isolated client-side motion
- Character: editorial commerce, playful food tactility, clean nutrition confidence

## 3. Brand System

### Colors

- Frost: `#F4F6F3` - main canvas
- Porcelain: `#FCFDF9` - raised surfaces
- Graphite: `#171916` - primary text and dark controls
- Steel: `#626861` - secondary text
- Mist: `#DDE2DC` - borders and quiet surfaces
- Raspberry: `#E83E62` - single brand accent and primary action
- Success: `#267A53`
- Warning: `#A96110`
- Destructive: `#C62F3B`

Raspberry is the only decorative accent. Semantic colors remain limited to status and validation.

### Typography

- Display: Outfit, 600-800 weights
- Body: Manrope, 400-700 weights
- Utility and numeric data: Manrope with tabular numerals

Headlines use compact tracking and strong line breaks. Body text stays conversational, readable, and restrained. No decorative serif.

### Shape

- Cards and major surfaces: 16px radius
- Inputs and secondary controls: 12px radius
- Buttons, chips, and quantity controls: full pill
- Images may use organic clipped silhouettes only in major brand moments

### Spacing

Use a consistent 4px base scale. Main page gutters:

- Mobile: 16px
- Tablet: 24px
- Desktop: 32px
- Wide desktop content cap: 1440px

Section rhythm ranges from 72px mobile to 128px desktop.

## 4. Signature Visual Device

The memorable brand element is the **Snack Window**: real product photography revealed through oversized, irregular food-inspired masks.

Use it in the homepage hero and one supporting brand section only. It must not become a repeated decorative gimmick.

Behavior:

- Hero image enters with a restrained mask reveal.
- Pointer hover creates slight depth on desktop.
- Scroll changes the mask from expressive to rectangular, visually transitioning from brand story into shopping.
- Mobile uses a static rounded crop.
- Reduced-motion mode renders the final static state immediately.

Real product or brand photography is required. No fake product renders, decorative stock dashboards, or generated package labels.

## 5. Inspiration and Reference Framework

The redesign will study and translate interaction and composition ideas from:

- Awwwards food and drink winners, including image-led restaurant and packaged-food experiences
- Apple product pages and store surfaces
- 21st.dev component collections
- Aceternity UI
- Magic UI
- UIverse
- Other current, widely recognized product and commerce sites where the pattern fits SafeSnack

These sources are references, not a visual identity. Components must be rebuilt inside the Electric Pantry token system and adapted to SafeSnack's content, accessibility needs, performance budget, and commerce flows.

### What to learn from Apple

- Product photography carries the page.
- Each viewport has one dominant message.
- Strong hierarchy comes from scale, spacing, and sequencing instead of decoration.
- Calls to action remain simple and predictable.
- Motion reveals product details and preserves spatial continuity.
- Dense technical or nutritional information is progressively disclosed.
- Every visual effect supports a product story.

SafeSnack will borrow this discipline, not Apple's visual branding, device imagery, blue accent, or exact layouts.

### What to learn from Awwwards food sites

- Appetite appeal through oversized macro photography
- Bold cropping and asymmetric compositions
- Typography that interacts with products without obscuring them
- Distinct section pacing
- Memorable transitions between brand story and commerce
- Strong packaging, texture, and ingredient details
- Confident art direction specific to the food

SafeSnack will avoid slow intro loaders, cursor replacement, inaccessible navigation, excessive scroll hijacking, heavy WebGL, and effects that delay shopping.

### What to learn from component libraries

Potential primitives to reinterpret:

- Direction-aware button fills
- Magnetic hover used on one primary desktop action only
- Spotlight or glare response on featured product surfaces
- Mask and blur reveals
- Shared-layout transitions for selected filters and tabs
- Animated accordions and mobile sheets
- Border highlights for focus and active states
- Skeleton shimmer for real loading states
- Image comparison or before-and-after treatment for ingredient education
- Scroll-aware navigation surface
- Tactile quantity controls
- Accessible toast, alert, and confirmation feedback

No component is copied into the project unchanged. Each pattern must:

1. Solve a real SafeSnack interaction need.
2. Use Electric Pantry colors, type, radius, and spacing.
3. Work with keyboard and touch.
4. Respect reduced motion.
5. Avoid adding a dependency when native CSS or existing React is sufficient.
6. Preserve current application behavior.

### Effects explicitly rejected

- Generic aurora and purple mesh backgrounds
- Border-beam decoration on every card
- Neon outer glows
- Infinite marquees used as filler
- Particle explosions and confetti for ordinary actions
- 3D tilt on every product
- Text scramble that reduces readability
- Animated grids unrelated to food or nutrition
- Glassmorphism across the whole site
- Demo-component aesthetics that compete with products

### Reference-to-SafeSnack mapping

- Apple product reveal becomes the homepage Snack Window reveal.
- Apple comparison clarity becomes ingredient and dietary education.
- Awwwards macro food imagery becomes product-first hero and bundle art direction.
- Awwwards asymmetric layouts become offset Originals and story sections.
- Aceternity and Magic UI spotlight concepts become restrained featured-card hover feedback.
- 21st.dev transition patterns inform mobile navigation, filters, and page continuity.
- UIverse button and input ideas inform tactile controls after accessibility and brand adaptation.

The result must feel authored for SafeSnack. A visitor should not be able to identify which library a component came from.

## 6. Global Experience

### Header

- Single-line desktop navigation under 80px.
- Strong SafeSnack wordmark treatment without changing the company name.
- Shop, Bundles, Diabetic, and Search retain existing routes and labels.
- Account and Cart remain available globally.
- Mobile uses a compact menu sheet with large touch targets.
- Cart has a clear count state when existing data permits it without backend changes.
- Sticky behavior gains a subtle solid surface after scrolling.

### Footer

- Clear shopping, company, contact, and account groupings.
- Strong closing brand statement.
- Existing email, phone, and legal content remain.
- No decorative version labels or fake location metadata.

### Page transitions

- 180-320ms opacity and vertical movement.
- Route changes retain spatial continuity.
- No scroll hijacking.
- All motion uses transform and opacity.
- Reduced-motion preference disables nonessential transitions.

### Accessibility

- WCAG AA text and control contrast.
- Visible focus states.
- Minimum 44px touch targets.
- Keyboard-operable navigation and controls.
- Existing skip link retained.
- Semantic heading order retained or improved.
- Motion and transparency fallbacks included.

## 7. Public Storefront

### Homepage

The homepage becomes a product-first editorial journey:

1. Asymmetric hero with Snack Window photography, concise value proposition, Shop snacks primary action, and Bundles secondary action.
2. Compact trust strip for sugar-free, diabetic-friendly, nutritionist-approved, and Hyderabad delivery claims.
3. SafeSnack Originals in an offset product grid.
4. Ingredient transparency section using a compare-and-replace interaction for banned ingredients and preferred alternatives.
5. Dietary discovery using four distinct visual tiles, not equal generic cards.
6. Bundle feature using a wide product composition.
7. Brand proof and company story with real photography.
8. Instagram-inspired content rail based only on verified content or clearly marked CMS content.
9. FAQ accordion.
10. Closing shopping action.

Unverified claims and invented social engagement numbers must not be presented as facts.

### Product catalog

- Editorial heading and active-filter summary.
- Desktop filter rail with clear selected states.
- Mobile filter drawer or horizontal control row.
- Responsive two-column mobile and three/four-column desktop product grid where space permits.
- Empty state provides a direct reset action.
- URL query behavior remains unchanged.

### Product card

- Photography leads.
- Dietary information moves below or beside imagery, never overlaid as decorative pills.
- Product name and price have strong hierarchy.
- House-brand indication stays subtle but visible.
- Hover reveals a controlled image zoom and directional action feedback.
- Missing imagery receives a deliberate branded fallback.

### Product detail

- Asymmetric gallery and purchase panel.
- Sticky purchase panel on desktop.
- Variant, stock, price, quantity, wishlist, and add-to-cart behavior remain unchanged.
- Dietary facts, storytelling, ingredients, reviews, and frequently bought together gain distinct section layouts.
- Mobile keeps the primary purchase action easy to reach.

### Bundles and search

- Bundles use broader image-led compositions.
- Search gains a prominent accessible field, recent or helpful empty-state guidance using existing data only, and the shared product grid.

## 8. Cart and Checkout

### Cart

- Two-column desktop layout: cart lines and sticky order summary.
- Mobile uses stacked cart lines with clear quantity controls.
- Checkout remains the primary action.
- WhatsApp ordering remains secondary.
- Empty cart becomes a purposeful return-to-shop state.

### Checkout

- Existing fields, order, validation, points, coupons, payment flow, and event tracking remain untouched.
- Visual grouping clarifies delivery details, order review, rewards, and payment.
- Desktop summary stays visible while completing details.
- Inline errors stay adjacent to fields.
- Loading and disabled states prevent duplicate submission.

## 9. Authentication and Account

### Authentication

- Focused split composition with brand photography on desktop.
- Single-column form on mobile.
- Labels remain visible.
- Login and signup logic remains untouched.

### Account

- Consistent account navigation.
- Overview prioritizes rewards, recent orders, addresses, wishlist, and referrals.
- Orders use readable status treatments and mobile-friendly layouts.
- Address, profile, wishlist, and referral screens reuse the shared form and surface system.
- Empty states always include a useful next action.

## 10. Admin and Staff

Marketing styling will not be forced onto operational screens. Admin and staff use the same typography, color tokens, controls, and accessibility rules, but with lower variance and higher density.

- Desktop sidebar and compact mobile navigation.
- Data surfaces use restrained borders rather than decorative cards.
- Tables remain readable and horizontally safe.
- Forms use clear sections, labels, helper text, and validation states.
- Revenue, funnel, inventory, orders, products, coupons, homepage CMS, users, and reviews retain existing data and actions.
- Destructive actions remain clearly separated.
- Staff order and inventory workflows prioritize speed and status clarity.

## 11. Component System

Shared frontend components:

- Button variants: primary, secondary, quiet, destructive
- Icon button
- Input, select, textarea, checkbox, radio
- Filter control and chip
- Product card
- Surface and section shell
- Empty state
- Skeleton
- Inline alert
- Status badge
- Quantity control
- Accordion
- Mobile navigation sheet
- Dialog or confirmation surface where already needed

Components use semantic CSS tokens. No backend-aware abstraction is introduced.

## 12. Motion and Interaction

Motion communicates hierarchy, feedback, or state:

- Hero Snack Window reveal
- Section entrance for key content only
- Product image hover zoom
- Button press scale
- Filter state crossfade
- Accordion expand and collapse
- Mobile menu transition
- Cart quantity feedback
- Page transition

No perpetual decorative animation, parallax-heavy scenes, WebGL, custom cursor, multiple marquees, or scroll hijacking.

Motion quality target:

- Interaction feedback begins within 100ms.
- Standard transitions use 180-280ms.
- Larger composition changes may use up to 420ms.
- Entrances use deceleration.
- Exits are shorter than entrances.
- Animations remain interruptible.
- Nothing blocks clicking, scrolling, or purchasing.

## 13. Responsive Rules

- 375px is the minimum test width.
- High-variance layouts collapse to one column below 768px.
- Product grids may remain two columns when cards stay readable.
- Navigation never wraps.
- No horizontal page overflow.
- Sticky elements become normal-flow content when mobile space is limited.
- Forms use 16px minimum input text.
- Landscape mobile remains operable.

## 14. Preservation Contract

The implementation must preserve:

- All route paths and query parameters
- API routes and payload shapes
- Supabase clients, queries, RLS, and schema
- Razorpay and checkout behavior
- Cart storage behavior
- Authentication and role checks
- Analytics event names and triggers
- SEO metadata, JSON-LD, sitemap, and robots behavior
- Form field names, required fields, and submission order
- Existing product, CMS, review, wishlist, reward, referral, inventory, and order logic

Only presentation code and frontend-only interaction wrappers may change.

## 15. Verification

Before completion:

- `npm test`
- `npm run build`
- Browser smoke test of public, auth, account, admin, and staff routes
- Visual checks at 375px, 768px, 1024px, and 1440px
- Keyboard navigation test
- Reduced-motion test
- Empty, loading, error, disabled, hover, focus, and active states
- Confirm no backend, API, database, query, or schema files changed
- Confirm no broken routes or renamed analytics events
- Check visible copy for unsupported claims and AI-style filler
- Compare final screenshots against the approved Electric Pantry direction and reference principles
- Confirm borrowed interaction patterns no longer resemble library defaults
- Verify LCP, CLS, and interaction responsiveness are not harmed by visual effects

## 16. Quality and Popularity Goal

The ambition is an Apple-level standard of clarity, polish, memorability, and product storytelling. Design alone cannot guarantee popularity, traffic, awards, sales, or cultural reach. Those outcomes also require strong products, original photography, brand assets, marketing, SEO, distribution, and continuous testing.

The UI contribution toward that goal is measurable:

- A recognizable visual signature
- Clear first-viewport value proposition
- Fast route and interaction response
- High-quality mobile experience
- Strong product photography placement
- Consistent interaction language
- Accessible commerce flows
- Shareable page moments without gimmicks
- Technical performance suitable for search and conversion

## 17. Success Criteria

The redesign succeeds when:

- SafeSnack is visually recognizable without relying on generic wellness conventions.
- Product photography and shopping actions dominate the experience.
- Users can understand dietary suitability and purchase confidently.
- Storefront feels expressive while checkout and operations remain calm and clear.
- Mobile usability matches desktop quality.
- Existing application behavior and backend contracts remain intact.
