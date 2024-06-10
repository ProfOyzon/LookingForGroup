import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as paths from "./constants/routes";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={paths.routes.DEFAULT} element={<Home />} />
          <Route path={paths.routes.HOME} element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
