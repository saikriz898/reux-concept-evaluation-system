import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Zap, BarChart3, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">R</div>
            <span className="text-xl font-bold font-heading text-slate-900 tracking-tight">REUX</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary">Log in</Link>
            <Link to="/register" className="btn btn-primary text-sm px-6">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 inline-block">
              Built for Sri College of Engineering
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
              Evaluate <span className="text-primary">Understanding</span>,<br />
              Not Just Memorization.
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              REUX uses advanced AI to assess conceptual depth, reasoning ability, and 
              originality in student responses. Production-grade academic evaluation for the next generation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn btn-primary btn-lg px-8 py-4 text-lg w-full sm:w-auto">
                Start Evaluating Now
                <ChevronRight size={20} />
              </Link>
              <button className="btn bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 px-8 py-4 text-lg w-full sm:w-auto">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Academia</h2>
            <p className="text-slate-600">Everything you need to run high-stakes exams with confidence.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Brain />, title: "AI-Powered Evaluation", desc: "Automated scoring of subjective answers with deep conceptual analysis." },
              { icon: <Shield />, title: "Anti-Cheat System", desc: "Tab switch detection, randomized questions, and IP tracking." },
              { icon: <BarChart3 />, title: "Weak Area Detection", desc: "Automatically identify concepts where students need more help." },
              { icon: <Zap />, title: "Real-time Feedback", desc: "Students get detailed, constructive feedback immediately after evaluation." },
              { icon: <Zap />, title: "Plagiarism Check", desc: "Advanced similarity detection between student submissions." },
              { icon: <BarChart3 />, title: "Rich Analytics", desc: "Detailed performance trends and class-wide topic analysis." },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100 group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  {React.cloneElement(f.icon, { size: 24 })}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">R</div>
            <span className="text-xl font-bold text-white tracking-tight">REUX</span>
          </div>
          <p className="mb-6">Built with precision for Sri College of Engineering.</p>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} REUX Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
