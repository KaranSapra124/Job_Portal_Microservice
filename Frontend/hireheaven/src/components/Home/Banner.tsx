import React from 'react'
import { ArrowRight, Zap, Users, Sparkles } from 'lucide-react'

const Banner = () => {
  return (
    <div className=" mx-auto  ">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-12 md:py-20 text-center shadow-2xl">
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Small badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-white/20 text-blue-50 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={14} className="text-yellow-300" />
            Launch Your Career
          </div>

          <h2 className="text-xl md:text-4xl font-black text-white mb-4 leading-[1.15]">
            Ready to make your 
            <span className="text-blue-200 ml-2">next big move?</span>
          </h2>

          <p className="text-blue-100 text-sm  md:text-xl font-semibold mb-4 opacity-90 leading-relaxed">
            Join 5,000+ professionals who found their dream roles this month. 
            Get prioritized by top tech companies today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-4 py-2 bg-white text-blue-700 font-black rounded-sm hover:bg-blue-50 transition-all shadow-xl hover:shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2 group">
              Get Started Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
           
          </div>
        </div>

      
      </div>
    </div>
  )
}

export default Banner