import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Ana Sayfa', icon: '🏠' },
  { path: '/publishers', label: 'Yayıncılar', icon: '🏢' },
  { path: '/categories', label: 'Kategoriler', icon: '📂' },
  { path: '/authors', label: 'Yazarlar', icon: '✍️' },
  { path: '/books', label: 'Kitaplar', icon: '📚' },
  { path: '/borrows', label: 'Kitap Alma', icon: '📖' },
]

function Layout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ width: '1200px', margin: '0 auto' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/50 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Kütüphane
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Yönetim Sistemi</p>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <p className="text-slate-400 text-xs">
            Patika.dev Capstone Projesi
          </p>
          <p className="text-slate-500 text-xs mt-1">
            © 2024
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout
