import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, BarChart3, Users, Activity, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="font-bold text-white text-xl">+</span>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              MediMind
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Pharmacy Management System 
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight text-white">
            Manage your pharmacy <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              smarter & faster.
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Streamline inventory, track sales, and generate insights with our modern,
            platform designed for the next generation of healthcare.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-gray-700 hover:border-gray-600"
            >
              Live Demo
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden aspect-video flex items-center justify-center group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
              <div className="relative text-center p-8">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <Activity size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Real-time Analytics</h3>
                <p className="text-gray-300">Monitor your business performance instantly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Everything you need</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powerful features to help you run your pharmacy business efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Zap}
              title="Fast Billing"
              desc="Process sales in seconds with our optimized checkout flow."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Secure Inventory"
              desc="Track every pill with batch tracking and expiry alerts."
            />
            <FeatureCard
              icon={BarChart3}
              title="Smart Reports"
              desc="Get detailed insights into sales trends and stock levels."
            />
            <FeatureCard
              icon={Users}
              title="Staff Management"
              desc="Manage roles and permissions for your entire team."
            />
            <FeatureCard
              icon={Globe}
              title="Cloud Based"
              desc="Access your pharmacy data from anywhere, anytime."
            />
            <FeatureCard
              icon={Activity}
              title="Predictions"
              desc="Forecast demand to prevent stockouts and overstocking."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">+</span>
            </div>
            <span className="text-xl font-bold text-white">MediMind</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 MediMind Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="p-8 rounded-2xl bg-gray-800 border border-gray-700 hover:border-emerald-500/50 transition-all hover:-translate-y-1 group">
    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
      <Icon size={24} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
);
