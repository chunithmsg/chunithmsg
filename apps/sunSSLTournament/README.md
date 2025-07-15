# chunithmsg

## Project Requirements

- NodeJS 18 or higher
- Yarn 4.0.2 or higher
- 17.00 Rating on Chunithm (Optional)

## Installation

Clone this repository

```bash
git clone https://github.com/xantho09/chunithmsg.git
```

Install dependencies

```bash
yarn run ci
```

Request a `.env.local` from @notlega, @xantho09, or @yytan25

## Usage

Development Mode

```bash
yarn run dev
```

Production Mode

```bash
yarn run build
yarn run start
```

Production Mode with Bundler Analyzer

Set `ANALYZE` to `true` in `.env.local`

```bash
yarn run build
yarn run analyze
```
