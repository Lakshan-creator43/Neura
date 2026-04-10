const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Domain detection keywords → theme
const DOMAIN_THEMES = {
  tech: ['code','programming','javascript','python','react','node','css','html','error','bug','api','database','linux','git','docker','kubernetes','server','software','algorithm','function','array','class','object','framework','library','typescript','java','c++','golang','rust','flutter','android','ios','app','web','frontend','backend','devops','cloud','aws','azure','deploy','debug','fix','build','compile','install','npm','pip','brew','terminal','bash','shell','curl','json','xml','http','rest','graphql'],
  medical: ['pain','fever','symptom','disease','medicine','doctor','health','blood','heart','lung','brain','cancer','infection','virus','bacteria','diabetes','pressure','cholesterol','thyroid','kidney','liver','stomach','headache','allergy','skin','rash','surgery','hospital','clinic','treatment','diagnosis','tablet','drug','dose','side effect','pregnancy','mental','anxiety','depression','sleep','diet','vitamin','nutrition','immune','vaccine','covid','flu'],
  electronics: ['circuit','resistor','capacitor','transistor','diode','arduino','raspberry','esp32','sensor','motor','led','pcb','soldering','voltage','current','watt','ohm','amp','multimeter','oscilloscope','microcontroller','gpio','i2c','spi','uart','pwm','adc','dac','battery','power','supply','relay','bjt','mosfet','op-amp','555','atmega','stm32','fpga','vhdl','verilog','schematic','breadboard'],
  agriculture: ['farming','crop','soil','fertilizer','irrigation','seed','harvest','plant','pest','disease','weed','yield','organic','compost','greenhouse','hydroponics','aquaponics','livestock','cattle','poultry','fish','weather','climate','drought','rain','temperature','humidity','ph','nitrogen','potassium','phosphorus','tractor','pesticide','herbicide','fungicide','agri','paddy','wheat','rice','maize','vegetable','fruit','flower','garden'],
  science: ['physics','chemistry','biology','astronomy','geology','quantum','relativity','atom','molecule','element','compound','reaction','experiment','hypothesis','theory','law','force','energy','mass','velocity','acceleration','gravity','electron','proton','neutron','nucleus','dna','rna','cell','evolution','ecosystem','environment','climate','space','planet','star','galaxy','telescope','microscope','lab'],
};

function detectDomain(q) {
  const lower = q.toLowerCase();
  const scores = {};
  for (const [domain, keywords] of Object.entries(DOMAIN_THEMES)) {
    scores[domain] = keywords.filter(k => lower.includes(k)).length;
  }
  const top = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  return top[0][1] > 0 ? top[0][0] : 'general';
}

