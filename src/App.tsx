
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { classifyMessage } from './services/geminiService';
import { Message, Classification, View } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import MessageList from './components/MessageList';
import { ShieldCheckIcon, InboxIcon, ExclamationTriangleIcon, PlusIcon, ArrowPathIcon } from './components/icons/Icons';
import { INITIAL_MESSAGES } from './constants';

const App: React.FC = () => {
    const [smsPermissionGranted, setSmsPermissionGranted] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isClassifying, setIsClassifying] = useState<boolean>(false);

    const classifyInitialMessages = useCallback(async () => {
        setIsLoading(true);
        const classifiedMessages = await Promise.all(
            INITIAL_MESSAGES.map(async (msg, index) => {
                try {
                    const result = await classifyMessage(msg.content);
                    // FIX: Map properties from classification result to the Message type correctly.
                    return {
                        ...msg,
                        id: `msg-${Date.now()}-${index}`,
                        classification: result.classification,
                        modelConfidence: result.confidence,
                        userCorrected: false,
                    };
                } catch (error) {
                    console.error("Failed to classify message:", msg.content, error);
                    return {
                        ...msg,
                        id: `msg-${Date.now()}-${index}`,
                        classification: Classification.NOT_SPAM,
                        modelConfidence: 0.5,
                        userCorrected: false,
                    };
                }
            })
        );
        setMessages(classifiedMessages);
        setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (smsPermissionGranted) {
            classifyInitialMessages();
        }
    }, [smsPermissionGranted, classifyInitialMessages]);
    
    const handleGrantPermission = () => {
        setSmsPermissionGranted(true);
    };

    const handleRevokePermission = () => {
        setSmsPermissionGranted(false);
        setMessages([]);
    };

    const handleToggleClassification = (messageId: string) => {
        setMessages(prevMessages =>
            prevMessages.map(msg => {
                if (msg.id === messageId) {
                    return {
                        ...msg,
                        classification: msg.classification === Classification.SPAM ? Classification.NOT_SPAM : Classification.SPAM,
                        userCorrected: true
                    };
                }
                return msg;
            })
        );
    };

    const simulateNewMessage = async () => {
        const sampleMessages = [
            "URGENT: Your account has been compromised! Click http://bit.ly/reset-now to secure it.",
            "Hey, are we still on for dinner tonight at 7? Let me know!",
            "You've won a $1000 gift card! Claim it here: sketchy-link.com/winner",
            "Your Amazon package with order #A123BC456 has been delivered. Thank you for your order!",
            "FINAL NOTICE: Your car's extended warranty is about to expire. Call 800-123-4567 now!"
        ];
        const randomContent = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        
        setIsClassifying(true);
        try {
            const result = await classifyMessage(randomContent);
            // FIX: Map properties from classification result to the Message type correctly.
            const newMessage: Message = {
                id: `msg-${Date.now()}`,
                sender: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                content: randomContent,
                timestamp: new Date().toISOString(),
                userCorrected: false,
                classification: result.classification,
                modelConfidence: result.confidence,
            };
            setMessages(prev => [newMessage, ...prev]);
        } catch (error) {
            console.error("Failed to simulate and classify new message:", error);
        } finally {
            setIsClassifying(false);
        }
    };

    const spamMessages = useMemo(() => messages.filter(m => m.classification === Classification.SPAM), [messages]);
    const inboxMessages = useMemo(() => messages.filter(m => m.classification === Classification.NOT_SPAM), [messages]);

    if (!smsPermissionGranted) {
        return <Onboarding onGrant={handleGrantPermission} />;
    }

    return (
        <HashRouter>
            <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
                <nav className="w-64 bg-gray-800 p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center mb-8">
                            <ShieldCheckIcon className="h-10 w-10 text-cyan-400" />
                            <h1 className="ml-2 text-2xl font-bold text-white">IntelliSpam</h1>
                        </div>
                        <ul>
                            <NavItem to="/" icon={<InboxIcon className="h-5 w-5" />} text="Dashboard" />
                            <NavItem to="/inbox" icon={<InboxIcon className="h-5 w-5" />} text="Inbox" count={inboxMessages.length} />
                            <NavItem to="/spam" icon={<ExclamationTriangleIcon className="h-5 w-5" />} text="Spam" count={spamMessages.length} />
                        </ul>
                        <div className="mt-8">
                             <button
                                onClick={simulateNewMessage}
                                disabled={isClassifying}
                                className="w-full flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                {isClassifying ? <ArrowPathIcon className="h-5 w-5 animate-spin"/> : <PlusIcon className="h-5 w-5" />}
                                <span className="ml-2">{isClassifying ? 'Classifying...' : 'New Message'}</span>
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleRevokePermission}
                        className="w-full text-left text-sm text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-md hover:bg-gray-700"
                    >
                        Revoke Permissions
                    </button>
                </nav>
                <main className="flex-1 p-8 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <ArrowPathIcon className="h-12 w-12 mx-auto animate-spin text-cyan-400" />
                                <p className="mt-4 text-lg">Scanning and classifying messages...</p>
                            </div>
                        </div>
                    ) : (
                        <Routes>
                            <Route path="/" element={<Dashboard messages={messages} />} />
                            <Route path="/inbox" element={<MessageList messages={inboxMessages} onToggle={handleToggleClassification} view={View.INBOX} />} />
                            <Route path="/spam" element={<MessageList messages={spamMessages} onToggle={handleToggleClassification} view={View.SPAM} />} />
                        </Routes>
                    )}
                </main>
            </div>
        </HashRouter>
    );
};

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    text: string;
    count?: number;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, text, count }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
        <li className="mb-2">
            <NavLink
                to={to}
                className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                {icon}
                <span className="ml-3 font-medium">{text}</span>
                {count !== undefined && (
                    <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full ${
                        isActive ? 'bg-white text-cyan-600' : 'bg-gray-600 text-gray-200'
                    }`}>
                        {count}
                    </span>
                )}
            </NavLink>
        </li>
    );
};

export default App;
