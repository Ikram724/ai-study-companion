import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function AppLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#030507] text-white selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] h-[300px] w-[300px] rounded-full bg-blue-600/5 blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="flex">
        <Sidebar />

        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <Topbar title={title} subtitle={subtitle} />
          
          <main className="flex-1 px-4 md:px-8 py-8 max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