// Platform configs per domain
const PLATFORM_CONFIGS = {
  tech: [
    { name:'Stack Overflow', icon:'⚡', url:'https://stackoverflow.com/search?q=', color:'#f48024', bg:'#fff3e6' },
    { name:'GitHub', icon:'⬡', url:'https://github.com/search?q=', color:'#6e40c9', bg:'#f0ebff' },
    { name:'Reddit r/programming', icon:'◉', url:'https://www.reddit.com/r/programming/search/?q=', color:'#ff4500', bg:'#fff1ee' },
    { name:'YouTube', icon:'▶', url:'https://www.youtube.com/results?search_query=', color:'#cc0000', bg:'#fff0f0' },
    { name:'Dev.to', icon:'✦', url:'https://dev.to/search?q=', color:'#3b49df', bg:'#eef0ff' },
    { name:'HackerNews', icon:'△', url:'https://hn.algolia.com/?q=', color:'#ff6600', bg:'#fff4ee' },
    { name:'Medium', icon:'M', url:'https://medium.com/search?q=', color:'#00ab6c', bg:'#e6fff6' },
    { name:'MDN Web Docs', icon:'⬛', url:'https://developer.mozilla.org/en-US/search?q=', color:'#1d3163', bg:'#eaf0ff' },
    { name:'Reddit r/learnprogramming', icon:'◈', url:'https://www.reddit.com/r/learnprogramming/search/?q=', color:'#ff5700', bg:'#fff2ee' },
  ],
  medical: [
    { name:'WebMD', icon:'✚', url:'https://www.webmd.com/search/search_results/default.aspx?query=', color:'#0078a8', bg:'#e6f6ff' },
    { name:'Reddit r/medical', icon:'◉', url:'https://www.reddit.com/r/medical/search/?q=', color:'#ff4500', bg:'#fff1ee' },
    { name:'YouTube', icon:'▶', url:'https://www.youtube.com/results?search_query=', color:'#cc0000', bg:'#fff0f0' },
    { name:'Healthline', icon:'♥', url:'https://www.healthline.com/search?q1=', color:'#1f8c5a', bg:'#e6fff2' },
    { name:'PubMed', icon:'⬡', url:'https://pubmed.ncbi.nlm.nih.gov/?term=', color:'#326599', bg:'#eaf2ff' },
    { name:'Mayo Clinic', icon:'✦', url:'https://www.mayoclinic.org/search/search-results?q=', color:'#00558c', bg:'#e6f4ff' },
    { name:'Quora Health', icon:'Q', url:'https://www.quora.com/search?q=', color:'#b92b27', bg:'#fff0f0' },
    { name:'ResearchGate', icon:'R', url:'https://www.researchgate.net/search?q=', color:'#00d0af', bg:'#e6fff9' },
    { name:'Reddit r/AskDocs', icon:'◈', url:'https://www.reddit.com/r/AskDocs/search/?q=', color:'#ff5700', bg:'#fff2ee' },
  ],
  electronics: [
    { name:'Reddit r/electronics', icon:'⚡', url:'https://www.reddit.com/r/electronics/search/?q=', color:'#ff4500', bg:'#fff1ee' },
    { name:'Arduino Forum', icon:'◉', url:'https://forum.arduino.cc/search?q=', color:'#00979d', bg:'#e6feff' },
    { name:'Stack Exchange EE', icon:'✦', url:'https://electronics.stackexchange.com/search?q=', color:'#f48024', bg:'#fff3e6' },
    { name:'YouTube', icon:'▶', url:'https://www.youtube.com/results?search_query=', color:'#cc0000', bg:'#fff0f0' },
    { name:'Instructables', icon:'⬡', url:'https://www.instructables.com/search/?q=', color:'#f6851f', bg:'#fff4e6' },
    { name:'Hackaday', icon:'△', url:'https://hackaday.com/?s=', color:'#1eb854', bg:'#e6ffe6' },
    { name:'GitHub', icon:'⬛', url:'https://github.com/search?q=', color:'#6e40c9', bg:'#f0ebff' },
    { name:'Quora', icon:'Q', url:'https://www.quora.com/search?q=', color:'#b92b27', bg:'#fff0f0' },
    { name:'EEVblog Forum', icon:'◈', url:'https://www.eevblog.com/forum/search/?q=', color:'#2255cc', bg:'#eef0ff' },
  ],
  agriculture: [
    { name:'Reddit r/farming', icon:'🌿', url:'https://www.reddit.com/r/farming/search/?q=', color:'#2d7a2d', bg:'#edfaed' },
    { name:'YouTube', icon:'▶', url:'https://www.youtube.com/results?search_query=', color:'#cc0000', bg:'#fff0f0' },
    { name:'Agritecture', icon:'✦', url:'https://www.agritecture.com/?s=', color:'#5a8a00', bg:'#f2ffdf' },
    { name:'Quora Agriculture', icon:'Q', url:'https://www.quora.com/search?q=', color:'#b92b27', bg:'#fff0f0' },
    { name:'FAO Resources', icon:'⬡', url:'https://www.fao.org/search/en/?q=', color:'#0066cc', bg:'#e6f0ff' },
    { name:'ResearchGate', icon:'R', url:'https://www.researchgate.net/search?q=', color:'#00d0af', bg:'#e6fff9' },
    { name:'The Farmer Journal', icon:'◉', url:'https://www.agriland.ie/?s=', color:'#006600', bg:'#edfaed' },
    { name:'Reddit r/gardening', icon:'◈', url:'https://www.reddit.com/r/gardening/search/?q=', color:'#ff5700', bg:'#fff2ee' },
    { name:'Wikipedia', icon:'W', url:'https://en.wikipedia.org/w/index.php?search=', color:'#888', bg:'#f4f4f4' },
  ],
  science: [
    { name:'ResearchGate', icon:'R', url:'https://www.researchgate.net/search?q=', color:'#00d0af', bg:'#e6fff9' },
    { name:'PubMed', icon:'⬡', url:'https://pubmed.ncbi.nlm.nih.gov/?term=', color:'#326599', bg:'#eaf2ff' },
    { name:'YouTube', icon:'▶', url:'https://www.youtube.com/results?search_query=', color:'#cc0000', bg:'#fff0f0' },
    { name:'Reddit r/science', icon:'◉', url:'https://www.reddit.com/r/science/search/?q=', color:'#ff4500', bg:'#fff1ee' },
    { name:'Khan Academy', icon:'✦', url:'https://www.khanacademy.org/search?page_search_query=', color:'#14bf96', bg:'#e6fffb' },
    { name:'Wikipedia', icon:'W', url:'https://en.wikipedia.org/w/index.php?search=', color:'#555', bg:'#f4f4f4' },
    { name:'Quora', icon:'Q', url:'https://www.quora.com/search?q=', color:'#b92b27', bg:'#fff0f0' },
    { name:'HackerNews', icon:'△', url:'https://hn.algolia.com/?q=', color:'#ff6600', bg:'#fff4ee' },
    { name:'Google Scholar', icon:'⬛', url:'https://scholar.google.com/scholar?q=', color:'#4285f4', bg:'#eaf2ff' },
  ],
  general: [
    { name:'Reddit', icon:'◉', url:'https://www.reddit.com/search/?q=', color:'#ff4500', bg:'#fff1ee' },
    { name:'YouTube', icon:'▶', url:'https://www.youtube.com/results?search_query=', color:'#cc0000', bg:'#fff0f0' },
    { name:'Quora', icon:'Q', url:'https://www.quora.com/search?q=', color:'#b92b27', bg:'#fff0f0' },
    { name:'Medium', icon:'M', url:'https://medium.com/search?q=', color:'#00ab6c', bg:'#e6fff6' },
    { name:'Wikipedia', icon:'W', url:'https://en.wikipedia.org/w/index.php?search=', color:'#555', bg:'#f4f4f4' },
    { name:'Stack Overflow', icon:'⚡', url:'https://stackoverflow.com/search?q=', color:'#f48024', bg:'#fff3e6' },
    { name:'HackerNews', icon:'△', url:'https://hn.algolia.com/?q=', color:'#ff6600', bg:'#fff4ee' },
    { name:'ResearchGate', icon:'R', url:'https://www.researchgate.net/search?q=', color:'#00d0af', bg:'#e6fff9' },
    { name:'GitHub', icon:'⬡', url:'https://github.com/search?q=', color:'#6e40c9', bg:'#f0ebff' },
    { name:'GeeksforGeeks', icon:'G', url:'https://www.geeksforgeeks.org/?s=', color:'#4285f4', bg:'#eaf2ff' },
  ],
};

app.post('/api/search', (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) return res.status(400).json({ error: 'Query required' });

  const q = query.trim();
  const domain = detectDomain(q);
  const platforms = PLATFORM_CONFIGS[domain] || PLATFORM_CONFIGS.general;
  const enc = encodeURIComponent(q);

  const results = platforms.map(p => ({
    name: p.name,
    icon: p.icon,
    color: p.color,
    bg: p.bg,
    url: p.url + enc,
  }));

  res.json({ query: q, domain, results });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  ✦ NEXUS running at http://localhost:${PORT}\n`);
});
