import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as paths from "./constants/routes";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";
import SideBar from "./components/Sidebar";

function App() {
  return (
    <div className="App">
      <SideBar />
      <BrowserRouter>
        <Routes>
          <Route path={paths.routes.DEFAULT} element={<Home />} />
          <Route path={paths.routes.HOME} element={<Home />} />
          <Route path={paths.routes.NOTFOUND} element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
