// =========================================================================
// 🎲 คลังข้อมูลสำหรับสุ่มคดี (คุณครูสามารถพิมพ์เพิ่มตัวเลือกเข้าไปใน Array ได้ไม่จำกัด)
// =========================================================================
const poolData = {
    WHO: [
        { text: "นักเรียนชั้น ม.4 แผนกคอมพิวเตอร์", code: "WHO" },
        { text: "สมาชิกชมรมอีสปอร์ตของโรงเรียน", code: "WHO" },
        { text: "กลุ่มนักเรียนแกนนำสภากรรมการนักเรียน", code: "WHO" }
    ],
    WHAT: [
        { text: "เกิดภาวะส่งงานวิชาโปรเจกต์ล่าช้าเกินกำหนด", code: "WHAT" },
        { text: "มีสถิติผลการเรียนเฉลี่ยรายวิชาหลักลดลงอย่างมาก", code: "WHAT" },
        { text: "พบพฤติกรรมการแอบใช้ AI ทำการบ้านแทนตนเองทั้งหมด", code: "WHAT" }
    ],
    WHEN: [
        { text: "ในช่วงสัปดาห์ก่อนการสอบกลางภาค", code: "WHEN" },
        { text: "ในช่วงเปิดภาคเรียนการศึกษาใหม่นี้", code: "WHEN" },
        { text: "ในคืนวันอาทิตย์ก่อนวันกำหนดส่งงานใหญ่ประจำเทอม", code: "WHEN" }
    ],
    WHERE: [
        { text: "บริเวณภายในห้องปฏิบัติการคอมพิวเตอร์", code: "WHERE" },
        { text: "ที่บ้านพักอาศัยส่วนตัวของนักเรียนเอง", code: "WHERE" },
        { text: "ในแชตกลุ่มออนไลน์เครือข่ายสังคมของระดับชั้น", code: "WHERE" }
    ],
    WHY: [
        { text: "เนื่องจากนักเรียนติดโทรศัพท์มือถือและเล่นเกมจนดึก", code: "WHY" },
        { text: "เพราะขาดทักษะในการวางแผนและจัดสรรเวลารวมถึงไม่เข้าใจโจทย์", code: "WHY" },
        { text: "เนื่องจากงานที่ได้รับมีปริมาณมากสะสมจนทำไม่ทัน", code: "WHY" }
    ],
    HOW: [
        { text: "โดยการติดตั้งแอปพลิเคชันบล็อกหน้าจอควบคุมเวลานอน", code: "HOW" },
        { text: "จัดตารางเวลาการส่งงานย่อยร่วมกับการแจ้งเตือนผ่านบอต", code: "HOW" },
        { text: "การใช้ระบบเพื่อนช่วยเพื่อนติวและแบ่งสัดส่วนการทำโปรเจกต์", code: "HOW" }
    ]
};

// =========================================================================
// ตัวแปรควบคุมระบบเกมภายใน
// =========================================================================
let gameState = {
    name: "", no: "", score: 0, startTime: 0, currentTool: null,
    selectedParts: { WHO: null, WHAT: null, WHEN: null, WHERE: null, WHY: null, HOW: null },
    currentCaseTextArray: []
};

