# GitHub Actions CI/CD Pipeline Documentation

## Overview
Pipeline CI/CD ini menggunakan GitHub Actions untuk melakukan automated testing dan code quality checks. Pipeline ini berjalan pada setiap push dan pull request ke branch `main`.

## Workflows

### 1. **test.yml** - CI Testing Pipeline
**Trigger:** Push dan Pull Request ke `main` atau `develop`

**Jobs:**
- ✅ Checkout kode repository
- ✅ Setup Node.js (testing dengan versi 18.x dan 20.x)
- ✅ Install dependencies menggunakan npm ci
- ✅ Run ESLint untuk code style checking
- ✅ Check TypeScript types menggunakan tsc
- ✅ Build verification (non-blocking)

**Duration:** ~3-5 menit per node version

### 2. **pr-checks.yml** - Pull Request Specific Checks
**Trigger:** Pull Request events (opened, synchronize, reopened)

**Jobs:**
- ✅ Checkout kode dengan full history
- ✅ Setup Node.js (latest 20.x)
- ✅ Install dependencies
- ✅ Strict lint checking (no warnings allowed)
- ✅ TypeScript type checking
- ✅ Full build verification
- ✅ Auto comment pada PR dengan status hasil

**Duration:** ~4-6 menit

## Fitur

### ✅ Apa yang di-check:
1. **Linting** - Menggunakan ESLint untuk memastikan code style consistency
2. **Type Safety** - TypeScript compiler untuk memastikan type correctness
3. **Build Verification** - Memastikan project dapat di-build tanpa error

### ❌ Apa yang TIDAK termasuk:
- Docker build
- Image pushing ke registry
- Production deployment
- Production build optimization

## Setup Required

### 1. Branch Protection Rules (Optional tapi Recommended)
Go to Settings → Branches → Add rule untuk `main`:
```
- Require status checks to pass before merging
- Require code reviews before merging
- Require branches to be up to date before merging
```

### 2. Environment Variables (Jika diperlukan)
Tambahkan di Settings → Secrets and variables → Actions:
```
Tidak ada secret yang diperlukan saat ini untuk pipeline ini
```

## Logs dan Monitoring

### Mengakses Workflow Logs:
1. Buka GitHub repository
2. Klik tab "Actions"
3. Pilih workflow yang ingin dilihat
4. Klik run specific untuk melihat detail logs

### Status Badges:
Tambahkan ke README.md untuk menampilkan status pipeline:
```markdown
![CI Testing](https://github.com/{owner}/{repo}/actions/workflows/test.yml/badge.svg)
![PR Checks](https://github.com/{owner}/{repo}/actions/workflows/pr-checks.yml/badge.svg)
```

## Troubleshooting

### 1. Build fails dengan error tertentu
- Check logs di Actions tab
- Verifikasi dependensi di package.json
- Pastikan Node.js version compatible

### 2. ESLint errors
- Run locally: `npm run lint`
- Fix issues: `npx eslint --fix`

### 3. TypeScript errors
- Run locally: `npx tsc --noEmit`
- Check tsconfig.json settings

## Maintenance

### Update Actions Versions:
Workflows menggunakan latest versions dari:
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/github-script@v7`

Untuk update dependencies, edit workflow files dan ubah version numbers.

### Adding Tests:
Untuk menambahkan unit tests di masa depan:
1. Install test framework (Jest, Vitest, etc.)
2. Add test script ke package.json: `"test": "jest"`
3. Update workflows untuk menjalankan `npm test`

## Next Steps

1. ✅ Push workflow files ke repository
2. ✅ Go to Actions tab untuk verify workflows
3. ✅ Setup branch protection rules (optional)
4. ✅ Add status badges ke README.md
