'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { db } from './firebase/config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

interface Essay {
  id: string;
  prompt: string;
  guidelines: string;
  content: string;
  analysis: any;
  userId: string;
  createdAt: Date;
}

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [essay, setEssay] = useState('');
  const [prompt, setPrompt] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [analysis, setAnalysis] = useState<null | any>(null);
  const [loading, setLoading] = useState(false);
  const [essays, setEssays] = useState<Essay[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    // Load user's essays
    const loadEssays = async () => {
      const essaysQuery = query(
        collection(db, 'essays'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(essaysQuery);
      const essayList: Essay[] = [];
      querySnapshot.forEach((doc) => {
        essayList.push({ id: doc.id, ...doc.data() } as Essay);
      });
      setEssays(essayList);
    };

    loadEssays();
  }, [user, router]);

  const analyzeEssay = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          essay,
          prompt,
          guidelines,
        }),
      });
      const data = await response.json();
      setAnalysis(data);

      // Save to Firestore
      await addDoc(collection(db, 'essays'), {
        prompt,
        guidelines,
        content: essay,
        analysis: data,
        userId: user.uid,
        createdAt: new Date(),
      });

      // Refresh essays list
      const essaysQuery = query(
        collection(db, 'essays'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(essaysQuery);
      const essayList: Essay[] = [];
      querySnapshot.forEach((doc) => {
        essayList.push({ id: doc.id, ...doc.data() } as Essay);
      });
      setEssays(essayList);
    } catch (error) {
      console.error('Error analyzing essay:', error);
    }
    setLoading(false);
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Essay Prompt
            </label>
            <textarea
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-primary transition-shadow duration-200 hover:shadow-sm"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the essay prompt or question..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guidelines/Rubric
            </label>
            <textarea
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-primary transition-shadow duration-200 hover:shadow-sm"
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              placeholder="Enter any specific guidelines, requirements, or rubric..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Essay
            </label>
            <textarea
              className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-primary transition-shadow duration-200 hover:shadow-sm"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Paste your essay here..."
            />
          </div>

          <button
            onClick={analyzeEssay}
            disabled={loading || !essay}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-primary flex items-center justify-center gap-2 hover:shadow-md"
          >
            {loading ? (
              <>
                <CloudArrowUpIcon className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Essay'
            )}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-200 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
            {analysis ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Suggestions</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    {analysis.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="text-gray-700">{suggestion}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Thought-Provoking Questions</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    {analysis.questions.map((question: string, index: number) => (
                      <li key={index} className="text-gray-700">{question}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                Submit your essay to receive AI-powered analysis and suggestions for improvement.
              </p>
            )}
          </div>

          {essays.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Previous Essays</h2>
              <div className="space-y-4">
                {essays.map((essay) => (
                  <div
                    key={essay.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
                  >
                    <h3 className="font-medium text-gray-900">{essay.prompt}</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      {new Date(essay.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 