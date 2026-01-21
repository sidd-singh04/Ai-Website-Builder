import React, { useState } from 'react'
import "./App.css"
import Navbar from './components/Navbar'
import { MdOutlineArrowUpward } from "react-icons/md";
import { ImNewTab } from "react-icons/im";
import { IoMdDownload } from "react-icons/io";
import { BiSolidShow } from "react-icons/bi";
import { FaEyeSlash } from "react-icons/fa";
import Editor from '@monaco-editor/react';
import { IoMdClose } from "react-icons/io";
import { GoogleGenAI } from "@google/genai";
import { apiKey } from "./helper.js";


import { toast } from 'react-toastify';
import { FadeLoader } from 'react-spinners';

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [isShowCode, setIsShowCode] = useState(false);
  const [isInNewTab, setIsInNewTab] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(
    `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-[10px]">
  <h1 class="text-[30px] font-[700]">Welcome to WebBuilder</h1>
</body>
</html>
    `
  );

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const extractCode = (response) => {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  };

  const downloadCode = () => {
    let blob = new Blob([code], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "webBuilderCode.html";
    a.click();
  };

  const getResponse = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt!");
      return;
    }

    setLoading(true);

    // ✅ Full instructions for AI to generate a working website
    const text_prompt = `
You are an expert frontend developer and UI/UX designer. The user will provide a detailed prompt describing what kind of website they want. Based on the user’s description, generate a fully working, production-ready website as a **single HTML file**. Use only **HTML, Tailwind CSS (via CDN)**, vanilla JavaScript, and GSAP (via CDN).  

Strict output rules:
- Return the website as a single fenced Markdown code block with the language tag.  
- Do NOT include any explanations, text, or extra code blocks outside that single block. Only the HTML file content.  

Technical requirements:
1. **Stack**: HTML + Tailwind CSS (via CDN) + vanilla JavaScript + GSAP (via CDN). Everything in one file.  
2. **Responsive**: Fully responsive (mobile, tablet, desktop) using flex and grid layouts.  
3. **Theme**: Default **dark mode**, but auto-select light mode if appropriate. Include a **toggle button** to switch between dark and light themes.  
4. **Animations & Interactions**:  
   - GSAP scroll-based animations (fade, slide, stagger, parallax).  
   - Smooth hover effects with scale, shadow, and gradient transitions.  
   - Sticky navbar with subtle shadow on scroll.  
   - Animated gradient backgrounds or floating decorative shapes.  
5. **Visual richness**:  
   - Use high-quality **royalty-free images** (Unsplash via direct URLs).  
   - Apply **soft shadows, glassmorphism, or neumorphism** effects where suitable.  
   - Modern cards, rounded corners, gradient buttons, hover animations.  
6. **UI Sections** (as per user request):  
   - Sticky **Navbar** with logo + links + theme toggle.  
   - **Hero section** with headline, subheadline, CTA button, and background image/gradient.  
   - **Main content**: features grid, product showcase, gallery, blog cards, or whatever fits user’s request.  
   - **Call to Action** with strong button.  
   - **Footer** with the text: "Made with WebBuilder"  
7. **Code quality**: Clean, semantic HTML5, ARIA labels for accessibility, well-indented, professional Tailwind usage.  
8. **Performance**: Optimized. No external CSS/JS frameworks beyond Tailwind + GSAP. Use responsive images, gradients, inline SVGs, or Unsplash placeholders.  

Website prompt: ${prompt}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text_prompt,
    });

    setCode(extractCode(response.text));
    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 md:px-[120px] mt-8">
        <h3 className='text-[30px] font-[700]'>
          Create beautiful websites with{" "}
          <span className='bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent'>WebBuilder</span>
        </h3>
        <p className='mt-2 text-[16px] text-[#b3b3b3]'>Describe your website and AI will code for you.</p>

        <div className="inputBox flex flex-col md:flex-row mt-4 gap-4">
          <textarea
            className="flex-1 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-violet-400"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Describe your website in detail.'
          />
          {prompt !== "" && (
            <i
              onClick={getResponse}
              className='sendIcon text-[20px] w-[50px] h-[50px] flex items-center justify-center bg-[#9933ff] rounded-[50%] transition-all duration-300 hover:opacity-[.8]'
            >
              <MdOutlineArrowUpward />
            </i>
          )}
        </div>

        <p className='text-[20px] font-[700] mt-[10vh]'>Your AI-Generated Website will appear here.</p>

        <div className="preview mt-4">
          <div className="header w-full flex flex-col md:flex-row justify-between items-start md:items-center p-4 h-auto md:h-[70px]">
            <h3 className='font-bold text-[16px] mb-2 md:mb-0'>Live Preview</h3>

            <div className="icons flex flex-wrap gap-2 md:gap-[15px]">
              <div onClick={() => setIsInNewTab(true)} className="icon !w-[auto] !p-[12px] flex items-center gap-[10px]">Open in new tab <ImNewTab /></div>
              <div onClick={downloadCode} className="icon !w-[auto] !p-[12px] flex items-center gap-[10px]">Download <IoMdDownload /></div>
              <div onClick={() => setIsShowCode(!isShowCode)} className="icon !w-[auto] !p-[12px] flex items-center gap-[10px]">{isShowCode ? "Hide Code" : "Show Code"} {isShowCode ? <FaEyeSlash /> : <BiSolidShow />}</div>
            </div>
          </div>

          {isShowCode ? (
            <Editor onChange={(code) => setCode(code)} height="100%" theme='vs-dark' defaultLanguage="html" value={code} />
          ) : loading ? (
            <div className='w-full h-full flex items-center justify-center flex-col'>
              <FadeLoader color='#9933ff'/>
              <h3 className='text-[23px] mt-4 font-semibold'>
                <span className='bg-gradient-to-br from-violet-400 to-purple-600 bg-clip-text text-transparent'>Generating</span> your website...
              </h3>
            </div>
          ) : (
            <iframe srcDoc={code} className='w-full bg-[white] min-h-[400px]'></iframe>
          )}
        </div>
      </div>

      {isInNewTab && (
        <div className="modelCon fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="modelBox w-full max-w-5xl bg-white rounded-md overflow-hidden">
            <div className="header w-full flex justify-end px-4 md:px-[50px] py-2 border-b">
              <div 
                className="icon text-[#9933ff] hover:text-violet-600 cursor-pointer text-2xl rounded-full p-1 bg-white"
                onClick={() => setIsInNewTab(false)}
              >
                <IoMdClose />
              </div>
            </div>
            <iframe srcDoc={code} className='w-full h-[80vh]'></iframe>
          </div>
        </div>
      )}

    </>
  )
}

export default App
