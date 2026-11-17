# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience: recruiters and employers evaluating Abdulmalek Esughi for networking and infrastructure opportunities. Help them inspect skills and project evidence, download a CV, and make contact.

## Product Purpose

Personal portfolio and technical blog for Abdulmalek Esughi, known as 7n4xt. Present his networking and infrastructure focus, cybersecurity background, projects, and practical learning.

Success means a recruiter can understand his profile, evaluate relevant work, and reach him about an opportunity.

## Operating Context

Public website with English and French interface copy. Visitors can browse the portfolio, inspect source repositories, read technical articles, download CV documents, and follow contact or social links.

## Capabilities and Constraints

- Existing Astro static site; no runtime UI framework. Preserve static delivery.
- Homepage includes profile, background, skills, featured projects, and public repositories fetched client-side from GitHub.
- Blog uses Markdown content with tags and reading-time information.
- Preserve English/French interface support, downloadable CVs, and contact paths.
- Keep certification status accurate: existing content describes CCNA as in progress, not earned.
- Do not restore removed security-tool claims or the associated deleted article without explicit approval.
- Current study year, certification progress, availability, and CV freshness need reconfirmation before future factual updates.
- No formal accessibility standard was specified during init.
- Both CV PDFs still contain claims the owner requested removed. Replace them from corrected source documents before treating CV cleanup as complete.

## Brand Commitments

Use the existing identity: Abdulmalek Esughi / 7n4xt. Existing profile places him in Marseille, France, with origins in Libya.

## Evidence on Hand

- Identity and contact links: `src/lib/site.ts`.
- English/French copy: `src/lib/i18n.ts`.
- Featured projects: `src/components/FeaturedProjects.astro`.
- Technical articles: `src/content/blog/`.
- Portrait and project images: `public/photos/`.
- CV documents: `public/files/ESUGHI-Abdulmalek-CV.pdf` and `public/files/ESUGHI-Abdulmalek-Alternance-Infra-Reseaux.pdf`.
- Live public repository source: GitHub account `7n4xt`.

Existing content is evidence to preserve, not permission to invent certifications, professional experience, testimonials, or results.

## Product Principles

- Prioritize recruiter understanding and access to relevant evidence.
- Support claims with real projects, articles, and repositories.
- Distinguish work in progress from completed achievements.
- Keep CV and contact access straightforward in both interface languages.
