import React from 'react';
import { Message, View } from '../types';
import MessageItem from './MessageItem';
import { InboxIcon, ExclamationTriangleIcon } from './icons/Icons';

interface MessageListProps {
    messages: Message[];
    onToggle: (messageId: string) => void;
    view: View;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onToggle, view }) => {
    const viewConfig = {
        [View.INBOX]: {
            title: "Inbox",
            icon: <InboxIcon className="h-8 w-8 mr-3 text-cyan-400" />,
            emptyText: "Your inbox is empty. All messages are classified as spam."
        },
        [View.SPAM]: {
            title: "Spam",
            icon: <ExclamationTriangleIcon className="h-8 w-8 mr-3 text-red-400" />,
            emptyText: "No spam detected. Your inbox is clean!"
        }
    };

    const config = viewConfig[view];

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-4xl font-bold text-white mb-6 flex items-center">{config.icon}{config.title}</h1>
            
            {messages.length === 0 ? (
                <div className="flex-grow flex items-center justify-center bg-gray-800 rounded-lg">
                    <p className="text-gray-400">{config.emptyText}</p>
                </div>
            ) : (
                 <div className="space-y-4">
                    {messages.map(message => (
                        <MessageItem key={message.id} message={message} onToggle={onToggle} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageList;