// 🔄 ดึงสถิติเก่าจาก LocalStorage ทันทีเมื่อเบราว์เซอร์พร้อมทำงาน
window.onload = function() {
    const localScore = localStorage.getItem('csi_high_score');
    const localName = localStorage.getItem('csi_player_name');
    const localNo = localStorage.getItem('csi_player_no');
    if (localScore) {
        document.getElementById('history-text').innerText = `เจ้าหน้าที่: ${localName} (เลขที่ ${localNo}) | คะแนนสูงสุด: ${localScore} คะแนน`;
        document.getElementById('student-name').value = localName;
        document.getElementById('student-no').value = localNo;
    }
};

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startGame() {
    const nameInput = document.getElementById('student-name').value.trim();
    const noInput = document.getElementById('student-no').value.trim();

    if(!nameInput || !noInput) {
        alert("กรุณากรอกชื่อและเลขที่ก่อนเริ่มปฏิบัติภารกิจครับ!");
        return;
    }

    gameState.name = nameInput;
    gameState.no = noInput;
    gameState.startTime = Date.now();
    document.getElementById('hud-name').innerText = `${nameInput} (เลขที่ ${noInput})`;

    const rWho = poolData.WHO[Math.floor(Math.random() * poolData.WHO.length)];
    const rWhat = poolData.WHAT[Math.floor(Math.random() * poolData.WHAT.length)];
    const rWhen = poolData.WHEN[Math.floor(Math.random() * poolData.WHEN.length)];
    const rWhere = poolData.WHERE[Math.floor(Math.random() * poolData.WHERE.length)];
    const rWhy = poolData.WHY[Math.floor(Math.random() * poolData.WHY.length)];
    const rHow = poolData.HOW[Math.floor(Math.random() * poolData.HOW.length)];

    gameState.correctAnswers = { WHO: rWho.text, WHAT: rWhat.text, WHEN: rWhen.text, WHERE: rWhere.text, WHY: rWhy.text, HOW: rHow.text };

    gameState.currentCaseTextArray = [
        { text: "รายงานด่วนระบุว่า", code: "LURE" }, { text: rWho.text, code: "WHO" },
        { text: "กำลังประสบปัญหาสำคัญคือ", code: "LURE" }, { text: rWhat.text, code: "WHAT" },
        { text: "ซึ่งมักสังเกตพบเห็นเด่นชัด", code: "LURE" }, { text: rWhen.text, code: "WHEN" },
        { text: "เหตุการณ์นี้แพร่กระจายตัวอย่างมากที่", code: "LURE" }, { text: rWhere.text, code: "WHERE" },
        { text: "ทางทีมผู้เชี่ยวชาญสืบทราบข้อมูลว่าเกิดขึ้น", code: "LURE" }, { text: rWhy.text, code: "WHY" },
        { text: "และเบื้องต้นควรแก้ไขสถานการณ์นี้", code: "LURE" }, { text: rHow.text, code: "HOW" },
        { text: "เพื่อไม่ให้เกิดผลกระทบลุกลามต่อไปในอนาคต", code: "LURE" }
    ];

    renderCaseText();
    showScreen('screen-phase1');
}

function renderCaseText() {
    const container = document.getElementById('case-text-container');
    container.innerHTML = "";
    gameState.currentCaseTextArray.forEach((item, index) => {
        const span = document.createElement('span');
        span.innerText = item.text + " ";
        span.className = "clickable-word";
        span.id = `word-${index}`;
        span.onclick = () => handleWordClick(item, index);
        container.appendChild(span);
    });
}

