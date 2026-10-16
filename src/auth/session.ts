const SESSION_KEY = 'rismaclick.session'

// Akses storage bisa melempar error (mode private, storage diblokir), jadi selalu dibungkus try/catch.
export function getSession(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export function saveSession(email: string): void {
  try {
    sessionStorage.setItem(SESSION_KEY, email)
  } catch {
    // Gagal menyimpan: user tetap diarahkan ke Homepage, tetapi sesi tidak bertahan saat refresh.
  }
}
