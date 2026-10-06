/**
 * Clients — content/clients.ts
 *
 * Powers the "Trusted by" strip on the home page. Add real clients here and the
 * strip appears; while this list is empty it stays hidden on the live site (in
 * development it shows clearly marked placeholders so the layout can be previewed).
 *
 * For each client:
 *   name  — shown as text if there is no logo, and used as the logo's alt text
 *   logo  — optional path under /public, e.g. "/images/clients/acme.svg"
 *           (use a single-colour logo on a transparent background; SVG or PNG)
 *   href  — optional link to their site
 */

export interface Client {
  name: string;
  logo?: string;
  href?: string;
}

export const clients: Client[] = [];
