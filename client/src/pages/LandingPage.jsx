import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Zap, ShieldCheck, Clock } from 'lucide-react';

const features = [
    { icon: <Zap size={40}/>, title: "Lightning Fast", desc: "Global edge network pings your API in milliseconds." },
    { icon: <ShieldCheck size={40}/>, title: "Unbreakable", desc: "Enterprise-grade reliability that never sleeps." },
    { icon: <Clock size={40}/>, title: "10s Intervals", desc: "We check your site more often than you check your phone." }
];

export const LandingPage = () => {
    return (
        <div className="flex-grow flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full px-4 py-20 md:py-32 flex flex-col items-center text-center border-b-4 border-black bg-[#FFF6A3]">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                        Stop Guessing.<br/>
                        <span className="text-[#FF847C]">Start Knowing.</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-bold mb-12 max-w-2xl mx-auto">
                        The brutalist uptime monitor for billion dollar SaaS companies. We ping your endpoints so you don't have to.
                    </p>
                    <Link to="/login">
                        <Button variant="primary" className="text-2xl px-12 py-6">
                            Start Monitoring For Free
                        </Button>
                    </Link>
                </motion.div>
            </section>

            {/* Marquee */}
            <div className="w-full overflow-hidden border-b-4 border-black bg-[#99E1D9] py-4 whitespace-nowrap flex">
                <motion.div 
                    className="flex font-black text-2xl uppercase tracking-widest gap-8"
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                    <span>• 99.999% UPTIME</span>
                    <span>• INSTANT ALERTS</span>
                    <span>• ZERO CONFIGURATION</span>
                    <span>• BUILT FOR SPEED</span>
                    <span>• 99.999% UPTIME</span>
                    <span>• INSTANT ALERTS</span>
                    <span>• ZERO CONFIGURATION</span>
                    <span>• BUILT FOR SPEED</span>
                </motion.div>
            </div>

            {/* Features */}
            <section className="w-full max-w-7xl mx-auto px-4 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform"
                        >
                            <div className="bg-[#99E1D9] border-4 border-black w-16 h-16 flex items-center justify-center mb-6">
                                {f.icon}
                            </div>
                            <h3 className="text-3xl font-black uppercase mb-4">{f.title}</h3>
                            <p className="text-lg font-bold text-gray-700">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};
