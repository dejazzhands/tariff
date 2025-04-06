'use client';
import { useSearchParams } from 'next/navigation';

export default function Result() {
    const searchParams = useSearchParams();
    const response = searchParams.get('response');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-12">
            <h1 className="text-2xl font-bold mb-4">Import Price Calculation Result</h1>
            <pre className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-2xl">
                {response ? JSON.stringify(JSON.parse(response), null, 4) : 'No response available'}
            </pre>
        </div>
    );
}