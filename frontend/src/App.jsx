import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Messaging from './pages/Messaging';
import Notifications from './pages/Notifications';
import Jobs from './pages/Jobs';
import Search from './pages/Search';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />

        <Route path="/profile" element={
          <Layout>
            <Profile />
          </Layout>
        } />

        <Route path="/messaging" element={
          <Layout>
            <Messaging />
          </Layout>
        } />

        <Route path="/notifications" element={
          <Layout>
            <Notifications />
          </Layout>
        } />

        <Route path="/jobs" element={
          <Layout>
            <Jobs />
          </Layout>
        } />

        <Route path="/search" element={
          <Layout>
            <Search />
          </Layout>
        } />

        {/* Fallback for other routes */}
        <Route path="*" element={
          <Layout>
            <div className="text-center p-10">Page Not Found</div>
          </Layout>
        } />

      </Routes>
    </Router>
  );
}

export default App;
