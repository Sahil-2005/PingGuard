import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin 
                ? { email, password } 
                : { email, password, displayName };
                
            const { data } = await api.post(endpoint, payload);
            login(data.token, data.email, data.displayName);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#99E1D9] flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black p-8 max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-4xl font-black mb-6 uppercase tracking-tight">
                    {isLogin ? 'Welcome Back' : 'Join PingGuard'}
                </h1>
                
                {error && (
                    <div className="bg-[#FF847C] text-black border-4 border-black font-bold p-3 mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label className="block font-bold mb-2 uppercase text-sm">Display Name</label>
                            <Input 
                                type="text" 
                                value={displayName} 
                                onChange={(e) => setDisplayName(e.target.value)} 
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm">Email</label>
                        <Input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-2 uppercase text-sm">Password</label>
                        <Input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            minLength={8}
                        />
                    </div>

                    <Button type="submit" variant="primary" className="w-full text-xl mt-4">
                        {isLogin ? 'Login' : 'Create Account'}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t-4 border-black text-center">
                    <p className="font-bold mb-4">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign Up Now' : 'Login Instead'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
