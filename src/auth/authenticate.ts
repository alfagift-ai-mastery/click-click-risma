// Data dummy untuk tahap 1 (A3.1). Ganti isi `authenticate` dengan panggilan API
// di tahap berikutnya; pemanggil tidak perlu berubah.
export const DUMMY_USER = {
  email: 'risma@example.com',
  password: 'Passw0rd!',
} as const

// Penundaan buatan agar status "sedang memeriksa" (A3.5) bisa diamati dan diuji.
// Hapus saat diganti API sungguhan.
export const AUTH_DELAY_MS = 300

export type AuthResult = { ok: true; email: string } | { ok: false }

export function authenticate(email: string, password: string): Promise<AuthResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matches =
        email.trim().toLowerCase() === DUMMY_USER.email && password === DUMMY_USER.password
      resolve(matches ? { ok: true, email: DUMMY_USER.email } : { ok: false })
    }, AUTH_DELAY_MS)
  })
}
