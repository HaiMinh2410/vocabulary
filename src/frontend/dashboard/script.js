document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Setup Chart Gradient
    setupChartGradient();

    // 3. Fetch and Render Data
    if (typeof CONFIG !== 'undefined') {
        fetchDashboardData();
    } else {
        console.error('Dashboard configuration matching CONFIG is missing.');
    }
});

function setupChartGradient() {
    const svgChart = document.querySelector('.circular-chart');
    if (svgChart) {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        gradient.setAttribute("id", "chart-gradient");
        gradient.setAttribute("x1", "0%");
        gradient.setAttribute("y1", "0%");
        gradient.setAttribute("x2", "100%");
        gradient.setAttribute("y2", "100%");
        
        const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "#5B9CFF");
        
        const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", "#8F7CFF");
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svgChart.appendChild(defs);

        const circlePath = document.querySelector('.circular-chart .circle');
        if (circlePath) {
            circlePath.style.stroke = "url(#chart-gradient)";
        }
    }
}

async function fetchDashboardData() {
    const endpoint = `${CONFIG.SUPABASE_URL}/rest/v1/vocabulary?select=*&order=created_at.desc`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'apikey': CONFIG.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to fetch vocabulary data');

        const data = await response.json();
        renderDashboard(data);
    } catch (error) {
        console.error('Dashboard Error:', error);
        document.getElementById('capture-summary').textContent = 'Error loading data. Check console.';
    }
}

function renderDashboard(vocabList) {
    // 1. Update stats
    const masteredCount = vocabList.filter(item => item.learning_state === 'mastered').length;
    const reviewCount = vocabList.filter(item => item.learning_state !== 'mastered').length;
    
    document.getElementById('stat-mastered').textContent = masteredCount;
    document.getElementById('stat-review').textContent = reviewCount;
    document.getElementById('capture-summary').textContent = `You've captured ${vocabList.length} words in total from real-world reading.`;

    // Calculate "This week" (simple mock for now, or actual date check)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thisWeekCount = vocabList.filter(item => new Date(item.created_at) > sevenDaysAgo).length;
    document.getElementById('stat-mastered-trend').textContent = `+${thisWeekCount} total this week`;

    // 2. Render Feed
    const feedList = document.getElementById('feed-list');
    feedList.innerHTML = ''; // Clear existing static content

    if (vocabList.length === 0) {
        feedList.innerHTML = '<p style="text-align:center; padding: 20px; color: #7A7A7A;">No captures yet. Start reading and saving words!</p>';
        return;
    }

    vocabList.slice(0, 10).forEach(item => {
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        
        const badgeClass = item.learning_state === 'new' ? 'badge-new' : 
                          item.learning_state === 'mastered' ? 'badge-mastered' : 'badge-review';
        const badgeText = item.learning_state.charAt(0).toUpperCase() + item.learning_state.slice(1);

        // Extract domain from source_url
        let domain = 'unknown source';
        try { domain = new URL(item.source_url).hostname; } catch(e) {}

        feedItem.innerHTML = `
            <div class="word-info">
                <span class="word">${item.target_word}</span>
                <span class="pos">${item.part_of_speech || 'word'}</span>
            </div>
            <div class="translation">${item.translation}</div>
            <div class="context-box">
                <i data-lucide="quote" class="quote-icon"></i>
                <span class="context">${formatContext(item.context_sentence, item.target_word)}</span>
            </div>
            <div class="source-link">
                <i data-lucide="link"></i> <span>${domain}</span>
            </div>
            <span class="badge ${badgeClass}">${badgeText}</span>
        `;
        feedList.appendChild(feedItem);
    });

    // Re-initialize icons for newly added elements
    if (window.lucide) {
        lucide.createIcons();
    }
}

function formatContext(sentence, target) {
    if (!sentence) return '';
    // Bold the target word in the context
    try {
        const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedTarget})`, 'gi');
        return sentence.replace(regex, '<strong>$1</strong>');
    } catch (e) {
        return sentence;
    }
}
