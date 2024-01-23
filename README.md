This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, set the relevant constants and credentials into the following environment variables:

```bash
# Details of this Google Cloud project can be found here:
# https://console.cloud.google.com/welcome?project=even-environs-201001

export GCLOUD_PROJECT="595992552497"
export GOOGLE_PROJECT_ID="even-environs-201001"
export GOOGLE_CLIENT_EMAIL="chuni-qualifier-submission-rea@even-environs-201001.iam.gserviceaccount.com"

# This is from the credentials JSON file. If you don't have these, you may need to contact @xantho09,
# or create your own key for this service account in the above GCloud Project.
export GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABCDEF...UVWXYZ\n-----END PRIVATE KEY-----\n"
```

(If you didn't set these environment variables, the development server would still run, but the fetching of the leaderboard standings would fail, causing the page to be eternally stuck in the loading state.)

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[http://localhost:3000/api/hello](http://localhost:3000/api/hello) is an endpoint that uses [Route Handlers](https://beta.nextjs.org/docs/routing/route-handlers). This endpoint can be edited in `app/api/hello/route.ts`.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Testing

To run the GoogleApis tests, start by setting these environment variables:

```bash
# Details of this Google Cloud project can be found here: https://console.cloud.google.com/welcome?project=even-environs-201001

export GCLOUD_PROJECT="595992552497"
export GOOGLE_PROJECT_ID="even-environs-201001"
export GOOGLE_CLIENT_EMAIL="chuni-qualifier-submission-rea@even-environs-201001.iam.gserviceaccount.com"

# This is from the credentials JSON file. If you don't have these, you may need to contact @xantho09,
# or create your own key for this service account in the above GCloud Project.
export GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABCDEF...UVWXYZ\n-----END PRIVATE KEY-----\n"
```

Then run the following command:

```bash
yarn test
```
