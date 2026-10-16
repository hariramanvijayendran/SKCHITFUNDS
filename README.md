# Senthilkumar Chit Funds

React + Vite + TypeScript + Tailwind CSS website for Velu Senthilkumar Chit Funds Private Limited.

## Run

Requires Node.js 20+ and npm:

```bash
npm install
npm run dev
npm run build
```

## Image integration

Put approved company images in `public/images/` and set their paths in `src/data/images.ts`. The project intentionally includes no invented logo or stock imagery.

## Enquiry integration

`submitDemoEnquiry` in `src/App.tsx` is the single safe integration point. It currently does not transmit or retain personal data. Replace it with an approved, privacy-reviewed service before launch.

## Content review

Scheme figures are brochure transcriptions, flagged pending company approval. Tamil and legal-facing content needs company/legal review before publication.
