# Auto-Generate Pull Request

Sistem untuk auto-generate Pull Request description/review dari git changes.

## Cara Kerja (2 Fase)

1. **Fase Metadata (script)** — `generate-pr.sh` otomatis mengisi: repo, branch,
   daftar file, jumlah baris (+/-), diff stat, dan commits.
2. **Fase Analisis (AI/manual)** — untuk type `lead`/`hod`, file hasil berisi
   placeholder `<!-- REVIEW:* -->` dan tabel `TBD` yang diisi oleh reviewer
   (via opencode command `/generate-pr` atau manual).

## Struktur

```
~/Developer/agent_opencode/
└── pull_request/
    ├── generate-pr.sh                     # Main script
    ├── templates/
    │   ├── basic.md
    │   ├── lead-review.md
    │   └── hod-review.md
    ├── output/                            # OUTPUT (per app)
    │   └── <app_name>/
    │       └── pull_request_<datetime>.md
    └── README.md

~/.config/opencode/command/generate-pr.md  # opencode command
```

## Penggunaan

### Via Script

```bash
S=~/Developer/agent_opencode/pull_request/generate-pr.sh

# Basic (default), current branch
"$S"

# Tipe + branch + PR number
"$S" lead improvements/pickup-report/08062026
"$S" hod  request/SCA-Ticketing/17062026 515
```

Argumen:
1. `type`   : `basic` | `lead` | `hod`  (default `basic`)
2. `branch` : target branch             (default: current branch)
3. `pr_number` : nomor PR untuk URL     (default: `TBD`)

### Via opencode

Gunakan keyword:
- "generate pr" / "make pr description" → **basic**
- "as lead review ..." → **lead**
- "as hod review ..." → **hod**

## Logika Pemilihan Diff (otomatis)

Script memilih sumber perubahan dengan prioritas:
1. `origin/<branch>` vs base branch  (jika ada perbedaan)
2. `<branch>` lokal vs base branch
3. Working tree (uncommitted changes) vs `HEAD`

Base branch dideteksi otomatis: `origin/master` → `origin/main` → `master` → `main`.

## Output Naming

`pull_request_<datetime>.md` — jika sudah ada (detik sama), otomatis menambah
suffix `_1`, `_2`, dst untuk menghindari overwrite.

Output tersimpan di:
```
~/Developer/agent_opencode/pull_request/output/<app_name>/pull_request_<datetime>.md
```

## Variabel Template

| Variable | Keterangan |
|----------|------------|
| `{{REPO}}` | Nama repository |
| `{{BRANCH}}` | Branch |
| `{{PR_NUMBER}}` | Nomor PR (default TBD) |
| `{{AUTHOR}}` | git user.name |
| `{{DATE}}` / `{{DATETIME}}` | Tanggal / timestamp |
| `{{SUMMARY}}` | Ringkasan otomatis |
| `{{FILES_COUNT}}` | Jumlah file |
| `{{BACKEND_COUNT}}` | File `.php` |
| `{{FRONTEND_COUNT}}` | File `.js`/`.ts` |
| `{{BLADE_COUNT}}` | File `.blade.php` |
| `{{NEW_FILES}}` | File baru |
| `{{LINES_ADDED}}` / `{{LINES_REMOVED}}` | Total +/- baris |
| `{{COMMITS_COUNT}}` | Jumlah commit |
| `{{COMMITS}}` | Daftar commit |
| `{{DIFF_STAT}}` | Statistik diff |
| `{{FILES_MODIFIED}}` | Tabel markdown file (template basic) |

## Setup

```bash
chmod +x ~/Developer/agent_opencode/pull_request/generate-pr.sh
```

opencode command sudah tersedia di `~/.config/opencode/command/generate-pr.md`.
