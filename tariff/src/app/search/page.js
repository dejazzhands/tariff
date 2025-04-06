'use client'
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';

// Simulated API for commodities
// async function fetchTrendingCommodities() {
//   try {
//     const response = await fetch("https://localhost:5000/usda/top-exports-json");
//     const data = await response.json();

//     if (data.status === "success") {
//       return data.data.map((item) => ({
//         name: item.name,
//         price: parseFloat(item.value.toFixed(2)), // value is price
//       }));
//     } else {
//       console.error("Error fetching commodities:", data.message);
//       return [];
//     }
//   } catch (err) {
//     console.error("Failed to fetch from backend:", err);
//     return [];
//   }
// }



// this is the landing page. it contains the search bar using Gemini and displays trending commodities
// people are purchasing.

export default function Search() {

    const [userInput, setUserInput] = useState('');
    const router = useRouter();
  

    // useEffect(() => {
    //   fetchTrendingCommodities().then(setTrending);
    // }, []);
  
    //handle submission for gemini
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      console.log("User input:", userInput);

      try {
        // Send the user query to the backend
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userInput }),
      });
    
        if (!response.ok) {
            throw new Error('Failed to fetch the response from the backend');
        }
    
        const data = await response.json();
    
        // Navigate to a new page with the response
        router.push({
            pathname: '/result',
            query: { response: JSON.stringify(data.result) },
        });
      } 
      catch (error) {
          console.error('Error:', error.message);
      }
    };
    

    // default value before plumbing with API for trending commodities
    const [trending, setTrending] = React.useState([
        { name: "Wheat", price: 231.42 },
        { name: "Soybeans", price: 318.29 },
        { name: "Corn", price: 187.56 },
      ]);
    
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-12 pb-24 gap-20 sm:p-24 font-[family-name:var(--font-geist-sans)]">
        <header className="text-center mb-12">
            {/* this image should be the new logo */}
            <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={200}
            height={42}
            priority
            />
        </header>

      <main className="flex flex-col gap-[40px] row-start-2 items-center sm:items-start">
    
{/* 
          <div className="grid w-full max-w-md items-center gap-2 scale-140">
            <Label htmlFor="search">What produce would you like to buy?</Label>
            <form method="GET" action="/search" className="flex w-full max-w-sm items-center space-x-2">
              <Input type="text" placeholder="I'm importing 100 kilograms of avocado from Mexico" />
              <Button type="submit">Search</Button>
            </form>
          </div> */}

          <div className="grid w-full max-w-md items-center gap-2 scale-140">
                    <Label htmlFor="search">What produce would you like to buy?</Label>
                    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="I'm importing 100 kilograms of avocado from Mexico"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        <Button type="submit">Search</Button>
                    </form>
        </div>

        <div>
            <h2 className="text-xl font-bold mb-4">Trending Commodities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {trending.map((item, index) => (
                <div key={index} className="rounded-2xl p-4 shadow-md border bg-white dark:bg-gray-950">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                </div>
                ))}
            </div>
        </div>


        <div className="flex gap-6 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-12 sm:h-14 px-5 sm:px-6 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={24}
              height={24}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-12 sm:h-14 px-5 sm:px-6 w-full sm:w-auto md:w-[180px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>

      
      <footer className="row-start-3 flex gap-[28px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={18}
            height={18}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={18}
            height={18}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={18}
            height={18}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
