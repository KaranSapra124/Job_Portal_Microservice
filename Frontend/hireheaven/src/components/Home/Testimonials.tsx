import React from 'react'
import { Star, Quote } from 'lucide-react'

const testimonialsData = [
    {
        id: 1,
        name: "Arjun Mehta",
        role: "Software Engineer",
        company: "Tech Mahindra",
        content: "Hire Heaven's priority application feature actually works. I was getting ignored for months, but after upgrading, I landed 3 interviews in a week.",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=arjun"
    },
    {
        id: 2,
        name: "Sarah Williams",
        role: "Product Designer",
        company: "Adobe",
        content: "The resume analyzer gave me feedback I never considered. It completely changed how I present my portfolio to recruiters.",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        id: 3,
        name: "Vikram Singh",
        role: "Data Analyst",
        company: "Swiggy",
        content: "A very clean and fast portal. No spam, just high-quality job postings. The microservices architecture definitely makes the site feel snappy!",
        rating: 4,
        image: "https://i.pravatar.cc/150?u=vikram"
    }
]

const Testimonials = () => {
    return (
        <section className="py-12 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                <div className="text-center mb-5">
                    <h2 className="text-blue-600 border-blue-600 border-2 w-fit  mx-auto px-2 rounded-l-full rounded-r-full font-bold uppercase tracking-[0.2em] text-xs mb-4">
                        Success Stories
                    </h2>
                    <h3 className="text-xl md:text-4xl font-black text-gray-900 tracking-tight">
                        Loved by <span className="text-blue-600">thousands</span> of seekers
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonialsData.map((t) => (
                        <div 
                            key={t.id} 
                            className="relative bg-gray-50 rounded-[2.5rem] p-8 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 group"
                        >
                            <Quote className="absolute top-8 right-8 text-blue-100 group-hover:text-blue-200 transition-colors" size={40} />
                            
                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-gray-600 font-medium italic leading-relaxed mb-8 relative z-10">
                                "{t.content}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl overflow-hidden bg-gray-200 shadow-inner">
                                    <img 
                                        src={t.image} 
                                        alt={t.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 leading-none">{t.name}</h4>
                                    <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-tighter">
                                        {t.role} @ <span className="text-blue-600">{t.company}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials