import React, { useState } from 'react';
import { classifyMessage } from '../services/geminiService';
import { ClassificationResult, Classification } from '../types';
import { BeakerIcon, ArrowPathIcon } from './icons/Icons';

const Sandbox: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [result, setResult] = useState<ClassificationResult | null>(null);
    const [isClassifying, setIsClassifying] = useState<boolean>(false);

    const handleClassify = async () => {
        if (!inputText.trim()) {
            setResult(null);
            return;
        }
        setIsClassifying(true);
        setResult(null);
        try {
            const classificationResult = await classifyMessage(inputText);
            setResult(classificationResult);
        } catch (error) {
            console.error("Failed to classify in sandbox:", error);
        } finally {
            setIsClassifying(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white flex items-center">
                <BeakerIcon className="h-9 w-9 mr-4 text-purple-400" />
                Manual Input Sandbox
            </h1>
            <p className="text-gray-400">
                Test the AI's classification ability. Type or paste any message below and see the result instantly. This message will not be saved.
            </p>
            
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter SMS content here..."
                    className="w-full h-40 p-4 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-none text-gray-200"
                    aria-label="Message content input"
                />
                <button
                    onClick={handleClassify}
                    disabled={isClassifying || !inputText.trim()}
                    className="mt-4 w-full flex items-center justify-center bg-purple-500 hover:bg-purple-600 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-lg"
                >
                    {isClassifying ? (
                        <>
                            <ArrowPathIcon className="h-6 w-6 animate-spin" />
                            <span className="ml-2">Classifying...</span>
                        </>
                    ) : (
                        'Analyze Message'
                    )}
                </button>
            </div>

            {result && (
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Classification Result</h2>
                    <div className={`p-4 rounded-lg border-2 ${result.classification === Classification.SPAM ? 'border-red-400 bg-red-500/10' : 'border-cyan-400 bg-cyan-500/10'}`}>
                        <p className="text-lg">
                            <span className="font-semibold text-gray-300">Classification:</span>
                            <span className={`ml-2 font-bold text-2xl ${result.classification === Classification.SPAM ? 'text-red-400' : 'text-cyan-400'}`}>
                                {result.classification}
                            </span>
                        </p>
                        <p className="text-lg mt-2">
                            <span className="font-semibold text-gray-300">AI Confidence:</span>
                            <span className="ml-2 font-bold text-xl text-white">
                                {(result.confidence * 100).toFixed(1)}%
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sandbox;
