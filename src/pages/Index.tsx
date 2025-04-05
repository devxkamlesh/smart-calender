import { CalendarProvider } from "@/context/CalendarContext";
import Layout from "@/components/Layout";
import Dashboard from "./Dashboard";
import { Route, Routes } from "react-router-dom";
import Calendar from "./Calendar";
import Tasks from "./Tasks";
import Focus from "./Focus";
import Settings from "./Settings";
import Profile from "./Profile";
import ExpenseTracker from "./ExpenseTracker";
import AdvancedAnalysis from "./AdvancedAnalysis";
import Notes from "./Notes";

const Index = () => {
  return (
    <CalendarProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
          <Route path="/analysis" element={<AdvancedAnalysis />} />
        </Routes>
      </Layout>
    </CalendarProvider>
  );
};

export default Index;
