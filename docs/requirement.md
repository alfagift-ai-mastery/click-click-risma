# Requirement — RismaClick (Tahap 1: Landing & Dashboard)

Lihat aturan kerja dan cara verifikasi di `CLAUDE.md`. Desain teknis ada di `docs/superpowers/specs/2026-10-15-landing-dashboard-design.md`. Urutan pengerjaan ada di `docs/implementation-plan.md`, pemantauan progres di `docs/progess.md`.

> **Revisi 2026-10-15:** Scope diperluas. Login sekarang menjadi landing page di `/`, dan Homepage menjadi dashboard manajemen di `/dashboard`. Item yang berubah sudah diimplementasi dan diverifikasi otomatis (60 test unit, 11 test e2e) dan diverifikasi manual di Chrome (lihat `docs/progess.md`).

Keterangan status:
- `[ ]` belum dikerjakan atau perlu diverifikasi ulang
- `[x]` selesai dan sudah terverifikasi
- `[?]` menunggu keputusan user (lihat bagian **Pertanyaan Terbuka**)

---

## A. Landing & Login (route `/`)

### A1. Tampilan
- [x] A1.1 Halaman `/` memiliki input `email`
- [x] A1.2 Halaman `/` memiliki input `password` dengan tipe masked (karakter tersembunyi)
- [x] A1.3 Halaman `/` memiliki tombol submit "Login"
- [x] A1.4 Navigasi atas berisi nama "RismaClick" dan link "Sign in" yang menggulir ke form login
- [x] A1.5 Hero berisi judul dan subjudul tentang project management, serta form login di sebelahnya
- [x] A1.6 Bagian fitur menampilkan tiga kartu: Project, Task, dan Progres
- [x] A1.7 Bagian langkah kerja menampilkan empat langkah bernomor
- [x] A1.8 CTA akhir dan footer sederhana; tombol CTA menggulir ke form login

### A2. Validasi Input
- [x] A2.1 Email kosong → tampil pesan error di dekat field email, form tidak dikirim
- [x] A2.2 Password kosong → tampil pesan error di dekat field password, form tidak dikirim
- [x] A2.3 Email dan password kosong bersamaan → kedua pesan error tampil sekaligus
- [x] A2.4 Email harus berupa alamat email yang valid; jika tidak valid → tampil pesan error di dekat field email, form tidak dikirim
- [x] A2.5 Password minimal 8 karakter dan mengandung minimal 1 huruf, 1 angka, dan 1 karakter spesial; jika tidak terpenuhi → tampil pesan error di dekat field password, form tidak dikirim

### A3. Proses Autentikasi
- [x] A3.1 Kredensial dicek terhadap data dummy (hardcoded) yang berada di satu modul tersendiri, agar mudah diganti API di tahap berikutnya
- [x] A3.2 Kredensial salah → tampil pesan error umum (misal: "Incorrect email or password"), user tetap di `/`
- [x] A3.3 Kredensial benar → sistem menyimpan status login user
- [x] A3.4 Kredensial benar → redirect ke `/dashboard`
- [x] A3.5 Selama proses pengecekan, tombol submit tidak bisa ditekan ulang (mencegah submit ganda)
- [x] A3.6 User yang sudah login dan membuka `/` → redirect ke `/dashboard`

---

## B. Dashboard (route `/dashboard`)

Istilah "Homepage" di dokumen sebelumnya berarti halaman ini.

### B1. Akses
- [x] B1.1 Dashboard hanya bisa dibuka jika user sudah login
- [x] B1.2 Membuka `/dashboard` tanpa login (termasuk akses langsung via URL) → redirect ke `/`
- [x] B1.3 Status login tetap bertahan setelah halaman di-refresh, dan hilang ketika tab ditutup (disimpan di `sessionStorage`)

### B2. Tampilan
- [x] B2.1 Header dashboard menampilkan teks persis `Halo, {email}`
- [x] B2.2 `{email}` diisi dengan email dari user yang sedang login
- [x] B2.3 Sidebar kiri berisi menu Dashboard, Projects, dan Tasks; menu hanya tampilan dan tidak membuka halaman lain
- [x] B2.4 Empat kartu statistik dummy: total project, task aktif, task selesai, dan task terlambat
- [x] B2.5 Tabel daftar project dummy dengan kolom nama, status, dan progres
- [x] B2.6 Daftar task terbaru dummy dengan kolom judul, project, prioritas, dan status
- [x] B2.7 Semua data dashboard berasal dari satu modul dummy

