import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import Layout from "./layouts/Layout"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"

function App() {

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
