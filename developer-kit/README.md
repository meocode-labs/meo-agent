# Developer Kit — Use Case Scaffold

Sistem untuk auto-generate folder `usecase-NNN/` berisi 3 file:
`requirements.md`, `tasks.md`, `tdd.md` dari brief deskriptif.

## Struktur

```
~/Developer/agent_opencode/developer-kit/
├── developer-kit.sh                  # Main script
├── templates/
│   ├── requirements.md               # Template requirements
│   ├── tasks.md                      # Template tasks breakdown
│   └── tdd.md                        # Template TDD plan
└── README.md

~/.config/opencode/command/developer-kit.md  # opencode command (/developer-kit)
```

## Cara Pakai

### Via Script (Manual)

```bash
S=~/Developer/agent_opencode/developer-kit/developer-kit.sh

# 1) Docs directory belum ada → akan dibuat
"$S" ./docs "Add login with OAuth2"

# 2) Docs directory sudah ada → auto-increment usecase-NNN
"$S" ./docs "Pickup report improvements"

# 3) Dengan explicit number (3 digit)
"$S" ./docs "Custom numbered use case" 5

# 4) Custom docs path
"$S" ~/Developer/office/ivosights/commercial/app-pipeline/docs "Add payment gateway"
```

Argumen:
1. `docs_dir`         : target directory (akan dibuat jika belum ada)
2. `brief`            : deskripsi singkat use case
3. `usecase_number`   : (opsional) nomor explicit, 3 digit dengan leading zero

### Via opencode

```
/developer-kit                                          # Tanya docs dir + brief interaktif
/developer-kit add login with OAuth2                    # Brief dari argumen
/developer-kit ./docs pickup report improvements        # Docs dir + brief
/developer-kit 5 explicit numbered use case             # Brief + explicit number
```

### Interaktif Prompt (Native TUI Popup)

Jika argumen tidak lengkap, command akan trigger **native TUI popup** via
`question` tool (UX yang sama seperti `/connect` dan `/models`):

| Prompt | Trigger |
|--------|---------|
| "Describe the use case in one sentence — what should be built?" | Tidak ada brief di argumen |
| "Where should the docs folder live?" | Docs dir tidak ter-resolve |
| "usecase-005 already exists. How should I proceed?" | Nomor konflik dengan folder ada |

User bisa:
- Pilih dari opsi (default/sample values)
- Ketik jawaban sendiri (free-text)
- Navigate antar multiple questions sebelum submit

## Counter Logic

- Auto-detect folder `usecase-NNN` tertinggi yang ada
- Next folder = `usecase-(NNN+1)` (zero-padded 3 digit)
- Contoh: `usecase-001, 002, 005` ada → next = `usecase-006`
- Bisa override dengan explicit number argumen ke-3

## Generated Files

| File | Isi |
|------|-----|
| `requirements.md` | Functional & non-functional requirements, acceptance criteria, assumptions, constraints |
| `tasks.md` | 5-phase task breakdown (Discovery, Design, Implementation, Quality, Release) dengan checklist |
| `tdd.md` | Test matrix, edge cases, performance tests, security tests, CI/CD integration |

## Reference Template

`~/Developer/office/ivosights/commercial/app-pipeline/docs/usecase-001/`

## Setup

```bash
chmod +x ~/Developer/agent_opencode/developer-kit/developer-kit.sh
```

opencode command sudah tersedia di `~/.config/opencode/command/developer-kit.md`.

## Restart Required

Restart opencode untuk aktivasi command `/developer-kit` (config di-load saat startup).