---

## C. Kualitas Umum (berlaku untuk seluruh tahap)

- [x] C1. Landing, login, dan dashboard berjalan di layar desktop dan mobile (lebar layar 375px ke atas). Di layar kecil, sidebar bisa dibuka dan ditutup, dan halaman tidak memiliki scroll horizontal
- [x] C2. Tidak ada error di console browser pada alur utama
- [x] C3. Tidak ada fitur di luar bagian A dan B (termasuk logout, registrasi, lupa password, dan halaman detail project atau task)

---

## Asumsi

Asumsi berikut dipakai karena belum ada keputusan eksplisit dari user. Bisa diubah kapan saja.

1. **Field login** adalah `email` (bukan `username`). Sapaan di dashboard memakai email: `Halo, {email}`.
2. **Teks sapaan** tetap `Halo, ...` (Bahasa Indonesia) meskipun bahasa antarmuka lain Inggris. Ini keputusan user.
3. **Karakter spesial** pada password berarti karakter apa pun yang bukan huruf dan bukan angka (misal `!@#$%`).
4. **Layout landing**: navigasi di atas, hero dengan form di satu sisi (desktop) dan bertumpuk (mobile). Gaya visual mengikuti kesan bersih dan minimal, tanpa menyalin brand atau teks dari referensi.
5. **Error validasi**: tampil inline di bawah field saat form disubmit, semua error muncul sekaligus, dan error pada sebuah field hilang saat user mulai mengubah isinya.
6. **Teks pesan error** (Bahasa Inggris):
   - "Email is required"
   - "Enter a valid email address"
   - "Password is required"
   - "Password must be at least 8 characters and include a letter, a number, and a special character"
   - "Incorrect email or password"
7. **Penundaan buatan** ±300 ms pada pengecekan kredensial dummy, supaya perilaku A3.5 bisa diuji. Penundaan ini dihapus saat diganti API.
8. **Link "Sign in"** hanya menggulir ke form login; tidak ada halaman terpisah.
9. **Menu Projects dan Tasks** di sidebar tidak punya halaman. Klik pada menu tersebut tidak melakukan apa pun.
10. **Data dashboard** hanya beberapa baris dummy. Jumlahnya tidak perlu banyak, dan angka pada kartu statistik dihitung dari data dummy tersebut.

---

## Pertanyaan Terbuka

Semua pertanyaan dari tahap sebelumnya sudah dijawab. Tidak ada pertanyaan baru.

1. **Stack teknologi** — Frontend dan backend pakai apa?
   - Jawaban: **React + Vite + TypeScript** (frontend saja, tanpa backend di tahap ini). Test otomatis memakai Vitest, Testing Library, dan Playwright.
2. **Sumber autentikasi (A3.1)** — Kredensial dicek dari mana?
   - Jawaban: Data hardcoded/dummy untuk tahap ini
3. **Aturan validasi (A2.4 dan A2.5)** — Apa batas panjang dan format email serta password?
   - Jawaban: Email harus berupa alamat email yang valid. Password minimal 8 karakter, dengan kombinasi huruf, angka, dan karakter spesial. Keduanya tidak boleh kosong.
   - Catatan: "kombinasi" diartikan ketiganya wajib ada sekaligus (dikonfirmasi user).
4. **Persistensi login (B1.3)** — Apakah user tetap login setelah refresh halaman, atau cukup sampai tab ditutup?
   - Jawaban: Ya, lewat sessionStorage
5. **Logout** — Apakah tombol logout termasuk tahap ini?
   - Jawaban: tidak
6. **Bahasa antarmuka** — Label dan pesan error memakai Bahasa Indonesia atau Inggris?
   - Jawaban: Inggris (kecuali teks sapaan `Halo, {email}`)
7. **Alur route (revisi 2026-10-15)** — Login menjadi landing di `/`, dashboard di `/dashboard`, dan sapaan tetap ada.
   - Jawaban: sesuai rancangan yang disetujui user ("ya sudah sesuai").
