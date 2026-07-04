import { useEffect } from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ChatWidget } from './components/ChatWidget'
import { Home } from './pages/Home'
import { Particuliers } from './pages/Particuliers'
import { Cartes } from './pages/Cartes'
import { Credits } from './pages/Credits'
import { Entreprises } from './pages/Entreprises'
import { Banque } from './pages/Banque'
import { Agences } from './pages/Agences'
import { Contact } from './pages/Contact'
import { DevenirClient } from './pages/DevenirClient'
import { NotFound } from './pages/NotFound'
import { DemoApp } from './demo/DemoApp'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/particuliers" element={<Particuliers />} />
          <Route path="/cartes" element={<Cartes />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/entreprises" element={<Entreprises />} />
          <Route path="/banque" element={<Banque />} />
          <Route path="/agences" element={<Agences />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/devenir-client" element={<DevenirClient />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/mybiat/*" element={<DemoApp />} />
      </Routes>
    </>
  )
}