function selectTool(toolName) {
    gameState.currentTool = toolName;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tool="${toolName}"]`).classList.add('active');
}

function handleWordClick(item, index) {
    if (!gameState.currentTool) {
        alert("กรุณาเลือกเครื่องมือสืบสวนด้านล่างก่อนคลิกข้อความครับ!");
        return;
    }
    const tool = gameState.currentTool;
    const element = document.getElementById(`word-${index}`);

    if (item.code === tool) {
        if (!gameState.selectedParts[tool]) gameState.score += 20;
        gameState.selectedParts[tool] = item.text;
        element.className = `clickable-word hl-${tool.toLowerCase()}`;
        document.getElementById(`slot-${tool}`).innerText = item.text;
        document.getElementById(`slot-${tool}`).style.color = "#ffffff";
        updateScoreHUD();
        checkPhase1Completion();
    } else {
        gameState.score -= 5;
        alert(`🚨 หลักฐานชิ้นนี้ไม่ใช่กลุ่มข้อมูลประเภท ${tool}! ลองคิดวิเคราะห์ความหมายใหม่อีกครั้งครับ`);
        updateScoreHUD();
    }
}

function updateScoreHUD() {
    document.getElementById('hud-score').innerText = gameState.score;
}

function checkPhase1Completion() {
    const allDone = Object.values(gameState.selectedParts).every(val => val !== null);
    if (allDone) document.getElementById('btn-goto-phase2').style.display = "block";
}

function goToPhase2() {
    showScreen('screen-phase2');
    renderPhase2Quiz();
}

function renderPhase2Quiz() {
    const container = document.getElementById('quiz-options');
    const questionEl = document.getElementById('quiz-question');
    questionEl.innerText = `💡 [วิเคราะห์โจทย์ส่วนลึก] จากกระดาน 5W1H ที่สกัดได้ ตัวแปรข้อใดจัดว่าเป็น "ตัวปัญหาหลัก (What)" ที่ต้องรีบออกแบบวิธีแก้ไข ไม่ใช่สาเหตุหรือปัจจัยภายนอก?`;

    const correctText = gameState.correctAnswers.WHAT;
    const options = [
        { text: correctText, isCorrect: true },
        { text: "เครื่องมือทางเทคโนโลยีและสมาร์ตโฟนของนักเรียน", isCorrect: false },
        { text: "ความเข้มงวดของกฎเกณฑ์และเวลาเรียนประจำภาคเรียน", isCorrect: false },
        { text: "พฤติกรรมปัจจัยส่วนบุคคลของพยานแวดล้อมที่ไม่ส่งผลตรงๆ", isCorrect: false }
    ];

    options.sort(() => Math.random() - 0.5);
    container.innerHTML = "";
    options.forEach((opt, index) => {
        const div = document.createElement('div');
        div.className = "quiz-option";
        div.innerText = `${index + 1}. ${opt.text}`;
        div.onclick = () => {
            document.querySelectorAll('.quiz-option').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            gameState.phase2Answer = opt;
        };
        container.appendChild(div);
    });
}

function submitQuiz() {
    if (!gameState.phase2Answer) {
        alert("กรุณาเลือกคำตอบวิเคราะห์ปัญหาก่อนส่งสรุปคดีครับ!");
        return;
    }

    if (gameState.phase2Answer.isCorrect) gameState.score += 30;
    else gameState.score -= 10;

    const totalTime = Math.floor((Date.now() - gameState.startTime) / 1000);

    let currentHighScore = localStorage.getItem('csi_high_score');
    if (!currentHighScore || gameState.score > parseInt(currentHighScore)) {
        localStorage.setItem('csi_high_score', gameState.score);
        localStorage.setItem('csi_player_name', gameState.name);
        localStorage.setItem('csi_player_no', gameState.no);
        currentHighScore = gameState.score;
    }

    document.getElementById('res-name').innerText = gameState.name;
    document.getElementById('res-no').innerText = gameState.no;
    document.getElementById('res-score').innerText = gameState.score;
    document.getElementById('res-highscore').innerText = currentHighScore;
    document.getElementById('res-time').innerText = totalTime;

    let rankStr = ""; let rankColor = "#ff007f";
    if (gameState.score >= 120) { rankStr = "🏆 ENGINEERING MASTER (ปรมาจารย์วิศวกรนักสืบ)"; rankColor = "#39ff14"; }
    else if (gameState.score >= 90) { rankStr = "🥇 TECH ANALYST (นักวิเคราะห์เทคโนโลยีระดับสูง)"; rankColor = "#00f0ff"; }
    else if (gameState.score >= 60) { rankStr = "🥈 FIELD DETECTIVE (นักสืบภาคสนาม)"; rankColor = "#ffd700"; }
    else { rankStr = "🥉 DETECTIVE TRAINEE (นักสืบฝึกหัด - แนะนำให้กดเล่นใหม่)"; rankColor = "#ff007f"; }

    const rankEl = document.getElementById('result-rank');
    rankEl.innerText = rankStr;
    rankEl.style.color = rankColor;
    rankEl.style.textShadow = `0 0 15px ${rankColor}`;

    showScreen('screen-result');
}

function downloadReportImage() {
    const targetElement = document.getElementById('capture-area');
    
    html2canvas(targetElement, {
        backgroundColor: "#131a26",
        scale: 2
    }).then(canvas => {
        const imageURL = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = `CSI_Report_เลขที่_${gameState.no}_${gameState.name}.png`;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }).catch(err => {
        alert("เกิดข้อผิดพลาดในการเซฟภาพ กรุณาลองกดใหม่อีกครั้ง หรือแคปหน้าจอแทนครับ");
        console.error(err);
    });
}