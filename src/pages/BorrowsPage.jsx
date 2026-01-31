import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { supabase } from '../lib/supabase'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'

function BorrowsPage() {
  const [borrows, setBorrows] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBorrow, setSelectedBorrow] = useState(null)
  const [formData, setFormData] = useState({
    borrower_name: '',
    borrow_date: '',
    return_date: '',
    book_id: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [borrowsRes, booksRes] = await Promise.all([
        supabase.from('borrows').select(`
          *,
          books(id, title)
        `).order('id', { ascending: true }),
        supabase.from('books').select('id, title').order('title')
      ])

      if (borrowsRes.error) throw borrowsRes.error
      setBorrows(borrowsRes.data || [])
      setBooks(booksRes.data || [])
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu!')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const borrowData = {
        borrower_name: formData.borrower_name,
        borrow_date: formData.borrow_date,
        return_date: formData.return_date || null,
        book_id: formData.book_id ? parseInt(formData.book_id) : null
      }

      if (selectedBorrow) {
        const { error } = await supabase
          .from('borrows')
          .update(borrowData)
          .eq('id', selectedBorrow.id)

        if (error) throw error
        toast.success('Ödünç kaydı başarıyla güncellendi!')
      } else {
        const { error } = await supabase
          .from('borrows')
          .insert([borrowData])

        if (error) throw error
        toast.success('Ödünç kaydı başarıyla eklendi!')
      }

      setIsModalOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      toast.error('İşlem sırasında hata oluştu!')
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('borrows')
        .delete()
        .eq('id', selectedBorrow.id)

      if (error) throw error
      toast.success('Ödünç kaydı başarıyla silindi!')
      fetchData()
    } catch (error) {
      toast.error('Silme işlemi sırasında hata oluştu!')
    }
  }

  const openEditModal = (borrow) => {
    setSelectedBorrow(borrow)
    setFormData({
      borrower_name: borrow.borrower_name,
      borrow_date: borrow.borrow_date || '',
      return_date: borrow.return_date || '',
      book_id: borrow.book_id || ''
    })
    setIsModalOpen(true)
  }

  const openDeleteDialog = (borrow) => {
    setSelectedBorrow(borrow)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setSelectedBorrow(null)
    setFormData({
      borrower_name: '',
      borrow_date: '',
      return_date: '',
      book_id: ''
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  const getStatus = (borrow) => {
    if (borrow.return_date) {
      return { label: 'İade Edildi', color: 'bg-green-500/20 text-green-400' }
    }
    return { label: 'Ödünçte', color: 'bg-yellow-500/20 text-yellow-400' }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📖</span> Kitap Alma İşlemleri
          </h1>
          <p className="text-slate-400 mt-1">Ödünç alma işlemlerini yönetin</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition-all font-medium flex items-center gap-2 shadow-lg shadow-blue-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Ödünç Kaydı
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-700/30">
              <th className="text-left text-slate-300 font-medium px-6 py-4">ID</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Ödünç Alan</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Kitap</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Alış Tarihi</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">İade Tarihi</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Durum</th>
              <th className="text-right text-slate-300 font-medium px-6 py-4">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((borrow, index) => {
              const status = getStatus(borrow)
              return (
                <tr 
                  key={borrow.id} 
                  className={`border-t border-slate-700/30 hover:bg-slate-700/20 transition-colors ${
                    index % 2 === 0 ? 'bg-slate-800/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-slate-400">{borrow.id}</td>
                  <td className="px-6 py-4 text-white font-medium">{borrow.borrower_name}</td>
                  <td className="px-6 py-4 text-slate-300">{borrow.books?.title || '-'}</td>
                  <td className="px-6 py-4 text-slate-300">{formatDate(borrow.borrow_date)}</td>
                  <td className="px-6 py-4 text-slate-300">{formatDate(borrow.return_date)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(borrow)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openDeleteDialog(borrow)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {borrows.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Henüz ödünç kaydı eklenmemiş.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBorrow ? 'Ödünç Kaydı Düzenle' : 'Yeni Ödünç Kaydı'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Ödünç Alan Kişi *
            </label>
            <input
              type="text"
              value={formData.borrower_name}
              onChange={(e) => setFormData({ ...formData, borrower_name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Ödünç alan kişinin adını girin"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Kitap *
            </label>
            <select
              value={formData.book_id}
              onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Kitap Seçin</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Alış Tarihi *
              </label>
              <input
                type="date"
                value={formData.borrow_date}
                onChange={(e) => setFormData({ ...formData, borrow_date: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                İade Tarihi
              </label>
              <input
                type="date"
                value={formData.return_date}
                onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition-all font-medium"
            >
              {selectedBorrow ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Ödünç Kaydını Sil"
        message={`Bu ödünç kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
      />
    </div>
  )
}

export default BorrowsPage
