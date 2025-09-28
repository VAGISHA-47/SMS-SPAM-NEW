import React from 'react';
import { Message, Classification } from '../types';
import { ArrowUturnLeftIcon, CheckBadgeIcon } from './icons/Icons';

interface MessageItemProps {
    message: Message;
    onToggle: (messageId: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onToggle }) => {
    const isSpam = message.classification === Classification.SPAM;
    const confidenceColor = message.modelConfidence > 0.9 ? 'text-green-400' : message.modelConfidence > 0.7 ? 'text-yellow-400' : 'text-red-400';

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700/50 transition-colors duration-200 flex items-start space-x-4">
            <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-lg text-white">{message.sender}</p>
                    <span className="text-xs text-gray-400">{formatDate(message.timestamp)}</span>
                </div>
                <p className="text-gray-300 mb-3">{message.content}</p>
                <div className="flex items-center text-xs text-gray-400 space-x-4">
                   <div className="flex items-center">
                        <span className="font-semibold mr-1.5">AI Confidence:</span>
                        <span className={`font-bold ${confidenceColor}`}>{(message.modelConfidence * 100).toFixed(0)}%</span>
                   </div>
                   {message.userCorrected && (
                       <div className="flex items-center text-cyan-400">
                           <CheckBadgeIcon className="h-4 w-4 mr-1"/>
                           <span className="font-semibold">User Corrected</span>
                       </div>
                   )}
                </div>
            </div>
            <button
                onClick={() => onToggle(message.id)}
                title={isSpam ? "Move to Inbox" : "Move to Spam"}
                className={`p-2 rounded-full transition-colors duration-200 ${isSpam ? 'hover:bg-cyan-500/20 text-cyan-400' : 'hover:bg-red-500/20 text-red-400'}`}
            >
                <ArrowUturnLeftIcon className="h-5 w-5"/>
            </button>
        </div>
    );
};

export default MessageItem;
