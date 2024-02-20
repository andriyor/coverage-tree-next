# coverage-tree-next

## Usage

1. Enable `json-summary` and `html`(optional) reports for [jest](https://jestjs.io/docs/configuration#coveragereporters-arraystring--string-options) or [karma](https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md#type)

2. Use [ts-tree-cli](https://github.com/andriyor/ts-tree-cli) to generate tree

3. [Serve](https://github.com/vercel/serve) coverage to open `html` report

```
serve coverage
```

## TODO

- [x] show tree tree based on coverage report
- [x] expandable node
- [x] custom node renderer
- [x] collor of node based on file coverage
- [ ] select between lines/functions/statements/branches
- [ ] node with coverage progress bar
- [x] calculate total coverage of node
- [ ] calculate total coverage of node and ignore duplicated nodes
- [x] open html report by node
- [x] copy node file path
- [ ] search node
- [ ] render tree on center initially
- [x] used exports by parent node
- [ ] show used exort as arrow label?
- [ ] coverage based on used import
- [ ] file graph
- [x] deploy
- [x] pass tree as search param
- [x] view mode tree/coverageTree
- [ ] use `ts-tree` and pass somehow generated tree

## Next doc

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
