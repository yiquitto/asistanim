import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmailInbox from './pages/EmailInbox';
import TaskBoard from './pages/TaskBoard';
import MeetingPanel from './pages/MeetingPanel';
import RiskPanel from './pages/RiskPanel';
import MemorySearch from './pages/MemorySearch';
import { TaskProvider } from './context/TaskContext';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="email" element={<EmailInbox />} />
            <Route path="tasks" element={<TaskBoard />} />
            <Route path="meetings" element={<MeetingPanel />} />
            <Route path="risks" element={<RiskPanel />} />
            <Route path="memory" element={<MemorySearch />} />
          </Route>
        </Routes>
      </TaskProvider>
    </BrowserRouter>
  );
}

export default App;
