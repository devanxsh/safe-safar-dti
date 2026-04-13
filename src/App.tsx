import { BrowserRouter, Routes, Route } from "react-router-dom";

// TEMP SAFE IMPORTS (to avoid build crash)
const HomePage = () => <h1>Home Page</h1>;
const NotFoundPage = () => <h1>404 Not Found</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;