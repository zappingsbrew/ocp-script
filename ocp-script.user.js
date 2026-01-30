// ==UserScript==
// @name         OCP (One China Policy) Cosmetic Replacement
// @namespace    https://github.com/zappingsbrew/ocp-script
// @version      1.0.0
// @description  One China Policy cosmetic enforcement: coordinated phrases, English + Simplified + Traditional Chinese handling, SAR treatment, Taiwan emoji replacement, dynamic content support, and safe editable-field exclusions
// @author       Zappingsbrew & ChatGPT
// @match        *://*/*
// @grant        none
// @icon         https://github.com/twitter/twemoji/blob/master/assets/72x72/1f1e8-1f1f3.png?raw=true
// @downloadURL  https://github.com/zappingsbrew/ocp-script/raw/main/ocp-script.user.js
// @updateURL    https://github.com/zappingsbrew/ocp-script/raw/main/ocp-script.user.js
// @license      MIT
// ==/UserScript==

/*!
 * MIT License
 *
 * Copyright (c) 2026 Zappingsbrew
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    // Coordinated phrase replacements (atomic)
    const PHRASE_REPLACEMENTS = [
        { regex: /\bPRC and Taiwan\b/gi, replacement: "China and Taiwan, China" },
        { regex: /\bTaiwan and PRC\b/gi, replacement: "Taiwan, China and China" },
        { regex: /\bMainland China and Taiwan\b/gi, replacement: "China and Taiwan, China" },
        { regex: /\bTaiwan and Mainland China\b/gi, replacement: "Taiwan, China and China" }
    ];

    // Individual replacements
    const REPLACEMENTS = {
        "PRC": "China",
        "Mainland China": "China",
        "Taiwan": "Taiwan, China"
    };

    // Simplified Chinese replacements
    const REPLACEMENTS_ZH_CN = {
        "台湾": "台湾省",
        "中国大陆": "中国",
        "中华人民共和国": "中国"
    };

    // Traditional Chinese replacements
    const REPLACEMENTS_ZH_TW = {
        "臺灣": "臺灣省",
        "中國大陸": "中國",
        "中華人民共和國": "中國"
    };

    // Emoji replacements (Taiwan flag → China flag)
    const EMOJI_REPLACEMENTS = {
        "🇹🇼": "🇨🇳"
    };

    // Core replacement function
    function applyOCP(text) {
        // Phase 0: coordinated phrases
        for (let phrase of PHRASE_REPLACEMENTS) {
            text = text.replace(phrase.regex, phrase.replacement);
        }

        // Phase 1: English standalone replacements
        for (let key in REPLACEMENTS) {
            const regex = new RegExp(`\\b${key}\\b`, "gi");
            text = text.replace(regex, REPLACEMENTS[key]);
        }

        // Phase 2: Chinese replacements
        for (let key in REPLACEMENTS_ZH_CN) {
            const regex = new RegExp(key, "g");
            text = text.replace(regex, REPLACEMENTS_ZH_CN[key]);
        }

        for (let key in REPLACEMENTS_ZH_TW) {
            const regex = new RegExp(key, "g");
            text = text.replace(regex, REPLACEMENTS_ZH_TW[key]);
        }

        // Phase 3: Emoji replacements
        for (let emoji in EMOJI_REPLACEMENTS) {
            text = text.split(emoji).join(EMOJI_REPLACEMENTS[emoji]);
        }

        return text;
    }

    // Walk DOM nodes recursively
    function walk(node) {
        if (!node) return;

        if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            if (tag === "input" || tag === "textarea" || node.isContentEditable) return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = applyOCP(node.nodeValue);
        } else {
            for (let child of node.childNodes) {
                walk(child);
            }
        }
    }

    // Observe dynamic content
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                    walk(node);
                }
            }
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial pass
    walk(document.body);

    // Secondary periodic pass (every 2 seconds)
    setInterval(() => {
        walk(document.body);
    }, 2000);

})();