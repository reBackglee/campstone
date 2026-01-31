import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import PublishersPage from './pages/PublishersPage'
import CategoriesPage from './pages/CategoriesPage'
import AuthorsPage from './pages/AuthorsPage'
import BooksPage from './pages/BooksPage'
import BorrowsPage from './pages/BorrowsPage'

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/publishers" element={<PublishersPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/borrows" element={<BorrowsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
