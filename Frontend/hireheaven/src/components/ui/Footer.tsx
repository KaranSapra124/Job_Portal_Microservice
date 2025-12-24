import React from 'react'
import Link from 'next/link'
import { BriefcaseBusiness, Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-xl">
                <BriefcaseBusiness className="text-white" size={20} />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900">
                Hire<span className="text-blue-600">Heaven</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Making the job search experience seamless and faster for professionals worldwide through modern technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Navigation</h4>
              <Link href="/" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/jobs" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Browse Jobs</Link>
              <Link href="/about" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">About Us</Link>
            </div>

            {/* <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Support</h4>
              <Link href="/contact" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
              <Link href="/privacy" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</Link>
            </div> */}

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Social</h4>
              <div className="flex gap-4">
                <Link href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  <Twitter size={18} />
                </Link>
                <Link href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  <Linkedin size={18} />
                </Link>
                <Link href="#" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                  <Github size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
            © {new Date().getFullYear()} TalentLoop. Built with Precision.
          </p>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
           All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer