import { appLink } from './site'
import { t } from './strings'

export interface NavItem {
  label: string
  href: string
  /** Links to another site; rendered with the external-link icon. */
  external?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

/** Header menus. Every item points at the KK Trip app site, so each is external. */
export const navGroups: NavGroup[] = [
  {
    label: t.navProduct,
    items: [
      { label: t.navHow, href: appLink('/#how'), external: true },
      { label: t.navFeatures, href: appLink('/#features'), external: true },
      { label: t.navMarketplace, href: appLink('/marketplace'), external: true },
    ],
  },
  {
    label: t.navResources,
    items: [
      { label: t.navSupport, href: appLink('/support'), external: true },
      { label: t.navPrivacy, href: appLink('/privacy'), external: true },
      { label: t.navTerms, href: appLink('/terms'), external: true },
    ],
  },
]
