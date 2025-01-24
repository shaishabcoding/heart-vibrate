import { Toaster } from "sonner";
import Sidebar from "./components/sidebar";

export default function App() {
  return (
    <div className="h-screen w-full">
      <Toaster />
      <Sidebar />
    </div>
  );
}
