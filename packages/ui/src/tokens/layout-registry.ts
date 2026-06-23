/**
 * Layout Registry -- 51 layout recipes as data
 *
 * Each entry maps a LayoutStructure name to a complete recipe:
 *   - CSS grid-template configuration (columns, rows, areas)
 *   - Named regions (slots) for content injection
 *   - Responsive breakpoints (mobile, tablet, desktop)
 *   - Context metadata (bestFor, conflicts, category)
 *   - ASCII preview for visual reference
 *
 * Used by:
 *   - <Layout structure="holy-grail"> component
 *   - useLayoutAdvice() hook
 *   - Component Browser preview
 */

import type {
  LayoutRecipe,
  LayoutStructure,
} from './types'

// ─── Classic Layouts (10) ─────────────────────────────────────

const sidebarLeft: LayoutRecipe = {
  structure: 'sidebar-left',
  name: 'Sidebar Left',
  description: 'Fixed-width sidebar on the left with flexible content area. The most common app layout pattern, used by admin panels, documentation sites, and IDEs.',
  category: 'classic',
  bestFor: ['admin-panel', 'dashboard-app', 'documentation'],
  conflicts: ['landing', 'portfolio'],
  techNotes: 'sidebar-left uses CSS Grid with a fixed first column. On mobile, the sidebar collapses into a sheet/overlay. Requires a sidebar toggle for small screens.',
  regions: [
    { name: 'sidebar', required: true, minHeight: '100%' },
    { name: 'main', required: true },
  ],
  gridTemplate: {
    columns: '280px 1fr',
    rows: '1fr',
    areas: ['sidebar main'],
  },
  gridTemplateTablet: {
    columns: '240px 1fr',
    rows: '1fr',
    areas: ['sidebar main'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: '1fr',
    areas: ['main'],
  },
  gap: 'none',
  minHeight: '100vh',
  preview: '+-------+-------------------+\n|       |                   |\n| SIDE  |     MAIN          |\n| BAR   |     CONTENT        |\n|       |                   |\n+-------+-------------------+',
}

const sidebarRight: LayoutRecipe = {
  structure: 'sidebar-right',
  name: 'Sidebar Right',
  description: 'Flexible content area with a fixed-width sidebar on the right. Common for detail panels, property editors, and chat layouts where supplementary info sits beside primary content.',
  category: 'classic',
  bestFor: ['admin-panel', 'dashboard-app', 'documentation'],
  conflicts: ['landing', 'portfolio'],
  techNotes: 'Mirror of sidebar-left. The right sidebar often holds context-dependent tools (property panels, chat members, filters).',
  regions: [
    { name: 'main', required: true },
    { name: 'sidebar', required: true, minHeight: '100%' },
  ],
  gridTemplate: {
    columns: '1fr 280px',
    rows: '1fr',
    areas: ['main sidebar'],
  },
  gridTemplateTablet: {
    columns: '1fr 240px',
    rows: '1fr',
    areas: ['main sidebar'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: '1fr',
    areas: ['main'],
  },
  gap: 'none',
  minHeight: '100vh',
  preview: '+-------------------+-------+\n|                   |       |\n|     MAIN          | SIDE  |\n|     CONTENT        | BAR   |\n|                   |       |\n+-------------------+-------+',
}

const topNav: LayoutRecipe = {
  structure: 'top-nav',
  name: 'Top Navigation',
  description: 'Horizontal navigation bar at the top with content below. The simplest full-page layout, used by landing pages, blogs, and marketing sites.',
  category: 'classic',
  bestFor: ['landing', 'blog', 'portfolio', 'documentation'],
  conflicts: ['dashboard-app'],
  techNotes: 'Header is sticky by default. Content area uses Container for max-width constraint. Footer is optional.',
  regions: [
    { name: 'header', required: true, minHeight: '56px' },
    { name: 'main', required: true },
    { name: 'footer' },
  ],
  gridTemplate: {
    columns: '1fr',
    rows: 'auto 1fr auto',
    areas: ['header', 'main', 'footer'],
  },
  gridTemplateTablet: {
    columns: '1fr',
    rows: 'auto 1fr auto',
    areas: ['header', 'main', 'footer'],
  },
  gap: 'none',
  minHeight: '100vh',
  preview: '+---------------------------+\n|         HEADER            |\n+---------------------------+\n|                           |\n|       MAIN CONTENT        |\n|                           |\n+---------------------------+\n|         FOOTER            |\n+---------------------------+',
}

const twoColumns: LayoutRecipe = {
  structure: 'two-columns',
  name: 'Two Columns',
  description: 'Two equal-width columns side by side. Ideal for comparison views, split content, and side-by-side forms.',
  category: 'classic',
  bestFor: ['landing', 'documentation', 'portfolio'],
  conflicts: [],
  techNotes: 'Equal 50/50 split. For unequal splits, use asymmetric-grid instead. On mobile, columns stack vertically.',
  regions: [
    { name: 'left', required: true },
    { name: 'right', required: true },
  ],
  gridTemplate: {
    columns: '1fr 1fr',
    rows: '1fr',
    areas: ['left right'],
  },
  gridTemplateTablet: {
    columns: '1fr 1fr',
    rows: '1fr',
    areas: ['left right'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto',
    areas: ['left', 'right'],
  },
  gap: 'lg',
  preview: '+-------------+-------------+\n|             |             |\n|    LEFT     |    RIGHT    |\n|             |             |\n+-------------+-------------+',
}

const threeColumns: LayoutRecipe = {
  structure: 'three-columns',
  name: 'Three Columns',
  description: 'Three equal-width columns. Used for master-detail patterns, triple-panel layouts, and product comparison views.',
  category: 'classic',
  bestFor: ['admin-panel', 'dashboard-app', 'documentation'],
  conflicts: ['landing'],
  techNotes: 'Classic master-detail-detail pattern. On tablet, collapses to two columns. On mobile, single column.',
  regions: [
    { name: 'left', required: true },
    { name: 'center', required: true },
    { name: 'right', required: true },
  ],
  gridTemplate: {
    columns: '1fr 1fr 1fr',
    rows: '1fr',
    areas: ['left center right'],
  },
  gridTemplateTablet: {
    columns: '1fr 1fr',
    rows: '1fr 1fr',
    areas: ['left center', 'right right'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto',
    areas: ['left', 'center', 'right'],
  },
  gap: 'md',
  preview: '+---------+---------+---------+\n|         |         |         |\n|  LEFT   | CENTER  |  RIGHT  |\n|         |         |         |\n+---------+---------+---------+',
}

const holyGrail: LayoutRecipe = {
  structure: 'holy-grail',
  name: 'Holy Grail',
  description: 'The classic web layout: header, left sidebar, main content, right sidebar, footer. Named for being historically difficult in CSS before Grid. Now trivially achieved with grid-template-areas.',
  category: 'classic',
  bestFor: ['documentation', 'blog', 'ecommerce'],
  conflicts: [],
  techNotes: 'The Holy Grail layout is the gold standard for content-heavy sites. Both sidebars are fixed-width, content is fluid. On tablet, right sidebar drops below. On mobile, both sidebars collapse.',
  regions: [
    { name: 'header', required: true, minHeight: '56px' },
    { name: 'sidebar', required: true },
    { name: 'main', required: true },
    { name: 'aside' },
    { name: 'footer' },
  ],
  gridTemplate: {
    columns: '240px 1fr 240px',
    rows: 'auto 1fr auto',
    areas: [
      'header header header',
      'sidebar main aside',
      'footer footer footer',
    ],
  },
  gridTemplateTablet: {
    columns: '220px 1fr',
    rows: 'auto 1fr auto auto',
    areas: [
      'header header',
      'sidebar main',
      'aside aside',
      'footer footer',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto auto auto',
    areas: ['header', 'main', 'sidebar', 'aside', 'footer'],
  },
  gap: 'none',
  minHeight: '100vh',
  preview: '+-----------------------------+\n|          HEADER             |\n+-------+-------------+-------+\n|       |             |       |\n| SIDE  |    MAIN     | ASIDE |\n|       |             |       |\n+-------+-------------+-------+\n|          FOOTER             |\n+-----------------------------+',
}

const splitScreen: LayoutRecipe = {
  structure: 'split-screen',
  name: 'Split Screen',
  description: 'Two equal halves of the viewport. Perfect for hero sections with text on one side and image/illustration on the other, or side-by-side feature comparisons.',
  category: 'classic',
  bestFor: ['landing', 'portfolio', 'ecommerce'],
  conflicts: ['admin-panel', 'dashboard-app'],
  techNotes: 'Each half takes 50vh by default. On mobile, they stack vertically with each half taking 50vh.',
  regions: [
    { name: 'left', required: true },
    { name: 'right', required: true },
  ],
  gridTemplate: {
    columns: '1fr 1fr',
    rows: '100vh',
    areas: ['left right'],
  },
  gridTemplateTablet: {
    columns: '1fr 1fr',
    rows: '80vh',
    areas: ['left right'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: '50vh 50vh',
    areas: ['left', 'right'],
  },
  gap: 'none',
  preview: '+-------------+-------------+\n|             |             |\n|             |             |\n|    LEFT     |    RIGHT    |\n|             |             |\n|             |             |\n+-------------+-------------+',
}

const cardsGrid: LayoutRecipe = {
  structure: 'cards-grid',
  name: 'Cards Grid',
  description: 'Responsive grid of equal-sized card slots. The most common layout pattern -- used for product listings, component browsers, blog archives, and any collection of items.',
  category: 'classic',
  bestFor: ['landing', 'ecommerce', 'blog', 'portfolio'],
  conflicts: [],
  techNotes: 'Auto-fill grid: columns adjust automatically. On mobile 1 column, tablet 2, desktop 3-4. Use with SearchableFilterableGrid for search+filter+grid.',
  regions: [
    { name: 'header' },
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: 'repeat(auto-fill, minmax(280px, 1fr))',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: 'repeat(auto-fill, minmax(240px, 1fr))',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'lg',
  preview: '+-------+-------+-------+\n| CARD  | CARD  | CARD  |\n+-------+-------+-------+\n| CARD  | CARD  | CARD  |\n+-------+-------+-------+',
}

const magazine: LayoutRecipe = {
  structure: 'magazine',
  name: 'Magazine',
  description: 'Editorial layout with a large hero/featured area spanning full width, then a 2-column content area below. Used by news sites, blogs, and editorial landing pages.',
  category: 'classic',
  bestFor: ['blog', 'landing', 'documentation'],
  conflicts: ['admin-panel', 'dashboard-app'],
  techNotes: 'Hero spans full width, then two columns for article previews. A classic newspaper-style layout.',
  regions: [
    { name: 'hero', required: true },
    { name: 'primary', required: true },
    { name: 'secondary', required: true },
  ],
  gridTemplate: {
    columns: '1fr 1fr',
    rows: 'auto auto',
    areas: [
      'hero hero',
      'primary secondary',
    ],
  },
  gridTemplateTablet: {
    columns: '1fr 1fr',
    rows: 'auto auto',
    areas: [
      'hero hero',
      'primary secondary',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto',
    areas: ['hero', 'primary', 'secondary'],
  },
  gap: 'lg',
  preview: '+---------------------------+\n|          HERO             |\n|   (featured content)      |\n+-------------+-------------+\n|  PRIMARY    |  SECONDARY  |\n+-------------+-------------+',
}

const fullscreenHero: LayoutRecipe = {
  structure: 'fullscreen-hero',
  name: 'Fullscreen Hero',
  description: 'A single centered content area filling the entire viewport. Used for splash pages, coming-soon screens, login pages, and dramatic single-focus presentations.',
  category: 'classic',
  bestFor: ['landing', 'portfolio'],
  conflicts: ['admin-panel', 'dashboard-app'],
  techNotes: 'The entire viewport is one centered container. Content is vertically and horizontally centered using place-items: center.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: '1fr',
    rows: '100vh',
    areas: ['content'],
  },
  gridTemplateTablet: {
    columns: '1fr',
    rows: '100vh',
    areas: ['content'],
  },
  gap: 'none',
  preview: '+---------------------------+\n|                           |\n|                           |\n|      [CENTERED]           |\n|      CONTENT              |\n|                           |\n|                           |\n+---------------------------+',
}

// ─── Bento Layouts (4) ────────────────────────────────────────

const bentoGrid: LayoutRecipe = {
  structure: 'bento-grid',
  name: 'Bento Grid',
  description: 'Variable-size grid items in a compact bento-box arrangement. Items span different numbers of columns and rows, creating a dynamic dashboard-style layout.',
  category: 'bento',
  bestFor: ['dashboard-app', 'landing', 'portfolio'],
  conflicts: [],
  techNotes: 'Uses grid with auto-rows and explicit colSpan/rowSpan on children. Items declare their own size. Named after Japanese bento boxes.',
  regions: [
    { name: 'hero', required: true },
    { name: 'card-1' },
    { name: 'card-2' },
    { name: 'card-3' },
    { name: 'card-4' },
    { name: 'card-5' },
  ],
  gridTemplate: {
    columns: 'repeat(4, 1fr)',
    rows: 'repeat(3, 80px)',
    areas: [
      'hero hero card-1 card-2',
      'hero hero card-3 card-4',
      'card-5 card-5 card-5 card-5',
    ],
  },
  gridTemplateTablet: {
    columns: 'repeat(2, 1fr)',
    rows: 'repeat(4, 80px)',
    areas: [
      'hero hero',
      'hero hero',
      'card-1 card-2',
      'card-3 card-4',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+-------+-------+---+---+\n|       |       | 1 | 2 |\n| HERO  | HERO  +---+---+\n|       |       | 3 | 4 |\n+-------+-------+---+---+\n|     WIDE CARD 5       |\n+-----------------------+',
}

const bentoSidebar: LayoutRecipe = {
  structure: 'bento-sidebar',
  name: 'Bento Sidebar',
  description: 'Fixed sidebar on the left with a bento-style content grid on the right. Combines navigation stability with visual variety in the content area.',
  category: 'bento',
  bestFor: ['dashboard-app', 'admin-panel'],
  conflicts: ['landing', 'portfolio'],
  techNotes: 'Sidebar is fixed width, right side uses bento grid areas. Good for dashboards where the sidebar has navigation and the main area has varied widgets.',
  regions: [
    { name: 'sidebar', required: true },
    { name: 'hero' },
    { name: 'card-1' },
    { name: 'card-2' },
    { name: 'card-3' },
  ],
  gridTemplate: {
    columns: '240px repeat(3, 1fr)',
    rows: 'repeat(2, 100px)',
    areas: [
      'sidebar hero hero card-1',
      'sidebar card-2 card-3 card-3',
    ],
  },
  gridTemplateTablet: {
    columns: '200px 1fr 1fr',
    rows: 'repeat(2, 100px)',
    areas: [
      'sidebar hero card-1',
      'sidebar card-2 card-3',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  minHeight: '100vh',
  preview: '+-------+-------+-------+---+\n|       | HERO  | HERO  | 1 |\n| SIDE  +-------+-------+---+\n| BAR   |   2   |   3   | 3 |\n+-------+-------+-------+---+',
}

const bentoHero: LayoutRecipe = {
  structure: 'bento-hero',
  name: 'Bento Hero',
  description: 'Large hero section on top with a bento grid of feature cards below. Common for product landing pages where the hero communicates the main message and cards show features.',
  category: 'bento',
  bestFor: ['landing', 'portfolio'],
  conflicts: ['admin-panel'],
  techNotes: 'Hero takes full width, cards below in bento arrangement. A popular SaaS landing page pattern.',
  regions: [
    { name: 'hero', required: true },
    { name: 'feature-1' },
    { name: 'feature-2' },
    { name: 'feature-3' },
    { name: 'feature-4' },
  ],
  gridTemplate: {
    columns: 'repeat(4, 1fr)',
    rows: 'auto repeat(2, 80px)',
    areas: [
      'hero hero hero hero',
      'feature-1 feature-1 feature-2 feature-3',
      'feature-4 feature-4 feature-2 feature-3',
    ],
  },
  gridTemplateTablet: {
    columns: '1fr 1fr',
    rows: 'auto auto auto',
    areas: [
      'hero hero',
      'feature-1 feature-2',
      'feature-3 feature-4',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+---------------------------+\n|          HERO             |\n+-------+-------+---+-------+\n|  F1   |  F1   | F2| F3    |\n+-------+-------+   |       |\n|  F4   |  F4   +---+-------+\n+-------+-------+-----------+',
}

const bentoMasonry: LayoutRecipe = {
  structure: 'bento-masonry',
  name: 'Bento Masonry',
  description: 'Bento grid where items flow in a masonry pattern (top-to-bottom, then left-to-right). Combines the size variety of bento with the dense packing of masonry.',
  category: 'bento',
  bestFor: ['portfolio', 'landing', 'blog'],
  conflicts: ['admin-panel'],
  techNotes: 'Uses CSS columns for masonry flow with break-inside: avoid on items. Items can have varying heights.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: 'repeat(3, 1fr)',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: 'repeat(2, 1fr)',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+-------+-------+-------+\n| AAA   | BB    | C     |\n| AAA   |       +-------+\n| AAA   +-------+ DDD   |\n+-------+ EEE   | DDD   |\n| FF    | EEE   +-------+\n+-------+-------+ GGG   |',
}

// ─── Artistic Layouts (7) ─────────────────────────────────────

const masonryGrid: LayoutRecipe = {
  structure: 'masonry-grid',
  name: 'Masonry Grid',
  description: 'Pinterest-style layout where items of varying heights pack tightly. Content flows top-to-bottom within columns, then left-to-right. Ideal for image galleries, portfolios, and card feeds.',
  category: 'artistic',
  bestFor: ['portfolio', 'blog', 'ecommerce', 'landing'],
  conflicts: ['admin-panel', 'dashboard-app'],
  techNotes: 'Uses CSS column-count for true masonry. Items need break-inside: avoid. Column-first order means items flow vertically then wrap to next column.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: 'repeat(3, 1fr)',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: 'repeat(2, 1fr)',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+---+---+---+\n| A | D | G |\n| A | D |   |\n|   | E | H |\n| B |   |   |\n| B | F | I |\n|   |   | I |\n| C |   |   |\n| C |   |   |\n+---+---+---+',
}

const asymmetricGrid: LayoutRecipe = {
  structure: 'asymmetric-grid',
  name: 'Asymmetric Grid',
  description: 'Two columns with unequal widths (2:1 ratio). The larger column holds primary content, the smaller holds secondary info. More visually interesting than equal splits.',
  category: 'artistic',
  bestFor: ['landing', 'blog', 'portfolio', 'documentation'],
  conflicts: [],
  techNotes: '2:1 ratio using 2fr 1fr. On mobile, stacks with primary content first.',
  regions: [
    { name: 'primary', required: true },
    { name: 'secondary', required: true },
  ],
  gridTemplate: {
    columns: '2fr 1fr',
    rows: '1fr',
    areas: ['primary secondary'],
  },
  gridTemplateTablet: {
    columns: '2fr 1fr',
    rows: '1fr',
    areas: ['primary secondary'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto',
    areas: ['primary', 'secondary'],
  },
  gap: 'lg',
  preview: '+-------------------+-----------+\n|                   |           |\n|    PRIMARY        | SECONDARY |\n|    (2/3 width)    | (1/3)     |\n|                   |           |\n+-------------------+-----------+',
}

const spanGrid: LayoutRecipe = {
  structure: 'span-grid',
  name: 'Span Grid',
  description: 'Regular grid where specific items span multiple columns or rows. Used for featured items in a product grid, highlighted cards, and editorial layouts with emphasis.',
  category: 'artistic',
  bestFor: ['ecommerce', 'landing', 'blog'],
  conflicts: ['admin-panel'],
  techNotes: '3-column grid with one item spanning 2 columns. The featured item gets visual emphasis through size.',
  regions: [
    { name: 'featured', required: true },
    { name: 'card-1' },
    { name: 'card-2' },
    { name: 'card-3' },
    { name: 'card-4' },
  ],
  gridTemplate: {
    columns: 'repeat(3, 1fr)',
    rows: 'auto auto',
    areas: [
      'featured featured card-1',
      'card-2 card-3 card-4',
    ],
  },
  gridTemplateTablet: {
    columns: '1fr 1fr',
    rows: 'auto auto auto',
    areas: [
      'featured featured',
      'card-1 card-2',
      'card-3 card-4',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+-------------------+---+\n|   FEATURED        | 1 |\n|   (spans 2 cols)  +---+\n+-----+-----+-------+\n|  2  |  3  |   4       |\n+-----+-----+-----------+',
}

const overlapGrid: LayoutRecipe = {
  structure: 'overlap-grid',
  name: 'Overlap Grid',
  description: 'Grid where items intentionally overlap, creating layered depth effects. Used for creative portfolios, hero sections, and artistic showcases.',
  category: 'artistic',
  bestFor: ['portfolio', 'landing'],
  conflicts: ['admin-panel', 'dashboard-app', 'ecommerce'],
  techNotes: 'Uses negative margins or CSS grid overlap (items share the same grid cells). Requires z-index management.',
  regions: [
    { name: 'background', required: true },
    { name: 'foreground', required: true },
  ],
  gridTemplate: {
    columns: '1fr 1fr',
    rows: '1fr',
    areas: ['background foreground'],
  },
  gridTemplateTablet: {
    columns: '1fr 1fr',
    rows: '1fr',
    areas: ['background foreground'],
  },
  gap: 'none',
  preview: '+---------------+\n|  BG  |  FG    |\n|    +--+--+    |\n|    |  |  |    |\n|    +--+--+    |\n+---------------+',
}

const honeycombGrid: LayoutRecipe = {
  structure: 'honeycomb-grid',
  name: 'Honeycomb Grid',
  description: 'Hexagonal grid layout where items form a honeycomb pattern. Visually distinctive for showcases, team pages, and creative portfolios.',
  category: 'artistic',
  bestFor: ['portfolio', 'landing'],
  conflicts: ['admin-panel', 'dashboard-app', 'ecommerce'],
  techNotes: 'Uses clip-path for hexagonal shapes and offset rows. Each row is shifted by half an item width. Requires consistent item aspect ratios.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: 'repeat(3, 1fr)',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: 'repeat(2, 1fr)',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: 'repeat(2, 1fr)',
    rows: 'auto',
  },
  gap: 'md',
  preview: '   / \\ / \\ / \\ \n  | A | B | C |\n   \\ / \\ / \\ / \n  / \\ / \\ / \\   \n | D | E | F |\n  \\ / \\ / \\ /   ',
}

const mosaicGrid: LayoutRecipe = {
  structure: 'mosaic-grid',
  name: 'Mosaic Grid',
  description: 'Mixed-size tile layout where items of different sizes fill space like a mosaic. Similar to bento but with more organic, less grid-locked arrangements.',
  category: 'artistic',
  bestFor: ['portfolio', 'landing', 'blog'],
  conflicts: ['admin-panel', 'dashboard-app'],
  techNotes: 'Uses CSS Grid with named areas. Items have varied spans creating a visually dynamic composition.',
  regions: [
    { name: 'tile-1', required: true },
    { name: 'tile-2', required: true },
    { name: 'tile-3' },
    { name: 'tile-4' },
    { name: 'tile-5' },
  ],
  gridTemplate: {
    columns: 'repeat(4, 1fr)',
    rows: 'repeat(3, 80px)',
    areas: [
      'tile-1 tile-1 tile-2 tile-3',
      'tile-1 tile-1 tile-4 tile-4',
      'tile-5 tile-5 tile-5 tile-5',
    ],
  },
  gridTemplateTablet: {
    columns: '1fr 1fr',
    rows: 'repeat(3, 80px)',
    areas: [
      'tile-1 tile-1',
      'tile-2 tile-3',
      'tile-4 tile-5',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+-------+-------+---+---+\n|   1   |   1   | 2 | 3 |\n|   1   |   1   +---+---+\n+-------+-------+ 4 | 4 |\n|     5     | 5     | 5 |\n+-----------+-------+---+',
}

const responsiveGrid: LayoutRecipe = {
  structure: 'responsive-grid',
  name: 'Responsive Grid',
  description: 'Auto-filling grid that adjusts column count based on available width. No fixed breakpoints -- columns flow naturally using minmax and auto-fill.',
  category: 'artistic',
  bestFor: ['ecommerce', 'blog', 'portfolio', 'landing'],
  conflicts: [],
  techNotes: 'Uses repeat(auto-fill, minmax(280px, 1fr)). The browser automatically determines how many columns fit. Most flexible grid -- no manual breakpoints needed.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: 'repeat(auto-fill, minmax(280px, 1fr))',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: 'repeat(auto-fill, minmax(240px, 1fr))',
    rows: 'auto',
  },
  gap: 'lg',
  preview: '[280px] [280px] [280px] [280px]\n  ...    ...    ...    ...\n\n(Auto-fills based on container width)',
}

// ─── Mathematical Layouts (14) ────────────────────────────────

const fibonacciGrid: LayoutRecipe = {
  structure: 'fibonacci-grid',
  name: 'Fibonacci Grid',
  description: 'Grid columns sized in Fibonacci ratios (1:1:2:3:5). Creates naturally harmonious proportions based on the Fibonacci sequence found throughout nature.',
  category: 'mathematical',
  bestFor: ['portfolio', 'landing'],
  conflicts: ['admin-panel'],
  techNotes: 'Column widths: 1fr 1fr 2fr 3fr 5fr. The Fibonacci sequence (1,1,2,3,5,8...) creates organic-feeling proportions.',
  regions: [
    { name: 'col-1' },
    { name: 'col-2' },
    { name: 'col-3' },
    { name: 'col-4' },
    { name: 'col-5' },
  ],
  gridTemplate: {
    columns: '1fr 1fr 2fr 3fr 5fr',
    rows: '1fr',
    areas: ['col-1 col-2 col-3 col-4 col-5'],
  },
  gridTemplateTablet: {
    columns: '1fr 1fr 2fr',
    rows: '1fr 1fr',
    areas: ['col-1 col-2 col-3', 'col-4 col-4 col-5'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto auto auto',
    areas: ['col-5', 'col-4', 'col-3', 'col-1', 'col-2'],
  },
  gap: 'md',
  preview: '+--+--+----+------+----------+\n|1 |1 | 2  |  3   |    5     |\n+--+--+----+------+----------+\n  Fibonacci: 1 1 2 3 5',
}

const fibonacciColumns: LayoutRecipe = {
  structure: 'fibonacci-columns',
  name: 'Fibonacci Columns',
  description: 'Vertical columns with Fibonacci-ratio widths. A more subtle application of the Fibonacci sequence -- each column is wider than the previous by the golden ratio.',
  category: 'mathematical',
  bestFor: ['portfolio', 'landing'],
  conflicts: ['admin-panel'],
  techNotes: 'Three columns: 1fr 1.618fr 2.618fr. Each is phi (1.618x) wider than the previous.',
  regions: [
    { name: 'narrow' },
    { name: 'medium' },
    { name: 'wide', required: true },
  ],
  gridTemplate: {
    columns: '1fr 1.618fr 2.618fr',
    rows: '1fr',
    areas: ['narrow medium wide'],
  },
  gridTemplateTablet: {
    columns: '1fr 1.618fr 2.618fr',
    rows: '1fr',
    areas: ['narrow medium wide'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto',
    areas: ['wide', 'medium', 'narrow'],
  },
  gap: 'md',
  preview: '+------+----------+----------------+\n|      |          |                |\n| 1fr  | 1.618fr  |   2.618fr      |\n|      |          |                |\n+------+----------+----------------+',
}

const fibonacciTiles: LayoutRecipe = {
  structure: 'fibonacci-tiles',
  name: 'Fibonacci Tiles',
  description: 'Tile layout where tile sizes follow Fibonacci proportions. Combines the visual variety of bento with mathematically harmonious sizing.',
  category: 'mathematical',
  bestFor: ['portfolio', 'landing'],
  conflicts: ['admin-panel', 'dashboard-app'],
  techNotes: 'Tiles span columns/rows in Fibonacci ratios: 1x1, 1x1, 2x2, 3x2, etc.',
  regions: [
    { name: 'tile-1' },
    { name: 'tile-2' },
    { name: 'tile-3' },
    { name: 'tile-4' },
    { name: 'tile-5' },
  ],
  gridTemplate: {
    columns: '1fr 1fr 2fr 3fr',
    rows: '1fr 1fr 2fr',
    areas: [
      'tile-1 tile-2 tile-3 tile-3',
      'tile-4 tile-4 tile-3 tile-3',
      'tile-5 tile-5 tile-5 tile-5',
    ],
  },
  gridTemplateTablet: {
    columns: '1fr 2fr',
    rows: 'auto auto',
    areas: [
      'tile-1 tile-3',
      'tile-2 tile-3',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+---+---+-------+--------+\n| 1 | 2 |       |        |\n+---+---+   3   |   3    |\n|   4   |       |        |\n+---+---+-------+--------+\n|      5       |   5     |\n+--------------+---------+',
}

const fibonacciResponsive: LayoutRecipe = {
  structure: 'fibonacci-responsive',
  name: 'Fibonacci Responsive',
  description: 'Fibonacci-proportioned grid that gracefully adapts to different screen sizes. Columns collapse in reverse Fibonacci order on smaller screens.',
  category: 'mathematical',
  bestFor: ['portfolio', 'landing'],
  conflicts: ['admin-panel'],
  techNotes: 'On desktop: 5 columns (1:1:2:3:5). On tablet: 3 columns (1:2:3). On mobile: 1 column.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: '1fr 1fr 2fr 3fr 5fr',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: '1fr 2fr 3fr',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: 'Desktop:  1|1|2| 3 |   5   \nTablet:   1| 2 |   3   \nMobile:   |   1   |',
}

const fibonacciMasonry: LayoutRecipe = {
  structure: 'fibonacci-masonry',
  name: 'Fibonacci Masonry',
  description: 'Masonry layout where column widths follow Fibonacci proportions. Each column is phi times wider than the one before it.',
  category: 'mathematical',
  bestFor: ['portfolio', 'blog'],
  conflicts: ['admin-panel'],
  techNotes: '3 columns: 1fr 1.618fr 2.618fr with masonry flow. Items fill the narrowest column first.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: '1fr 1.618fr 2.618fr',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: '1fr 1.618fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+---+-------+-----------+\n| A |   D   |     G     |\n| B |   D   |     G     |\n| B |       |     H     |\n| C |   E   |           |\n|   |   F   |     I     |\n+---+-------+-----------+',
}

const fibonacciBento: LayoutRecipe = {
  structure: 'fibonacci-bento',
  name: 'Fibonacci Bento',
  description: 'Bento grid with Fibonacci-proportioned cells. Cell sizes follow the sequence, creating harmonious visual weight distribution.',
  category: 'mathematical',
  bestFor: ['portfolio', 'landing'],
  conflicts: ['admin-panel'],
  techNotes: 'Grid areas sized in Fibonacci ratios. The largest cell (5fr) gets the most visual weight.',
  regions: [
    { name: 'hero' },
    { name: 'card-1' },
    { name: 'card-2' },
    { name: 'card-3' },
  ],
  gridTemplate: {
    columns: '1fr 1fr 2fr 3fr',
    rows: '1fr 2fr',
    areas: [
      'card-1 card-2 hero hero',
      'card-3 card-3 hero hero',
    ],
  },
  gridTemplateTablet: {
    columns: '1fr 2fr',
    rows: '1fr 1fr',
    areas: [
      'card-1 hero',
      'card-2 hero',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+---+---+-------+--------+\n| 1 | 2 |       HERO       |\n+---+---+-------+          |\n|    3    |      HERO       |\n+---------+----------------+',
}

const fibonacciSteps: LayoutRecipe = {
  structure: 'fibonacci-steps',
  name: 'Fibonacci Steps',
  description: 'Staircase layout where each step is wider than the previous by the golden ratio. Creates a cascading visual flow from narrow to wide.',
  category: 'mathematical',
  bestFor: ['landing', 'portfolio'],
  conflicts: ['admin-panel', 'dashboard-app'],
  techNotes: 'Steps: 1fr, 1fr, 2fr, 3fr, 5fr. Each row has one more column than the previous.',
  regions: [
    { name: 'step-1' },
    { name: 'step-2' },
    { name: 'step-3' },
    { name: 'step-4' },
    { name: 'step-5' },
  ],
  gridTemplate: {
    columns: '1fr 1fr 2fr 3fr 5fr',
    rows: 'auto',
    areas: ['step-1 step-2 step-3 step-4 step-5'],
  },
  gridTemplateTablet: {
    columns: '1fr 2fr 3fr',
    rows: 'auto auto',
    areas: [
      'step-1 step-2 step-3',
      'step-4 step-4 step-5',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto auto auto',
    areas: ['step-5', 'step-4', 'step-3', 'step-2', 'step-1'],
  },
  gap: 'md',
  preview: '|1|1| 2 |  3  |    5    |\n  Each column wider by phi',
}

const fibonacciCascade: LayoutRecipe = {
  structure: 'fibonacci-cascade',
  name: 'Fibonacci Cascade',
  description: 'Cascading layout where content sections increase in width following the Fibonacci sequence. Creates a natural visual flow that draws the eye from narrow to wide.',
  category: 'mathematical',
  bestFor: ['landing', 'portfolio'],
  conflicts: ['admin-panel'],
  techNotes: 'Stacked rows of increasing width, centered. Each section is centered and wider than the previous.',
  regions: [
    { name: 'section-1' },
    { name: 'section-2' },
    { name: 'section-3' },
    { name: 'section-4' },
  ],
  gridTemplate: {
    columns: '1fr 2fr 3fr 5fr',
    rows: 'auto auto auto auto',
    areas: [
      'section-1 section-1 section-1 section-1',
      '. section-2 section-2 section-2',
      '. . section-3 section-3',
      '. . . section-4',
    ],
  },
  gridTemplateTablet: {
    columns: '1fr 2fr',
    rows: 'auto auto auto auto',
    areas: [
      'section-1 section-1',
      '. section-2',
      '. section-3',
      '. section-4',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto auto',
    areas: ['section-4', 'section-3', 'section-2', 'section-1'],
  },
  gap: 'md',
  preview: '|        S1           |\n   |      S2         |\n      |    S3      |\n         | S4    |',
}

const goldenRatioGrid: LayoutRecipe = {
  structure: 'golden-ratio-grid',
  name: 'Golden Ratio Grid',
  description: 'Two-column layout divided by the golden ratio (1:1.618). The most aesthetically pleasing proportion in art and design, found in nature, architecture, and classical art.',
  category: 'mathematical',
  bestFor: ['landing', 'portfolio', 'documentation'],
  conflicts: ['admin-panel'],
  techNotes: 'Columns: 1fr 1.618fr. The golden ratio (phi = 1.618...) creates natural visual harmony. Right column is 61.8% of total width.',
  regions: [
    { name: 'minor', required: true },
    { name: 'major', required: true },
  ],
  gridTemplate: {
    columns: '1fr 1.618fr',
    rows: '1fr',
    areas: ['minor major'],
  },
  gridTemplateTablet: {
    columns: '1fr 1.618fr',
    rows: '1fr',
    areas: ['minor major'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto',
    areas: ['major', 'minor'],
  },
  gap: 'lg',
  preview: '+----------+------------------+\n|          |                  |\n|  38.2%   |     61.8%        |\n|  (minor) |     (major)      |\n|          |                  |\n+----------+------------------+',
}

const phiGrid: LayoutRecipe = {
  structure: 'phi-grid',
  name: 'Phi Grid',
  description: 'Three-column grid using phi (1.618) proportions. Creates a balanced three-zone layout where each zone relates to the others by the golden ratio.',
  category: 'mathematical',
  bestFor: ['landing', 'portfolio'],
  conflicts: ['admin-panel'],
  techNotes: 'Columns: 1fr 1.618fr 2.618fr. Each column is phi times the previous. Total adds up to 5.236fr.',
  regions: [
    { name: 'minor' },
    { name: 'medium' },
    { name: 'major', required: true },
  ],
  gridTemplate: {
    columns: '1fr 1.618fr 2.618fr',
    rows: '1fr',
    areas: ['minor medium major'],
  },
  gridTemplateTablet: {
    columns: '1fr 1.618fr',
    rows: '1fr auto',
    areas: [
      'minor major',
      'medium medium',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto',
    areas: ['major', 'medium', 'minor'],
  },
  gap: 'md',
  preview: '+------+----------+------------------+\n|      |          |                  |\n| 19%  |   31%    |      50%         |\n|      |          |                  |\n+------+----------+------------------+',
}

const ruleOfThirds: LayoutRecipe = {
  structure: 'rule-of-thirds',
  name: 'Rule of Thirds',
  description: 'Grid divided into thirds, following the photographic composition rule. Creates four intersection points that naturally draw the eye, ideal for hero sections and feature layouts.',
  category: 'mathematical',
  bestFor: ['landing', 'portfolio'],
  conflicts: ['admin-panel'],
  techNotes: '3x3 grid with equal thirds. The four intersection points are natural focal points. Place important content at intersections.',
  regions: [
    { name: 'top-left' },
    { name: 'top-center' },
    { name: 'top-right' },
    { name: 'mid-left' },
    { name: 'mid-center', required: true },
    { name: 'mid-right' },
    { name: 'bottom-left' },
    { name: 'bottom-center' },
    { name: 'bottom-right' },
  ],
  gridTemplate: {
    columns: '1fr 1fr 1fr',
    rows: '1fr 1fr 1fr',
    areas: [
      'top-left top-center top-right',
      'mid-left mid-center mid-right',
      'bottom-left bottom-center bottom-right',
    ],
  },
  gridTemplateTablet: {
    columns: '1fr 1fr 1fr',
    rows: '1fr 1fr 1fr',
    areas: [
      'top-left top-center top-right',
      'mid-left mid-center mid-right',
      'bottom-left bottom-center bottom-right',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+--------+--------+--------+\n| TL     | TC     | TR     |\n|   *    |        |   *    |\n+--------+--------+--------+\n| ML     | MC     | MR     |\n|        |   *    |        |\n+--------+--------+--------+\n| BL     | BC     | BR     |\n|   *    |        |   *    |\n+--------+--------+--------+\n  * = natural focal points',
}

const harmonicSeries: LayoutRecipe = {
  structure: 'harmonic-series',
  name: 'Harmonic Series',
  description: 'Grid columns sized by the harmonic series (1, 1/2, 1/3, 1/4...). Each column is progressively narrower, creating a gradual visual taper.',
  category: 'mathematical',
  bestFor: ['portfolio', 'landing'],
  conflicts: ['admin-panel'],
  techNotes: 'Columns: 12fr 6fr 4fr 3fr (normalized from 1, 1/2, 1/3, 1/4). Creates a smooth tapering effect.',
  regions: [
    { name: 'col-1' },
    { name: 'col-2' },
    { name: 'col-3' },
    { name: 'col-4' },
  ],
  gridTemplate: {
    columns: '12fr 6fr 4fr 3fr',
    rows: '1fr',
    areas: ['col-1 col-2 col-3 col-4'],
  },
  gridTemplateTablet: {
    columns: '2fr 1fr',
    rows: '1fr 1fr',
    areas: ['col-1 col-2', 'col-3 col-4'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto auto',
    areas: ['col-1', 'col-2', 'col-3', 'col-4'],
  },
  gap: 'md',
  preview: '+------------+------+----+---+\n|            |      |    |   |\n|   12fr     | 6fr  |4fr |3fr|\n|            |      |    |   |\n+------------+------+----+---+\n  Harmonic: 1, 1/2, 1/3, 1/4',
}

const primeGrid: LayoutRecipe = {
  structure: 'prime-grid',
  name: 'Prime Grid',
  description: 'Grid with a prime number of columns (5). Prime numbers create grids that resist simple subdivision, producing more interesting and less predictable layouts.',
  category: 'mathematical',
  bestFor: ['portfolio', 'landing'],
  conflicts: ['admin-panel'],
  techNotes: '5 columns (prime number). Cannot be evenly divided into halves or thirds, creating more interesting span patterns.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: 'repeat(5, 1fr)',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: 'repeat(3, 1fr)',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+---+---+---+---+---+\n|   |   |   |   |   |\n| 1 | 2 | 3 | 4 | 5 |\n|   |   |   |   |   |\n+---+---+---+---+---+\n  5 columns (prime)',
}

const sqrtGrid: LayoutRecipe = {
  structure: 'sqrt-grid',
  name: 'Square Root Grid',
  description: 'Grid columns sized by square root proportions (1, sqrt2, sqrt3). Creates a smooth geometric progression that feels both mathematical and organic.',
  category: 'mathematical',
  bestFor: ['portfolio', 'landing'],
  conflicts: ['admin-panel'],
  techNotes: 'Columns: 1fr 1.414fr 1.732fr (normalized sqrt values). Geometric but not as aggressive as Fibonacci.',
  regions: [
    { name: 'col-1' },
    { name: 'col-2' },
    { name: 'col-3' },
  ],
  gridTemplate: {
    columns: '1fr 1.414fr 1.732fr',
    rows: '1fr',
    areas: ['col-1 col-2 col-3'],
  },
  gridTemplateTablet: {
    columns: '1fr 1.414fr',
    rows: '1fr auto',
    areas: [
      'col-1 col-2',
      'col-3 col-3',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto',
    areas: ['col-3', 'col-2', 'col-1'],
  },
  gap: 'md',
  preview: '+------+--------+----------+\n|      |        |          |\n| 1fr  | 1.41fr | 1.73fr   |\n|      |        |          |\n+------+--------+----------+\n  sqrt(1), sqrt(2), sqrt(3)',
}

const modularGrid: LayoutRecipe = {
  structure: 'modular-grid',
  name: 'Modular Grid',
  description: 'Grid based on a modular scale where each column is a fixed ratio larger than the previous. Configurable ratio allows custom proportional systems.',
  category: 'mathematical',
  bestFor: ['portfolio', 'landing', 'documentation'],
  conflicts: ['admin-panel'],
  techNotes: 'Default ratio: 1.25 (major third). Columns: 1fr 1.25fr 1.563fr 1.953fr. Each column is 1.25x the previous.',
  regions: [
    { name: 'col-1' },
    { name: 'col-2' },
    { name: 'col-3' },
    { name: 'col-4' },
  ],
  gridTemplate: {
    columns: '1fr 1.25fr 1.563fr 1.953fr',
    rows: '1fr',
    areas: ['col-1 col-2 col-3 col-4'],
  },
  gridTemplateTablet: {
    columns: '1fr 1.25fr',
    rows: '1fr 1fr',
    areas: [
      'col-1 col-2',
      'col-3 col-4',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto auto',
    areas: ['col-4', 'col-3', 'col-2', 'col-1'],
  },
  gap: 'md',
  preview: '+------+-------+---------+----------+\n|      |       |         |          |\n| 1fr  |1.25fr | 1.56fr  | 1.95fr   |\n|      |       |         |          |\n+------+-------+---------+----------+\n  Ratio: 1.25 (major third)',
}

// ─── Application Layouts (2) ──────────────────────────────────

const dashboard: LayoutRecipe = {
  structure: 'dashboard',
  name: 'Dashboard',
  description: 'Full dashboard layout with fixed sidebar, top header with user actions, and a content grid for widgets. The standard pattern for data-heavy applications.',
  category: 'application',
  bestFor: ['dashboard-app', 'admin-panel'],
  conflicts: ['landing', 'portfolio'],
  techNotes: 'Combines sidebar-left with a content grid. Header spans full width above sidebar+content. Content area uses auto-fill grid for widget placement.',
  regions: [
    { name: 'header', required: true, minHeight: '56px' },
    { name: 'sidebar', required: true },
    { name: 'main', required: true },
  ],
  gridTemplate: {
    columns: '260px 1fr',
    rows: 'auto 1fr',
    areas: [
      'header header',
      'sidebar main',
    ],
  },
  gridTemplateTablet: {
    columns: '220px 1fr',
    rows: 'auto 1fr',
    areas: [
      'header header',
      'sidebar main',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto 1fr',
    areas: ['header', 'main'],
  },
  gap: 'none',
  minHeight: '100vh',
  preview: '+---------------------------+\n|         HEADER            |\n+-------+-------------------+\n|       |                   |\n| SIDE  |   WIDGET GRID     |\n| NAV   |   [1] [2] [3]     |\n|       |   [4] [5]         |\n+-------+-------------------+',
}

const blog: LayoutRecipe = {
  structure: 'blog',
  name: 'Blog',
  description: 'Classic blog layout: header with navigation, main content column, sidebar with archives/tags, and footer. Content-heavy, reader-focused layout.',
  category: 'application',
  bestFor: ['blog', 'documentation'],
  conflicts: ['dashboard-app'],
  techNotes: 'Main content is 2/3 width, sidebar is 1/3. Header has logo + nav. Footer has links.',
  regions: [
    { name: 'header', required: true, minHeight: '56px' },
    { name: 'main', required: true },
    { name: 'sidebar' },
    { name: 'footer' },
  ],
  gridTemplate: {
    columns: '2fr 1fr',
    rows: 'auto 1fr auto',
    areas: [
      'header header',
      'main sidebar',
      'footer footer',
    ],
  },
  gridTemplateTablet: {
    columns: '1fr 1fr',
    rows: 'auto 1fr auto',
    areas: [
      'header header',
      'main sidebar',
      'footer footer',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto auto',
    areas: ['header', 'main', 'sidebar', 'footer'],
  },
  gap: 'none',
  minHeight: '100vh',
  preview: '+---------------------------+\n|         HEADER            |\n+-------------------+-------+\n|                   |       |\n|   MAIN CONTENT    | SIDE  |\n|   (articles)      | BAR   |\n|                   |       |\n+-------------------+-------+\n|         FOOTER            |\n+---------------------------+',
}

// ─── Advanced Layouts (13) ─────────────────────────────────────

const gridOverlap: LayoutRecipe = {
  structure: 'grid-overlap',
  name: 'Grid Overlap / Z-Stack',
  description: 'All items stacked in the same grid cell (grid-area: 1/1), creating overlays, badges, and card stacks. The only layout that uses cell overlap -- impossible with flexbox.',
  category: 'advanced',
  bestFor: ['portfolio', 'landing', 'saas'],
  conflicts: ['admin-panel', 'dashboard-app'],
  techNotes: 'All children get grid-area: 1/1 and use z-index for layering. Great for hero overlays, card stack effects, and badge positioning.',
  regions: [
    { name: 'base', required: true },
    { name: 'overlay' },
  ],
  gridTemplate: {
    columns: '1fr',
    rows: '1fr',
    areas: ['base'],
  },
  gridTemplateTablet: {
    columns: '1fr',
    rows: '1fr',
    areas: ['base'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: '1fr',
    areas: ['base'],
  },
  gap: 'none',
  preview: '+-------------------+\n|  BASE (z:0)      |\n|  +-------------+  |\n|  | OVERLAY z:1 |  |\n|  +-------------+  |\n+-------------------+',
}

const fullBleed: LayoutRecipe = {
  structure: 'full-bleed',
  name: 'Full Bleed',
  description: 'Three-column article layout (1fr min(65ch, 100%) 1fr) where content is constrained to readable width but full-bleed images span the entire container. The Heydon Pickering pattern.',
  category: 'advanced',
  bestFor: ['blog', 'documentation', 'media'],
  conflicts: ['admin-panel', 'dashboard-app'],
  techNotes: 'Content column uses min(65ch, 100%) for optimal reading width. Full-bleed children use grid-column: 1/-1 to span all columns.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: '1fr min(65ch, 100%) 1fr',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: '1fr min(65ch, 100%) 1fr',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'none',
  preview: '+------+---content---+------+\n|      |  readable   |      |\n| full |  65ch max   | full |\n| bleed|  content    | bleed|\n+------+-------------+------+',
}

const containerQueryGrid: LayoutRecipe = {
  structure: 'container-query-grid',
  name: 'Container Query Grid',
  description: 'Responsive grid that responds to parent width, not viewport. Uses @container queries for component-scoped responsiveness -- essential for component libraries and embeddable widgets.',
  category: 'advanced',
  bestFor: ['saas', 'dashboard-app', 'crm'],
  conflicts: [],
  techNotes: 'Uses container-type: inline-size on parent + @container queries. Columns change based on available parent width, not viewport. Chrome 105+ support.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: 'repeat(auto-fill, minmax(280px, 1fr))',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: 'repeat(auto-fill, minmax(240px, 1fr))',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '[Container Width >= 600px]\n+-------+-------+-------+\n| Card  | Card  | Card  |\n+-------+-------+-------+\n\n[Container Width < 600px]\n+-------------------+\n|      Card         |\n+-------------------+',
}

const scrollSnapGrid: LayoutRecipe = {
  structure: 'scroll-snap-grid',
  name: 'Scroll Snap Grid',
  description: 'Horizontal scrolling card carousel using CSS Grid + scroll-snap. No JavaScript libraries needed. Items snap into place as the user scrolls.',
  category: 'advanced',
  bestFor: ['ecommerce', 'media', 'saas', 'landing'],
  conflicts: [],
  techNotes: 'Uses grid-auto-flow: column + scroll-snap-type: x mandatory. Each item has scroll-snap-align: start. Overflow-x: auto for horizontal scroll.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: 'repeat(auto-fill, minmax(280px, 1fr))',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: 'repeat(auto-fill, minmax(260px, 1fr))',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: 'repeat(auto-fill, minmax(240px, 1fr))',
    rows: 'auto',
  },
  gap: 'md',
  preview: '[<--- scroll --->]\n+-------+-------+-------+-------+\n| Card  | Card  | Card  | Card  |\n| snap  | snap  | snap  | snap  |\n+-------+-------+-------+-------+',
}

const animatedGrid: LayoutRecipe = {
  structure: 'animated-grid',
  name: 'Animated Grid',
  description: 'Grid where columns can be animated using CSS transitions on grid-template-columns. Enables interactive resizing, collapsible panels, and responsive controls.',
  category: 'advanced',
  bestFor: ['dashboard-app', 'saas', 'admin-panel'],
  conflicts: [],
  techNotes: 'Uses transition: grid-template-columns 0.3s ease. Column widths change smoothly. Add @media (prefers-reduced-motion: reduce) to disable.',
  regions: [
    { name: 'sidebar', required: true },
    { name: 'main', required: true },
  ],
  gridTemplate: {
    columns: '280px 1fr',
    rows: '1fr',
    areas: ['sidebar main'],
  },
  gridTemplateTablet: {
    columns: '240px 1fr',
    rows: '1fr',
    areas: ['sidebar main'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: '1fr',
    areas: ['main'],
  },
  gap: 'none',
  minHeight: '100vh',
  preview: '+-------+-------------------+\n|       |                   |\n| SIDE  |     MAIN          |\n| 280px |     (1fr)          |\n|  <->  |                   |\n+-------+-------------------+\n  <-> = animated width change',
}

const subgridSync: LayoutRecipe = {
  structure: 'subgrid-sync',
  name: 'Subgrid Sync',
  description: 'Child grid aligned to parent tracks using CSS subgrid. Children inherit the parent grid columns and rows, enabling precise alignment across nested grid contexts.',
  category: 'advanced',
  bestFor: ['dashboard-app', 'saas', 'analytics'],
  conflicts: [],
  techNotes: 'Uses grid-template-columns: subgrid and grid-template-rows: subgrid on children. Chrome 117+, Firefox 71+, Safari 16+ support.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: 'repeat(4, 1fr)',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: 'repeat(2, 1fr)',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+-------+-------+-------+-------+\n| Parent| Grid  | Track | Align |\n+-------+-------+-------+-------+\n| Child | sub-  | grid  | syncs |\n| inherits columns from parent   |',
}

const autoFlowColumn: LayoutRecipe = {
  structure: 'auto-flow-column',
  name: 'Auto Flow Column',
  description: 'Grid where items flow vertically first (top-to-bottom), then wrap to next column. Unique to CSS Grid. Great for timelines, channel lists, and multi-column feeds.',
  category: 'advanced',
  bestFor: ['social', 'media', 'blog'],
  conflicts: ['admin-panel'],
  techNotes: 'Uses grid-auto-flow: column with grid-auto-columns: 1fr. Items stack vertically then wrap. Add grid-template-rows: repeat(N, auto) to control column height.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: 'repeat(3, 1fr)',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: 'repeat(2, 1fr)',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+---+---+---+\n| 1 | 4 | 7 |\n| 2 | 5 | 8 |\n| 3 | 6 | 9 |\n+---+---+---+\n  Vertical-first flow',
}

const densePacking: LayoutRecipe = {
  structure: 'dense-packing',
  name: 'Dense Packing',
  description: 'Grid with auto-flow: dense that automatically fills gaps. When items span different sizes, smaller items are placed in empty spaces. Essential for image/masonry-like grids without column-count hacks.',
  category: 'advanced',
  bestFor: ['portfolio', 'media', 'ecommerce', 'landing'],
  conflicts: [],
  techNotes: 'Uses grid-auto-flow: dense. Items with varied spans pack tightly. Warning: may reorder items visually, breaking source order. Not suitable for tabular content.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: 'repeat(4, 1fr)',
    rows: 'repeat(3, 80px)',
  },
  gridTemplateTablet: {
    columns: 'repeat(3, 1fr)',
    rows: 'repeat(3, 80px)',
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+-------+-------+---+---+\n| BIG   | BIG   | 3 | 4 |\n| BIG   | BIG   +---+---+\n+-------+-------+ 5 | 6 |\n| 7     | 8     +---+---+\n+-------+-------+-------+',
}

const loginSplit: LayoutRecipe = {
  structure: 'login-split',
  name: 'Login Split Screen',
  description: 'Standard authentication layout: 50/50 viewport split with brand/illustration on one side and form on the other. Collapses to single column on mobile. The most common auth page pattern.',
  category: 'advanced',
  bestFor: ['saas', 'dashboard-app', 'crm', 'analytics'],
  conflicts: [],
  techNotes: 'Equal 1fr 1fr split. On mobile, shows only the form side (brand hidden or above). Uses min-height: 100vh for full-viewport coverage.',
  regions: [
    { name: 'brand', required: true },
    { name: 'form', required: true },
  ],
  gridTemplate: {
    columns: '1fr 1fr',
    rows: '100vh',
    areas: ['brand form'],
  },
  gridTemplateTablet: {
    columns: '1fr 1fr',
    rows: '100vh',
    areas: ['brand form'],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: '100vh',
    areas: ['form'],
  },
  gap: 'none',
  preview: '+-------------+-------------+\n|             |             |\n|    BRAND    |    FORM     |\n| illustration|   login     |\n|             |   form      |\n+-------------+-------------+',
}

const formLabelInput: LayoutRecipe = {
  structure: 'form-label-input',
  name: 'Form Label + Input',
  description: 'Two-column form layout where labels are auto-width and inputs fill remaining space. The standard pattern for all form layouts. auto 1fr creates naturally aligned label-input pairs.',
  category: 'advanced',
  bestFor: ['admin-panel', 'saas', 'crm', 'dashboard-app'],
  conflicts: [],
  techNotes: 'Uses grid-template-columns: auto 1fr. Labels take natural width, inputs fill the rest. Full-width elements use grid-column: 1/-1.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: 'auto 1fr',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: 'auto 1fr',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'md',
  preview: '+--------+-------------------+\n| Label  | [Input..........] |\n| Label  | [Input..........] |\n|        | [Full-width btn ] |\n+--------+-------------------+',
}

const navLogoAction: LayoutRecipe = {
  structure: 'nav-logo-action',
  name: 'Nav: Logo + Menu + Action',
  description: 'Three-zone navigation bar: logo (auto), menu (1fr), action button (auto). The most common navigation pattern for web apps and marketing sites.',
  category: 'advanced',
  bestFor: ['landing', 'saas', 'documentation', 'portfolio'],
  conflicts: [],
  techNotes: 'Uses grid-template-columns: auto 1fr auto. Logo left, menu center, action right. Menu can be flex or grid internally for items.',
  regions: [
    { name: 'logo', required: true },
    { name: 'nav' },
    { name: 'action' },
  ],
  gridTemplate: {
    columns: 'auto 1fr auto',
    rows: 'auto',
    areas: ['logo nav action'],
  },
  gridTemplateTablet: {
    columns: 'auto 1fr auto',
    rows: 'auto',
    areas: ['logo nav action'],
  },
  gridTemplateMobile: {
    columns: 'auto 1fr auto',
    rows: 'auto',
    areas: ['logo nav action'],
  },
  gap: 'md',
  preview: '+------+------------------+--------+\n| LOGO |   Nav Links      | [CTA]  |\n+------+------------------+--------+',
}

const gridTemplateShorthand: LayoutRecipe = {
  structure: 'grid-template-shorthand',
  name: 'Grid Template Shorthand',
  description: 'Layout using the grid-template shorthand that combines areas, rows, and columns in one declaration. More compact and declarative than three separate properties.',
  category: 'advanced',
  bestFor: ['documentation', 'blog', 'landing'],
  conflicts: [],
  techNotes: 'Uses grid-template: "header header" auto "sidebar main" 1fr "footer footer" auto / 240px 1fr. Single declaration replaces grid-template-areas + grid-template-rows + grid-template-columns.',
  regions: [
    { name: 'header', required: true, minHeight: '56px' },
    { name: 'sidebar' },
    { name: 'main', required: true },
    { name: 'footer' },
  ],
  gridTemplate: {
    columns: '240px 1fr',
    rows: 'auto 1fr auto',
    areas: [
      'header header',
      'sidebar main',
      'footer footer',
    ],
  },
  gridTemplateTablet: {
    columns: '200px 1fr',
    rows: 'auto 1fr auto',
    areas: [
      'header header',
      'sidebar main',
      'footer footer',
    ],
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto auto auto auto',
    areas: ['header', 'main', 'sidebar', 'footer'],
  },
  gap: 'none',
  minHeight: '100vh',
  preview: '+---------------------------+\n|         HEADER            |\n+-------+-------------------+\n|       |                   |\n| SIDE  |     MAIN          |\n|       |                   |\n+-------+-------------------+\n|         FOOTER            |\n+---------------------------+',
}

const implicitNamedLines: LayoutRecipe = {
  structure: 'implicit-named-lines',
  name: 'Implicit Named Lines',
  description: 'Grid using named grid lines ([main-start] 1fr [main-end sidebar-start] 200px [sidebar-end]) for precise placement. Named lines are self-documenting and more maintainable than numeric indices.',
  category: 'advanced',
  bestFor: ['documentation', 'saas', 'analytics'],
  conflicts: [],
  techNotes: 'Uses grid-template-columns: [full-start] 1fr [content-start] minmax(0, 65ch) [content-end] 1fr [full-end]. Items placed by line name: grid-column: content-start / content-end.',
  regions: [
    { name: 'content', required: true },
  ],
  gridTemplate: {
    columns: '1fr minmax(0, 65ch) 1fr',
    rows: 'auto',
  },
  gridTemplateTablet: {
    columns: '1fr minmax(0, 65ch)',
    rows: 'auto',
  },
  gridTemplateMobile: {
    columns: '1fr',
    rows: 'auto',
  },
  gap: 'none',
  preview: '+------+---content---+------+\n|      |  [content-  |      |\n| full |  start/end] | full |\n| area |  65ch max   | area |\n+------+-------------+------+',
}

// ─── Registry ─────────────────────────────────────────────────

/** All 51 layout recipes indexed by structure name */
export const layoutRegistry: Record<LayoutStructure, LayoutRecipe> = {
  // Classic
  'sidebar-left': sidebarLeft,
  'sidebar-right': sidebarRight,
  'top-nav': topNav,
  'two-columns': twoColumns,
  'three-columns': threeColumns,
  'holy-grail': holyGrail,
  'split-screen': splitScreen,
  'cards-grid': cardsGrid,
  'magazine': magazine,
  'fullscreen-hero': fullscreenHero,
  // Bento
  'bento-grid': bentoGrid,
  'bento-sidebar': bentoSidebar,
  'bento-hero': bentoHero,
  'bento-masonry': bentoMasonry,
  // Artistic
  'masonry-grid': masonryGrid,
  'asymmetric-grid': asymmetricGrid,
  'span-grid': spanGrid,
  'overlap-grid': overlapGrid,
  'honeycomb-grid': honeycombGrid,
  'mosaic-grid': mosaicGrid,
  'responsive-grid': responsiveGrid,
  // Mathematical
  'fibonacci-grid': fibonacciGrid,
  'fibonacci-columns': fibonacciColumns,
  'fibonacci-tiles': fibonacciTiles,
  'fibonacci-responsive': fibonacciResponsive,
  'fibonacci-masonry': fibonacciMasonry,
  'fibonacci-bento': fibonacciBento,
  'fibonacci-steps': fibonacciSteps,
  'fibonacci-cascade': fibonacciCascade,
  'golden-ratio-grid': goldenRatioGrid,
  'phi-grid': phiGrid,
  'rule-of-thirds': ruleOfThirds,
  'harmonic-series': harmonicSeries,
  'prime-grid': primeGrid,
  'sqrt-grid': sqrtGrid,
  'modular-grid': modularGrid,
  // Application
  'dashboard': dashboard,
  'blog': blog,
  // Advanced
  'grid-overlap': gridOverlap,
  'full-bleed': fullBleed,
  'container-query-grid': containerQueryGrid,
  'scroll-snap-grid': scrollSnapGrid,
  'animated-grid': animatedGrid,
  'subgrid-sync': subgridSync,
  'auto-flow-column': autoFlowColumn,
  'dense-packing': densePacking,
  'login-split': loginSplit,
  'form-label-input': formLabelInput,
  'nav-logo-action': navLogoAction,
  'grid-template-shorthand': gridTemplateShorthand,
  'implicit-named-lines': implicitNamedLines,
}

/** Get a layout recipe by structure name */
export function getLayoutRecipe(structure: LayoutStructure): LayoutRecipe {
  return layoutRegistry[structure]
}

/** Get all layout recipes as an array */
export function getAllLayoutRecipes(): LayoutRecipe[] {
  return Object.values(layoutRegistry)
}

/** Get layouts by category */
export function getLayoutsByCategory(category: LayoutRecipe['category']): LayoutRecipe[] {
  return Object.values(layoutRegistry).filter((r) => r.category === category)
}

/** Get layouts recommended for a project goal */
export function getLayoutsForGoal(goal: import('./types').ProjectGoal): LayoutRecipe[] {
  return Object.values(layoutRegistry).filter((r) => r.bestFor.includes(goal))
}
