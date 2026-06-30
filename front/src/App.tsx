import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import Layout from "./layouts/Layout"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import './styles/style.scss';
import GroupCreate from "./pages/GroupCreate"
import GroupList from "./pages/GroupList"
import GroupDetail from "./pages/GroupDetail"

function App() {

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="group-create" element={<GroupCreate />} />
            <Route path="group-list" element={<GroupList />} />
            <Route path="group-detail/:id" element={<GroupDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
