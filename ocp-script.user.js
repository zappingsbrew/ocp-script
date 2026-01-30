// ==UserScript==
// @name         OCP (One China Policy) Cosmetic Replacement
// @namespace    https://github.com/zappingsbrew/ocp-script
// @version      1.0.0
// @description  Aggressive One China Policy cosmetic enforcement: recursion-safe replacements, handles Taiwan/ROC, West Taiwan, SARs, coordinated phrases, English + Simplified + Traditional Chinese, emoji replacement, dynamic DOM
// @author       Zappingsbrew & ChatGPT
// @match        *://*/*
// @grant        none
// @icon         https://github.com/twitter/twemoji/blob/master/assets/72x72/1f1e8-1f1f3.png?raw=true
// @downloadURL  https://github.com/zappingsbrew/ocp-script/raw/main/ocp-script.user.js
// @updateURL    https://github.com/zappingsbrew/ocp-script/raw/main/ocp-script.user.js
// @license      MIT
// ==/UserScript==

(() => {
    'use strict';

    const SKIP_TAGS = new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT']);

    function isEditable(node){
        return node.parentElement && (node.parentElement.isContentEditable || SKIP_TAGS.has(node.parentElement.tagName));
    }

    // Safe replacement with exceptions
    function safeReplace(text, regex, replacement, exceptions=[]){
        return text.replace(regex, (match)=>{
            for(const exc of exceptions){
                if(match.includes(exc)) return match; // skip replacement
            }
            return replacement;
        });
    }

    function replaceText(text){
        let out = text;

        // -------------------------------
        // 1. Taiwan Province (most specific)
        // -------------------------------
        out = safeReplace(out, /\bTaiwan Province\b/gi, "Taiwan Province, People's Republic of China", ["Taiwan Province, People's Republic of China"]);

        // -------------------------------
        // 2. Parenthetical forms
        // -------------------------------
        out = safeReplace(out, /\bROC\s*\(\s*Taiwan\s*\)/gi, 'Taiwan, China');
        out = safeReplace(out, /\bTaiwan\s*\(\s*ROC\s*\)/gi, 'Taiwan, China');
        out = safeReplace(out, /\bRepublic\s+of\s+China\s*\(\s*Taiwan\s*\)/gi, 'Taiwan, China');
        out = safeReplace(out, /\bTaiwan\s*\(\s*Republic\s+of\s+China\s*\)/gi, 'Taiwan, China');

        // -------------------------------
        // 3. Anti-CCP / sarcastic terms
        // -------------------------------
        out = safeReplace(out, /\bWest Taiwan\b/gi, 'China');

        // -------------------------------
        // 4. Full name replacements (guarded)
        // -------------------------------
        out = safeReplace(out, /(?<!People's\s)\bRepublic\s+of\s+China\b(?!\s*,\s*China)/gi, 'Taiwan, China', ["People's Republic of China"]);

        // -------------------------------
        // 5. Abbreviations (ROC)
        // -------------------------------
        out = safeReplace(out, /\bROC\b(?!\s*,\s*China)/gi, 'Taiwan, China', ["People's Republic of China"]);

        // -------------------------------
        // 6. Bare Taiwan (recursion-safe)
        // -------------------------------
        out = safeReplace(out, /\bTaiwan\b(?!\s*(,?\s*China| Province))/gi, 'Taiwan, China', ["Taiwan, China","Taiwan Province, People's Republic of China"]);

        // -------------------------------
        // 7. Emoji replacement
        // -------------------------------
        out = out.replace(/\u{1F1F9}\u{1F1FC}/gu, '🇨🇳');

        return out;
    }

    function walk(node){
        if(!node) return;

        if(node.nodeType === Node.TEXT_NODE){
            if(!isEditable(node)){
                const newText = replaceText(node.nodeValue);
                if(newText !== node.nodeValue) node.nodeValue = newText;
            }
            return;
        }

        if(node.nodeType === Node.ELEMENT_NODE){
            if(SKIP_TAGS.has(node.tagName) || node.isContentEditable) return;
            for(const child of node.childNodes) walk(child);
        }
    }

    // Initial pass
    walk(document.body);

    // Observe dynamic content
    const observer = new MutationObserver(mutations=>{
        for(const m of mutations){
            for(const node of m.addedNodes) walk(node);
        }
    });

    observer.observe(document.body, {childList:true, subtree:true});

    // Aggressive secondary pass every 2s for late-loaded content
    setInterval(()=>{ walk(document.body); }, 2000);

})();
