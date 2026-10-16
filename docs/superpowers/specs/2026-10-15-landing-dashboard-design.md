# Desain — Landing (Login) dan Dashboard RismaClick

Tanggal: 2026-10-15
Sumber kebenaran: `docs/requirement.md` (revisi 2026-10-15)

## 1. Tujuan

Mengubah Tahap 1 dari halaman login sederhana dan homepage berisi sapaan menjadi:
- **Landing page di `/`** yang berisi navigasi, hero dengan form login, bagian fitur, langkah kerja, CTA, dan footer.
- **Dashboard manajemen di `/dashboard`** dengan sidebar, header sapaan, kartu statistik, daftar project, dan daftar task, semuanya dari data dummy.

Login tetap memakai autentikasi dummy dan `sessionStorage`, sesuai requirement A3 dan B1.

## 2. Routing

| Path | Akses | Perilaku |
|---|---|---|
| `/` | Publik | Landing + form login. Jika sudah login → `/dashboard` (A3.6). |
| `/dashboard` | Terproteksi | Jika belum login → `/` dengan `replace` (B1.2). |
| `*` | – | Dialihkan ke `/` (perilaku lama tetap). |

Route `/login` dihapus. Tidak ada halaman login terpisah.

## 3. Struktur komponen

```
src/
  App.tsx                      Routes: "/" dan "/dashboard" (dibungkus RequireAuth)
  auth/
    RequireAuth.tsx            Tetap; redirect ke "/" jika tidak ada sesi
    RedirectIfAuthed.tsx       Baru; redirect ke "/dashboard" jika sudah ada sesi
    authenticate.ts, session.ts, validation.ts   Tidak berubah
  pages/
    LandingPage.tsx            Baru; susunan seksi landing, menyisipkan LoginForm
    DashboardPage.tsx          Baru; susunan layout dashboard
  components/
    LoginForm.tsx              Dipindah dari LoginPage; form email/password, error inline
    landing/
      Navbar.tsx               Nama "RismaClick" dan link "Sign in" (menggulir ke #login)
      Hero.tsx                 Judul, subjudul, dan kolom form
      FeatureCards.tsx         Tiga kartu fitur
      Steps.tsx                Empat langkah bernomor
      CtaFooter.tsx            CTA akhir dan footer
    dashboard/
      Sidebar.tsx              Menu Dashboard, Projects, Tasks; bisa dibuka/ditutup di mobile
      StatCards.tsx            Empat kartu statistik
      ProjectTable.tsx         Tabel nama, status, progres
      TaskList.tsx             Daftar judul, project, prioritas, status
  data/
    dashboard.ts               Satu modul data dummy: projects, tasks, dan statistik dihitung dari keduanya
```

`LoginForm` dipakai satu kali di landing. Komponen ini tidak perlu tahu tentang layout landing, sehingga bisa diuji sendiri.

## 4. Alur data

- **Login:** `LoginForm` memanggil `validateLogin` (tidak berubah) → `authenticate` → `saveSession(email)` → `navigate('/dashboard', { replace: true })`. Status pending tetap disimpan di state `LoginForm`, sehingga tombol nonaktif (A3.5) tetap berlaku.
- **Dashboard:** `DashboardPage` membaca `getSession()` sekali untuk sapaan. Data dashboard diambil dari `data/dashboard.ts`. Statistik dihitung dari daftar project dan task dummy, sehingga angka selalu konsisten dengan tabel.
- **Logout:** tidak ada (C3).

## 5. Sidebar dan responsivitas

- Di layar lebar (≥ 768px), sidebar selalu terlihat di kiri.
- Di layar kecil, sidebar tersembunyi dan dibuka dengan tombol menu di header. Tombol ini punya `aria-expanded` dan `aria-controls`.
- Tabel project dibungkus `overflow-x: auto` di dalam kontainernya, sehingga halaman tidak memiliki scroll horizontal.
- Landing: hero berubah dari dua kolom menjadi satu kolom di bawah 768px.

## 6. Penanganan error

- Error validasi dan error kredensial tetap seperti sekarang (A2, A3.2).
- Jika `sessionStorage` tidak bisa dibaca, `getSession()` mengembalikan `null` dan user diarahkan ke `/` (perilaku lama).
- Jika `getSession()` mengembalikan email yang tidak valid (misal diubah manual di devtools), dashboard tetap menampilkan apa adanya. Ini risiko yang diterima karena data hanya dummy dan tidak ada aksi sensitif.

## 7. Pengujian

Vitest (komponen dan unit):
- `RedirectIfAuthed`: sesi ada → redirect ke `/dashboard`; tidak ada → tampil children. (A3.6)
- `LandingPage`: navbar, hero, tiga kartu, empat langkah, CTA, dan footer tampil. (A1.4–A1.8)
- `LoginForm`: semua test validasi dan autentikasi yang sudah ada dipindahkan ke sini, dengan perubahan redirect ke `/dashboard`.
- `DashboardPage`: sapaan `Halo, {email}`; empat kartu statistik sesuai data dummy; tabel dan daftar task ada. (B2.1–B2.7)
- `data/dashboard.ts`: statistik dihitung dari data dummy dan cocok dengan jumlah project dan task.
- `Sidebar`: tombol menu membuka dan menutup sidebar di layar kecil; `aria-expanded` berubah.

Playwright (e2e):
- Buka `/` tanpa login → tampil landing dengan form.
- Klik "Sign in" → halaman menggulir ke form login.
- Login salah → pesan error, tetap di `/`.
- Login benar → `/dashboard` dengan `Halo, risma@example.com`.
- Refresh di `/dashboard` → tetap di sana.
- Buka `/dashboard` langsung tanpa login → `/`.
- Buka `/` saat sudah login → `/dashboard`.
- Viewport 375px: tidak ada scroll horizontal di landing dan dashboard; sidebar bisa dibuka.
- Tidak ada error atau warning di console pada alur di atas.

Verifikasi akhir: `pnpm test`, `pnpm test:e2e`, `pnpm build`, dan pengecekan manual di Chrome sesuai `CLAUDE.md` bagian 4a.

## 8. Di luar scope

- Halaman detail project atau task, dan menu Projects atau Tasks yang berfungsi.
- Logout, registrasi, lupa password.
- Backend atau penyimpanan data nyata. Semua data tetap dummy.

## 9. Pemeriksaan spec sendiri

- **Placeholder:** tidak ada TBD atau TODO.
- **Konsistensi:** route `/login` dihapus di seluruh spec. Setiap rujukan ke `/dashboard` dan `/` sama dengan tabel routing.
- **Scope:** semua komponen mengacu ke item A, B, atau C di requirement revisi.
- **Ambiguitas:** perilaku ukuran layar dan sidebar sudah ditentukan di bagian 5.
- **Catatan:** brainstorming menyarankan spec di-commit. Karena `CLAUDE.md` aturan 7 melarang commit tanpa diminta, spec belum di-commit.
