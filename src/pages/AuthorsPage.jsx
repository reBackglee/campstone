import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { supabase } from '../lib/supabase'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import LoadingSpinner from '../components/LoadingSpinner'

function AuthorsPage() {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    country: ''
  })

  useEffect(() => {
    fetchAuthors()
  }, [])

  const fetchAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      setAuthors(data || [])
    } catch (error) {
      toast.error('Yazarlar yüklenirken hata oluştu!')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (selectedAuthor) {
        const { error } = await supabase
          .from('authors')
          .update({
            name: formData.name,
            birth_date: formData.birth_date || null,
            country: formData.country || null
          })
          .eq('id', selectedAuthor.id)

        if (error) throw error
        toast.success('Yazar başarıyla güncellendi!')
      } else {
        const { error } = await supabase
          .from('authors')
          .insert([{
            name: formData.name,
            birth_date: formData.birth_date || null,
            country: formData.country || null
          }])

        if (error) throw error
        toast.success('Yazar başarıyla eklendi!')
      }

      setIsModalOpen(false)
      resetForm()
      fetchAuthors()
    } catch (error) {
      toast.error('İşlem sırasında hata oluştu!')
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', selectedAuthor.id)

      if (error) throw error
      toast.success('Yazar başarıyla silindi!')
      fetchAuthors()
    } catch (error) {
      toast.error('Silme işlemi sırasında hata oluştu!')
    }
  }

  const openEditModal = (author) => {
    setSelectedAuthor(author)
    setFormData({
      name: author.name,
      birth_date: author.birth_date || '',
      country: author.country || ''
    })
    setIsModalOpen(true)
  }

  const openDeleteDialog = (author) => {
    setSelectedAuthor(author)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setSelectedAuthor(null)
    setFormData({ name: '', birth_date: '', country: '' })
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">✍️</span> Yazarlar
          </h1>
          <p className="text-slate-400 mt-1">Yazarları ekleyin, düzenleyin ve silin</p>
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
          Yeni Yazar
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-700/30">
              <th className="text-left text-slate-300 font-medium px-6 py-4">ID</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Yazar Adı</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Doğum Tarihi</th>
              <th className="text-left text-slate-300 font-medium px-6 py-4">Ülke</th>
              <th className="text-right text-slate-300 font-medium px-6 py-4">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author, index) => (
              <tr 
                key={author.id} 
                className={`border-t border-slate-700/30 hover:bg-slate-700/20 transition-colors ${
                  index % 2 === 0 ? 'bg-slate-800/20' : ''
                }`}
              >
                <td className="px-6 py-4 text-slate-400">{author.id}</td>
                <td className="px-6 py-4 text-white font-medium">{author.name}</td>
                <td className="px-6 py-4 text-slate-300">{formatDate(author.birth_date)}</td>
                <td className="px-6 py-4 text-slate-300">{author.country || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(author)}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteDialog(author)}
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
            ))}
          </tbody>
        </table>

        {authors.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Henüz yazar eklenmemiş.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAuthor ? 'Yazar Düzenle' : 'Yeni Yazar Ekle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Yazar Adı *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Yazar adını girin"
              required
            />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Doğum Tarihi
            </label>
            <input
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Ülke
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Ülke adını girin"
            />
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
              {selectedAuthor ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Yazarı Sil"
        message={`"${selectedAuthor?.name}" yazarını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
      />
    </div>
  )
}

export default AuthorsPage
