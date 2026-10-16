interface SidebarProps {
  open: boolean
  onClose: () => void
}

// Menu hanya tampilan (B2.3). Projects dan Tasks belum punya halaman.
// Tombol tutup hanya tampil di layar kecil, karena di desktop sidebar selalu terlihat.
export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <aside id="sidebar" className={open ? 'sidebar open' : 'sidebar'} aria-label="Sidebar">
      <div className="sidebar-top">
        <p className="sidebar-brand">RismaClick</p>
        <button type="button" className="sidebar-close" aria-label="Close menu" onClick={onClose}>
          ×
        </button>
      </div>
      <ul className="sidebar-menu">
        <li aria-current="page">Dashboard</li>
        <li>Projects</li>
        <li>Tasks</li>
      </ul>
    </aside>
  )
}
