import React from 'react';
import { ShieldCheckIcon, DocumentTextIcon, LockClosedIcon } from './icons/Icons';

interface OnboardingProps {
    onGrant: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onGrant }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-lg p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl text-center">
                <div className="flex justify-center">
                    <ShieldCheckIcon className="h-20 w-20 text-cyan-400" />
                </div>
                <h1 className="text-4xl font-bold text-white">Welcome to IntelliSpam Shield</h1>
                <p className="text-lg text-gray-300">
                    Your AI-powered guardian against unwanted messages. To get started, we need your permission to scan incoming SMS messages for spam.
                </p>

                <div className="space-y-4 text-left p-6 bg-gray-700/50 rounded-lg">
                    <div className="flex items-start">
                        <DocumentTextIcon className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0" />
                        <div className="ml-4">
                            <h3 className="font-semibold text-white">What We Access</h3>
                            <p className="text-gray-400">We only read the content of incoming messages to classify them.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <LockClosedIcon className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0" />
                        <div className="ml-4">
                            <h3 className="font-semibold text-white">Your Privacy is Paramount</h3>
                            <p className="text-gray-400">Your messages are processed securely and are never shared. You can revoke this permission at any time in the settings.</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onGrant}
                    className="w-full px-5 py-4 text-lg font-semibold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50 transition-transform transform hover:scale-105"
                >
                    Grant Permission & Protect My Inbox
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
