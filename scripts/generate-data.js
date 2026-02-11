const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.resolve(__dirname, '../../生日大事记/days');
const COVER_PAGE_FILE = path.resolve(__dirname, '../../生日大事记/CoverPage.md');
const INITIAL_PAGE_FILE = path.resolve(__dirname, '../../生日大事记/InitialPage.md');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/events.json');
const SUMMARY_OUTPUT_FILE = path.resolve(__dirname, '../src/data/events-summary.json');
const META_OUTPUT_FILE = path.resolve(__dirname, '../src/data/meta.json');

const MONTHS = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
];

const MONTH_NAMES = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
];

function parseFile(filename, content) {
    const lines = content.split('\n');
    let title = '';
    let intro = '';
    const events = [];

    let currentSection = 'meta';
    let currentEvent = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Title
        if (line.startsWith('# ')) {
            title = line.replace('# ', '').trim();
            continue;
        }

        // Intro
        if (line.startsWith('> **导语：**')) {
            intro = line.replace('> **导语：**', '').trim();
            continue;
        }
        if (currentSection === 'meta' && line.startsWith('>')) {
            intro += ' ' + line.replace('>', '').trim();
            continue;
        }

        // Events
        if (line.startsWith('## ')) {
            if (currentEvent) {
                events.push(currentEvent);
            }

            // Logic: Split by first colon (full or half width)
            // Example: "## 🥀 1642年：星辰的陨落" -> Left: "🥀 1642年", Right: "星辰的陨落"
            // Example: "## 🕊️ 前45年：时间的标尺" -> Left: "🕊️ 前45年", Right: "时间的标尺"

            let fullLine = line.replace('## ', '').trim();
            let year = '';
            let emoji = '';
            let title = fullLine;

            // Try split by colon
            const colonMatch = fullLine.match(/^(.+?)[：:](.+)$/);
            if (colonMatch) {
                let leftPart = colonMatch[1].trim(); // "🥀 1642年"
                title = colonMatch[2].trim();        // "星辰的陨落"

                // Extract Emoji from leftPart
                // Regex for finding default emoji or simple match at start
                const emojiMatch = leftPart.match(/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})\s*(.*)$/u);
                if (emojiMatch) {
                    emoji = emojiMatch[1];
                    leftPart = emojiMatch[2]; // "1642年"
                }

                // Extract Year
                year = leftPart.replace('年', '').trim();
            } else {
                // No colon found fallback: Title is the whole line
            }

            currentEvent = {
                emoji,
                year,
                title,
                content: ''
            };

            currentSection = 'event';
            continue;
        }

        if (currentSection === 'event' && currentEvent) {
            if (line === '---') continue;
            currentEvent.content += line + '\n';
        }
    }

    // Push last event
    if (currentEvent) {
        events.push(currentEvent);
    }

    // Clean up content
    events.forEach(e => {
        e.content = e.content.trim();
    });

    // Formatting Date ID
    let date = filename.replace('.md', '').replace('_', '-');

    return {
        id: filename.replace('.md', ''),
        date,
        title,
        intro,
        events
    };
}

function main() {
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`Source directory not found: ${SOURCE_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.md'));
    const allData = [];

    console.log(`Found ${files.length} MD files.`);

    for (const file of files) {
        const content = fs.readFileSync(path.join(SOURCE_DIR, file), 'utf-8');
        try {
            const data = parseFile(file, content);
            allData.push(data);
        } catch (e) {
            console.error(`Error parsing ${file}:`, e);
        }
    }

    allData.sort((a, b) => a.id.localeCompare(b.id));

    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allData, null, 2));
    console.log(`Generated ${OUTPUT_FILE} with ${allData.length} records.`);

    // Generate lightweight summary for home page (no event content)
    const summaryData = allData.map(d => ({
        id: d.id,
        date: d.date,
        title: d.title,
        intro: d.intro,
        eventCount: d.events.length
    }));
    fs.writeFileSync(SUMMARY_OUTPUT_FILE, JSON.stringify(summaryData));
    console.log(`Generated ${SUMMARY_OUTPUT_FILE} (${Math.round(JSON.stringify(summaryData).length / 1024)}KB).`);

    // Parse CoverPage
    let coverContent = '';
    if (fs.existsSync(COVER_PAGE_FILE)) {
        coverContent = fs.readFileSync(COVER_PAGE_FILE, 'utf-8');
    } else {
        console.warn('CoverPage.md not found at', COVER_PAGE_FILE);
    }

    // Parse InitialPage
    let initial = { title: '', subtitle: '', months: [] };
    if (fs.existsSync(INITIAL_PAGE_FILE)) {
        const initialContent = fs.readFileSync(INITIAL_PAGE_FILE, 'utf-8');
        const lines = initialContent.split('\n');

        let currentMonth = null;
        const monthMap = {
            '一月': '01', '二月': '02', '三月': '03', '四月': '04', '五月': '05', '六月': '06',
            '七月': '07', '八月': '08', '九月': '09', '十月': '10', '十一月': '11', '十二月': '12'
        };

        // Initialize months array with empty objects
        for (let i = 0; i < 12; i++) {
            initial.months.push({
                id: MONTHS[i],
                name: MONTH_NAMES[i],
                subtitle: '',
                poem: '',
                author: ''
            });
        }

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            if (line.startsWith('标题：')) initial.title = line.replace('标题：', '').trim();
            else if (line.startsWith('副标题：')) initial.subtitle = line.replace('副标题：', '').trim();
            else {
                // Check for Month Header like "一月：凛冬・初见"
                let monthMatch = null;
                for (const [mName, mId] of Object.entries(monthMap)) {
                    if (line.startsWith(mName + '：')) {
                        monthMatch = { name: mName, id: mId };
                        break;
                    }
                }

                if (monthMatch) {
                    const monthIndex = parseInt(monthMatch.id) - 1;
                    const parts = line.split('：');
                    if (parts.length > 1) {
                        initial.months[monthIndex].subtitle = parts[1].trim();
                    }
                    currentMonth = monthIndex;
                } else if (currentMonth !== null) {
                    // Poem content
                    if (line.startsWith('“') || line.startsWith('"')) {
                        // Remove quotes for cleaner data if desired, or keep them. 
                        // Keeping them for now as per design style often uses quotes.
                        initial.months[currentMonth].poem = line;
                    }
                    // Author content
                    else if (line.startsWith('——')) {
                        initial.months[currentMonth].author = line.replace('——', '').trim();
                    }
                }
            }
        });
    } else {
        console.warn('InitialPage.md not found at', INITIAL_PAGE_FILE);
    }

    fs.writeFileSync(META_OUTPUT_FILE, JSON.stringify({ coverContent, initial }, null, 2));
    console.log(`Generated ${META_OUTPUT_FILE}`);
}

main();
