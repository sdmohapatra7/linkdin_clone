import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import { getRoles } from '../features/roles/roleSlice';
import Spinner from '../components/Spinner';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
    });

    const { name, email, password, confirmPassword, role } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );
    const { roles } = useSelector((state) => state.role);

    useEffect(() => {
        dispatch(getRoles());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleNext = (e) => {
        e.preventDefault();

        // Basic validation before proceeding
        if (step === 1) {
            if (!email || !password || !confirmPassword) {
                toast.error('Please fill in all fields');
                return;
            }
            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
        }
        if (step === 2 && !name) {
            toast.error('Please enter your full name');
            return;
        }

        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!role) {
            toast.error('Please select a role');
            return;
        }

        const userData = {
            name,
            email,
            password,
            role,
        };

        dispatch(register(userData));
    };

    if (isLoading) {
        return <Spinner />;
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={onChange}
                                    className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password (6+ characters)</label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={onChange}
                                    className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={onChange}
                                    className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex w-full justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all mt-6"
                        >
                            Continue
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={onChange}
                                    className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                                    placeholder="John Doe"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex flex-1 justify-center rounded-lg border border-gray-300 bg-white py-3 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex flex-1 justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">How do you want to use JobsHub?</label>

                            <div className="space-y-3">
                                {roles.map((r) => (
                                    <div
                                        key={r._id}
                                        onClick={() => setFormData({ ...formData, role: r._id })}
                                        className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${role === r._id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50' : 'border-gray-300 bg-white hover:border-blue-400'}`}
                                    >
                                        <span className="flex flex-1">
                                            <span className="flex flex-col">
                                                <span className={`block text-sm font-medium ${role === r._id ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {r.name === 'Recruiter' ? 'I want to hire' : 'I want to find a job'}
                                                </span>
                                                <span className={`mt-1 flex items-center text-sm ${role === r._id ? 'text-blue-700' : 'text-gray-500'}`}>
                                                    {r.name === 'Recruiter'
                                                        ? 'Post a job and find top talent.'
                                                        : 'Create a profile and easily apply to jobs.'}
                                                </span>
                                            </span>
                                        </span>
                                        <input
                                            type="radio"
                                            name="role"
                                            value={r._id}
                                            checked={role === r._id}
                                            onChange={onChange}
                                            className="h-4 w-4 mt-1 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 text-center mt-4">
                            By clicking Agree & Join, you agree to the JobsHub User Agreement, Privacy Policy, and Cookie Policy.
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex flex-1 justify-center rounded-lg border border-gray-300 bg-white py-3 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                onClick={onSubmit}
                                className="flex flex-1 justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                            >
                                Agree & Join
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <img src="/favicon.png" alt="JobsHub Logo" className="h-10 w-10" />
                            <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">JobsHub</h1>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">

                        {/* Progress Tracker */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div className={`h-2 w-1/3 rounded-l-full sm:mr-2 mr-1 transition-all ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                <div className={`h-2 w-1/3 rounded-none sm:mx-2 mx-1 transition-all ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                <div className={`h-2 w-1/3 rounded-r-full sm:ml-2 ml-1 transition-all ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                            </div>
                            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2 px-1">
                                <span className={step >= 1 ? 'text-blue-600' : ''}>Account</span>
                                <span className={step >= 2 ? 'text-blue-600 text-center' : 'text-center'}>Profile</span>
                                <span className={step >= 3 ? 'text-blue-600 text-right' : 'text-right'}>Role</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <form className="space-y-6">
                                {renderStep()}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Image/Decoration */}
            <div className="relative hidden w-0 flex-1 lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-blue-600 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>

                    <div className="absolute inset-0 flex flex-col justify-center px-16 text-white z-10">
                        <h2 className="text-4xl font-bold mb-6 max-w-lg leading-tight">
                            Your next chapter starts right here.
                        </h2>
                        <ul className="space-y-4 text-lg text-blue-100 max-w-md">
                            <li className="flex items-center">
                                <span className="mr-3 text-blue-300">✓</span> Showcase your expertise
                            </li>
                            <li className="flex items-center">
                                <span className="mr-3 text-blue-300">✓</span> Connect with industry leaders
                            </li>
                            <li className="flex items-center">
                                <span className="mr-3 text-blue-300">✓</span> Discover exclusive job opportunities
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
