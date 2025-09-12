import React, { useState } from 'react';
import { GoogleIcon, FacebookIcon, LogoIcon, MailIcon } from '../common/Icons';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [view, setView] = useState<'login' | 'register' | 'confirm'>('login');
    const [email, setEmail] = useState('');

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userEmail = formData.get('email-register') as string;
        setEmail(userEmail);
        setView('confirm');
    };
    
    const handleActivateAccount = () => {
        alert('¡Cuenta activada! Ahora puedes iniciar sesión.');
        setView('login');
    };
    
    const commonCardClasses = "w-full transition-all duration-500 ease-in-out absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 space-y-6";
    const visibleClasses = "opacity-100 z-10 scale-100";
    const hiddenClasses = "opacity-0 z-0 scale-95 pointer-events-none";

    const FormInput = ({ id, type, placeholder, required = true, icon }: { id: string, type: string, placeholder: string, required?: boolean, icon: React.ReactNode }) => (
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                {icon}
            </span>
            <input id={id} name={id} type={type} required={required} className="input-field pl-10" placeholder={placeholder} />
        </div>
    );

    const SocialButton = ({ provider, icon, onClick }: { provider: string, icon: React.ReactNode, onClick: () => void }) => (
        <button onClick={onClick} type="button" className="flex-1 flex items-center justify-center gap-2 border border-neutral-300 dark:border-neutral-600 rounded-md py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold transition-colors">
            {icon} {provider}
        </button>
    );

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl min-h-[650px] bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl flex overflow-hidden">
                {/* Branding Panel */}
                <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                <img  src="/images/logo.png"  alt="Recytoken Logo"  className="mx-auto h-16 w-auto"/>
                    <h1 className="text-4xl font-bold mt-4">RECYTOKEN-UP</h1>
                    <p className="mt-2 text-primary-200">Transformando el reciclaje en Nicaragua con tecnología Blockchain.</p>
                </div>

                {/* Forms Panel */}
                <div className="w-full md:w-1/2 relative flex items-center justify-center">
                    
                    {/* Login View */}
                    <div className={`${commonCardClasses} ${view === 'login' ? visibleClasses : hiddenClasses}`}>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Bienvenido de Nuevo</h2>
                            <p className="text-neutral-500 dark:text-neutral-400 mt-1">Inicia sesión para continuar.</p>
                        </div>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                            <FormInput id="email-login" type="email" placeholder="tu@correo.com" icon={<MailIcon className="w-5 h-5" />} />
                            <FormInput id="password-login" type="password" placeholder="••••••••" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>} />
                            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 font-semibold transition-colors shadow-sm hover:shadow-md">
                                Entrar
                            </button>
                        </form>
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-neutral-300 dark:border-neutral-600"></div>
                            <span className="flex-shrink mx-4 text-neutral-400 text-sm">o continuar con</span>
                            <div className="flex-grow border-t border-neutral-300 dark:border-neutral-600"></div>
                        </div>
                        <div className="flex gap-4">
                            <SocialButton provider="Google" icon={<GoogleIcon />} onClick={onLogin} />
                            <SocialButton provider="Facebook" icon={<FacebookIcon />} onClick={onLogin} />
                        </div>
                        <div className="text-center text-sm">
                            ¿No tienes cuenta? <button onClick={() => setView('register')} className="font-semibold text-primary-600 hover:underline">Regístrate</button>
                        </div>
                    </div>

                    {/* Register View */}
                    <div className={`${commonCardClasses} ${view === 'register' ? visibleClasses : hiddenClasses}`}>
                         <div className="text-center">
                             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Crear Cuenta</h2>
                             <p className="text-neutral-500 dark:text-neutral-400 mt-1">Únete a la revolución del reciclaje.</p>
                         </div>
                        <form className="space-y-4" onSubmit={handleRegister}>
                            <FormInput id="name-register" type="text" placeholder="Nombre Completo" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>} />
                            <FormInput id="email-register" type="email" placeholder="tu@correo.com" icon={<MailIcon className="w-5 h-5" />} />
                            <FormInput id="password-register" type="password" placeholder="Contraseña" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>} />
                            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 font-semibold transition-colors shadow-sm hover:shadow-md">
                                Crear Cuenta
                            </button>
                        </form>
                        <div className="text-center text-sm">
                            ¿Ya tienes cuenta? <button onClick={() => setView('login')} className="font-semibold text-primary-600 hover:underline">Inicia Sesión</button>
                        </div>
                    </div>
                    
                    {/* Confirmation View */}
                    <div className={`${commonCardClasses} ${view === 'confirm' ? visibleClasses : hiddenClasses}`}>
                        <div className="flex flex-col items-center text-center">
                            <div className="p-4 bg-primary-100 dark:bg-primary-900/50 rounded-full">
                                <MailIcon className="h-12 w-12 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Confirma tu Correo</h2>
                            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                                Hemos enviado un enlace a <strong className="text-neutral-800 dark:text-neutral-200">{email}</strong>.
                            </p>
                            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                                Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                            </p>
                            <button 
                                onClick={handleActivateAccount} 
                                className="w-full mt-6 bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 font-semibold"
                            >
                                Activar Cuenta (Simulado)
                            </button>
                            <div className="mt-4 text-sm">
                                <button onClick={() => setView('login')} className="font-semibold text-primary-600 hover:underline">Volver a Inicio</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
