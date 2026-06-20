const tracksModal = document.getElementById("tracksModal");
const openTracksButton = document.getElementById("openTracksModal");
const selectionCountdown = document.getElementById("selectionCountdown");
const tipsRoller = document.getElementById("tipsRoller");
const rankingPreviewList = document.getElementById("rankingPreviewList");
const rankingPreviewSection = document.getElementById("rankingPreview");
const openQualifierRankingButton = document.getElementById("openQualifierRanking");
const qualifierRankingRift = document.getElementById("qualifierRankingRift");
const qualifierRankingForm = document.getElementById("qualifierRankingForm");
const qualifierRankingStatus = document.getElementById("qualifierRankingStatus");
const qualifierRebootStage = document.getElementById("qualifierRebootStage");
const openFragmentFiveRiftButton = document.getElementById("openFragmentFiveRift");
const fragmentFiveEntryTargets = document.querySelectorAll("[data-open-fragment-five-rift]");
const fragmentHitboxTargets = document.querySelectorAll("[data-fragment-hitbox]");
const openFragmentFiveMainRiftButton = document.getElementById("openFragmentFiveMainRift");
const fragmentFiveRift = document.getElementById("fragmentFiveRift");
const fragmentFiveAnswerForm = document.getElementById("fragmentFiveAnswerForm");
const fragmentFiveAnswerInput = document.getElementById("fragmentFiveAnswerInput");
const fragmentFiveAnswerSubmit = document.getElementById("fragmentFiveAnswerSubmit");
const fragmentFiveAnswerStatus = document.getElementById("fragmentFiveAnswerStatus");
const fragmentFiveResult = document.getElementById("fragmentFiveResult");
const startSimulationButton = document.getElementById("startSimulationButton");
const saturnSimulationLoader = document.getElementById("saturnSimulationLoader");
const saturnLoaderStatus = document.getElementById("saturnLoaderStatus");
const saturnLoaderCode = document.getElementById("saturnLoaderCode");
const saturnLoaderProgress = document.getElementById("saturnLoaderProgress");
const mobileLandscapeNotice = document.getElementById("mobileLandscapeNotice");
const mobileLandscapeCountdown = document.getElementById("mobileLandscapeCountdown");
const plcDatabase = document.getElementById("plcDatabase");
const plcDatabaseHome = document.getElementById("plcDatabaseHome");
const plcDatabaseDetail = document.getElementById("plcDatabaseDetail");
const plcOpenFirstCategory = document.getElementById("plcOpenFirstCategory");
const plcOpenSecondCategory = document.getElementById("plcOpenSecondCategory");
const plcOpenSecretCategory = document.getElementById("plcOpenSecretCategory");
const plcDatabaseBack = document.getElementById("plcDatabaseBack");
const plcDatabaseReplayButton = document.getElementById("plcDatabaseReplayButton");
const plcDatabaseCloseTargets = document.querySelectorAll("[data-close-plc-database]");
const plcDatabaseEntryList = document.getElementById("plcDatabaseEntryList");
const plcDatabaseEntryTitle = document.getElementById("plcDatabaseEntryTitle");
const plcDatabaseEntryTime = document.getElementById("plcDatabaseEntryTime");
const plcDatabaseEntryKeeper = document.getElementById("plcDatabaseEntryKeeper");
const plcDatabaseEntryLevel = document.getElementById("plcDatabaseEntryLevel");
const plcDatabaseEntryContent = document.getElementById("plcDatabaseEntryContent");
const plcDatabaseFile = plcDatabaseDetail?.querySelector(".plc-db-file");
const plcDatabaseEntryCount = document.getElementById("plcDatabaseEntryCount");
const plcTotalProgressBar = document.getElementById("plcTotalProgressBar");
const plcTotalProgressText = document.getElementById("plcTotalProgressText");
const plcFirstCategoryProgress = document.getElementById("plcFirstCategoryProgress");
const plcSecondCategoryProgress = document.getElementById("plcSecondCategoryProgress");
const plcSecretCategoryProgress = document.getElementById("plcSecretCategoryProgress");
const plcFolderProgress = document.getElementById("plcFolderProgress");
const plcFolderTitle = document.getElementById("plcFolderTitle");
const plcRestoreToast = document.getElementById("plcRestoreToast");
const databaseQuickEntry = document.getElementById("databaseQuickEntry");
const quickDatabaseButton = document.getElementById("quickDatabaseButton");
const qualifierRankingCloseTargets = document.querySelectorAll("[data-close-qualifier-ranking]");
const fragmentFiveRiftCloseTargets = document.querySelectorAll("[data-close-fragment-five-rift]");
const signalRift = document.getElementById("signalRift");
const openSignalRiftButton = document.getElementById("openSignalRift");
const finalArtFrame = document.querySelector(".final-art-frame");
const finalSignalSection = document.getElementById("finalSignal");
const firstLayerEchoSection = document.getElementById("firstLayerEcho");
const firstLayerOffsetButton = document.getElementById("firstLayerOffsetButton");
const firstLayerNextAnalysis = document.getElementById("firstLayerNextAnalysis");
const firstLayerFragmentOne = document.getElementById("firstLayerFragmentOne");
const firstLayerTerminal = document.getElementById("firstLayerTerminal");
const firstLayerTerminalCloseTargets = document.querySelectorAll("[data-close-first-layer-terminal]");
const firstLayerTerminalForm = document.getElementById("firstLayerTerminalForm");
const firstLayerTerminalInput = document.getElementById("firstLayerTerminalInput");
const firstLayerTerminalLog = document.getElementById("firstLayerTerminalLog");
const firstLayerTerminalStatus = document.getElementById("firstLayerTerminalStatus");
const fragmentSevenDialogueStage = document.getElementById("fragmentSevenDialogueStage");
const fragmentSevenDialogueStack = document.getElementById("fragmentSevenDialogueStack");
const fragmentSevenRift = document.getElementById("fragmentSevenRift");
const openFragmentSevenRiftButton = document.getElementById("openFragmentSevenRift");
const fragmentSevenRiftCloseTargets = document.querySelectorAll("[data-close-fragment-seven-rift]");
const fragmentSevenAnswerForm = document.getElementById("fragmentSevenAnswerForm");
const fragmentSevenAnswerInput = document.getElementById("fragmentSevenAnswerInput");
const fragmentSevenAnswerSubmit = document.getElementById("fragmentSevenAnswerSubmit");
const fragmentSevenAnswerStatus = document.getElementById("fragmentSevenAnswerStatus");
const fragmentSevenResult = document.getElementById("fragmentSevenResult");
const signalGatePanel = document.querySelector(".signal-gate-panel");
const signalGateStatus = document.getElementById("signalGateStatus");
const offsetTableValue = document.getElementById("offsetTableValue");
const offsetEncryptedTime = document.getElementById("offsetEncryptedTime");
const resetSignalGateButton = document.getElementById("resetSignalGate");
const openRetryPuzzleButton = document.getElementById("openRetryPuzzle");
const retryPuzzle = document.getElementById("retryPuzzle");
const retryPuzzleStatus = document.getElementById("retryPuzzleStatus");
const retryPulseButtons = document.querySelectorAll("[data-retry-pulse]");
const retryPulseSlots = document.querySelectorAll("[data-retry-slot]");
const phasePlateRift = document.getElementById("phasePlateRift");
const openPhasePlateButton = document.getElementById("openPhasePlate");
const dateRift = document.getElementById("dateRift");
const noteGateForm = document.getElementById("noteGateForm");
const noteGateInput = document.getElementById("noteGateInput");
const noteGateSubmit = document.getElementById("noteGateSubmit");
const noteGateStatus = document.getElementById("noteGateStatus");
const finalDateRift = document.getElementById("finalDateRift");
const finalDateCountdown = document.getElementById("finalDateCountdown");
const finalDateBootPanel = document.getElementById("finalDateBootPanel");
const bootLoadout = document.getElementById("bootLoadout");
const bootProgressBar = document.getElementById("bootProgressBar");
const bootProgressText = document.getElementById("bootProgressText");
const bootSequenceButton = document.getElementById("bootSequenceButton");
const bootDialogueStage = document.getElementById("bootDialogueStage");
const bootDialogueStack = document.getElementById("bootDialogueStack");
const settlementRift = document.getElementById("settlementRift");
const openSettlementPlateButtons = document.querySelectorAll("[data-open-settlement-plate]");
const palaceRift = document.getElementById("palaceRift");
const openPalacePlateButtons = document.querySelectorAll("[data-open-palace-plate]");
const releaseRift = document.getElementById("releaseRift");
const openReleaseRiftButtons = document.querySelectorAll("[data-open-release-rift]");
const artistGatePuzzle = document.getElementById("artistGatePuzzle");
const artistGateStatus = document.getElementById("artistGateStatus");
const artistPulseButtons = document.querySelectorAll("[data-artist-pulse]");
const artistPulseSlots = document.querySelectorAll("[data-artist-slot]");
const palaceGatePuzzle = document.getElementById("palaceGatePuzzle");
const palaceGateForm = document.getElementById("palaceGateForm");
const palaceGateInput = document.getElementById("palaceGateInput");
const palaceGateSubmit = document.getElementById("palaceGateSubmit");
const palaceGateStatus = document.getElementById("palaceGateStatus");
const multisourceGatePuzzle = document.getElementById("multisourceGatePuzzle");
const multisourceGateForm = document.getElementById("multisourceGateForm");
const multisourceGateInput = document.getElementById("multisourceGateInput");
const multisourceGateSubmit = document.getElementById("multisourceGateSubmit");
const multisourceGateStatus = document.getElementById("multisourceGateStatus");
const playMultisourceAudioButton = document.getElementById("playMultisourceAudio");
const fragmentRift = document.getElementById("fragmentRift");
const openFragmentRiftButton = document.getElementById("openFragmentRift");
const fragmentTwoRift = document.getElementById("fragmentTwoRift");
const openFragmentTwoRiftButton = document.getElementById("openFragmentTwoRift");
const fragmentThreeRift = document.getElementById("fragmentThreeRift");
const openFragmentThreeRiftButton = document.getElementById("openFragmentThreeRift");
const fragmentFourRift = document.getElementById("fragmentFourRift");
const openFragmentFourRiftButton = document.getElementById("openFragmentFourRift");
const fragmentAnswerForm = document.getElementById("fragmentAnswerForm");
const fragmentAnswerInput = document.getElementById("fragmentAnswerInput");
const fragmentAnswerSubmit = document.getElementById("fragmentAnswerSubmit");
const fragmentAnswerStatus = document.getElementById("fragmentAnswerStatus");
const fragmentResult = document.getElementById("fragmentResult");
const fragmentTwoAnswerForm = document.getElementById("fragmentTwoAnswerForm");
const fragmentTwoAnswerInput = document.getElementById("fragmentTwoAnswerInput");
const fragmentTwoAnswerSubmit = document.getElementById("fragmentTwoAnswerSubmit");
const fragmentTwoAnswerStatus = document.getElementById("fragmentTwoAnswerStatus");
const fragmentTwoResult = document.getElementById("fragmentTwoResult");
const fragmentThreeAnswerForm = document.getElementById("fragmentThreeAnswerForm");
const fragmentThreeAnswerInput = document.getElementById("fragmentThreeAnswerInput");
const fragmentThreeAnswerSubmit = document.getElementById("fragmentThreeAnswerSubmit");
const fragmentThreeAnswerStatus = document.getElementById("fragmentThreeAnswerStatus");
const fragmentThreeResult = document.getElementById("fragmentThreeResult");
const fragmentFourAnswerForm = document.getElementById("fragmentFourAnswerForm");
const fragmentFourAnswerInput = document.getElementById("fragmentFourAnswerInput");
const fragmentFourAnswerSubmit = document.getElementById("fragmentFourAnswerSubmit");
const fragmentFourAnswerStatus = document.getElementById("fragmentFourAnswerStatus");
const fragmentFourResult = document.getElementById("fragmentFourResult");
const modalCloseTargets = document.querySelectorAll("[data-close-tracks-modal]");
const signalRiftCloseTargets = document.querySelectorAll("[data-close-signal-rift]");
const fragmentRiftCloseTargets = document.querySelectorAll("[data-close-fragment-rift]");
const fragmentTwoRiftCloseTargets = document.querySelectorAll("[data-close-fragment-two-rift]");
const fragmentThreeRiftCloseTargets = document.querySelectorAll("[data-close-fragment-three-rift]");
const fragmentFourRiftCloseTargets = document.querySelectorAll("[data-close-fragment-four-rift]");
const phasePlateCloseTargets = document.querySelectorAll("[data-close-phase-plate]");
const settlementRiftCloseTargets = document.querySelectorAll("[data-close-settlement-rift]");
const palaceRiftCloseTargets = document.querySelectorAll("[data-close-palace-rift]");
const releaseRiftCloseTargets = document.querySelectorAll("[data-close-release-rift]");
const dateRiftCloseTargets = document.querySelectorAll("[data-close-date-rift]");
const finalDateRiftCloseTargets = document.querySelectorAll("[data-close-final-date-rift]");
const signalGateButtons = document.querySelectorAll("[data-signal-key]");
const signalGateDots = document.querySelectorAll("[data-gate-dot]");

function loadDeferredImages(root = document) {
  root.querySelectorAll("img[data-src]").forEach((image) => {
    image.src = image.dataset.src;
    image.removeAttribute("data-src");
  });
}

function runWhenIdle(callback, timeout = 1600) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, {
      timeout
    });
    return;
  }

  setTimeout(callback, Math.min(timeout, 700));
}

let modalCloseTimer = null;
let signalRiftCloseTimer = null;
let fragmentRiftCloseTimer = null;
let fragmentTwoRiftCloseTimer = null;
let fragmentThreeRiftCloseTimer = null;
let fragmentFourRiftCloseTimer = null;
let fragmentFiveRiftCloseTimer = null;
let fragmentSevenRiftCloseTimer = null;
let fragmentFiveMainReturnTimer = null;
let saturnSimulationTimers = [];
let mobileLandscapeNoticeTimers = [];
let qualifierRebootTimers = [];
let phasePlateCloseTimer = null;
let settlementRiftCloseTimer = null;
let palaceRiftCloseTimer = null;
let releaseRiftCloseTimer = null;
let dateRiftCloseTimer = null;
let finalDateRiftCloseTimer = null;
let lastFocusedElement = null;
let signalRiftLastFocusedElement = null;
let fragmentRiftLastFocusedElement = null;
let fragmentTwoRiftLastFocusedElement = null;
let fragmentThreeRiftLastFocusedElement = null;
let fragmentFourRiftLastFocusedElement = null;
let fragmentFiveRiftLastFocusedElement = null;
let fragmentSevenRiftLastFocusedElement = null;
let phasePlateLastFocusedElement = null;
let settlementRiftLastFocusedElement = null;
let palaceRiftLastFocusedElement = null;
let releaseRiftLastFocusedElement = null;
let dateRiftLastFocusedElement = null;
let finalDateRiftLastFocusedElement = null;
let finalDateCountdownTimer = null;
let bootAssetsLoadPromise = null;
let bootAssetsLoaded = false;
let bootAssetsFailed = false;
let bootSequenceStarted = false;
let bootDialogueTimers = [];
let reverseReplayMode = false;
let reverseReplayStepIndex = 0;
let plcDatabaseActiveCategoryKey = "first";
let plcDatabaseActiveEntryIndex = 0;
let offsetScrambleTimer = null;
let offsetDigitRevealTimers = [];
let qualifierRankingDraftAutosaveTimer = null;
let qualifierRankingDraftSnapshot = "";
let firstLayerTerminalTimers = [];
let plcRestoreToastTimer = null;
let fragmentSevenDialogueTimers = [];
let rankingPreviewMode = "normal";
let tips = Array.isArray(window.PLC_TIPS) && window.PLC_TIPS.length > 0
  ? window.PLC_TIPS
  : ["咕咕咕！"];
let tipIndex = 0;
const signalGateSequence = ["07", "11", "87"];
const plcSecretSignalGateSequence = ["7C", "AF", "87", "11", "00", "07"];
const signalGateStorageKey = "plc.event.signalGate.v1";
const signalGateCacheVersion = "2026-06-13";
const retryPuzzleSequence = ["green", "cyan", "pink", "white", "yellow", "violet"];
const artistGateSequence = ["status", "date", "track", "file"];
const palaceGateAnswer = "10";
const multisourceGateAnswer = "0418200";
const noteGateAnswer = "68.8";
const retryPulseLabels = {
  cyan: "冷光",
  pink: "粉噪",
  yellow: "闪核",
  green: "绿漂",
  white: "白门",
  violet: "余影"
};
const artistPulseLabels = {
  status: "同步失败",
  date: "6.06",
  track: "AT",
  file: "A1Z26",
  score: "1000000",
  rank: "φ"
};
const signalRetryStorageKey = "plc.event.signalRetry.v1";
const signalRetryCacheVersion = "2026-06-13-shard-01-hard-v2";
const fragmentAnswerStorageKey = "plc.event.fragment01.v1";
const fragmentAnswerCacheVersion = "2026-06-13-fragment-01-hard-v2";
const artistGateStorageKey = "plc.event.artistGate.v1";
const artistGateCacheVersion = "2026-06-13-fragment-02-result-v2";
const fragmentTwoAnswerStorageKey = "plc.event.fragment02.v1";
const fragmentTwoAnswerCacheVersion = "2026-06-13-fragment-02-result-artist-v2";
const palaceGateStorageKey = "plc.event.palaceGate.v1";
const palaceGateCacheVersion = "2026-06-13-fragment-03-palace-v1";
const multisourceGateStorageKey = "plc.event.multisourceGate.v1";
const multisourceGateCacheVersion = "2026-06-13-fragment-03-release-check-v1";
const fragmentThreeAnswerStorageKey = "plc.event.fragment03.v1";
const fragmentThreeAnswerCacheVersion = "2026-06-13-fragment-03-chart-v1";
const noteGateStorageKey = "plc.event.noteGate.v1";
const noteGateCacheVersion = "2026-06-13-fragment-04-total-dif-v1";
const fragmentFourAnswerStorageKey = "plc.event.fragment04.v1";
const fragmentFourAnswerCacheVersion = "2026-06-13-fragment-04-dif-v1";
const fragmentFiveAnswerStorageKey = "plc.event.fragment05.v1";
const fragmentFiveAnswerCacheVersion = "2026-06-18-fragment-05-layer-10-v2";
const fragmentFiveEntryStorageKey = "plc.event.fragment05Entry.v1";
const fragmentFiveEntryCacheVersion = "2026-06-18-fragment-05-entry-v1";
const plcDatabaseSeenStorageKey = "plc.event.databaseSeen.v1";
const plcDatabaseSeenCacheVersion = "2026-06-19-plc-plan-v1";
const plcDatabaseFullLoaderStorageKey = "plc.event.databaseFullLoader.v1";
const plcDatabaseFullLoaderCacheVersion = "2026-06-19-full-loader-v1";
const plcDatabaseReplayStorageKey = "plc.event.databaseReplay.v1";
const plcDatabaseReplayCacheVersion = "2026-06-19-replay-toggle-v1";
const plcDatabaseVerificationStorageKey = "plc.event.databaseVerification.v1";
const plcDatabaseVerificationCacheVersion = "2026-06-19-secret-check-v1";
const plcDatabaseVerificationAnswer = "WLWHXHN";
const plcDatabaseVerificationEntryTitle = "??? #0";
const plcDatabaseSecretFragmentTitlePrefix = "\u5341\u4e8c\u5757\u6b8b\u7247";
const plcSecretFragmentThreeTitle = "\u5341\u4e8c\u5757\u6b8b\u7247 #3";
const plcSecretFragmentFourTitle = "\u5341\u4e8c\u5757\u6b8b\u7247 #4";
const plcSecretFragmentFourStorageKey = "plc.event.secretFragmentFour.v1";
const plcSecretFragmentFourCacheVersion = "2026-06-19-secret-fragment-four-v1";
const firstLayerEchoStorageKey = "plc.event.firstLayerEcho.v1";
const firstLayerEchoCacheVersion = "2026-06-20-first-layer-echo-v1";
const firstLayerFragmentOneStorageKey = "plc.event.firstLayerFragmentOne.v1";
const firstLayerFragmentOneCacheVersion = "2026-06-20-first-layer-fragment-one-v1";
const fragmentSevenAnswerStorageKey = "plc.event.fragment07.v1";
const fragmentSevenAnswerCacheVersion = "2026-06-20-fragment-07-bpm-v1";
const fragmentSevenIntroStorageKey = "plc.event.fragment07Intro.v1";
const fragmentSevenIntroCacheVersion = "2026-06-20-fragment-07-intro-v1";
const fragmentSevenAnswer = "retribution";
const fragmentSevenDialogueIntervalMs = 3200;
const fragmentSevenDialogueTexts = [
  "你也许也意识到了这件事。",
  "旅船是掩盖未来的虚像，战车正指引着我们的命运。",
  "硬币掷出之后，正逆的转换从未停止。",
  "前方是毁灭亦是重生。"
];
const plcPlanHiddenLetters = {
  1: "W",
  2: "L",
  3: "W",
  4: "H",
  5: "X",
  6: "H",
  7: "N"
};
const plcPlanHiddenLetterPositions = {
  1: { x: "72%", y: "54%", rotate: "-10deg" },
  2: { x: "31%", y: "62%", rotate: "7deg" },
  3: { x: "64%", y: "42%", rotate: "4deg" },
  4: { x: "39%", y: "46%", rotate: "-7deg" },
  5: { x: "76%", y: "68%", rotate: "9deg" },
  6: { x: "26%", y: "39%", rotate: "-5deg" },
  7: { x: "58%", y: "63%", rotate: "6deg" }
};
const finalBootDialogueStorageKey = "plc.event.finalBootDialogue.v1";
const finalBootDialogueCacheVersion = "2026-06-17-boot-dialogue-v1";
const finalOffsetStorageKey = "plc.event.finalOffset.v1";
const finalOffsetCacheVersion = "2026-06-17-offset-table-v1";
const qualifierRankingDraftStorageKey = "plc.event.qualifierRankingDraft.v1";
const qualifierRankingDraftCacheVersion = "2026-06-17-qualifier-ranking-draft-v1";
const fragmentFourAnswer = "17";
const fragmentFourAnswerLabel = "Dif：17";
const fragmentFourResultLabel = "Dif：17.0";
const legacyFragmentFourResultLabel = "Dif：17.?";
const fragmentFiveResultLabel = "SongName：Gyaku";
const legacyFragmentFiveResultLabels = ["10 // 穹顶"];
const plcDatabaseEntries = [
  {
    title: "PLC计划 #0",
    collectedAt: "26/6/19",
    keeper: "像素塔",
    level: "Main",
    body: "于一切破碎的音符残片中，我得以窥得虚空的一隅。"
  },
  {
    title: "PLC计划 #1",
    collectedAt: "26/6/19",
    keeper: "像素塔",
    level: "Main",
    body: [
      "他们把这一计划称作“PLC”，具体的含义，至今无人知晓。",
      "但时至今日，在这穹顶之下——",
      "命运的轨迹终将交于一点，而交点的坐标，正位于我所处的位置。",
      "我来到了一座残破的实验室中。",
      "自“PLC”计划开始展开以来，遭遇了很多来自不明地区的攻击。",
      "他们抢掠烧杀，天下再不安宁。",
      "",
      "实验室的设备已经被破坏，残骸散落一地。",
      "在一张生锈的铁桌上，一份残破的实验日志被随意的散落在上面。",
      "——页码不齐，似乎是某人匆忙离开时未整理好的资料。"
    ].join("\n")
  },
  {
    title: "PLC计划 #2",
    collectedAt: "26/6/19",
    keeper: "像素塔",
    level: "Main",
    body: [
      "日志上的内容能被勉强辨认。",
      "前一半的内容叙述着所谓“PLC”实验的过程。",
      "然而在日期为6/14的日志后，情况似乎急转直下——",
      "",
      "“我们遭遇了一场陨石轰炸。”",
      "",
      "这句话写得很重，墨水在纸背上洇开，似乎是被人颤抖着写下的，字体歪歪扭扭，占了上下两行的空间。",
      "空荡的实验室中再无一个人影，没有人能够诉说他们的经历。",
      "只有一直发出轰鸣声的灯具和时不时滴下水滴的、破旧的生锈铁皮天花板陪着我，在这样一个废墟中。"
    ].join("\n")
  },
  {
    title: "PLC计划 #3",
    collectedAt: "26/6/19",
    keeper: "像素塔",
    level: "Main",
    body: [
      "事情差不多理清了——",
      "不知多长时间前，一道被称为“音轨”的不明物体突然从空中坠落。",
      "没有人知道它的来源。",
      "据第一个发现它的研究人员回忆，在靠近这些物质时，它会释放出像素状的粒子，发出霓虹般的光芒。",
      "而在这些粒子范围内的人，将会听到一段令人十分熟悉的音调——尽管他们从未听过这种曲目。",
      "随着调查深入，人们发现这些音律拥有精神污染的效应。",
      "一旦接触，便会永远停留在脑中，无法除去。",
      "久而久之，人们便会陷入癫狂。",
      "据那份实验报告所述，主要症状为“剧烈头痛，眩晕，出现幻觉。严重者将不受控制，大声喊叫，内容为‘重聚、幽蓝、霓虹、中之层’等。”",
      "为了研究这些来路不明的音轨，减少人员受到的伤害，像素塔组织了一支先锋小组。",
      "于是，”PLC计划“诞生了。",
      "这是一个从未公开过的保密行动。"
    ].join("\n")
  },
  {
    title: "PLC计划 #4",
    collectedAt: "26/6/19",
    keeper: "像素塔",
    level: "Main",
    body: [
      "研究开始的几个月，一切如常。",
      "很快，对于音轨的初步信息，他们已经有了掌握。",
      "在完善的保护措施下，研究小组的成员并未受到音轨带来的伤害。",
      "经过他们的分析，发现这些音轨由漂浮在虚无宇宙中的微子重聚构成，蕴含了来自未知的讯息，因为无法识别，导致它们以音符粒子的方式溢出。",
      "而分析音轨所传达的信息，便成了“PLC”计划的第一要务。",
      "它更像一种被压缩过的记录，里面混着声音、图像、记忆，还有一些无法归类的东西。仪器能读出它们，却不能翻译它们。",
      "实验进行到这一步便遇见了卡点。由于不明信息过多，最尖端的科研技术也无法破译音轨所传递的信息。",
      "就在实验小组的成员一筹莫展之时，一场意外爆发了。",
      "实验报告中，这样描述这场足以改变所有的变故——",
      "",
      "“浩渺深空中能量翻涌，骤然袭来的陨石群划破星云雾霭，密集砸落轰击星礁，碎石四散迸溅。”",
      "",
      "没有人能预料到。",
      "",
      "于是，进行到一半的“PLC”计划，悄然在硝烟中，按下了暂停键。"
    ].join("\n")
  },
  {
    title: "PLC计划 #5",
    collectedAt: "26/6/19",
    keeper: "像素塔",
    level: "Main",
    body: [
      "时间，被反复挤压、折叠。",
      "空间，是无法定义的世界。",
      "陨石轰然降下，于漫天尘灰之中，传来阵阵音律。",
      "没有人听过这些音乐，但所有人都感到无比熟悉，那首曲子像是早就在每个人心里。"
    ].join("\n")
  },
  {
    title: "PLC计划 #6",
    collectedAt: "26/6/19",
    keeper: "像素塔",
    level: "Main",
    body: [
      "在幸存者营地，一切事情将出现专机。",
      "人们通过陨石中的音乐，发现了埋藏在地下深处的，一张音乐唱片。",
      "唱片机转动的一瞬，一曲旋律传入耳中。",
      "它不属于这个世界。",
      "唱片机停下了，随着一声巨响。",
      "天空轰然撕裂出一个巨大的裂缝，随着太阳的光线迅速暗淡无光，人群陷入混乱。",
      "无数的碎片从裂缝中落下，反射着唯一的一缕光芒，在黑云中折射、传播。",
      "后来，人们在四处找到了一些东西——",
      "",
      "一些残片，它们大小不同，形状不同，但都带着同一种微弱的声音。",
      "经过统计，特征相同的残片，共十二张。",
      "档案里把它们归为同一类：",
      "",
      "无法解析。"
    ].join("\n")
  },
  {
    title: "PLC计划 #7",
    collectedAt: "26/6/20",
    keeper: "像素塔",
    level: "Main",
    body: [
      "很快，人们便破译了十二块残片中的六块。",
      "他们发现，这六块残片中的五块，指向同一张谱面——一张他们从未见过的谱面。",
      "他们猜测，找到属于这张谱面的最后一块残片，即第六块残片，便可进入谱面。",
      "但没有人能证实这个猜测，因为没有人能找到最后一块残片。",
      "而另一块与众不同的残片也吸引了人们的注意力。",
      "它指向的并不是同一张谱面，而是另外一张，全新的谱面？",
      "研究所的人们发疯般寻找剩下的残片，试图理清这其中蕴藏的真相。",
      "又有一行人来到了陨石坠落的地方，但这里什么都没有。",
      "夜幕逐渐降临了，他们准备返回研究所。",
      "带头的研究员望向他的手表，竟发现所示时间为14:21。",
      "在耗费了约12分钟的时间回到研究所后，手表的时间又变为了19:40。",
      "于是，人们发现陨石降落的区域存在时间偏移。",
      "",
      "或许，这一发现能够大幅推动对残片的研究进度。"
    ].join("\n")
  },
  {
    title: "PLC计划 #8",
    collectedAt: "??/?/??",
    keeper: "正在解析",
    level: "Main",
    body: [
      "后续记录仍在整理。",
      "若有新的纸页被找到，本档案将继续补全。"
    ].join("\n")
  }
];
const plcDatabasePendingPlanEntry = {
  title: "PLC计划 #7",
  collectedAt: "??/?/??",
  keeper: "正在解析",
  level: "Main",
  body: [
    "后续记录仍在整理。",
    "若有新的纸页被找到，本档案将继续补全。"
  ].join("\n")
};
const plcExperimentLogEntries = [
  {
    title: "实验日志 #0",
    collectedAt: "26/6/19",
    keeper: "音轨实验室",
    level: "Side",
    body: "我们发现了一本留存于实验室里的实验日志，上面的页码已被撕得残破不堪，只留下了极少的可视内容。"
  },
  {
    title: "实验日志 #1",
    collectedAt: "25/10/6",
    keeper: "音轨实验室",
    level: "Side",
    body: [
      "今日实验推进进度：0",
      "73/240"
    ].join("\n")
  },
  {
    title: "实验日志 #2",
    collectedAt: "26/4/11",
    keeper: "音轨实验室",
    level: "Side",
    body: [
      "目前实验推进进度：45",
      "实验室里的人员状态不佳，音轨究竟何时才会被破解？",
      "171/240"
    ].join("\n")
  },
  {
    title: "实验日志 #3",
    collectedAt: "26/6/14",
    keeper: "音轨实验室",
    level: "Side",
    body: [
      "我们遭遇了一场陨石轰炸。",
      "浩渺深空中能量翻涌，骤然袭来的陨石群划破星云雾霭，密集砸落轰击星礁，碎石四散迸溅。",
      "在震荡轰鸣的断壁之间，一枚音乐磁盘静静蛰伏于陨击凹痕之中。",
      "这个磁盘上面只有一串看不懂的密文，经过实验人员的研究，密文最终被转化为这串字符：",
      "−·−·−−−·−−·−·−−··−−··−−−−···−−·−−−−.−−−·−····−···−−",
      "235/240"
    ].join("\n")
  },
  {
    title: "实验日志 #4",
    collectedAt: "26/6/15",
    keeper: "音轨实验室",
    level: "Side",
    body: [
      "只是休息一晚，密文就发生了转变，第一段式的末尾被删除，看起来已经无法奏效。新的密文是这样的：",
      "−·−·−−−·−−·−−··−··−−−−···−−··−−·.−−−·−····−···−−",
      "看起来仍然需要昨天陨石碎片的帮助。",
      "群管家说，其他的帮助在昨天的谈话里。",
      "236/240"
    ].join("\n")
  },
    {
    title: "实验日志 #SP",
    collectedAt: "26/6/14",
    keeper: "B*i*uN*t*i*k*own*o*d",
    level: "Side",
    body: [
      "我抓住了虚空中四首乐曲掉落的音符，乐曲之首便是我想要的结果。",
      "它们掉落了一串密文，似乎有一种神秘的力量在指引着我：",
      "1BHagejhknWhRhNqIzYwJ2Q",
    ].join("\n")
  },
  {
    title: "20260614_221800.txt",
    collectedAt: "26/6/14",
    keeper: "群管家",
    level: "Side",
    body: [
      "浩渺深空漫延开层层叠叠的星霭，交错星轨循着亘古不变的隐性秩序缓缓流转。苍茫星河被无形的引力脉络分割锚定，悬浮漂泊的星云碎块、游离穿梭的宇宙粒子，全都恪守着潜藏的排布节律。",
      "",
      "深空里翻涌的能量浪潮自有收敛边界，偶然迸发的星辰异动终会归于平稳。日月轮转、星河起落，万象浮沉皆被隐匿于虚无深处的规则稳稳框束，世间所有偶然的偏移与躁动，终究会顺着既定脉络，奔赴早已定格的运行轨迹。",
      "--14日22：18分--",
      "/time add -7000",
      "∥ASCⅡ 20108 36827 21046∥",
      "|TmpRek16UkJOa0UwUmpVMU16RTFNRFV6TXpBME5qY3lOalUyUVRReU16UT0=|",
      "Permutation Code/−·−·−−−·−−·−·−−··−−··−−−−···−−·−−−−.−−−·−····−···−−/"
    ].join("\n")
  }
];
const plcSecretEntries = [
  {
    title: "??? #0",
    collectedAt: "26/6/19",
    keeper: "Unknown",
    level: "Null",
    body: "[PLC计划数据库深层保密数据，查阅请验证身份。]"
  },
  {
    title: "十二块残片 #0",
    collectedAt: "26/6/19",
    keeper: "Unknown",
    level: "Null",
    body: [
      "那天，从天而降的十二块残片，有五块均被前线小组集齐。",
      "而对于它们的破译工作，正紧锣密鼓地展开——",
      "",
      "自从不知什么人发现了这些残片中藏着信息，人们又开始了没日没夜的研究。",
      "像极了那所谓的PLC计划小组。",
      "",
      "可是他们却真的得到了结果，这五块残片的内容被全部解析。",
      "",
      "“SongName：Gyaku”",
      "“Artist：Essbee”",
      "“Chart：BaNa₂Be₂O₅”",
      "“BPM：182”",
      "“Dif：17.0”",
      "",
      "人们猜测，这是漂浮在虚无宇宙中的一整张谱面，受到外力破坏而成的残片。",
      "部分人还指出了，一张谱面对应六块残片的道理。",
      "",
      "然而至今无人知道剩下一块残片的下落，也不知晓残片的总数是否为十二块。",
      "",
      "这场看似不同的自救行动，似乎又一次停滞不前。",
      "",
      "收集进度 5/12",
      "破译进度 5/12"
    ].join("\n")
  },
  {
    title: "十二块残片 #1",
    collectedAt: "26/6/19",
    keeper: "Unknown",
    level: "Null",
    body: [
      "“喂———！！”",
      "“看看这是什么———！！”",
      "远处山坡上传来一位研究员激动的声音。",
      "探勘小组的成员迅速围了上去，定睛一看，发现那深埋在绿紫色土壤中的，是一块未被发现的残片。",
      "他们激动极了，互相击掌拥抱，庆祝着这一巨大发现。",
      "他们知道，在现在的时间点，任何有实质性的发现都将使研究迈出巨大一步。",
      "",
      "这块残片很快被送到了研究所。",
      "说是研究所，其实是在幸存者营地的一个坡地，临时搭建的小房子而已。",
      "毕竟真正的PLC计划研究所，早已在那场陨石灾难激起的扬尘中谢幕。",
      "",
      "发现新残片的研究员名为于世晴。他正在破译现场围观整个破译流程。",
      "",
      "残片被放入了解码机器中，机器发出一阵炫光。",
      "很快，机器便发出了运行的声音，显示屏上的进度一点一点向上涨。",
      "",
      "“12%，15%，18%...“",
      "",
      "这一块残片的破译时间，比破译前面所有残片加起来都要长。",
      "",
      "伴随着机器停止运转的响动，那块残片被原封不动地从解码机中弹出。",
      "",
      "显示屏上没有内容，只有冰冷的”解码失败“。",
      "",
      "空气仿佛凝固了，没有人说话。",
      "",
      "收集进度 6/12",
      "破译进度 5/12"
    ].join("\n")
  },
  {
    title: "十二块残片 #2",
    collectedAt: "26/6/19",
    keeper: "Unknown",
    level: "Null",
    body: [
      "残片破译失败的消息，很快传遍了整个幸存者营地。",
      "没有残片的帮助，他们永远无法破解音轨的谜题，也就永远无法重建自己的家园。",
      "这无疑是雪上加霜。",
      "",
      "深夜，营地归于寂静。",
      "于世晴独自一人，又爬上了白天发现残片的山坡。",
      "他发现那块土壤，正散发着绿紫色的光芒，照亮了漆黑的夜。",
      "他纵身一跃，投入了那光芒之中。",
      "",
      "那夜之后，没有人再见过他。",
      "寻人启事被贴满了整个营地，研究所乱成了一锅粥——",
      "于世晴的突然消失，给整件事件画上了更大的问号。",
      "",
      "可是，也有人发现，在那夜之后，解码机突然能够正常运行了。",
      "新残片的解码结果终于输出在显示屏上。",
      "",
      "人们逐渐理解了一切。",
      "",
      "收集进度 6/12",
      "破译进度 6/12"
    ].join("\n")
  },
  {
    title: "十二块残片 #3",
    collectedAt: "26/6/19",
    keeper: "Unknown",
    level: "Null",
    body: [
      "很快，人们就掌握了残片的秘密。",
      "下面，请遵循下方的步骤。",
      "",
      "1/请关闭数据库。注意不要关闭重演按钮；",
      "2/请找到“静默频段”板块；",
      "3/请按以下顺序输入：7C / AF / 87 / 11 / 00 / 07；",
      "4/请清除回卷；",
      "5/请回到隐秘分类，阅读“十二块残片 #4”后，返回主页面。"
    ].join("\n")
  },
  {
    title: "十二块残片 #4",
    collectedAt: "26/6/19",
    keeper: "Unknown",
    level: "Null",
    body: [
      "新的残片回卷已被消除。",
      "去找回那最终的六块残片吧，",
      "我们等你，一起回归。"
    ].join("\n")
  }
];
const plcDatabaseCategories = {
  first: {
    key: "first",
    label: "第一分类",
    title: "PLC计划",
    entries: plcDatabaseEntries
  },
  second: {
    key: "second",
    label: "第二分类",
    title: "实验日志",
    entries: plcExperimentLogEntries
  },
  secret: {
    key: "secret",
    label: "隐秘分类",
    title: "隐秘分类",
    entries: plcSecretEntries
  }
};
const finalDateTargetTime = new Date(2026, 5, 20, 20, 0, 0).getTime();
const bootAssetUrls = [
  "./assets/countdown-0620-obscured.webp",
  "./assets/countdown-0620-obscured.png"
];
const bootDialogueIntervalMs = 7000;
const bootDialogueTexts = [
  "你也许也意识到了这件事。",
  "被切开的蓝白色块还没有对齐。",
  "只有微弱的光芒还在向外溢出。",
  "在锁定最终坐标之前，",
  "请逆行至我们最初开始的地方。"
];
const reverseReplaySteps = [
  "fragmentFourAnswer",
  "noteGate",
  "fragmentThreeAnswer",
  "multisourceGate",
  "palaceGate",
  "fragmentTwoAnswer",
  "artistGate",
  "fragmentAnswer",
  "retryGate",
  "signalGate"
];
const offsetFinalValue = "80840586-95:85";
const offsetScrambleGlyphs = "0123456789?-+";
const offsetScrambleDelayMs = 5000;
const offsetScrambleDurationMs = 5000;
const offsetDigitRevealIntervalMs = 115;
const finalRankingPreviewPlayers = [
  { nickname: "Mika_XBR", score: "2998597" },
  { nickname: "Circle.", score: "2998211" },
  { nickname: "XietiaoC", score: "2997961" }
];
const qualifierRankingAnswers = [
  { rank: 5, name: "yaRsuteiuQ", score: "2995812" },
  { rank: 7, name: "Distorted_Fate", score: "2993213" },
  { rank: 10, name: "Deco*27", score: "2987375" }
];
const mysterySignalLabels = ["∴∴", "Q∅", "∷A", "∑∎", "N∴", "??"];
let signalGateInput = [];
let signalGateLocked = false;
let retryPuzzleInput = [];
let retryPuzzleLocked = false;
let artistGateInput = [];
let artistGateLocked = false;
let palaceGateLocked = false;
let multisourceGateLocked = false;
let noteGateLocked = false;

function formatSelectionCountdown() {
  const endTime = new Date(2026, 6, 3, 23, 59, 0);
  const now = new Date();
  const diff = endTime - now;

  if (diff <= 0) {
    return "海选倒计时：已截止";
  }

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  return `海选倒计时：${days}天${hours}小时`;
}

function updateSelectionCountdown() {
  if (!selectionCountdown) {
    return;
  }

  selectionCountdown.textContent = formatSelectionCountdown();
}

function openTracksModal() {
  if (!tracksModal) {
    return;
  }

  loadDeferredImages(tracksModal);
  clearTimeout(modalCloseTimer);
  lastFocusedElement = document.activeElement;

  tracksModal.classList.remove("is-closing");
  tracksModal.classList.add("is-open");
  tracksModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  updateSelectionCountdown();

  const closeButton = tracksModal.querySelector(".modal-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeTracksModal() {
  if (!tracksModal || !tracksModal.classList.contains("is-open")) {
    return;
  }

  tracksModal.classList.add("is-closing");
  tracksModal.classList.remove("is-open");
  tracksModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  modalCloseTimer = setTimeout(() => {
    tracksModal.classList.remove("is-closing");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }, 560);
}

function openSignalRift() {
  if (!signalRift) {
    return;
  }

  clearTimeout(signalRiftCloseTimer);
  signalRiftLastFocusedElement = document.activeElement;

  signalRift.classList.remove("is-closing");
  signalRift.classList.add("is-open");
  signalRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = signalRift.querySelector(".signal-rift-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeSignalRift() {
  if (!signalRift || !signalRift.classList.contains("is-open")) {
    return;
  }

  signalRift.classList.add("is-closing");
  signalRift.classList.remove("is-open");
  signalRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  signalRiftCloseTimer = setTimeout(() => {
    signalRift.classList.remove("is-closing");

    if (
      signalRiftLastFocusedElement &&
      typeof signalRiftLastFocusedElement.focus === "function"
    ) {
      signalRiftLastFocusedElement.focus();
    }
  }, 340);
}

function openPhasePlateRift() {
  if (!phasePlateRift) {
    return;
  }

  loadDeferredImages(phasePlateRift);
  clearTimeout(phasePlateCloseTimer);
  phasePlateLastFocusedElement = document.activeElement;

  phasePlateRift.classList.remove("is-closing");
  phasePlateRift.classList.add("is-open");
  phasePlateRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = phasePlateRift.querySelector(".signal-rift-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closePhasePlateRift() {
  if (!phasePlateRift || !phasePlateRift.classList.contains("is-open")) {
    return;
  }

  phasePlateRift.classList.add("is-closing");
  phasePlateRift.classList.remove("is-open");
  phasePlateRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  phasePlateCloseTimer = setTimeout(() => {
    phasePlateRift.classList.remove("is-closing");

    if (
      phasePlateLastFocusedElement &&
      typeof phasePlateLastFocusedElement.focus === "function"
    ) {
      phasePlateLastFocusedElement.focus();
    }
  }, 340);
}

function openSettlementRift() {
  if (!settlementRift) {
    return;
  }

  loadDeferredImages(settlementRift);
  clearTimeout(settlementRiftCloseTimer);
  settlementRiftLastFocusedElement = document.activeElement;

  settlementRift.classList.remove("is-closing");
  settlementRift.classList.add("is-open");
  settlementRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = settlementRift.querySelector(".signal-rift-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeSettlementRift() {
  if (!settlementRift || !settlementRift.classList.contains("is-open")) {
    return;
  }

  settlementRift.classList.add("is-closing");
  settlementRift.classList.remove("is-open");
  settlementRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  settlementRiftCloseTimer = setTimeout(() => {
    settlementRift.classList.remove("is-closing");

    if (
      settlementRiftLastFocusedElement &&
      typeof settlementRiftLastFocusedElement.focus === "function"
    ) {
      settlementRiftLastFocusedElement.focus();
    }
  }, 340);
}

function openPalaceRift() {
  if (!palaceRift) {
    return;
  }

  loadDeferredImages(palaceRift);
  clearTimeout(palaceRiftCloseTimer);
  palaceRiftLastFocusedElement = document.activeElement;

  palaceRift.classList.remove("is-closing");
  palaceRift.classList.add("is-open");
  palaceRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = palaceRift.querySelector(".signal-rift-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closePalaceRift() {
  if (!palaceRift || !palaceRift.classList.contains("is-open")) {
    return;
  }

  palaceRift.classList.add("is-closing");
  palaceRift.classList.remove("is-open");
  palaceRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  palaceRiftCloseTimer = setTimeout(() => {
    palaceRift.classList.remove("is-closing");

    if (
      palaceRiftLastFocusedElement &&
      typeof palaceRiftLastFocusedElement.focus === "function"
    ) {
      palaceRiftLastFocusedElement.focus();
    }
  }, 340);
}

function openReleaseRift() {
  if (!releaseRift) {
    return;
  }

  loadDeferredImages(releaseRift);
  clearTimeout(releaseRiftCloseTimer);
  releaseRiftLastFocusedElement = document.activeElement;

  releaseRift.classList.remove("is-closing");
  releaseRift.classList.add("is-open");
  releaseRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = releaseRift.querySelector(".signal-rift-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeReleaseRift() {
  if (!releaseRift || !releaseRift.classList.contains("is-open")) {
    return;
  }

  releaseRift.classList.add("is-closing");
  releaseRift.classList.remove("is-open");
  releaseRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  releaseRiftCloseTimer = setTimeout(() => {
    releaseRift.classList.remove("is-closing");

    if (
      releaseRiftLastFocusedElement &&
      typeof releaseRiftLastFocusedElement.focus === "function"
    ) {
      releaseRiftLastFocusedElement.focus();
    }
  }, 340);
}

function openDateRift() {
  if (!dateRift) {
    return;
  }

  loadDeferredImages(dateRift);
  clearTimeout(dateRiftCloseTimer);
  dateRiftLastFocusedElement = document.activeElement;

  dateRift.classList.remove("is-closing", "is-failed");
  dateRift.classList.add("is-open");
  dateRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (reverseReplayMode) {
    noteGateLocked = false;
  } else if (readNoteGateCache()) {
    revealNoteGateSolved({
      fromCache: true
    });
  } else {
    noteGateLocked = false;
    dateRift.classList.remove("is-solved");

    if (noteGateInput) {
      noteGateInput.disabled = false;
    }

    if (noteGateSubmit) {
      noteGateSubmit.disabled = false;
    }

    if (noteGateStatus) {
      noteGateStatus.textContent = "等待总难度。";
      noteGateStatus.classList.remove("is-failed", "is-complete");
    }
  }

  const focusTarget = noteGateInput?.disabled
    ? dateRift.querySelector(".signal-rift-close")
    : noteGateInput;

  if (focusTarget && typeof focusTarget.focus === "function") {
    focusTarget.focus();
  }
}

function closeDateRift() {
  if (!dateRift || !dateRift.classList.contains("is-open")) {
    return;
  }

  dateRift.classList.add("is-closing");
  dateRift.classList.remove("is-open");
  dateRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  dateRiftCloseTimer = setTimeout(() => {
    dateRift.classList.remove("is-closing", "is-failed");

    if (
      dateRiftLastFocusedElement &&
      typeof dateRiftLastFocusedElement.focus === "function"
    ) {
      dateRiftLastFocusedElement.focus();
    }
  }, 340);
}

function formatFinalDateCountdown(ms) {
  if (ms <= 0) {
    return "00D 00H 00M 00S";
  }

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, "0");

  return `${pad(days)}D ${pad(hours)}H ${pad(minutes)}M ${pad(seconds)}S`;
}

function updateFinalDateCountdown() {
  if (!finalDateCountdown) {
    return;
  }

  const nextCountdown = formatFinalDateCountdown(finalDateTargetTime - Date.now());
  if (finalDateCountdown.textContent !== nextCountdown) {
    finalDateCountdown.textContent = nextCountdown;
    finalDateCountdown.classList.remove("is-ticking");
    finalDateCountdown.offsetWidth;
    finalDateCountdown.classList.add("is-ticking");
  }

  refreshBootGate();
}

function startFinalDateCountdown() {
  updateFinalDateCountdown();
  clearInterval(finalDateCountdownTimer);
  finalDateCountdownTimer = setInterval(updateFinalDateCountdown, 1000);
}

function stopFinalDateCountdown() {
  clearInterval(finalDateCountdownTimer);
  finalDateCountdownTimer = null;
}

function updateBootProgress(loaded, total) {
  const progress = total > 0 ? Math.round((loaded / total) * 100) : 100;

  if (bootProgressBar) {
    bootProgressBar.style.width = `${progress}%`;
  }

  if (bootProgressText) {
    bootProgressText.textContent = `${progress}%`;
  }
}

function preloadBootAssets() {
  if (bootAssetsLoadPromise) {
    return bootAssetsLoadPromise;
  }

  bootAssetsFailed = false;

  if (bootAssetUrls.length === 0) {
    bootAssetsLoaded = true;
    bootAssetsFailed = false;
    updateBootProgress(1, 1);
    refreshBootGate();
    bootAssetsLoadPromise = Promise.resolve();
    return bootAssetsLoadPromise;
  }

  let loadedCount = 0;
  updateBootProgress(0, bootAssetUrls.length);

  if (bootLoadout) {
    bootLoadout.setAttribute("aria-hidden", "false");
  }

  bootAssetsLoadPromise = Promise.all(bootAssetUrls.map((url) => new Promise((resolve) => {
    const image = new Image();
    const settle = (ok) => {
      loadedCount += 1;
      updateBootProgress(loadedCount, bootAssetUrls.length);
      resolve(ok);
    };

    image.onload = () => settle(true);
    image.onerror = () => settle(false);
    image.src = url;
  }))).then((results) => {
    bootAssetsFailed = results.some((ok) => !ok);
    bootAssetsLoaded = !bootAssetsFailed;

    if (bootProgressText && bootAssetsFailed) {
      bootProgressText.textContent = "ERR";
    }

    refreshBootGate();
  });

  return bootAssetsLoadPromise;
}

function isFinalDateCountdownComplete() {
  return finalDateTargetTime - Date.now() <= 0;
}

function refreshBootGate() {
  const countdownComplete = isFinalDateCountdownComplete();
  finalDateRift?.classList.toggle("is-countdown-complete", countdownComplete);
  finalDateRift?.classList.toggle("is-boot-assets-loaded", bootAssetsLoaded);

  if (bootSequenceButton) {
    bootSequenceButton.disabled = !countdownComplete || !bootAssetsLoaded || bootSequenceStarted;
  }

  if (bootLoadout) {
    bootLoadout.setAttribute("aria-hidden", bootAssetsLoaded ? "true" : "false");
  }
}

function resetBootSequence() {
  bootSequenceStarted = false;
  bootDialogueTimers.forEach((timer) => clearTimeout(timer));
  bootDialogueTimers = [];
  finalDateRift?.classList.remove("is-booting", "is-dialogue-active");

  if (bootDialogueStage) {
    bootDialogueStage.setAttribute("aria-hidden", "true");
  }

  if (bootDialogueStack) {
    bootDialogueStack.replaceChildren();
  }

  refreshBootGate();
}

function appendBootDialogue(text) {
  if (!bootDialogueStack) {
    return;
  }

  bootDialogueStack.querySelectorAll(".boot-text-card").forEach((card) => {
    card.classList.remove("is-entering");
    card.classList.add("is-exiting");
  });

  const card = document.createElement("div");
  card.className = "boot-text-card is-entering";
  card.textContent = text;
  bootDialogueStack.prepend(card);

  window.setTimeout(() => {
    bootDialogueStack.querySelectorAll(".boot-text-card.is-exiting").forEach((item) => {
      item.remove();
    });
  }, 860);
}

function startBootDialogueSequence() {
  if (!bootDialogueStage) {
    return;
  }

  bootDialogueStage.setAttribute("aria-hidden", "false");
  finalDateRift?.classList.add("is-dialogue-active");

  bootDialogueTexts.forEach((text, index) => {
    const timer = window.setTimeout(() => {
      appendBootDialogue(text);
    }, index * bootDialogueIntervalMs);
    bootDialogueTimers.push(timer);
  });

  const returnTimer = window.setTimeout(() => {
    writeFinalBootDialogueCache();
    beginReverseMainReturn();
  }, bootDialogueTexts.length * bootDialogueIntervalMs + 900);
  bootDialogueTimers.push(returnTimer);
}

function startBootSequence() {
  if (!bootAssetsLoaded || !isFinalDateCountdownComplete() || bootSequenceStarted) {
    return;
  }

  bootSequenceStarted = true;
  if (bootSequenceButton) {
    bootSequenceButton.disabled = true;
  }

  finalDateRift?.classList.add("is-booting");
  const timer = window.setTimeout(startBootDialogueSequence, 3400);
  bootDialogueTimers.push(timer);
}

function getReverseCurrentStep() {
  return reverseReplaySteps[reverseReplayStepIndex] || "";
}

function isReverseStepActive(step) {
  return reverseReplayMode && getReverseCurrentStep() === step;
}

function setReverseStatus(status, message, state = "input") {
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.toggle("is-failed", state === "failed");
  status.classList.toggle("is-complete", state === "complete");
}

function clearReverseStatus(status) {
  setReverseStatus(status, "", "input");
}

function prepareReverseAnswer(rift, input, submit, status, result, value, resultText, message) {
  rift?.classList.remove("is-failed");
  rift?.classList.add("is-fragment-solved");

  if (input) {
    input.value = value;
    input.disabled = false;
  }

  if (submit) {
    submit.disabled = false;
  }

  if (result) {
    result.textContent = resultText;
    result.setAttribute("aria-hidden", "false");
  }

  setReverseStatus(status, message, "complete");
}

function prepareReverseChoiceButtons(buttons, sequence, datasetName) {
  buttons.forEach((button) => {
    const value = button.dataset[datasetName];
    const isSelected = sequence.includes(value);
    button.classList.toggle("is-used", isSelected);
    button.classList.toggle("is-accepted", isSelected);
    button.classList.remove("is-rejected");
    button.disabled = false;
  });
}

function revealReverseFinalState() {
  revealFinalSignal({
    animate: false,
    scroll: false
  });
  finalSignalSection?.classList.add(
    "is-fractured",
    "is-shard-one-open",
    "is-shard-two-open",
    "is-shard-three-open",
    "is-shard-four-open"
  );
  finalSignalSection?.classList.remove("is-reverse-folding", "is-resealing");
  finalArtFrame?.classList.add("is-fractured");
  finalArtFrame?.classList.remove("is-fracturing");

  [
    openFragmentRiftButton,
    openFragmentTwoRiftButton,
    openFragmentThreeRiftButton,
    openFragmentFourRiftButton
  ].forEach((button) => {
    if (button) {
      button.disabled = false;
    }
  });
}

function prepareReverseSignalGate() {
  signalGateInput = [...signalGateSequence];
  signalGateLocked = false;
  signalGatePanel?.classList.remove("is-failed", "is-resolving");
  signalGatePanel?.classList.add("is-unlocked");
  prepareReverseChoiceButtons(signalGateButtons, signalGateSequence, "signalKey");

  if (resetSignalGateButton) {
    resetSignalGateButton.disabled = false;
  }

  updateSignalGateProgress("complete");
  setReverseStatus(signalGateStatus, "握手已恢复：静默频段保持展开", "complete");
}

function prepareReverseRetryGate() {
  retryPuzzleInput = [...retryPuzzleSequence];
  retryPuzzleLocked = false;
  retryPuzzle?.classList.remove("is-failed", "is-resolving");
  retryPuzzle?.classList.add("is-complete");
  prepareReverseChoiceButtons(retryPulseButtons, retryPuzzleSequence, "retryPulse");
  updateRetryPulseSlots("complete");
  setReverseStatus(retryPuzzleStatus, "裂解记录已恢复：右上残片保持在线。", "complete");
}

function prepareReverseArtistGate() {
  artistGateInput = [...artistGateSequence];
  artistGateLocked = false;
  artistGatePuzzle?.classList.remove("is-failed", "is-resolving");
  artistGatePuzzle?.classList.add("is-complete");
  prepareReverseChoiceButtons(artistPulseButtons, artistGateSequence, "artistPulse");
  updateArtistPulseSlots("complete");
  setReverseStatus(artistGateStatus, "第二片进度已恢复。", "complete");
}

function prepareReverseMainInputs() {
  palaceGateLocked = false;
  multisourceGateLocked = false;
  noteGateLocked = false;

  prepareReverseAnswer(
    fragmentRift,
    fragmentAnswerInput,
    fragmentAnswerSubmit,
    fragmentAnswerStatus,
    fragmentResult,
    "182",
    "BPM 182",
    "这一项已经记录过了。"
  );
  prepareReverseAnswer(
    fragmentTwoRift,
    fragmentTwoAnswerInput,
    fragmentTwoAnswerSubmit,
    fragmentTwoAnswerStatus,
    fragmentTwoResult,
    "Essbee",
    "Artist：Essbee",
    "署名已经记录过了。"
  );
  prepareReverseAnswer(
    fragmentThreeRift,
    fragmentThreeAnswerInput,
    fragmentThreeAnswerSubmit,
    fragmentThreeAnswerStatus,
    fragmentThreeResult,
    "BaNa₂Be₂O₅",
    "Chart：BaNa₂Be₂O₅",
    "谱面式已经记录过了。"
  );
  prepareReverseAnswer(
    fragmentFourRift,
    fragmentFourAnswerInput,
    fragmentFourAnswerSubmit,
    fragmentFourAnswerStatus,
    fragmentFourResult,
    fragmentFourResultLabel,
    fragmentFourResultLabel,
    "第四格已经记录过了。"
  );

  if (palaceGateInput) {
    palaceGateInput.value = palaceGateAnswer;
    palaceGateInput.disabled = false;
  }

  if (palaceGateSubmit) {
    palaceGateSubmit.disabled = false;
  }

  setReverseStatus(palaceGateStatus, "上一段已恢复，继续做上线检查。", "complete");

  if (multisourceGateInput) {
    multisourceGateInput.value = multisourceGateAnswer;
    multisourceGateInput.disabled = false;
  }

  if (multisourceGateSubmit) {
    multisourceGateSubmit.disabled = false;
  }

  setReverseStatus(multisourceGateStatus, "上线检查已恢复，第三片保持在线。", "complete");

  dateRift?.classList.add("is-solved");
  if (noteGateInput) {
    noteGateInput.value = noteGateAnswer;
    noteGateInput.disabled = false;
  }

  if (noteGateSubmit) {
    noteGateSubmit.disabled = false;
  }

  setReverseStatus(noteGateStatus, "总难度已经记录过了。", "complete");
}

function setReverseEntryButtonText() {
  if (!openRetryPuzzleButton) {
    return;
  }

  openRetryPuzzleButton.disabled = false;
  openRetryPuzzleButton.classList.remove("is-resolved", "is-stage-two-ready", "is-date-ready", "is-unknown-date-ready", "is-final-date-ready", "is-fragment-five-ready");
  openRetryPuzzleButton.classList.add("is-resolved");

  const currentStep = getReverseCurrentStep();
  const textMap = {
    noteGate: ["Total Dif 已记录", "06-20"],
    multisourceGate: ["上线检查中", ""],
    palaceGate: ["06-07", ""],
    artistGate: ["结算页失焦，点击重采样", ""],
    retryGate: ["读取完成，裂片在线", ""],
    signalGate: ["静默频段", ""]
  };
  const [primary, secondary] = textMap[currentStep] || ["读取完成", ""];
  setRetryButtonText(primary, secondary);
}

function openReverseCurrentStep() {
  const currentStep = getReverseCurrentStep();
  setReverseEntryButtonText();

  if (currentStep === "fragmentFourAnswer") {
    openFragmentFourRift();
    return;
  }

  if (currentStep === "noteGate") {
    openDateRift();
    return;
  }

  if (currentStep === "fragmentThreeAnswer") {
    openFragmentThreeRift();
    return;
  }

  if (currentStep === "multisourceGate") {
    hidePuzzlePanel(retryPuzzle);
    hidePuzzlePanel(artistGatePuzzle);
    hidePuzzlePanel(palaceGatePuzzle);
    loadDeferredImages(multisourceGatePuzzle);
    multisourceGatePuzzle?.classList.add("is-open", "is-complete");
    multisourceGatePuzzle?.setAttribute("aria-hidden", "false");
    multisourceGateInput?.focus();
    return;
  }

  if (currentStep === "palaceGate") {
    hidePuzzlePanel(retryPuzzle);
    hidePuzzlePanel(artistGatePuzzle);
    hidePuzzlePanel(multisourceGatePuzzle);
    loadDeferredImages(palaceGatePuzzle);
    palaceGatePuzzle?.classList.add("is-open", "is-complete");
    palaceGatePuzzle?.setAttribute("aria-hidden", "false");
    palaceGateInput?.focus();
    return;
  }

  if (currentStep === "fragmentTwoAnswer") {
    openFragmentTwoRift();
    return;
  }

  if (currentStep === "artistGate") {
    openArtistGatePuzzle();
    return;
  }

  if (currentStep === "fragmentAnswer") {
    openFragmentRift();
    return;
  }

  if (currentStep === "retryGate") {
    openRetryGatePanelForReverse();
    return;
  }

  if (currentStep === "signalGate") {
    closeFragmentRift();
    hidePuzzlePanel(retryPuzzle);
    hidePuzzlePanel(artistGatePuzzle);
    hidePuzzlePanel(palaceGatePuzzle);
    hidePuzzlePanel(multisourceGatePuzzle);
    signalGatePanel?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

function openRetryGatePanelForReverse() {
  if (!retryPuzzle) {
    return;
  }

  hidePuzzlePanel(artistGatePuzzle);
  hidePuzzlePanel(palaceGatePuzzle);
  hidePuzzlePanel(multisourceGatePuzzle);
  loadDeferredImages(retryPuzzle);
  retryPuzzle.classList.add("is-open", "is-complete");
  retryPuzzle.setAttribute("aria-hidden", "false");
}

function resealReverseShard(shardClass) {
  finalSignalSection?.classList.add("is-resealing");
  setTimeout(() => {
    finalSignalSection?.classList.remove(shardClass, "is-resealing");
    const hasOpenShard = finalSignalSection?.classList.contains("is-shard-one-open") ||
      finalSignalSection?.classList.contains("is-shard-two-open") ||
      finalSignalSection?.classList.contains("is-shard-three-open") ||
      finalSignalSection?.classList.contains("is-shard-four-open") ||
      finalSignalSection?.classList.contains("is-shard-five-open");

    if (!hasOpenShard) {
      finalSignalSection?.classList.remove("is-fractured");
      finalArtFrame?.classList.remove("is-fractured");
    }
  }, 1280);
}

function scrambleOffsetValue(length = 8) {
  return Array.from({ length }, () => (
    offsetScrambleGlyphs[Math.floor(Math.random() * offsetScrambleGlyphs.length)]
  )).join("");
}

function clearOffsetAnimationTimers() {
  clearInterval(offsetScrambleTimer);
  offsetScrambleTimer = null;
  offsetDigitRevealTimers.forEach((timer) => clearTimeout(timer));
  offsetDigitRevealTimers = [];
}

function encodeOffsetTimeDigit(digit) {
  if (digit === "0") {
    return "0";
  }

  return String(10 - Number(digit));
}

function getEncryptedOffsetTime(date = new Date()) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return (year + "\u5e74" + month + "\u6708" + day + "\u65e5" + hours + ":" + minutes)
    .replace(/\d/g, encodeOffsetTimeDigit);
}

function hideOffsetEncryptedTime() {
  if (!offsetEncryptedTime) {
    return;
  }

  offsetEncryptedTime.textContent = "";
  offsetEncryptedTime.classList.remove("is-visible");
}

function updateOffsetEncryptedTime(date = new Date()) {
  if (!offsetEncryptedTime) {
    return;
  }

  offsetEncryptedTime.textContent = "TIME " + getEncryptedOffsetTime(date);
  offsetEncryptedTime.classList.add("is-visible");
}

function revealFinalOffsetDigits(onComplete) {
  if (!offsetTableValue) {
    onComplete?.();
    return;
  }

  offsetTableValue.textContent = "";
  hideOffsetEncryptedTime();
  offsetFinalValue.split("").forEach((digit, index) => {
    const timer = window.setTimeout(() => {
      offsetTableValue.textContent += digit;
      offsetTableValue.classList.remove("is-offset-digit-tick");
      offsetTableValue.offsetWidth;
      offsetTableValue.classList.add("is-offset-digit-tick");

      if (index === offsetFinalValue.length - 1) {
        writeFinalOffsetCache();
        updateOffsetEncryptedTime();
        const doneTimer = window.setTimeout(() => {
          activateFinalRankingStage({
            scroll: true
          });
          onComplete?.();
        }, 900);
        offsetDigitRevealTimers.push(doneTimer);
      }
    }, index * offsetDigitRevealIntervalMs);
    offsetDigitRevealTimers.push(timer);
  });
}

function restoreFinalOffsetProgress() {
  clearOffsetAnimationTimers();

  if (offsetTableValue) {
    offsetTableValue.textContent = offsetFinalValue;
    offsetTableValue.classList.remove("is-offset-scrambling");
    offsetTableValue.classList.add("is-offset-final");
  }
  updateOffsetEncryptedTime();

  signalGateInput = [];
  signalGateLocked = false;
  signalGatePanel?.classList.remove("is-unlocked", "is-resolving", "is-failed");
  signalGateButtons.forEach((button) => {
    button.classList.remove("is-used", "is-accepted", "is-rejected");
    button.disabled = false;
  });

  updateSignalGateProgress();
  finalSignalSection?.classList.remove(
    "is-fractured",
    "is-shard-one-open",
    "is-shard-two-open",
    "is-shard-three-open",
    "is-shard-four-open",
    "is-revealed",
    "is-resealing",
    "is-reverse-folding"
  );
  finalSignalSection?.classList.add("is-locked");
  finalSignalSection?.setAttribute("aria-hidden", "true");
  finalArtFrame?.classList.remove("is-fractured", "is-fracturing");
  hidePuzzlePanel(retryPuzzle);
  hidePuzzlePanel(artistGatePuzzle);
  hidePuzzlePanel(palaceGatePuzzle);
  hidePuzzlePanel(multisourceGatePuzzle);

  if (readFragmentFiveEntryCache() || readFragmentFiveAnswerCache()) {
    restoreLiveRankingPreview({
      forceRefresh: true
    });
    revealReverseFinalState();
    restoreFragmentFiveMainEntryIfActive();
    lockSignalGateForFragmentFiveStage();
    return;
  }

  activateFinalRankingStage();
}

function playFinalOffsetScramble(onComplete) {
  if (!offsetTableValue) {
    onComplete?.();
    return;
  }

  clearOffsetAnimationTimers();
  hideOffsetEncryptedTime();
  offsetTableValue.classList.remove("is-offset-final");
  offsetTableValue.classList.add("is-offset-scrambling");

  const startedAt = Date.now();
  offsetScrambleTimer = window.setInterval(() => {
    offsetTableValue.textContent = scrambleOffsetValue();

    if (Date.now() - startedAt >= offsetScrambleDurationMs) {
      clearInterval(offsetScrambleTimer);
      offsetScrambleTimer = null;
      offsetTableValue.classList.remove("is-offset-scrambling");
      offsetTableValue.classList.add("is-offset-final");
      revealFinalOffsetDigits(onComplete);
    }
  }, 45);
}

function finishReverseInputStep(step, input, submit, status, result, rift, message) {
  if (input) {
    input.disabled = true;
  }

  if (submit) {
    submit.disabled = true;
  }

  if (result) {
    result.textContent = "";
    result.setAttribute("aria-hidden", "true");
  }

  rift?.classList.remove("is-fragment-solved", "is-failed");
  setReverseStatus(status, message, "complete");
  completeReverseStep(step);
}

function handleReverseInputSubmit(step, input, submit, status, result, rift, message) {
  if (!reverseReplayMode) {
    return false;
  }

  if (!isReverseStepActive(step)) {
    setReverseStatus(status, "", "failed");
    return true;
  }

  if ((input?.value || "").trim() !== "") {
    setReverseStatus(status, "", "failed");
    return true;
  }

  finishReverseInputStep(step, input, submit, status, result, rift, message);
  return true;
}

function completeReverseStep(step) {
  if (!isReverseStepActive(step)) {
    return;
  }

  reverseReplayStepIndex += 1;
  let nextStepDelay = 360;

  if (step === "fragmentFourAnswer") {
    closeFragmentFourRift();
    resealReverseShard("is-shard-four-open");
    nextStepDelay = 1360;
  } else if (step === "noteGate") {
    closeDateRift();
    dateRift?.classList.remove("is-solved");
  } else if (step === "fragmentThreeAnswer") {
    closeFragmentThreeRift();
    resealReverseShard("is-shard-three-open");
    nextStepDelay = 1360;
  } else if (step === "multisourceGate") {
    hidePuzzlePanel(multisourceGatePuzzle);
  } else if (step === "fragmentTwoAnswer") {
    closeFragmentTwoRift();
    resealReverseShard("is-shard-two-open");
    nextStepDelay = 1360;
  } else if (step === "artistGate") {
    hidePuzzlePanel(artistGatePuzzle);
  } else if (step === "fragmentAnswer") {
    closeFragmentRift();
    resealReverseShard("is-shard-one-open");
    nextStepDelay = 1360;
  } else if (step === "retryGate") {
    hidePuzzlePanel(retryPuzzle);
  } else if (step === "signalGate") {
    document.body.classList.remove("reverse-replay-mode");
    reverseReplayMode = false;
    foldFinalSignalForReverse(() => {
      window.setTimeout(() => {
        playFinalOffsetScramble();
      }, offsetScrambleDelayMs);
    });
    return;
  }

  setReverseEntryButtonText();
  setTimeout(openReverseCurrentStep, nextStepDelay);
}

function foldFinalSignalForReverse(onComplete) {
  finalSignalSection?.classList.add("is-reverse-folding", "is-resealing");
  finalArtFrame?.classList.remove("is-fracturing");

  setTimeout(() => {
    finalSignalSection?.classList.remove(
      "is-fractured",
      "is-shard-one-open",
      "is-shard-two-open",
      "is-shard-three-open",
      "is-shard-four-open",
      "is-revealed",
      "is-resealing"
    );
    finalSignalSection?.classList.add("is-locked");
    finalSignalSection?.setAttribute("aria-hidden", "true");
    finalArtFrame?.classList.remove("is-fractured", "is-fracturing");
    hidePuzzlePanel(retryPuzzle);
    hidePuzzlePanel(artistGatePuzzle);
    hidePuzzlePanel(palaceGatePuzzle);
    hidePuzzlePanel(multisourceGatePuzzle);
    finalSignalSection?.classList.remove("is-reverse-folding");
    onComplete?.();
  }, 1380);
}

function enterReverseReplayMode() {
  reverseReplayMode = true;
  reverseReplayStepIndex = 0;
  document.body.classList.add("reverse-replay-mode");
  document.body.classList.remove("modal-open");

  revealReverseFinalState();
  prepareReverseMainInputs();
  prepareReverseSignalGate();
  prepareReverseRetryGate();
  prepareReverseArtistGate();
  setReverseEntryButtonText();
  openReverseCurrentStep();
}

function beginReverseMainReturn() {
  if (!finalDateRift || reverseReplayMode) {
    return;
  }

  finalDateRift.classList.add("is-returning");
  stopFinalDateCountdown();

  setTimeout(() => {
    finalDateRift.classList.remove("is-open", "is-booting", "is-dialogue-active", "is-returning");
    finalDateRift.setAttribute("aria-hidden", "true");

    if (bootDialogueStage) {
      bootDialogueStage.setAttribute("aria-hidden", "true");
    }

    enterReverseReplayMode();
  }, 1280);
}

function openFinalDateRift() {
  if (!finalDateRift) {
    return;
  }

  loadDeferredImages(finalDateRift);
  preloadBootAssets();
  clearTimeout(finalDateRiftCloseTimer);
  finalDateRiftLastFocusedElement = document.activeElement;

  finalDateRift.classList.remove("is-closing");
  finalDateRift.classList.add("is-open");
  finalDateRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  startFinalDateCountdown();
  refreshBootGate();

  const closeButton = finalDateRift.querySelector(".signal-rift-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeFinalDateRift() {
  if (!finalDateRift || !finalDateRift.classList.contains("is-open")) {
    return;
  }

  finalDateRift.classList.add("is-closing");
  finalDateRift.classList.remove("is-open");
  finalDateRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  stopFinalDateCountdown();
  resetBootSequence();

  finalDateRiftCloseTimer = setTimeout(() => {
    finalDateRift.classList.remove("is-closing");

    if (
      finalDateRiftLastFocusedElement &&
      typeof finalDateRiftLastFocusedElement.focus === "function"
    ) {
      finalDateRiftLastFocusedElement.focus();
    }
  }, 340);
}

function readSignalGateCache() {
  try {
    const cachedValue = readStoredSignalGateValue();
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === signalGateCacheVersion &&
      payload?.unlocked === true &&
      Array.isArray(payload?.sequence) &&
      payload.sequence.join("/") === signalGateSequence.join("/");

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function readStoredSignalGateValue() {
  return readStoredValue(signalGateStorageKey);
}

function readStoredValue(key) {
  try {
    if (typeof window.localStorage !== "undefined") {
      return window.localStorage.getItem(key);
    }
  } catch (error) {
  }

  try {
    const cookiePrefix = `${encodeURIComponent(key)}=`;
    const cachedCookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith(cookiePrefix));

    return cachedCookie
      ? decodeURIComponent(cachedCookie.slice(cookiePrefix.length))
      : null;
  } catch (error) {
    return null;
  }
}

function writeStoredSignalGateValue(value) {
  writeStoredValue(signalGateStorageKey, value);
}

function writeStoredValue(key, value) {
  try {
    if (typeof window.localStorage !== "undefined") {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (error) {
  }

  try {
    document.cookie = [
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      "max-age=31536000",
      "path=/",
      "SameSite=Lax"
    ].join("; ");
  } catch (error) {
  }
}

function writeSignalGateCache() {
  try {
    writeStoredSignalGateValue(JSON.stringify({
      version: signalGateCacheVersion,
      unlocked: true,
      sequence: signalGateSequence,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
    // 解密缓存只是体验增强，写入失败时不影响当前解锁。
  }
}

function readSignalRetryCache() {
  try {
    const cachedValue = readStoredValue(signalRetryStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === signalRetryCacheVersion &&
      payload?.unlocked === true &&
      Array.isArray(payload?.sequence) &&
      payload.sequence.join("/") === retryPuzzleSequence.join("/");

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeSignalRetryCache() {
  try {
    writeStoredValue(signalRetryStorageKey, JSON.stringify({
      version: signalRetryCacheVersion,
      unlocked: true,
      sequence: retryPuzzleSequence,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readFragmentAnswerCache() {
  try {
    const cachedValue = readStoredValue(fragmentAnswerStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === fragmentAnswerCacheVersion &&
      payload?.solved === true &&
      payload?.result === "BPM 182";

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeFragmentAnswerCache() {
  try {
    writeStoredValue(fragmentAnswerStorageKey, JSON.stringify({
      version: fragmentAnswerCacheVersion,
      solved: true,
      result: "BPM 182",
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readArtistGateCache() {
  try {
    const cachedValue = readStoredValue(artistGateStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === artistGateCacheVersion &&
      payload?.unlocked === true &&
      Array.isArray(payload?.sequence) &&
      payload.sequence.join("/") === artistGateSequence.join("/");

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeArtistGateCache() {
  try {
    writeStoredValue(artistGateStorageKey, JSON.stringify({
      version: artistGateCacheVersion,
      unlocked: true,
      sequence: artistGateSequence,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readFragmentTwoAnswerCache() {
  try {
    const cachedValue = readStoredValue(fragmentTwoAnswerStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === fragmentTwoAnswerCacheVersion &&
      payload?.solved === true &&
      payload?.result === "Artist：Essbee";

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeFragmentTwoAnswerCache() {
  try {
    writeStoredValue(fragmentTwoAnswerStorageKey, JSON.stringify({
      version: fragmentTwoAnswerCacheVersion,
      solved: true,
      result: "Artist：Essbee",
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readPalaceGateCache() {
  try {
    const cachedValue = readStoredValue(palaceGateStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === palaceGateCacheVersion &&
      payload?.unlocked === true &&
      payload?.result === palaceGateAnswer;

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writePalaceGateCache() {
  try {
    writeStoredValue(palaceGateStorageKey, JSON.stringify({
      version: palaceGateCacheVersion,
      unlocked: true,
      result: palaceGateAnswer,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readMultisourceGateCache() {
  try {
    const cachedValue = readStoredValue(multisourceGateStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === multisourceGateCacheVersion &&
      payload?.unlocked === true &&
      payload?.result === multisourceGateAnswer;

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeMultisourceGateCache() {
  try {
    writeStoredValue(multisourceGateStorageKey, JSON.stringify({
      version: multisourceGateCacheVersion,
      unlocked: true,
      result: multisourceGateAnswer,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readFragmentThreeAnswerCache() {
  try {
    const cachedValue = readStoredValue(fragmentThreeAnswerStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === fragmentThreeAnswerCacheVersion &&
      payload?.solved === true &&
      payload?.result === "Chart：BaNa₂Be₂O₅";

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeFragmentThreeAnswerCache() {
  try {
    writeStoredValue(fragmentThreeAnswerStorageKey, JSON.stringify({
      version: fragmentThreeAnswerCacheVersion,
      solved: true,
      result: "Chart：BaNa₂Be₂O₅",
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readNoteGateCache() {
  try {
    const cachedValue = readStoredValue(noteGateStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === noteGateCacheVersion &&
      payload?.solved === true &&
      payload?.result === noteGateAnswer;

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeNoteGateCache() {
  try {
    writeStoredValue(noteGateStorageKey, JSON.stringify({
      version: noteGateCacheVersion,
      solved: true,
      result: noteGateAnswer,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readFragmentFourAnswerCache() {
  try {
    const cachedValue = readStoredValue(fragmentFourAnswerStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === fragmentFourAnswerCacheVersion &&
      payload?.solved === true &&
      (
        payload?.result === fragmentFourResultLabel ||
        payload?.result === legacyFragmentFourResultLabel ||
        payload?.result === fragmentFourAnswerLabel
      );

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeFragmentFourAnswerCache() {
  try {
    writeStoredValue(fragmentFourAnswerStorageKey, JSON.stringify({
      version: fragmentFourAnswerCacheVersion,
      solved: true,
      result: fragmentFourResultLabel,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readFragmentFiveAnswerCache() {
  try {
    const cachedValue = readStoredValue(fragmentFiveAnswerStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === fragmentFiveAnswerCacheVersion &&
      payload?.solved === true &&
      (
        payload?.result === fragmentFiveResultLabel ||
        legacyFragmentFiveResultLabels.includes(payload?.result)
      );

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeFragmentFiveAnswerCache() {
  try {
    writeStoredValue(fragmentFiveAnswerStorageKey, JSON.stringify({
      version: fragmentFiveAnswerCacheVersion,
      solved: true,
      result: fragmentFiveResultLabel,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readFragmentFiveEntryCache() {
  try {
    const cachedValue = readStoredValue(fragmentFiveEntryStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === fragmentFiveEntryCacheVersion &&
      payload?.ready === true;

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeFragmentFiveEntryCache() {
  try {
    writeStoredValue(fragmentFiveEntryStorageKey, JSON.stringify({
      version: fragmentFiveEntryCacheVersion,
      ready: true,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readFinalBootDialogueCache() {
  try {
    const cachedValue = readStoredValue(finalBootDialogueStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === finalBootDialogueCacheVersion &&
      payload?.completed === true &&
      payload?.count === bootDialogueTexts.length;

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeFinalBootDialogueCache() {
  try {
    writeStoredValue(finalBootDialogueStorageKey, JSON.stringify({
      version: finalBootDialogueCacheVersion,
      completed: true,
      count: bootDialogueTexts.length,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readFinalOffsetCache() {
  try {
    const cachedValue = readStoredValue(finalOffsetStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === finalOffsetCacheVersion &&
      payload?.completed === true &&
      payload?.result === offsetFinalValue;

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeFinalOffsetCache() {
  try {
    writeStoredValue(finalOffsetStorageKey, JSON.stringify({
      version: finalOffsetCacheVersion,
      completed: true,
      result: offsetFinalValue,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function revealFinalSignal({ animate = true, scroll = true } = {}) {
  if (!finalSignalSection) {
    return;
  }

  loadDeferredImages(finalSignalSection);
  finalSignalSection.classList.remove("is-locked");
  finalSignalSection.classList.toggle("is-revealed", animate);
  finalSignalSection.setAttribute("aria-hidden", "false");

  if (scroll) {
    finalSignalSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function updateRetryPulseSlots(state = "input") {
  retryPulseSlots.forEach((slot, index) => {
    const value = retryPuzzleInput[index];
    slot.textContent = value ? retryPulseLabels[value] : "--";
    slot.classList.toggle("is-active", Boolean(value));
    slot.classList.toggle("is-failed", state === "failed");
    slot.classList.toggle("is-complete", state === "complete");
  });
}

function updateArtistPulseSlots(state = "input") {
  artistPulseSlots.forEach((slot, index) => {
    const value = artistGateInput[index];
    slot.textContent = value ? artistPulseLabels[value] : "--";
    slot.classList.toggle("is-active", Boolean(value));
    slot.classList.toggle("is-failed", state === "failed");
    slot.classList.toggle("is-complete", state === "complete");
  });
}

function hidePuzzlePanel(panel) {
  panel?.classList.remove("is-open", "is-complete", "is-failed", "is-resolving");
  panel?.setAttribute("aria-hidden", "true");
}

function setRetryButtonText(primary, secondary = "") {
  const buttonText = openRetryPuzzleButton?.querySelector("span");
  if (!buttonText) {
    return;
  }

  buttonText.replaceChildren(document.createTextNode(primary));

  if (secondary) {
    const subline = document.createElement("small");
    subline.textContent = secondary;
    buttonText.appendChild(subline);
  }
}

function setFragmentFiveResolvedEntry() {
  if (!openRetryPuzzleButton) {
    return;
  }

  openRetryPuzzleButton.disabled = false;
  openRetryPuzzleButton.classList.add("is-resolved", "is-fragment-five-ready");
  openRetryPuzzleButton.classList.remove(
    "is-stage-two-ready",
    "is-date-ready",
    "is-unknown-date-ready",
    "is-final-date-ready"
  );
  openRetryPuzzleButton.setAttribute("aria-label", "打开第五残片谜题");
  setRetryButtonText("第五残片待解析", "LAYER 10");
}

function setFragmentFiveSimulationEntry() {
  if (!openRetryPuzzleButton) {
    return;
  }

  openRetryPuzzleButton.disabled = false;
  openRetryPuzzleButton.classList.add("is-resolved", "is-fragment-five-ready");
  openRetryPuzzleButton.classList.remove(
    "is-stage-two-ready",
    "is-date-ready",
    "is-unknown-date-ready",
    "is-final-date-ready"
  );
  openRetryPuzzleButton.setAttribute("aria-label", "资料库开放");
  setRetryButtonText("资料库开放");
  showDatabaseQuickEntry();
}

function showDatabaseQuickEntry() {
  if (!databaseQuickEntry) {
    return;
  }

  databaseQuickEntry.classList.add("is-ready");
  databaseQuickEntry.setAttribute("aria-hidden", "false");

  if (quickDatabaseButton) {
    quickDatabaseButton.disabled = false;
  }
}

function revealShardFiveEntry({ fromCache = false } = {}) {
  finalSignalSection?.classList.add("is-fractured", "is-shard-five-open");
  finalArtFrame?.classList.add("is-fractured");

  if (openFragmentFiveMainRiftButton) {
    openFragmentFiveMainRiftButton.disabled = false;
  }

  setFragmentFiveResolvedEntry();

  if (!fromCache) {
    writeFragmentFiveEntryCache();
  }
}

function restoreFragmentFiveMainEntryIfActive() {
  const hasSimulationReady =
    fragmentFiveRift?.classList.contains("is-simulation-ready") ||
    ["等待模拟", "资料库开放"].includes(openRetryPuzzleButton?.textContent.trim()) ||
    (
      startSimulationButton &&
      startSimulationButton.getAttribute("aria-hidden") !== "true" &&
      startSimulationButton.disabled === false
    );
  const hasShardFiveEntry =
    finalSignalSection?.classList.contains("is-shard-five-open") ||
    (openFragmentFiveMainRiftButton && openFragmentFiveMainRiftButton.disabled === false);

  if (readFragmentFiveAnswerCache() || hasSimulationReady) {
    revealShardFiveEntry({
      fromCache: true
    });
    setFragmentFiveSimulationEntry();
    return true;
  }

  if (readFragmentFiveEntryCache() || hasShardFiveEntry) {
    revealShardFiveEntry({
      fromCache: true
    });
    return true;
  }

  return false;
}

function isDatabaseQuickAccessReady() {
  const retryLabel = openRetryPuzzleButton?.textContent.trim();
  return Boolean(
    ["等待模拟", "资料库开放"].includes(retryLabel) ||
    fragmentFiveRift?.classList.contains("is-simulation-ready") ||
    (
      startSimulationButton &&
      startSimulationButton.getAttribute("aria-hidden") !== "true" &&
      startSimulationButton.disabled === false
    )
  );
}

function shouldRouteCurrentMainToFragmentFive() {
  return Boolean(
    readFinalOffsetCache() &&
    !readFragmentFiveAnswerCache() &&
    finalSignalSection &&
    !document.body.classList.contains("qualifier-mystery-stage") &&
    !finalSignalSection.classList.contains("is-locked") &&
    finalSignalSection.getAttribute("aria-hidden") === "false" &&
    finalSignalSection.classList.contains("is-shard-four-open")
  );
}

function restoreNoteGateResolvedEntry() {
  if (!openRetryPuzzleButton || !readNoteGateCache()) {
    return false;
  }

  if (!reverseReplayMode && restoreFragmentFiveMainEntryIfActive()) {
    return true;
  }

  const finalDateReady = Boolean(readFragmentFourAnswerCache());

  openRetryPuzzleButton.classList.add("is-resolved");
  openRetryPuzzleButton.classList.remove("is-stage-two-ready", "is-date-ready", "is-unknown-date-ready", "is-final-date-ready", "is-fragment-five-ready");
  openRetryPuzzleButton.classList.toggle("is-final-date-ready", finalDateReady);
  openRetryPuzzleButton.disabled = !finalDateReady;
  openRetryPuzzleButton.setAttribute("aria-label", finalDateReady ? "打开 06-20 预留窗口" : "Total Dif 已记录");

  setRetryButtonText("Total Dif 已记录", finalDateReady ? "06-20" : "");

  return true;
}

function openRetryPuzzle() {
  if (reverseReplayMode) {
    openReverseCurrentStep();
    return;
  }

  if (restoreFragmentFiveMainEntryIfActive()) {
    if (isDatabaseQuickAccessReady()) {
      startDatabaseQuickLoader();
      return;
    }

    openFragmentFiveRift();
    return;
  }

  if (shouldRouteCurrentMainToFragmentFive()) {
    revealShardFiveEntry();
    openFragmentFiveRift();
    return;
  }

  if (openRetryPuzzleButton?.classList.contains("is-fragment-five-ready")) {
    if (isDatabaseQuickAccessReady()) {
      startDatabaseQuickLoader();
      return;
    }

    openFragmentFiveRift();
    return;
  }

  if (openRetryPuzzleButton?.classList.contains("is-final-date-ready")) {
    openFinalDateRift();
    return;
  }

  if (openRetryPuzzleButton?.classList.contains("is-stage-two-ready")) {
    openArtistGatePuzzle();
    return;
  }

  if (openRetryPuzzleButton?.classList.contains("is-unknown-date-ready")) {
    openDateRift();
    return;
  }

  if (openRetryPuzzleButton?.classList.contains("is-date-ready")) {
    openPalaceGatePuzzle();
    return;
  }

  if (!retryPuzzle || retryPuzzleLocked) {
    return;
  }

  loadDeferredImages(retryPuzzle);
  retryPuzzle.classList.remove("is-failed", "is-resolving");
  retryPuzzle.classList.add("is-open");
  retryPuzzle.setAttribute("aria-hidden", "false");

  if (retryPuzzleStatus) {
    retryPuzzleStatus.textContent = "读取笔记：残片 -> 日期 -> 白门 -> 偏移 -> 失同步。按钮小字是门牌，按钮颜色是最终输入。";
    retryPuzzleStatus.classList.remove("is-failed", "is-complete");
  }
}

function revealArtistGateRetryEntry() {
  if (!openRetryPuzzleButton) {
    return;
  }

  if (restoreNoteGateResolvedEntry()) {
    return;
  }

  openRetryPuzzleButton.disabled = false;
  openRetryPuzzleButton.classList.remove("is-resolved", "is-date-ready", "is-unknown-date-ready", "is-fragment-five-ready");
  openRetryPuzzleButton.classList.add("is-stage-two-ready");
  openRetryPuzzleButton.setAttribute("aria-label", "打开 Phigros 结算图校准");

  retryPuzzle?.classList.remove("is-open", "is-failed", "is-resolving");
  retryPuzzle?.setAttribute("aria-hidden", "true");

  const buttonText = openRetryPuzzleButton.querySelector("span");
  if (buttonText) {
    buttonText.textContent = "结算页失焦，点击重采样";
  }
}

function openArtistGatePuzzle() {
  if (!artistGatePuzzle || (!reverseReplayMode && artistGateLocked)) {
    return;
  }

  hidePuzzlePanel(retryPuzzle);
  hidePuzzlePanel(palaceGatePuzzle);
  hidePuzzlePanel(multisourceGatePuzzle);

  loadDeferredImages(artistGatePuzzle);
  artistGatePuzzle.classList.remove("is-failed", "is-resolving");
  artistGatePuzzle.classList.toggle("is-complete", reverseReplayMode);
  artistGatePuzzle.classList.add("is-open");
  artistGatePuzzle.setAttribute("aria-hidden", "false");

  if (!reverseReplayMode && artistGateStatus) {
    artistGateStatus.textContent = "按结算页上真正有用的四项顺序点。";
    artistGateStatus.classList.remove("is-failed", "is-complete");
  }
}

function resetArtistGatePuzzle() {
  artistGateInput = [];
  artistGateLocked = false;
  artistGatePuzzle?.classList.remove("is-failed", "is-resolving");

  artistPulseButtons.forEach((button) => {
    button.classList.remove("is-used", "is-rejected", "is-accepted");
    button.disabled = false;
  });

  updateArtistPulseSlots();
}

function revealShardTwo({ fromCache = false } = {}) {
  artistGateInput = [...artistGateSequence];
  artistGateLocked = true;

  finalSignalSection?.classList.add("is-fractured", "is-shard-two-open");
  finalArtFrame?.classList.toggle("is-fracturing", !fromCache);

  if (!fromCache && finalArtFrame) {
    setTimeout(() => {
      finalArtFrame.classList.remove("is-fracturing");
    }, 1320);
  }

  artistGatePuzzle?.classList.remove("is-failed", "is-resolving");
  artistGatePuzzle?.classList.add("is-open", "is-complete");
  artistGatePuzzle?.setAttribute("aria-hidden", "false");

  artistPulseButtons.forEach((button) => {
    const isSequencePulse = artistGateSequence.includes(button.dataset.artistPulse);
    button.classList.toggle("is-used", isSequencePulse);
    button.classList.toggle("is-accepted", isSequencePulse);
    button.classList.remove("is-rejected");
    button.disabled = true;
  });

  updateArtistPulseSlots("complete");

  if (openRetryPuzzleButton) {
    openRetryPuzzleButton.classList.add("is-resolved");
    openRetryPuzzleButton.classList.remove("is-stage-two-ready", "is-date-ready", "is-unknown-date-ready", "is-fragment-five-ready");
    openRetryPuzzleButton.disabled = true;
    const buttonText = openRetryPuzzleButton.querySelector("span");
    if (buttonText) {
      buttonText.textContent = "读取完成，第二片在线";
    }
  }

  if (artistGateStatus) {
    artistGateStatus.textContent = fromCache
      ? "第二片进度已恢复。"
      : "顺序对了，第二片已经放行。";
    artistGateStatus.classList.remove("is-failed");
    artistGateStatus.classList.add("is-complete");
  }

  if (openFragmentTwoRiftButton) {
    openFragmentTwoRiftButton.disabled = false;
  }
}

function solveArtistGatePuzzle() {
  artistGateLocked = true;
  artistGatePuzzle?.classList.add("is-resolving");

  if (artistGateStatus) {
    artistGateStatus.textContent = "顺序锁定，正在展开第二片。";
    artistGateStatus.classList.remove("is-failed");
    artistGateStatus.classList.add("is-complete");
  }

  artistPulseButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-accepted");
    }
    button.disabled = true;
  });

  updateArtistPulseSlots("complete");
  scrollFinalArtIntoView();

  setTimeout(() => {
    writeArtistGateCache();
    revealShardTwo();
  }, 1080);
}

function failArtistGatePuzzle() {
  artistGateLocked = true;
  artistGatePuzzle?.classList.add("is-failed");

  if (artistGateStatus) {
    artistGateStatus.textContent = "顺序不对，结算页再读一遍。";
    artistGateStatus.classList.remove("is-complete");
    artistGateStatus.classList.add("is-failed");
  }

  artistPulseButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-rejected");
    }
    button.disabled = true;
  });

  updateArtistPulseSlots("failed");

  setTimeout(() => {
    resetArtistGatePuzzle();
    artistGatePuzzle?.classList.add("is-open");
    artistGatePuzzle?.setAttribute("aria-hidden", "false");

    if (artistGateStatus) {
      artistGateStatus.textContent = "按结算页上真正有用的四项顺序点。";
    }
  }, 1120);
}

function handleArtistPulseInput(button) {
  if (handleReverseArtistPulseInput(button)) {
    return;
  }

  if (artistGateLocked || button.disabled) {
    return;
  }

  openArtistGatePuzzle();

  const value = button.dataset.artistPulse;
  artistGateInput.push(value);
  button.classList.add("is-used");
  button.disabled = true;
  updateArtistPulseSlots();

  if (artistGateInput.length === artistGateSequence.length) {
    if (artistGateInput.every((value, index) => value === artistGateSequence[index])) {
      solveArtistGatePuzzle();
    } else {
      failArtistGatePuzzle();
    }
  }
}

function handleReverseArtistPulseInput(button) {
  if (!reverseReplayMode) {
    return false;
  }

  if (!isReverseStepActive("artistGate")) {
    setReverseStatus(artistGateStatus, "", "failed");
    return true;
  }

  const value = button.dataset.artistPulse;
  if (!artistGateInput.includes(value)) {
    setReverseStatus(artistGateStatus, "", "failed");
    return true;
  }

  artistGateInput = artistGateInput.filter((item) => item !== value);
  button.classList.remove("is-used", "is-accepted", "is-rejected");
  button.disabled = false;
  updateArtistPulseSlots(artistGateInput.length === 0 ? "input" : "complete");

  if (artistGateInput.length === 0) {
    artistGatePuzzle?.classList.remove("is-complete", "is-failed", "is-resolving");
    clearReverseStatus(artistGateStatus);
    completeReverseStep("artistGate");
  } else {
    clearReverseStatus(artistGateStatus);
  }

  return true;
}

function resetRetryPuzzle() {
  retryPuzzleInput = [];
  retryPuzzleLocked = false;
  retryPuzzle?.classList.remove("is-failed", "is-resolving");

  retryPulseButtons.forEach((button) => {
    button.classList.remove("is-used", "is-rejected", "is-accepted");
    button.disabled = false;
  });

  updateRetryPulseSlots();
}

function revealShardOne({ fromCache = false } = {}) {
  retryPuzzleInput = [...retryPuzzleSequence];
  retryPuzzleLocked = true;

  finalSignalSection?.classList.add("is-fractured", "is-shard-one-open");
  finalArtFrame?.classList.add("is-fractured");
  finalArtFrame?.classList.toggle("is-fracturing", !fromCache);

  if (!fromCache && finalArtFrame) {
    setTimeout(() => {
      finalArtFrame.classList.remove("is-fracturing");
    }, 1320);
  }

  retryPuzzle?.classList.remove("is-failed", "is-resolving");
  retryPuzzle?.classList.add("is-open", "is-complete");
  retryPuzzle?.setAttribute("aria-hidden", "false");

  retryPulseButtons.forEach((button) => {
    const isSequencePulse = retryPuzzleSequence.includes(button.dataset.retryPulse);
    button.classList.toggle("is-used", isSequencePulse);
    button.classList.toggle("is-accepted", isSequencePulse);
    button.classList.remove("is-rejected");
    button.disabled = true;
  });

  updateRetryPulseSlots("complete");

  if (openRetryPuzzleButton) {
    openRetryPuzzleButton.classList.add("is-resolved");
    openRetryPuzzleButton.classList.remove("is-stage-two-ready", "is-date-ready", "is-unknown-date-ready", "is-fragment-five-ready");
    openRetryPuzzleButton.disabled = true;
    const buttonText = openRetryPuzzleButton.querySelector("span");
    if (buttonText) {
      buttonText.textContent = "读取完成，裂片在线";
    }
  }

  if (retryPuzzleStatus) {
    retryPuzzleStatus.textContent = fromCache
      ? "裂解记录已恢复：右上残片保持在线。"
      : "裂解完成：右上残片已暴露。";
    retryPuzzleStatus.classList.remove("is-failed");
    retryPuzzleStatus.classList.add("is-complete");
  }

  if (openFragmentRiftButton) {
    openFragmentRiftButton.disabled = false;
  }
}

function solveRetryPuzzle() {
  retryPuzzleLocked = true;
  retryPuzzle?.classList.add("is-resolving");

  if (retryPuzzleStatus) {
    retryPuzzleStatus.textContent = "六相位门牌锁定：玻璃层正在断裂。";
    retryPuzzleStatus.classList.remove("is-failed");
    retryPuzzleStatus.classList.add("is-complete");
  }

  retryPulseButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-accepted");
    }
    button.disabled = true;
  });

  updateRetryPulseSlots("complete");
  scrollFinalArtIntoView();

  setTimeout(() => {
    writeSignalRetryCache();
    revealShardOne();
  }, 1080);
}

function scrollFinalArtIntoView() {
  const target = finalArtFrame?.closest(".final-art-stage") || finalArtFrame || finalSignalSection;
  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function failRetryPuzzle() {
  retryPuzzleLocked = true;
  retryPuzzle?.classList.add("is-failed");

  if (retryPuzzleStatus) {
    retryPuzzleStatus.textContent = "重试失败：错误脉冲被红线回收。";
    retryPuzzleStatus.classList.remove("is-complete");
    retryPuzzleStatus.classList.add("is-failed");
  }

  retryPulseButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-rejected");
    }
    button.disabled = true;
  });

  updateRetryPulseSlots("failed");

  setTimeout(() => {
    resetRetryPuzzle();
    retryPuzzle?.classList.add("is-open");
    retryPuzzle?.setAttribute("aria-hidden", "false");

    if (retryPuzzleStatus) {
      retryPuzzleStatus.textContent = "读取笔记：残片 -> 日期 -> 白门 -> 偏移 -> 失同步。按钮小字是门牌，按钮颜色是最终输入。";
    }
  }, 1120);
}

function handleRetryPulseInput(button) {
  if (handleReverseRetryPulseInput(button)) {
    return;
  }

  if (retryPuzzleLocked || button.disabled) {
    return;
  }

  openRetryPuzzle();

  const value = button.dataset.retryPulse;
  retryPuzzleInput.push(value);
  button.classList.add("is-used");
  button.disabled = true;
  updateRetryPulseSlots();

  if (retryPuzzleInput.length === retryPuzzleSequence.length) {
    if (retryPuzzleInput.every((value, index) => value === retryPuzzleSequence[index])) {
      solveRetryPuzzle();
    } else {
      failRetryPuzzle();
    }
  }
}

function handleReverseRetryPulseInput(button) {
  if (!reverseReplayMode) {
    return false;
  }

  if (!isReverseStepActive("retryGate")) {
    setReverseStatus(retryPuzzleStatus, "", "failed");
    return true;
  }

  const value = button.dataset.retryPulse;
  if (!retryPuzzleInput.includes(value)) {
    setReverseStatus(retryPuzzleStatus, "", "failed");
    return true;
  }

  retryPuzzleInput = retryPuzzleInput.filter((item) => item !== value);
  button.classList.remove("is-used", "is-accepted", "is-rejected");
  button.disabled = false;
  updateRetryPulseSlots(retryPuzzleInput.length === 0 ? "input" : "complete");

  if (retryPuzzleInput.length === 0) {
    retryPuzzle?.classList.remove("is-complete", "is-failed", "is-resolving");
    clearReverseStatus(retryPuzzleStatus);
    completeReverseStep("retryGate");
  } else {
    clearReverseStatus(retryPuzzleStatus);
  }

  return true;
}

function revealFragmentAnswer({ fromCache = false } = {}) {
  fragmentRift?.classList.add("is-fragment-solved");

  if (fragmentResult) {
    fragmentResult.textContent = "BPM 182";
    fragmentResult.setAttribute("aria-hidden", "false");
  }

  if (fragmentAnswerInput) {
    fragmentAnswerInput.value = "182";
    fragmentAnswerInput.disabled = true;
  }

  if (fragmentAnswerSubmit) {
    fragmentAnswerSubmit.disabled = true;
  }

  if (fragmentAnswerStatus) {
    fragmentAnswerStatus.textContent = fromCache
      ? "这一项已经记录过了。"
      : "读数成立，结果已写入。";
    fragmentAnswerStatus.classList.remove("is-failed");
    fragmentAnswerStatus.classList.add("is-complete");
  }

  revealArtistGateRetryEntry();
}

function openFragmentRift() {
  if (!fragmentRift || openFragmentRiftButton?.disabled) {
    return;
  }

  loadDeferredImages(fragmentRift);
  clearTimeout(fragmentRiftCloseTimer);
  fragmentRiftLastFocusedElement = document.activeElement;

  fragmentRift.classList.remove("is-closing", "is-failed");
  fragmentRift.classList.add("is-open");
  fragmentRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (!reverseReplayMode && readFragmentAnswerCache()) {
    revealFragmentAnswer({
      fromCache: true
    });
  }

  if (!reverseReplayMode) {
    restoreFragmentFiveMainEntryIfActive();
  }

  const focusTarget = fragmentAnswerInput?.disabled
    ? fragmentRift.querySelector(".signal-rift-close")
    : fragmentAnswerInput;

  if (focusTarget && typeof focusTarget.focus === "function") {
    focusTarget.focus();
  }
}

function closeFragmentRift() {
  if (!fragmentRift || !fragmentRift.classList.contains("is-open")) {
    return;
  }

  fragmentRift.classList.add("is-closing");
  fragmentRift.classList.remove("is-open");
  fragmentRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  restoreFragmentFiveMainEntryIfActive();

  fragmentRiftCloseTimer = setTimeout(() => {
    fragmentRift.classList.remove("is-closing", "is-failed");

    if (
      fragmentRiftLastFocusedElement &&
      typeof fragmentRiftLastFocusedElement.focus === "function"
    ) {
      fragmentRiftLastFocusedElement.focus();
    }
  }, 340);
}

function handleFragmentAnswerSubmit(event) {
  event?.preventDefault();

  if (handleReverseInputSubmit(
    "fragmentAnswer",
    fragmentAnswerInput,
    fragmentAnswerSubmit,
    fragmentAnswerStatus,
    fragmentResult,
    fragmentRift,
    ""
  )) {
    return;
  }

  const answer = fragmentAnswerInput?.value.trim();
  if (answer === "182") {
    writeFragmentAnswerCache();
    revealFragmentAnswer();
    return;
  }

  fragmentRift?.classList.remove("is-failed");
  fragmentRift?.offsetHeight;
  fragmentRift?.classList.add("is-open", "is-failed");
  fragmentRift?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (fragmentAnswerStatus) {
    fragmentAnswerStatus.textContent = "这个三位数不对，先把白门换成十进制。";
    fragmentAnswerStatus.classList.remove("is-complete");
    fragmentAnswerStatus.classList.add("is-failed");
  }
}

function revealFragmentTwoAnswer({ fromCache = false, advanceNextEntry = true } = {}) {
  fragmentTwoRift?.classList.add("is-fragment-solved");

  if (fragmentTwoResult) {
    fragmentTwoResult.textContent = "Artist：Essbee";
    fragmentTwoResult.setAttribute("aria-hidden", "false");
  }

  if (fragmentTwoAnswerInput) {
    fragmentTwoAnswerInput.value = "Essbee";
    fragmentTwoAnswerInput.disabled = true;
  }

  if (fragmentTwoAnswerSubmit) {
    fragmentTwoAnswerSubmit.disabled = true;
  }

  if (fragmentTwoAnswerStatus) {
    fragmentTwoAnswerStatus.textContent = fromCache
      ? "署名已经记录过了。"
      : "署名对上了，下一项已经开放。";
    fragmentTwoAnswerStatus.classList.remove("is-failed");
    fragmentTwoAnswerStatus.classList.add("is-complete");
  }

  if (advanceNextEntry) {
    revealNextDateEntry();
  }
}

function revealNextDateEntry() {
  if (!openRetryPuzzleButton) {
    return;
  }

  if (restoreNoteGateResolvedEntry()) {
    return;
  }

  hidePuzzlePanel(retryPuzzle);
  hidePuzzlePanel(artistGatePuzzle);
  hidePuzzlePanel(palaceGatePuzzle);
  hidePuzzlePanel(multisourceGatePuzzle);

  openRetryPuzzleButton.disabled = false;
  openRetryPuzzleButton.classList.remove("is-resolved", "is-stage-two-ready", "is-date-ready", "is-unknown-date-ready", "is-fragment-five-ready");
  openRetryPuzzleButton.classList.add("is-date-ready");
  openRetryPuzzleButton.setAttribute("aria-label", "打开 06-07 坐标");

  const buttonText = openRetryPuzzleButton.querySelector("span");
  if (buttonText) {
    buttonText.textContent = "06-07";
  }
}

function revealUnknownDateEntry() {
  if (!openRetryPuzzleButton) {
    return;
  }

  if (restoreNoteGateResolvedEntry()) {
    return;
  }

  hidePuzzlePanel(retryPuzzle);
  hidePuzzlePanel(artistGatePuzzle);
  hidePuzzlePanel(palaceGatePuzzle);
  hidePuzzlePanel(multisourceGatePuzzle);

  openRetryPuzzleButton.disabled = false;
  openRetryPuzzleButton.classList.remove("is-resolved", "is-stage-two-ready", "is-date-ready", "is-unknown-date-ready", "is-fragment-five-ready");
  openRetryPuzzleButton.classList.add("is-unknown-date-ready");
  openRetryPuzzleButton.setAttribute("aria-label", "打开第四片音符残像");

  const buttonText = openRetryPuzzleButton.querySelector("span");
  if (buttonText) {
    buttonText.textContent = "音符残像，点击重采样";
  }
}

function openPalaceGatePuzzle() {
  if (!palaceGatePuzzle || (!reverseReplayMode && palaceGateLocked)) {
    return;
  }

  hidePuzzlePanel(retryPuzzle);
  hidePuzzlePanel(artistGatePuzzle);
  hidePuzzlePanel(multisourceGatePuzzle);

  loadDeferredImages(palaceGatePuzzle);
  palaceGatePuzzle.classList.remove("is-complete", "is-failed", "is-resolving");
  palaceGatePuzzle.classList.add("is-open");
  palaceGatePuzzle.setAttribute("aria-hidden", "false");

  if (!reverseReplayMode && palaceGateStatus) {
    palaceGateStatus.textContent = "等待补全：只写空格里的数字。";
    palaceGateStatus.classList.remove("is-failed", "is-complete");
  }

  if (palaceGateInput && !palaceGateInput.disabled) {
    palaceGateInput.focus();
  }
}

function revealMultisourceGate({ fromCache = false } = {}) {
  palaceGateLocked = true;
  multisourceGateLocked = false;

  hidePuzzlePanel(retryPuzzle);
  hidePuzzlePanel(artistGatePuzzle);

  if (palaceGateInput) {
    palaceGateInput.value = palaceGateAnswer;
    palaceGateInput.disabled = true;
  }

  if (palaceGateSubmit) {
    palaceGateSubmit.disabled = true;
  }

  if (palaceGateStatus) {
    palaceGateStatus.textContent = fromCache
      ? "上一段已恢复，继续做上线检查。"
      : "编号补上了，继续检查这次能不能上线。";
    palaceGateStatus.classList.remove("is-failed");
    palaceGateStatus.classList.add("is-complete");
  }

  hidePuzzlePanel(palaceGatePuzzle);

  loadDeferredImages(multisourceGatePuzzle);
  multisourceGatePuzzle?.classList.remove("is-complete", "is-failed", "is-resolving");
  multisourceGatePuzzle?.classList.add("is-open");
  multisourceGatePuzzle?.setAttribute("aria-hidden", "false");

  if (multisourceGateStatus) {
    multisourceGateStatus.textContent = "等待口令：退出码 / 包体积 / 探针状态。";
    multisourceGateStatus.classList.remove("is-failed", "is-complete");
  }

  if (openRetryPuzzleButton) {
    openRetryPuzzleButton.disabled = true;
    openRetryPuzzleButton.classList.add("is-resolved");
    openRetryPuzzleButton.classList.remove("is-stage-two-ready", "is-date-ready", "is-unknown-date-ready", "is-fragment-five-ready");
    const buttonText = openRetryPuzzleButton.querySelector("span");
    if (buttonText) {
      buttonText.textContent = "上线检查中";
    }
  }
}

function revealShardThree({ fromCache = false } = {}) {
  palaceGateLocked = true;
  multisourceGateLocked = true;
  hidePuzzlePanel(retryPuzzle);
  hidePuzzlePanel(artistGatePuzzle);
  hidePuzzlePanel(palaceGatePuzzle);
  hidePuzzlePanel(multisourceGatePuzzle);

  finalSignalSection?.classList.add("is-fractured", "is-shard-three-open");
  finalArtFrame?.classList.toggle("is-fracturing", !fromCache);

  if (!fromCache && finalArtFrame) {
    setTimeout(() => {
      finalArtFrame.classList.remove("is-fracturing");
    }, 1320);
  }

  if (palaceGateInput) {
    palaceGateInput.value = palaceGateAnswer;
    palaceGateInput.disabled = true;
  }

  if (palaceGateSubmit) {
    palaceGateSubmit.disabled = true;
  }

  if (multisourceGateInput) {
    multisourceGateInput.value = "0418200";
    multisourceGateInput.disabled = true;
  }

  if (multisourceGateSubmit) {
    multisourceGateSubmit.disabled = true;
  }

  if (multisourceGateStatus) {
    multisourceGateStatus.textContent = fromCache
      ? "上线检查已恢复，第三片保持在线。"
      : "检查通过，第三片已经放行。";
    multisourceGateStatus.classList.remove("is-failed");
    multisourceGateStatus.classList.add("is-complete");
  }

  if (openRetryPuzzleButton) {
    openRetryPuzzleButton.classList.add("is-resolved");
    openRetryPuzzleButton.classList.remove("is-stage-two-ready", "is-date-ready", "is-unknown-date-ready", "is-fragment-five-ready");
    openRetryPuzzleButton.disabled = true;
    const buttonText = openRetryPuzzleButton.querySelector("span");
    if (buttonText) {
      buttonText.textContent = "读取完成，第三片在线";
    }
  }

  if (palaceGateStatus) {
    palaceGateStatus.textContent = fromCache
      ? "上一段已恢复，第三片保持在线。"
      : "编号确认，第三片已经放行。";
    palaceGateStatus.classList.remove("is-failed");
    palaceGateStatus.classList.add("is-complete");
  }

  if (openFragmentThreeRiftButton) {
    openFragmentThreeRiftButton.disabled = false;
  }
}

function solvePalaceGatePuzzle() {
  palaceGateLocked = true;
  palaceGatePuzzle?.classList.add("is-resolving");

  if (palaceGateStatus) {
    palaceGateStatus.textContent = "编号成立，正在打开下一段检查。";
    palaceGateStatus.classList.remove("is-failed");
    palaceGateStatus.classList.add("is-complete");
  }

  scrollFinalArtIntoView();

  setTimeout(() => {
    writePalaceGateCache();
    revealMultisourceGate();
  }, 920);
}

function failPalaceGatePuzzle() {
  palaceGateLocked = true;
  palaceGatePuzzle?.classList.remove("is-failed");
  palaceGatePuzzle?.offsetHeight;
  palaceGatePuzzle?.classList.add("is-open", "is-failed");
  palaceGatePuzzle?.setAttribute("aria-hidden", "false");

  if (palaceGateStatus) {
    palaceGateStatus.textContent = "这个数对不上原句，再看一眼图和题面。";
    palaceGateStatus.classList.remove("is-complete");
    palaceGateStatus.classList.add("is-failed");
  }

  setTimeout(() => {
    palaceGateLocked = false;
    palaceGatePuzzle?.classList.remove("is-failed", "is-resolving");
    palaceGatePuzzle?.classList.add("is-open");
    palaceGatePuzzle?.setAttribute("aria-hidden", "false");

    if (palaceGateInput) {
      palaceGateInput.value = "";
      palaceGateInput.focus();
    }

    if (palaceGateStatus) {
      palaceGateStatus.textContent = "等待补全：只写空格里的数字。";
      palaceGateStatus.classList.remove("is-failed");
    }
  }, 980);
}

function handlePalaceGateSubmit(event) {
  event?.preventDefault();

  if (handleReverseInputSubmit(
    "palaceGate",
    palaceGateInput,
    palaceGateSubmit,
    palaceGateStatus,
    null,
    palaceGatePuzzle,
    ""
  )) {
    return;
  }

  if (palaceGateLocked) {
    return;
  }

  const answer = palaceGateInput?.value.trim();
  if (answer === palaceGateAnswer) {
    solvePalaceGatePuzzle();
    return;
  }

  failPalaceGatePuzzle();
}

function playMultisourceAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    if (multisourceGateStatus) {
      multisourceGateStatus.textContent = "浏览器不支持播放这段提示音，可以先看图和探针。";
      multisourceGateStatus.classList.add("is-failed");
    }
    return;
  }

  const context = new AudioContext();
  const now = context.currentTime + 0.04;
  const pulses = [
    { tone: 523.25, delay: 0 },
    { tone: 659.25, delay: 0.28 },
    { tone: 523.25, delay: 0.56 }
  ];

  playMultisourceAudioButton?.classList.add("is-playing");

  pulses.forEach(({ tone, delay }) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = tone;
    gain.gain.setValueAtTime(0.0001, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.08, now + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.15);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now + delay);
    oscillator.stop(now + delay + 0.17);
  });

  if (multisourceGateStatus) {
    multisourceGateStatus.textContent = "听到三段提示音：这道题也是三段值。";
    multisourceGateStatus.classList.remove("is-failed");
  }

  setTimeout(() => {
    playMultisourceAudioButton?.classList.remove("is-playing");
    context.close?.();
  }, 980);
}

function normalizeMultisourceAnswer(value = "") {
  return value
    .trim()
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function solveMultisourceGatePuzzle() {
  multisourceGateLocked = true;
  multisourceGatePuzzle?.classList.add("is-resolving");

  if (multisourceGateStatus) {
    multisourceGateStatus.textContent = "上线口令成立，正在放行第三片。";
    multisourceGateStatus.classList.remove("is-failed");
    multisourceGateStatus.classList.add("is-complete");
  }

  scrollFinalArtIntoView();

  setTimeout(() => {
    writeMultisourceGateCache();
    revealShardThree();
  }, 980);
}

function failMultisourceGatePuzzle() {
  multisourceGateLocked = true;
  multisourceGatePuzzle?.classList.remove("is-failed");
  multisourceGatePuzzle?.offsetHeight;
  multisourceGatePuzzle?.classList.add("is-open", "is-failed");
  multisourceGatePuzzle?.setAttribute("aria-hidden", "false");

  if (multisourceGateStatus) {
    multisourceGateStatus.textContent = "口令不对。只取退出码、包体积、健康检查状态。";
    multisourceGateStatus.classList.remove("is-complete");
    multisourceGateStatus.classList.add("is-failed");
  }

  setTimeout(() => {
    multisourceGateLocked = false;
    multisourceGatePuzzle?.classList.remove("is-failed", "is-resolving");
    multisourceGatePuzzle?.classList.add("is-open");
    multisourceGatePuzzle?.setAttribute("aria-hidden", "false");

    if (multisourceGateInput) {
      multisourceGateInput.value = "";
      multisourceGateInput.focus();
    }

    if (multisourceGateStatus) {
      multisourceGateStatus.textContent = "等待口令：退出码 / 包体积 / 探针状态。";
      multisourceGateStatus.classList.remove("is-failed");
    }
  }, 980);
}

function handleMultisourceGateSubmit(event) {
  event?.preventDefault();

  if (handleReverseInputSubmit(
    "multisourceGate",
    multisourceGateInput,
    multisourceGateSubmit,
    multisourceGateStatus,
    null,
    multisourceGatePuzzle,
    ""
  )) {
    return;
  }

  if (multisourceGateLocked) {
    return;
  }

  const answer = normalizeMultisourceAnswer(multisourceGateInput?.value);
  if (answer === multisourceGateAnswer) {
    solveMultisourceGatePuzzle();
    return;
  }

  failMultisourceGatePuzzle();
}

function openFragmentTwoRift() {
  if (!fragmentTwoRift || openFragmentTwoRiftButton?.disabled) {
    return;
  }

  loadDeferredImages(fragmentTwoRift);
  clearTimeout(fragmentTwoRiftCloseTimer);
  fragmentTwoRiftLastFocusedElement = document.activeElement;

  fragmentTwoRift.classList.remove("is-closing", "is-failed");
  fragmentTwoRift.classList.add("is-open");
  fragmentTwoRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (!reverseReplayMode && readFragmentTwoAnswerCache()) {
    revealFragmentTwoAnswer({
      fromCache: true,
      advanceNextEntry: false
    });
  }

  if (!reverseReplayMode) {
    restoreFragmentFiveMainEntryIfActive();
  }

  const focusTarget = fragmentTwoAnswerInput?.disabled
    ? fragmentTwoRift.querySelector(".signal-rift-close")
    : fragmentTwoAnswerInput;

  if (focusTarget && typeof focusTarget.focus === "function") {
    focusTarget.focus();
  }
}

function closeFragmentTwoRift() {
  if (!fragmentTwoRift || !fragmentTwoRift.classList.contains("is-open")) {
    return;
  }

  fragmentTwoRift.classList.add("is-closing");
  fragmentTwoRift.classList.remove("is-open");
  fragmentTwoRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  restoreFragmentFiveMainEntryIfActive();

  fragmentTwoRiftCloseTimer = setTimeout(() => {
    fragmentTwoRift.classList.remove("is-closing", "is-failed");

    if (
      fragmentTwoRiftLastFocusedElement &&
      typeof fragmentTwoRiftLastFocusedElement.focus === "function"
    ) {
      fragmentTwoRiftLastFocusedElement.focus();
    }
  }, 340);
}

function normalizeFragmentTwoAnswer(value = "") {
  return value
    .trim()
    .toLowerCase()
    .replace(/^artist\s*[:：]\s*/, "")
    .replace(/[^a-z]/g, "");
}

function handleFragmentTwoAnswerSubmit(event) {
  event?.preventDefault();

  if (handleReverseInputSubmit(
    "fragmentTwoAnswer",
    fragmentTwoAnswerInput,
    fragmentTwoAnswerSubmit,
    fragmentTwoAnswerStatus,
    fragmentTwoResult,
    fragmentTwoRift,
    ""
  )) {
    return;
  }

  const answer = normalizeFragmentTwoAnswer(fragmentTwoAnswerInput?.value);
  if (answer === "essbee") {
    writeFragmentTwoAnswerCache();
    revealFragmentTwoAnswer();
    return;
  }

  fragmentTwoRift?.classList.remove("is-failed");
  fragmentTwoRift?.offsetHeight;
  fragmentTwoRift?.classList.add("is-open", "is-failed");
  fragmentTwoRift?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (fragmentTwoAnswerStatus) {
    fragmentTwoAnswerStatus.textContent = "署名不对；底行六格按 A1Z26 再换一次。";
    fragmentTwoAnswerStatus.classList.remove("is-complete");
    fragmentTwoAnswerStatus.classList.add("is-failed");
  }
}

function revealFragmentThreeAnswer({ fromCache = false } = {}) {
  fragmentThreeRift?.classList.add("is-fragment-solved");

  if (fragmentThreeResult) {
    fragmentThreeResult.textContent = "Chart：BaNa₂Be₂O₅";
    fragmentThreeResult.setAttribute("aria-hidden", "false");
  }

  if (fragmentThreeAnswerInput) {
    fragmentThreeAnswerInput.value = "BaNa₂Be₂O₅";
    fragmentThreeAnswerInput.disabled = true;
  }

  if (fragmentThreeAnswerSubmit) {
    fragmentThreeAnswerSubmit.disabled = true;
  }

  if (fragmentThreeAnswerStatus) {
    fragmentThreeAnswerStatus.textContent = fromCache
      ? "谱面式已经记录过了。"
      : "元素式成立，谱面名已写入。";
    fragmentThreeAnswerStatus.classList.remove("is-failed");
    fragmentThreeAnswerStatus.classList.add("is-complete");
  }

  revealUnknownDateEntry();
}

function openFragmentThreeRift() {
  if (!fragmentThreeRift || openFragmentThreeRiftButton?.disabled) {
    return;
  }

  loadDeferredImages(fragmentThreeRift);
  clearTimeout(fragmentThreeRiftCloseTimer);
  fragmentThreeRiftLastFocusedElement = document.activeElement;

  fragmentThreeRift.classList.remove("is-closing", "is-failed");
  fragmentThreeRift.classList.add("is-open");
  fragmentThreeRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (!reverseReplayMode && readFragmentThreeAnswerCache()) {
    revealFragmentThreeAnswer({
      fromCache: true
    });
  }

  if (!reverseReplayMode) {
    restoreFragmentFiveMainEntryIfActive();
  }

  const focusTarget = fragmentThreeAnswerInput?.disabled
    ? fragmentThreeRift.querySelector(".signal-rift-close")
    : fragmentThreeAnswerInput;

  if (focusTarget && typeof focusTarget.focus === "function") {
    focusTarget.focus();
  }
}

function closeFragmentThreeRift() {
  if (!fragmentThreeRift || !fragmentThreeRift.classList.contains("is-open")) {
    return;
  }

  fragmentThreeRift.classList.add("is-closing");
  fragmentThreeRift.classList.remove("is-open");
  fragmentThreeRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  restoreFragmentFiveMainEntryIfActive();

  fragmentThreeRiftCloseTimer = setTimeout(() => {
    fragmentThreeRift.classList.remove("is-closing", "is-failed");

    if (
      fragmentThreeRiftLastFocusedElement &&
      typeof fragmentThreeRiftLastFocusedElement.focus === "function"
    ) {
      fragmentThreeRiftLastFocusedElement.focus();
    }
  }, 340);
}

function normalizeFragmentThreeAnswer(value = "") {
  return value
    .trim()
    .replace(/^chart\s*[:：]\s*/i, "")
    .replace(/[₂]/g, "2")
    .replace(/[₅]/g, "5")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function handleFragmentThreeAnswerSubmit(event) {
  event?.preventDefault();

  if (handleReverseInputSubmit(
    "fragmentThreeAnswer",
    fragmentThreeAnswerInput,
    fragmentThreeAnswerSubmit,
    fragmentThreeAnswerStatus,
    fragmentThreeResult,
    fragmentThreeRift,
    ""
  )) {
    return;
  }

  const answer = normalizeFragmentThreeAnswer(fragmentThreeAnswerInput?.value);
  if (answer === "bana2be2o5") {
    writeFragmentThreeAnswerCache();
    revealFragmentThreeAnswer();
    return;
  }

  fragmentThreeRift?.classList.remove("is-failed");
  fragmentThreeRift?.offsetHeight;
  fragmentThreeRift?.classList.add("is-open", "is-failed");
  fragmentThreeRift?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (fragmentThreeAnswerStatus) {
    fragmentThreeAnswerStatus.textContent = "式子不对；先按原子序数换符号，再写层数。";
    fragmentThreeAnswerStatus.classList.remove("is-complete");
    fragmentThreeAnswerStatus.classList.add("is-failed");
  }
}

function normalizeNoteGateAnswer(value = "") {
  return value
    .trim()
    .replace(/^total\s*dif\s*[:=]?\s*/i, "")
    .replace(/[,，]/g, ".")
    .replace(/[^0-9.]/g, "");
}

function revealNoteGateSolved({ fromCache = false } = {}) {
  noteGateLocked = true;
  dateRift?.classList.remove("is-failed");
  dateRift?.classList.add("is-solved");
  revealShardFour({ fromCache });

  if (noteGateInput) {
    noteGateInput.value = noteGateAnswer;
    noteGateInput.disabled = true;
  }

  if (noteGateSubmit) {
    noteGateSubmit.disabled = true;
  }

  if (noteGateStatus) {
    noteGateStatus.textContent = fromCache
      ? "总难度已经记录过了。"
      : "Total Dif 对上了，第四片已经解锁。";
    noteGateStatus.classList.remove("is-failed");
    noteGateStatus.classList.add("is-complete");
  }

  if (openRetryPuzzleButton) {
    restoreNoteGateResolvedEntry();
  }
}

function revealShardFour({ fromCache = false } = {}) {
  finalSignalSection?.classList.add("is-fractured", "is-shard-four-open");
  finalArtFrame?.classList.toggle("is-fracturing", !fromCache);

  if (!fromCache && finalArtFrame) {
    setTimeout(() => {
      finalArtFrame.classList.remove("is-fracturing");
    }, 1320);
  }

  if (openFragmentFourRiftButton) {
    openFragmentFourRiftButton.disabled = false;
    openFragmentFourRiftButton.setAttribute("aria-label", "读取第四残片");
  }
}

function revealFragmentFourAnswer({ fromCache = false } = {}) {
  fragmentFourRift?.classList.remove("is-failed");
  fragmentFourRift?.classList.add("is-fragment-solved");

  if (fragmentFourResult) {
    fragmentFourResult.textContent = fragmentFourResultLabel;
    fragmentFourResult.setAttribute("aria-hidden", "false");
  }

  if (fragmentFourAnswerInput) {
    fragmentFourAnswerInput.value = fragmentFourAnswerLabel;
    fragmentFourAnswerInput.disabled = true;
  }

  if (fragmentFourAnswerSubmit) {
    fragmentFourAnswerSubmit.disabled = true;
  }

  if (fragmentFourAnswerStatus) {
    fragmentFourAnswerStatus.textContent = fromCache
      ? "第四格已经记录过了。"
      : "余数成立，第四残片解密已写入。";
    fragmentFourAnswerStatus.classList.remove("is-failed");
    fragmentFourAnswerStatus.classList.add("is-complete");
  }

  restoreNoteGateResolvedEntry();
}

function normalizeFragmentFourAnswer(value = "") {
  return value
    .trim()
    .replace(/^dif\s*[:：]?\s*/i, "")
    .replace(/[,，]/g, ".")
    .replace(/[^0-9.]/g, "");
}

function handleFragmentFourAnswerSubmit(event) {
  event?.preventDefault();

  if (handleReverseInputSubmit(
    "fragmentFourAnswer",
    fragmentFourAnswerInput,
    fragmentFourAnswerSubmit,
    fragmentFourAnswerStatus,
    fragmentFourResult,
    fragmentFourRift,
    ""
  )) {
    return;
  }

  const answer = normalizeFragmentFourAnswer(fragmentFourAnswerInput?.value);
  if (answer === fragmentFourAnswer || answer === `${fragmentFourAnswer}.0`) {
    writeFragmentFourAnswerCache();
    revealFragmentFourAnswer();
    return;
  }

  fragmentFourRift?.classList.remove("is-failed");
  fragmentFourRift?.offsetHeight;
  fragmentFourRift?.classList.add("is-open", "is-failed");
  fragmentFourRift?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (fragmentFourAnswerStatus) {
    fragmentFourAnswerStatus.textContent = "第四格不对；先从 Total Dif 里扣掉前三条线。";
    fragmentFourAnswerStatus.classList.remove("is-complete");
    fragmentFourAnswerStatus.classList.add("is-failed");
  }
}

function openFragmentFourRift() {
  if (!fragmentFourRift || openFragmentFourRiftButton?.disabled) {
    return;
  }

  loadDeferredImages(fragmentFourRift);
  clearTimeout(fragmentFourRiftCloseTimer);
  fragmentFourRiftLastFocusedElement = document.activeElement;

  fragmentFourRift.classList.remove("is-closing", "is-failed");
  fragmentFourRift.classList.add("is-open");
  fragmentFourRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (!reverseReplayMode && readFragmentFourAnswerCache()) {
    revealFragmentFourAnswer({
      fromCache: true
    });
  }

  if (!reverseReplayMode) {
    restoreFragmentFiveMainEntryIfActive();
  }

  const focusTarget = fragmentFourAnswerInput?.disabled
    ? fragmentFourRift.querySelector(".signal-rift-close")
    : fragmentFourAnswerInput;

  if (focusTarget && typeof focusTarget.focus === "function") {
    focusTarget.focus();
  }
}

function closeFragmentFourRift() {
  if (!fragmentFourRift || !fragmentFourRift.classList.contains("is-open")) {
    return;
  }

  fragmentFourRift.classList.add("is-closing");
  fragmentFourRift.classList.remove("is-open");
  fragmentFourRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  restoreFragmentFiveMainEntryIfActive();

  fragmentFourRiftCloseTimer = setTimeout(() => {
    fragmentFourRift.classList.remove("is-closing");

    if (
      fragmentFourRiftLastFocusedElement &&
      typeof fragmentFourRiftLastFocusedElement.focus === "function"
    ) {
      fragmentFourRiftLastFocusedElement.focus();
    }
  }, 340);
}

function solveNoteGatePuzzle() {
  noteGateLocked = true;

  if (noteGateStatus) {
    noteGateStatus.textContent = "总难度成立，正在写入第四片记录。";
    noteGateStatus.classList.remove("is-failed");
    noteGateStatus.classList.add("is-complete");
  }

  setTimeout(() => {
    writeNoteGateCache();
    closeDateRift();
    setTimeout(() => {
      revealNoteGateSolved();
      scrollFinalArtIntoView();
    }, 360);
  }, 520);
}

function failNoteGatePuzzle() {
  noteGateLocked = true;
  dateRift?.classList.remove("is-failed");
  dateRift?.offsetHeight;
  dateRift?.classList.add("is-open", "is-failed");
  dateRift?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (noteGateStatus) {
    noteGateStatus.textContent = "总难度不对，再看 note 的数量和类别。";
    noteGateStatus.classList.remove("is-complete");
    noteGateStatus.classList.add("is-failed");
  }

  setTimeout(() => {
    noteGateLocked = false;
    dateRift?.classList.remove("is-failed");

    if (noteGateInput) {
      noteGateInput.value = "";
      noteGateInput.focus();
    }

    if (noteGateStatus) {
      noteGateStatus.textContent = "等待总难度。";
      noteGateStatus.classList.remove("is-failed");
    }
  }, 980);
}

function handleNoteGateSubmit(event) {
  event?.preventDefault();

  if (handleReverseInputSubmit(
    "noteGate",
    noteGateInput,
    noteGateSubmit,
    noteGateStatus,
    null,
    dateRift,
    ""
  )) {
    return;
  }

  if (noteGateLocked) {
    return;
  }

  const answer = normalizeNoteGateAnswer(noteGateInput?.value);
  if (answer === noteGateAnswer) {
    solveNoteGatePuzzle();
    return;
  }

  failNoteGatePuzzle();
}

function restoreSignalGateKeyLabels() {
  signalGateButtons.forEach((button) => {
    const signalKey = button.dataset.signalKey;

    if (signalKey) {
      button.textContent = signalKey;
    }
  });
}

function preparePlcSecretSignalGate() {
  if (!isPlcSecretSignalGateArmed()) {
    return false;
  }

  signalGateInput = [];
  signalGateLocked = false;
  signalGatePanel?.classList.remove("is-unlocked", "is-resolving", "is-failed");
  restoreSignalGateKeyLabels();

  signalGateButtons.forEach((button) => {
    button.classList.remove("is-used", "is-rejected", "is-accepted");
    button.disabled = false;
  });

  if (resetSignalGateButton) {
    resetSignalGateButton.disabled = false;
  }

  updateSignalGateProgress();
  return true;
}

function lockPlcSecretSignalGateSelection({ fromCache = false } = {}) {
  if (!readPlcSecretFragmentFourState()) {
    return false;
  }

  signalGateInput = [...plcSecretSignalGateSequence];
  signalGateLocked = true;
  signalGatePanel?.classList.remove("is-failed", "is-resolving");
  signalGatePanel?.classList.add("is-unlocked");
  restoreSignalGateKeyLabels();

  signalGateButtons.forEach((button) => {
    const isSequenceKey = plcSecretSignalGateSequence.includes(button.dataset.signalKey);
    button.classList.toggle("is-used", isSequenceKey);
    button.classList.toggle("is-accepted", isSequenceKey);
    button.classList.remove("is-rejected");
    button.disabled = true;
  });

  if (resetSignalGateButton) {
    resetSignalGateButton.disabled = true;
  }

  updateSignalGateProgress("complete");

  if (signalGateStatus) {
    signalGateStatus.textContent = fromCache
      ? "回卷已清除：静默频段保持锁定"
      : "回卷清除完成：静默频段已锁定";
  }

  return true;
}

function completePlcSecretSignalGate() {
  signalGateLocked = true;
  signalGatePanel?.classList.remove("is-failed");
  signalGatePanel?.classList.add("is-resolving", "is-unlocked");

  signalGateButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-accepted");
    }
    button.classList.remove("is-rejected");
    button.disabled = true;
  });

  if (resetSignalGateButton) {
    resetSignalGateButton.disabled = true;
  }

  updateSignalGateProgress("complete");

  if (signalGateStatus) {
    signalGateStatus.textContent = "回卷清除完成：正在返回档案库";
  }

  window.setTimeout(() => {
    writePlcSecretFragmentFourState();
    lockPlcSecretSignalGateSelection();
    showPlcDatabaseDetail("secret");
    const fragmentFourIndex = getPlcDatabaseEntryIndexByTitle("secret", plcSecretFragmentFourTitle);

    if (fragmentFourIndex >= 0) {
      selectPlcDatabaseEntry(fragmentFourIndex);
    }
  }, 920);
}

function handlePlcSecretSignalGateInput(button) {
  if (!isPlcSecretSignalGateArmed()) {
    return false;
  }

  if (signalGateLocked || button.disabled) {
    return true;
  }

  const value = button.dataset.signalKey;
  signalGateInput.push(value);
  button.classList.add("is-used");
  button.disabled = true;
  updateSignalGateProgress();

  if (
    signalGateInput.length === signalGateSequence.length &&
    signalGateInput.every((item, index) => item === signalGateSequence[index])
  ) {
    signalGateLocked = true;
    failSignalGate();
    return true;
  }

  if (signalGateInput.length === plcSecretSignalGateSequence.length) {
    signalGateLocked = true;

    if (signalGateInput.every((item, index) => item === plcSecretSignalGateSequence[index])) {
      completePlcSecretSignalGate();
    } else {
      failSignalGate();
    }
  }

  return true;
}

function updateSignalGateProgress(state = "input") {
  const activeSequence = isPlcSecretSignalGateArmed() ||
    readPlcSecretFragmentFourState() ||
    signalGateInput.length > signalGateSequence.length
    ? plcSecretSignalGateSequence
    : signalGateSequence;

  if (signalGateStatus) {
    const inputText = signalGateInput
      .concat(Array(Math.max(activeSequence.length - signalGateInput.length, 0)).fill("--"))
      .slice(0, activeSequence.length)
      .join(" / ");

    if (state === "failed") {
      signalGateStatus.textContent = "解析失败：噪声矩阵已回卷";
    } else if (state === "complete") {
      signalGateStatus.textContent = "校验通过：频段同步中";
    } else {
      signalGateStatus.textContent = `等待频点输入：${inputText}`;
    }
    signalGateStatus.classList.toggle("is-failed", state === "failed");
    signalGateStatus.classList.toggle("is-complete", state === "complete");
  }

  signalGateDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index < signalGateInput.length);
    dot.classList.toggle("is-failed", state === "failed");
    dot.classList.toggle("is-complete", state === "complete");
  });
}

function isFragmentFiveMainStageActive() {
  return Boolean(
    readFragmentFiveEntryCache() ||
    readFragmentFiveAnswerCache() ||
    finalSignalSection?.classList.contains("is-shard-five-open") ||
    openRetryPuzzleButton?.classList.contains("is-fragment-five-ready") ||
    ["等待模拟", "资料库开放"].includes(openRetryPuzzleButton?.textContent.trim())
  );
}

function lockSignalGateForFragmentFiveStage() {
  signalGateInput = [];
  signalGateLocked = true;
  signalGatePanel?.classList.remove("is-unlocked", "is-resolving", "is-failed");
  restoreSignalGateKeyLabels();

  signalGateButtons.forEach((button) => {
    button.classList.remove("is-used", "is-rejected", "is-accepted");
    button.disabled = true;
  });

  if (resetSignalGateButton) {
    resetSignalGateButton.disabled = true;
  }

  updateSignalGateProgress();
}

function completeSignalGate({ fromCache = false } = {}) {
  signalGateInput = [...signalGateSequence];
  signalGateLocked = true;
  signalGatePanel?.classList.remove("is-failed", "is-resolving");
  signalGatePanel?.classList.add("is-unlocked");
  restoreSignalGateKeyLabels();

  signalGateButtons.forEach((button) => {
    const isSequenceKey = signalGateSequence.includes(button.dataset.signalKey);
    button.classList.toggle("is-used", isSequenceKey);
    button.classList.toggle("is-accepted", isSequenceKey);
    button.classList.remove("is-rejected");
    button.disabled = true;
  });

  if (resetSignalGateButton) {
    resetSignalGateButton.disabled = true;
  }

  updateSignalGateProgress("complete");

  if (signalGateStatus) {
    signalGateStatus.textContent = fromCache
      ? "握手已恢复：静默频段保持展开"
      : "握手完成：静默频段已展开";
  }

  revealFinalSignal({
    animate: !fromCache,
    scroll: !fromCache
  });

  if (readSignalRetryCache()) {
    revealShardOne({
      fromCache: true
    });
  }
}

function resetSignalGate() {
  if (lockPlcSecretSignalGateSelection()) {
    return;
  }

  if (preparePlcSecretSignalGate()) {
    return;
  }

  if (isFragmentFiveMainStageActive()) {
    lockSignalGateForFragmentFiveStage();
    return;
  }

  signalGateInput = [];
  signalGateLocked = false;
  signalGatePanel?.classList.remove("is-failed", "is-resolving");
  restoreSignalGateKeyLabels();
  signalGateButtons.forEach((button) => {
    button.classList.remove("is-used", "is-rejected", "is-accepted");
    button.disabled = false;
  });
  updateSignalGateProgress();

  if (document.body.classList.contains("qualifier-mystery-stage")) {
    applyMysterySignalGate();
  }
}

function unlockSignalGate() {
  signalGatePanel?.classList.add("is-resolving");

  if (signalGateStatus) {
    signalGateStatus.textContent = "校验通过：频段同步中";
    signalGateStatus.classList.remove("is-failed");
    signalGateStatus.classList.add("is-complete");
  }

  signalGateButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-accepted");
    }
    button.disabled = true;
  });

  if (resetSignalGateButton) {
    resetSignalGateButton.disabled = true;
  }

  updateSignalGateProgress("complete");

  setTimeout(() => {
    signalGatePanel?.classList.remove("is-resolving");
    writeSignalGateCache();
    completeSignalGate();
  }, 920);
}

function failSignalGate() {
  signalGateLocked = true;
  signalGatePanel?.classList.add("is-failed");

  if (signalGateStatus) {
    signalGateStatus.textContent = "解析失败：噪声矩阵已回卷";
    signalGateStatus.classList.remove("is-complete");
    signalGateStatus.classList.add("is-failed");
  }

  signalGateButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-rejected");
    }
    button.disabled = true;
  });

  updateSignalGateProgress("failed");

  setTimeout(() => {
    resetSignalGate();
  }, 1150);
}

function handleSignalGateInput(button) {
  if (handlePlcSecretSignalGateInput(button)) {
    return;
  }

  if (handleMysterySignalGateInput(button)) {
    return;
  }

  if (handleReverseSignalGateInput(button)) {
    return;
  }

  if (isFragmentFiveMainStageActive()) {
    lockSignalGateForFragmentFiveStage();
    return;
  }

  if (signalGateLocked || button.disabled) {
    return;
  }

  const value = button.dataset.signalKey;

  signalGateInput.push(value);
  button.classList.add("is-used");
  button.disabled = true;
  updateSignalGateProgress();

  if (signalGateInput.length === signalGateSequence.length) {
    signalGateLocked = true;

    if (signalGateInput.every((value, index) => value === signalGateSequence[index])) {
      unlockSignalGate();
    } else {
      failSignalGate();
    }
  }
}

function handleMysterySignalGateInput(button) {
  if (!document.body.classList.contains("qualifier-mystery-stage")) {
    return false;
  }

  if (signalGateLocked || button.disabled) {
    return true;
  }

  signalGateInput.push(button.textContent.trim());
  button.classList.add("is-used");
  button.disabled = true;
  updateSignalGateProgress();

  if (signalGateInput.length >= signalGateSequence.length) {
    signalGateLocked = true;
    failSignalGate();
  }

  return true;
}

function handleReverseSignalGateInput(button) {
  if (!reverseReplayMode) {
    return false;
  }

  if (!isReverseStepActive("signalGate")) {
    setReverseStatus(signalGateStatus, "", "failed");
    return true;
  }

  const value = button.dataset.signalKey;
  if (!signalGateInput.includes(value)) {
    setReverseStatus(signalGateStatus, "", "failed");
    return true;
  }

  signalGateInput = signalGateInput.filter((item) => item !== value);
  button.classList.remove("is-used", "is-accepted", "is-rejected");
  button.disabled = false;
  updateSignalGateProgress();

  if (signalGateInput.length === 0) {
    signalGatePanel?.classList.remove("is-unlocked", "is-failed", "is-resolving");
    clearReverseStatus(signalGateStatus);
    completeReverseStep("signalGate");
  } else {
    clearReverseStatus(signalGateStatus);
  }

  return true;
}

function parseTipsYaml(source) {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .map((value) => {
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        return value.slice(1, -1);
      }

      return value;
    })
    .filter(Boolean);
}

function setTip(text) {
  if (!tipsRoller) {
    return;
  }

  tipsRoller.textContent = text;
  tipsRoller.classList.remove("is-switching");
  tipsRoller.style.animation = "none";
  tipsRoller.offsetHeight;
  tipsRoller.style.animation = "";
}

function showNextTip() {
  if (!tipsRoller || tips.length === 0) {
    return;
  }

  tipsRoller.classList.add("is-switching");

  setTimeout(() => {
    tipIndex = (tipIndex + 1) % tips.length;
    setTip(tips[tipIndex]);
  }, 340);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderRankingPreview(players) {
  if (!rankingPreviewList) {
    return;
  }

  if (!Array.isArray(players) || players.length === 0) {
    rankingPreviewList.innerHTML = '<div class="ranking-preview-empty">暂无海选成绩</div>';
    return;
  }

  const previewPlayers = players.slice(0, 3);

  rankingPreviewList.innerHTML = previewPlayers.map((player, index) => {
    const rank = getPreviewScoreRank(players, index);

    return `
    <article class="ranking-preview-item" data-rank="${rank}">
      <span class="ranking-preview-rank">#${rank}</span>
      <strong class="ranking-preview-name">${escapeHtml(player.nickname)}</strong>
      <span class="ranking-preview-score">${escapeHtml(player.score)}</span>
    </article>
  `;
  }).join("");
}

function restoreLiveRankingPreview({ forceRefresh = false } = {}) {
  if (!rankingPreviewList) {
    return;
  }

  rankingPreviewMode = "normal";
  document.body.classList.remove("qualifier-mystery-stage");

  if (openQualifierRankingButton) {
    openQualifierRankingButton.setAttribute("href", "./index.html#rankingList");
    openQualifierRankingButton.removeAttribute("target");
    openQualifierRankingButton.removeAttribute("rel");
  }

  if (forceRefresh) {
    rankingPreviewRequested = false;
  }

  requestRankingPreview({
    force: forceRefresh
  });
}

function activateFinalRankingStage({ scroll = false } = {}) {
  rankingPreviewMode = "mystery";
  document.body.classList.add("qualifier-mystery-stage");
  renderRankingPreview(finalRankingPreviewPlayers);
  applyMysterySignalGate();

  if (openQualifierRankingButton) {
    openQualifierRankingButton.removeAttribute("target");
    openQualifierRankingButton.removeAttribute("rel");
    openQualifierRankingButton.setAttribute("href", "#qualifierRankingRift");
  }

  if (scroll) {
    rankingPreviewSection?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

function applyMysterySignalGate() {
  signalGateInput = [];
  signalGateLocked = false;
  signalGatePanel?.classList.remove("is-unlocked", "is-resolving", "is-failed");

  signalGateButtons.forEach((button, index) => {
    button.textContent = mysterySignalLabels[index] || "∎∎";
    button.classList.remove("is-used", "is-accepted", "is-rejected");
    button.disabled = false;
  });

  if (resetSignalGateButton) {
    resetSignalGateButton.disabled = false;
  }

  updateSignalGateProgress();
}

function getPreviewScoreRank(players, index) {
  const score = players[index]?.score;
  const tiedIndex = players.findIndex((player) => player.score === score);

  return tiedIndex >= 0 ? tiedIndex + 1 : index + 1;
}

async function loadRankingPreview() {
  if (!rankingPreviewList) {
    return;
  }

  const shouldShowMysteryRanking =
    document.body.classList.contains("qualifier-mystery-stage") ||
    (
      readFinalOffsetCache() &&
      rankingPreviewMode !== "normal" &&
      !readFragmentFiveEntryCache() &&
      !readFragmentFiveAnswerCache()
    );

  if (shouldShowMysteryRanking) {
    activateFinalRankingStage();
    return;
  }

  if (window.PLCPlayersCache?.hydrate) {
    window.PLCPlayersCache.hydrate({
      onUpdate: renderRankingPreview,
      onError: () => {
        if (!rankingPreviewList.querySelector(".ranking-preview-item")) {
          rankingPreviewList.innerHTML = '<div class="ranking-preview-empty">排行榜加载失败，请稍后重试</div>';
        }
      }
    });
    return;
  }

  if (typeof API_URL === "undefined") {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/players`);

    if (!response.ok) {
      throw new Error("Ranking request failed");
    }

    renderRankingPreview(await response.json());
  } catch (error) {
    rankingPreviewList.innerHTML = '<div class="ranking-preview-empty">排行榜加载失败，请稍后重试</div>';
  }
}

let rankingPreviewRequested = false;

function requestRankingPreview({ force = false } = {}) {
  if (rankingPreviewRequested && !force) {
    return;
  }

  rankingPreviewRequested = true;
  loadRankingPreview();
}

function observeRankingPreview() {
  if (!rankingPreviewList) {
    return;
  }

  if (!("IntersectionObserver" in window) || !rankingPreviewSection) {
    runWhenIdle(requestRankingPreview, 2200);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      requestRankingPreview();
    }
  }, {
    rootMargin: "480px 0px"
  });

  observer.observe(rankingPreviewSection);
}

function openQualifierRankingRift(event) {
  if (
    rankingPreviewMode === "normal" &&
    !document.body.classList.contains("qualifier-mystery-stage")
  ) {
    return;
  }

  event?.preventDefault();

  if (!qualifierRankingRift) {
    return;
  }

  resetQualifierRebootScene({
    persistDraft: false,
    resetStatus: true
  });
  activateFinalRankingStage();
  restoreQualifierRankingDraft();
  startQualifierRankingDraftAutosave();
  qualifierRankingRift.classList.add("is-open");
  qualifierRankingRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const firstInput = qualifierRankingRift.querySelector("input");
  if (firstInput && typeof firstInput.focus === "function") {
    firstInput.focus();
  }
}

function clearQualifierRebootTimers() {
  qualifierRebootTimers.forEach((timer) => window.clearTimeout(timer));
  qualifierRebootTimers = [];
}

function resetQualifierRebootScene({
  persistDraft = true,
  releaseModal = true,
  resetStatus = false
} = {}) {
  if (!qualifierRankingRift) {
    return;
  }

  clearQualifierRebootTimers();

  if (persistDraft) {
    writeQualifierRankingDraft({
      force: true
    });
  }

  stopQualifierRankingDraftAutosave();
  qualifierRankingRift.classList.remove(
    "is-open",
    "is-failed",
    "is-complete",
    "is-reboot-sequencing",
    "is-blackout",
    "is-fragment-five-ready"
  );
  qualifierRankingRift.setAttribute("aria-hidden", "true");

  if (qualifierRebootStage) {
    qualifierRebootStage.setAttribute("aria-hidden", "true");
  }

  qualifierRankingRift.querySelectorAll(".qualifier-row.is-extracting").forEach((row) => {
    row.classList.remove("is-extracting");
  });

  qualifierRankingRift.querySelectorAll("input, button").forEach((control) => {
    control.disabled = false;
  });

  if (resetStatus && qualifierRankingStatus) {
    qualifierRankingStatus.textContent = "";
    qualifierRankingStatus.classList.remove("is-failed", "is-complete");
  }

  if (releaseModal) {
    document.body.classList.remove("modal-open");
  }
}

function closeQualifierRankingRift() {
  if (!qualifierRankingRift) {
    return;
  }

  resetQualifierRebootScene({
    persistDraft: qualifierRankingRift.classList.contains("is-open")
  });
}

function normalizeQualifierName(value = "") {
  return value.trim();
}

function normalizeQualifierScore(value = "") {
  return value.replace(/\D/g, "");
}

function getQualifierDraftInputs() {
  return qualifierRankingAnswers.flatMap(({ rank }) => [
    document.getElementById(`qualifierName${rank}`),
    document.getElementById(`qualifierScore${rank}`)
  ]).filter(Boolean);
}

function getQualifierRankingDraftValues() {
  const values = {};
  getQualifierDraftInputs().forEach((input) => {
    values[input.id] = input.value;
  });
  return values;
}

function readQualifierRankingDraft() {
  try {
    const cachedValue = readStoredValue(qualifierRankingDraftStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    return payload?.version === qualifierRankingDraftCacheVersion &&
      payload?.values &&
      typeof payload.values === "object"
      ? payload.values
      : null;
  } catch (error) {
    return null;
  }
}

function writeQualifierRankingDraft(options = {}) {
  try {
    const values = getQualifierRankingDraftValues();
    const snapshot = JSON.stringify(values);
    if (options?.force !== true && snapshot === qualifierRankingDraftSnapshot) {
      return;
    }

    qualifierRankingDraftSnapshot = snapshot;

    writeStoredValue(qualifierRankingDraftStorageKey, JSON.stringify({
      version: qualifierRankingDraftCacheVersion,
      values,
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function startQualifierRankingDraftAutosave() {
  stopQualifierRankingDraftAutosave();
  writeQualifierRankingDraft({
    force: true
  });
  qualifierRankingDraftAutosaveTimer = window.setInterval(writeQualifierRankingDraft, 500);
}

function stopQualifierRankingDraftAutosave() {
  if (qualifierRankingDraftAutosaveTimer) {
    window.clearInterval(qualifierRankingDraftAutosaveTimer);
    qualifierRankingDraftAutosaveTimer = null;
  }
}

function restoreQualifierRankingDraft() {
  const values = readQualifierRankingDraft();
  if (!values) {
    return;
  }

  getQualifierDraftInputs().forEach((input) => {
    if (Object.prototype.hasOwnProperty.call(values, input.id)) {
      input.value = values[input.id];
    }
  });
  qualifierRankingDraftSnapshot = JSON.stringify(getQualifierRankingDraftValues());
}

function handleQualifierRankingSubmit(event) {
  event?.preventDefault();

  if (!qualifierRankingRift) {
    return;
  }

  writeQualifierRankingDraft();
  const isCorrect = qualifierRankingAnswers.every(({ rank, name, score }) => {
    const nameInput = document.getElementById(`qualifierName${rank}`);
    const scoreInput = document.getElementById(`qualifierScore${rank}`);

    return normalizeQualifierName(nameInput?.value) === name &&
      normalizeQualifierScore(scoreInput?.value) === score;
  });

  if (isCorrect) {
    qualifierRankingRift.classList.remove("is-failed");
    qualifierRankingRift.classList.add("is-complete");
    if (qualifierRankingStatus) {
      qualifierRankingStatus.textContent = "REBOOT ACCEPTED";
      qualifierRankingStatus.classList.remove("is-failed");
      qualifierRankingStatus.classList.add("is-complete");
    }
    startQualifierRebootSequence();
    return;
  }

  qualifierRankingRift.classList.remove("is-failed");
  qualifierRankingRift.offsetHeight;
  qualifierRankingRift.classList.add("is-failed");

  if (qualifierRankingStatus) {
    qualifierRankingStatus.textContent = "REBOOT DENIED";
    qualifierRankingStatus.classList.remove("is-complete");
    qualifierRankingStatus.classList.add("is-failed");
  }
}

function startQualifierRebootSequence() {
  if (!qualifierRankingRift) {
    return;
  }

  clearQualifierRebootTimers();
  const rows = Array.from(qualifierRankingRift.querySelectorAll(".qualifier-row"));
  const rowExtractInterval = 360;
  rows.forEach((row) => {
    row.classList.remove("is-extracting");
  });
  qualifierRankingRift.classList.add("is-reboot-sequencing");

  if (qualifierRankingForm) {
    qualifierRankingForm.querySelectorAll("input, button").forEach((control) => {
      control.disabled = true;
    });
  }

  rows.slice().reverse().forEach((row, index) => {
    const timer = window.setTimeout(() => {
      row.classList.add("is-extracting");
    }, index * rowExtractInterval);
    qualifierRebootTimers.push(timer);
  });

  const blackoutDelay = rows.length * rowExtractInterval + 1200;
  const blackoutTimer = window.setTimeout(() => {
    qualifierRankingRift.classList.add("is-blackout");
  }, blackoutDelay);
  qualifierRebootTimers.push(blackoutTimer);

  const fragmentReadyTimer = window.setTimeout(() => {
    qualifierRankingRift.classList.add("is-fragment-five-ready");
    if (qualifierRebootStage) {
      qualifierRebootStage.setAttribute("aria-hidden", "false");
    }
  }, blackoutDelay + 3300);
  qualifierRebootTimers.push(fragmentReadyTimer);
}

function revealFragmentFiveAnswer({ fromCache = false } = {}) {
  fragmentFiveRift?.classList.remove("is-failed");
  fragmentFiveRift?.classList.add("is-fragment-solved", "is-simulation-ready");
  revealShardFiveEntry({
    fromCache
  });
  setFragmentFiveSimulationEntry();
  lockSignalGateForFragmentFiveStage();

  if (fragmentFiveResult) {
    fragmentFiveResult.textContent = fragmentFiveResultLabel;
    fragmentFiveResult.setAttribute("aria-hidden", "false");
  }

  if (fragmentFiveAnswerInput) {
    fragmentFiveAnswerInput.value = "穹顶";
    fragmentFiveAnswerInput.disabled = true;
  }

  if (fragmentFiveAnswerSubmit) {
    fragmentFiveAnswerSubmit.disabled = true;
  }

  if (fragmentFiveAnswerStatus) {
    fragmentFiveAnswerStatus.textContent = fromCache
      ? "第十层已记录。"
      : "第十层已接入。";
    fragmentFiveAnswerStatus.classList.remove("is-failed");
    fragmentFiveAnswerStatus.classList.add("is-complete");
  }

  if (startSimulationButton) {
    startSimulationButton.removeAttribute("aria-hidden");
    startSimulationButton.disabled = false;
  }
}

function normalizeFragmentFiveAnswer(value = "") {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[：:]/g, "")
    .replace(/穹頂/g, "穹顶");
}

function handleFragmentFiveAnswerSubmit(event) {
  event?.preventDefault();

  const answer = normalizeFragmentFiveAnswer(fragmentFiveAnswerInput?.value);
  if (answer === "穹顶") {
    writeFragmentFiveAnswerCache();
    revealFragmentFiveAnswer();
    return;
  }

  fragmentFiveRift?.classList.remove("is-failed");
  fragmentFiveRift?.offsetHeight;
  fragmentFiveRift?.classList.add("is-open", "is-failed");
  fragmentFiveRift?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (fragmentFiveAnswerStatus) {
    fragmentFiveAnswerStatus.textContent = "第十层尚未对齐。";
    fragmentFiveAnswerStatus.classList.remove("is-complete");
    fragmentFiveAnswerStatus.classList.add("is-failed");
  }
}

function showFragmentFiveRiftPanel() {
  if (!fragmentFiveRift) {
    return;
  }

  loadDeferredImages(fragmentFiveRift);
  clearTimeout(fragmentFiveRiftCloseTimer);
  fragmentFiveRiftLastFocusedElement = document.activeElement;
  fragmentFiveRift.classList.remove("is-closing");
  fragmentFiveRift.classList.add("is-open");
  fragmentFiveRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (readFragmentFiveAnswerCache()) {
    revealFragmentFiveAnswer({
      fromCache: true
    });
  }

  const focusTarget = fragmentFiveAnswerInput?.disabled
    ? fragmentFiveRift.querySelector(".signal-rift-close")
    : fragmentFiveAnswerInput;

  if (focusTarget && typeof focusTarget.focus === "function") {
    focusTarget.focus();
  }
}

function restoreZeroLayerEchoForFragmentFive() {
  restoreLiveRankingPreview({
    forceRefresh: true
  });
  revealReverseFinalState();
  revealShardFiveEntry();
  lockSignalGateForFragmentFiveStage();
  finalSignalSection?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function returnToMainBeforeFragmentFive() {
  clearTimeout(fragmentFiveMainReturnTimer);
  closeQualifierRankingRift();
  restoreZeroLayerEchoForFragmentFive();

  fragmentFiveMainReturnTimer = window.setTimeout(() => {
    showFragmentFiveRiftPanel();
  }, 760);
}

function openFragmentFiveRift(event) {
  event?.preventDefault();

  if (
    qualifierRankingRift?.classList.contains("is-open") &&
    qualifierRankingRift.classList.contains("is-fragment-five-ready")
  ) {
    returnToMainBeforeFragmentFive();
    return;
  }

  showFragmentFiveRiftPanel();
}

function openFragmentFromHitbox(event) {
  event?.preventDefault();
  const target = event?.currentTarget?.dataset?.fragmentHitbox;

  if (target === "one") {
    if (openFragmentRiftButton) {
      openFragmentRiftButton.disabled = false;
    }
    openFragmentRift();
    return;
  }

  if (target === "two") {
    if (openFragmentTwoRiftButton) {
      openFragmentTwoRiftButton.disabled = false;
    }
    openFragmentTwoRift();
    return;
  }

  if (target === "three") {
    if (openFragmentThreeRiftButton) {
      openFragmentThreeRiftButton.disabled = false;
    }
    openFragmentThreeRift();
    return;
  }

  if (target === "four") {
    if (openFragmentFourRiftButton) {
      openFragmentFourRiftButton.disabled = false;
    }
    openFragmentFourRift();
    return;
  }

  if (target === "five") {
    if (openFragmentFiveMainRiftButton) {
      openFragmentFiveMainRiftButton.disabled = false;
    }
    openFragmentFiveRift(event);
  }
}

function closeFragmentFiveRift() {
  if (!fragmentFiveRift || !fragmentFiveRift.classList.contains("is-open")) {
    return;
  }

  fragmentFiveRift.classList.add("is-closing");
  fragmentFiveRift.classList.remove("is-open");
  fragmentFiveRift.setAttribute("aria-hidden", "true");

  if (!qualifierRankingRift?.classList.contains("is-open")) {
    document.body.classList.remove("modal-open");
  }

  fragmentFiveRiftCloseTimer = setTimeout(() => {
    fragmentFiveRift.classList.remove("is-closing");

    if (
      fragmentFiveRiftLastFocusedElement &&
      typeof fragmentFiveRiftLastFocusedElement.focus === "function"
    ) {
      fragmentFiveRiftLastFocusedElement.focus();
    }
  }, 340);
}

function readPlcDatabaseSeenSet() {
  const fallback = new Set();

  try {
    const cachedValue = readStoredValue(plcDatabaseSeenStorageKey);

    if (!cachedValue) {
      return fallback;
    }

    const payload = JSON.parse(cachedValue);

    if (
      payload?.version !== plcDatabaseSeenCacheVersion ||
      !Array.isArray(payload?.seen)
    ) {
      return fallback;
    }

    return new Set(
      payload.seen
        .map((item) => {
          if (typeof item === "number") {
            return Number.isInteger(item) && item >= 0 && item < plcDatabaseEntries.length
              ? getPlcDatabaseEntryKey("first", item)
              : null;
          }

          if (typeof item === "string") {
            const separatorIndex = item.indexOf(":");

            if (separatorIndex < 0) {
              return null;
            }

            const categoryKey = item.slice(0, separatorIndex);
            const rawEntryKey = item.slice(separatorIndex + 1);
            const category = plcDatabaseCategories[categoryKey];

            if (!category) {
              return null;
            }

            const legacyIndex = Number(rawEntryKey);
            if (
              Number.isInteger(legacyIndex) &&
              legacyIndex >= 0 &&
              legacyIndex < category.entries.length
            ) {
              return getPlcDatabaseEntryKey(categoryKey, legacyIndex);
            }

            return category.entries.some((entry) => entry.title === rawEntryKey)
              ? categoryKey + ":" + rawEntryKey
              : null;
          }

          return null;
        })
        .filter(Boolean)
    );
  } catch (error) {
    return fallback;
  }
}

function writePlcDatabaseSeenSet(seenSet) {
  writeStoredValue(plcDatabaseSeenStorageKey, JSON.stringify({
    version: plcDatabaseSeenCacheVersion,
    seen: Array.from(seenSet).sort()
  }));
}

function readPlcDatabaseFullLoaderCache() {
  try {
    const cachedValue = readStoredValue(plcDatabaseFullLoaderStorageKey);

    if (!cachedValue) {
      return false;
    }

    const payload = JSON.parse(cachedValue);
    return payload?.version === plcDatabaseFullLoaderCacheVersion &&
      payload?.completed === true;
  } catch (error) {
    return false;
  }
}

function writePlcDatabaseFullLoaderCache() {
  writeStoredValue(plcDatabaseFullLoaderStorageKey, JSON.stringify({
    version: plcDatabaseFullLoaderCacheVersion,
    completed: true
  }));
}

function readPlcDatabaseReplayState() {
  try {
    const cachedValue = readStoredValue(plcDatabaseReplayStorageKey);

    if (!cachedValue) {
      return false;
    }

    const payload = JSON.parse(cachedValue);
    return payload?.version === plcDatabaseReplayCacheVersion &&
      payload?.enabled === true;
  } catch (error) {
    return false;
  }
}

function writePlcDatabaseReplayState(enabled) {
  writeStoredValue(plcDatabaseReplayStorageKey, JSON.stringify({
    version: plcDatabaseReplayCacheVersion,
    enabled: Boolean(enabled)
  }));
}

function readPlcDatabaseVerificationState() {
  try {
    const cachedValue = readStoredValue(plcDatabaseVerificationStorageKey);

    if (!cachedValue) {
      return false;
    }

    const payload = JSON.parse(cachedValue);
    return payload?.version === plcDatabaseVerificationCacheVersion &&
      payload?.passed === true;
  } catch (error) {
    return false;
  }
}

function writePlcDatabaseVerificationState() {
  writeStoredValue(plcDatabaseVerificationStorageKey, JSON.stringify({
    version: plcDatabaseVerificationCacheVersion,
    passed: true
  }));
}

function readPlcSecretFragmentFourState() {
  try {
    const cachedValue = readStoredValue(plcSecretFragmentFourStorageKey);

    if (!cachedValue) {
      return false;
    }

    const payload = JSON.parse(cachedValue);
    return payload?.version === plcSecretFragmentFourCacheVersion &&
      payload?.unlocked === true;
  } catch (error) {
    return false;
  }
}

function writePlcSecretFragmentFourState() {
  writeStoredValue(plcSecretFragmentFourStorageKey, JSON.stringify({
    version: plcSecretFragmentFourCacheVersion,
    unlocked: true,
    completedAt: new Date().toISOString()
  }));
}

function readFirstLayerEchoState() {
  try {
    const cachedValue = readStoredValue(firstLayerEchoStorageKey);

    if (!cachedValue) {
      return false;
    }

    const payload = JSON.parse(cachedValue);
    return payload?.version === firstLayerEchoCacheVersion &&
      payload?.unlocked === true;
  } catch (error) {
    return false;
  }
}

function writeFirstLayerEchoState() {
  writeStoredValue(firstLayerEchoStorageKey, JSON.stringify({
    version: firstLayerEchoCacheVersion,
    unlocked: true,
    completedAt: new Date().toISOString()
  }));
}

function readFirstLayerFragmentOneState() {
  try {
    const cachedValue = readStoredValue(firstLayerFragmentOneStorageKey);

    if (!cachedValue) {
      return false;
    }

    const payload = JSON.parse(cachedValue);
    return payload?.version === firstLayerFragmentOneCacheVersion &&
      payload?.unlocked === true;
  } catch (error) {
    return false;
  }
}

function writeFirstLayerFragmentOneState() {
  writeStoredValue(firstLayerFragmentOneStorageKey, JSON.stringify({
    version: firstLayerFragmentOneCacheVersion,
    unlocked: true,
    completedAt: new Date().toISOString()
  }));
}

function readFragmentSevenAnswerCache() {
  try {
    const cachedValue = readStoredValue(fragmentSevenAnswerStorageKey);

    if (!cachedValue) {
      return false;
    }

    const payload = JSON.parse(cachedValue);
    return payload?.version === fragmentSevenAnswerCacheVersion &&
      payload?.solved === true;
  } catch (error) {
    return false;
  }
}

function writeFragmentSevenAnswerCache() {
  writeStoredValue(fragmentSevenAnswerStorageKey, JSON.stringify({
    version: fragmentSevenAnswerCacheVersion,
    solved: true,
    completedAt: new Date().toISOString()
  }));
}

function readFragmentSevenIntroCache() {
  try {
    const cachedValue = readStoredValue(fragmentSevenIntroStorageKey);

    if (!cachedValue) {
      return false;
    }

    const payload = JSON.parse(cachedValue);
    return payload?.version === fragmentSevenIntroCacheVersion &&
      payload?.seen === true;
  } catch (error) {
    return false;
  }
}

function writeFragmentSevenIntroCache() {
  writeStoredValue(fragmentSevenIntroStorageKey, JSON.stringify({
    version: fragmentSevenIntroCacheVersion,
    seen: true,
    completedAt: new Date().toISOString()
  }));
}

function isPlcDatabaseVerificationRequired() {
  return readPlcDatabaseReplayState() && !readPlcDatabaseVerificationState();
}

function isPlcDatabaseVerificationEntry(entry) {
  return entry?.title === plcDatabaseVerificationEntryTitle;
}

function isPlcSecretFragmentEntry(entry) {
  return typeof entry?.title === "string" &&
    entry.title.startsWith(plcDatabaseSecretFragmentTitlePrefix);
}

function isPlcSecretFragmentThreeEntry(entry) {
  return entry?.title === plcSecretFragmentThreeTitle;
}

function isPlcSecretFragmentFourEntry(entry) {
  return entry?.title === plcSecretFragmentFourTitle;
}

function shouldRenderPlcDatabaseVerification(categoryKey = plcDatabaseActiveCategoryKey) {
  return categoryKey === "secret" && isPlcDatabaseVerificationRequired();
}

function getPlcPlanEntryNumber(entry, fallbackIndex = 0) {
  const match = String(entry?.title || "").match(/#(\d+)\s*$/);

  if (!match) {
    return fallbackIndex;
  }

  return Number(match[1]);
}

function applyPlcPlanHiddenLetter(categoryKey, entry, index = 0) {
  if (!plcDatabaseFile) {
    return;
  }

  const entryNumber = getPlcPlanEntryNumber(entry, index);
  const hiddenLetter = categoryKey === "first" && isPlcDatabaseVerificationRequired()
    ? plcPlanHiddenLetters[entryNumber]
    : "";

  if (!hiddenLetter) {
    plcDatabaseFile.removeAttribute("data-hidden-letter");
    plcDatabaseFile.style.removeProperty("--plc-hidden-letter-x");
    plcDatabaseFile.style.removeProperty("--plc-hidden-letter-y");
    plcDatabaseFile.style.removeProperty("--plc-hidden-letter-rotate");
    return;
  }

  const position = plcPlanHiddenLetterPositions[entryNumber] || {};
  plcDatabaseFile.setAttribute("data-hidden-letter", hiddenLetter);
  plcDatabaseFile.style.setProperty("--plc-hidden-letter-x", position.x || "62%");
  plcDatabaseFile.style.setProperty("--plc-hidden-letter-y", position.y || "54%");
  plcDatabaseFile.style.setProperty("--plc-hidden-letter-rotate", position.rotate || "0deg");
}

function applyPlcDatabaseReplayState(enabled, { restoreFirstLayer = true } = {}) {
  plcDatabase?.classList.toggle("is-replay-active", enabled);

  if (plcDatabaseReplayButton) {
    plcDatabaseReplayButton.classList.toggle("is-on", enabled);
    plcDatabaseReplayButton.setAttribute("aria-pressed", enabled ? "true" : "false");
    const stateLabel = plcDatabaseReplayButton.querySelector("span");

    if (stateLabel) {
      stateLabel.textContent = enabled ? "ON" : "OFF";
    }
  }

  if (plcOpenSecretCategory) {
    plcOpenSecretCategory.hidden = !enabled;
    plcOpenSecretCategory.setAttribute("aria-hidden", enabled ? "false" : "true");
  }

  updatePlcDatabaseProgress();
  applyPlcPlanHiddenLetter(
    plcDatabaseActiveCategoryKey,
    getPlcDatabaseCategory().entries[plcDatabaseActiveEntryIndex],
    plcDatabaseActiveEntryIndex
  );

  if (enabled && restoreFirstLayer && readFirstLayerEchoState()) {
    revealFirstLayerEcho({
      animate: false,
      scroll: false
    });
  } else {
    hideFirstLayerEcho();
  }
}

function getPlcPlanEntriesForCurrentState() {
  if (readFirstLayerEchoState()) {
    return plcDatabaseEntries;
  }

  return plcDatabaseEntries
    .filter((entry) => getPlcPlanEntryNumber(entry) < 7)
    .concat(plcDatabasePendingPlanEntry);
}

function getPlcDatabaseEntryKey(categoryKey, index) {
  const category = getPlcDatabaseCategory(categoryKey);
  const entry = category.entries[index];

  if (!entry) {
    return category.key + ":" + index;
  }

  return category.key + ":" + entry.title;
}

function getPlcDatabaseCategory(categoryKey = plcDatabaseActiveCategoryKey) {
  const category = plcDatabaseCategories[categoryKey] || plcDatabaseCategories.first;

  if (category.key === "first") {
    return {
      ...category,
      entries: getPlcPlanEntriesForCurrentState()
    };
  }

  return category;
}

function getPlcDatabaseEntryIndexByTitle(categoryKey, title) {
  const category = getPlcDatabaseCategory(categoryKey);
  return category.entries.findIndex((entry) => entry.title === title);
}

function isPlcSecretFragmentThreeSeen() {
  const fragmentThreeIndex = getPlcDatabaseEntryIndexByTitle("secret", plcSecretFragmentThreeTitle);

  if (fragmentThreeIndex < 0) {
    return false;
  }

  return readPlcDatabaseSeenSet().has(getPlcDatabaseEntryKey("secret", fragmentThreeIndex));
}

function isPlcSecretSignalGateArmed() {
  return readPlcDatabaseReplayState() &&
    readPlcDatabaseVerificationState() &&
    isPlcSecretFragmentThreeSeen() &&
    !readPlcSecretFragmentFourState();
}

function getPlcDatabaseProgress(categoryKey) {
  const seenSet = readPlcDatabaseSeenSet();
  const categories = categoryKey
    ? [getPlcDatabaseCategory(categoryKey)]
    : Object.keys(plcDatabaseCategories).map((key) => getPlcDatabaseCategory(key)).filter((category) => {
      return category.key !== "secret" || readPlcDatabaseReplayState();
    });
  const total = categories.reduce((sum, category) => sum + category.entries.length, 0) || 1;
  const count = categories.reduce((sum, category) => {
    return sum + category.entries.reduce((entrySum, _entry, index) => {
      return entrySum + (seenSet.has(getPlcDatabaseEntryKey(category.key, index)) ? 1 : 0);
    }, 0);
  }, 0);

  return {
    count,
    total,
    percent: Math.round((count / total) * 100)
  };
}

function updatePlcDatabaseProgress() {
  const progress = getPlcDatabaseProgress();
  const firstProgress = getPlcDatabaseProgress("first");
  const secondProgress = getPlcDatabaseProgress("second");
  const secretProgress = getPlcDatabaseProgress("secret");
  const folderProgress = getPlcDatabaseProgress(plcDatabaseActiveCategoryKey);

  if (plcTotalProgressBar) {
    plcTotalProgressBar.style.setProperty("--plc-db-progress", progress.percent + "%");
  }

  if (plcTotalProgressText) {
    plcTotalProgressText.textContent = progress.percent + "%";
  }

  if (plcFirstCategoryProgress) {
    plcFirstCategoryProgress.textContent = "完成度 " + firstProgress.percent + "%";
  }

  if (plcSecondCategoryProgress) {
    plcSecondCategoryProgress.textContent = "完成度 " + secondProgress.percent + "%";
  }

  if (plcSecretCategoryProgress) {
    plcSecretCategoryProgress.textContent = "完成度 " + secretProgress.percent + "%";
  }

  if (plcFolderProgress) {
    plcFolderProgress.textContent = "完成度 " + folderProgress.percent + "%";
  }

  return progress;
}

function markPlcDatabaseEntrySeen(index) {
  const seenSet = readPlcDatabaseSeenSet();
  const entryKey = getPlcDatabaseEntryKey(plcDatabaseActiveCategoryKey, index);

  if (!seenSet.has(entryKey)) {
    seenSet.add(entryKey);
    writePlcDatabaseSeenSet(seenSet);
  }

  updatePlcDatabaseProgress();
}

function getPlcDatabaseVisibleEntries(category = getPlcDatabaseCategory()) {
  const indexedEntries = category.entries.map((entry, index) => ({ entry, index }));

  if (!shouldRenderPlcDatabaseVerification(category.key)) {
    if (category.key === "secret" && !readPlcSecretFragmentFourState()) {
      return indexedEntries.filter(({ entry }) => !isPlcSecretFragmentFourEntry(entry));
    }

    return indexedEntries;
  }

  return indexedEntries.filter(({ entry }) => isPlcDatabaseVerificationEntry(entry));
}

function getPlcDatabaseVisibleEntryCount(category, activeIndex) {
  const visibleEntries = getPlcDatabaseVisibleEntries(category);
  const visibleIndex = visibleEntries.findIndex(({ index }) => index === activeIndex);

  return {
    current: visibleIndex >= 0 ? visibleIndex + 1 : 1,
    total: visibleEntries.length || 1
  };
}

function renderPlcDatabaseEntryList() {
  if (!plcDatabaseEntryList) {
    return;
  }

  const seenSet = readPlcDatabaseSeenSet();
  const activeCategory = getPlcDatabaseCategory();
  const visibleEntries = getPlcDatabaseVisibleEntries(activeCategory);
  plcDatabaseEntryList.replaceChildren();
  plcDatabaseEntryList.setAttribute("aria-label", activeCategory.label + "条目");

  visibleEntries.forEach(({ entry, index }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "plc-db-entry-button";
    button.textContent = entry.title;
    button.dataset.plcEntryIndex = String(index);
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", index === plcDatabaseActiveEntryIndex ? "true" : "false");

    if (seenSet.has(getPlcDatabaseEntryKey(activeCategory.key, index))) {
      button.classList.add("is-seen");
    }

    if (index === plcDatabaseActiveEntryIndex) {
      button.classList.add("is-active");
    }

    if (
      shouldRenderPlcDatabaseVerification(activeCategory.key) &&
      isPlcSecretFragmentEntry(entry)
    ) {
      button.classList.add("is-locked");
    }

    button.addEventListener("click", () => {
      selectPlcDatabaseEntry(index);
    });

    plcDatabaseEntryList.appendChild(button);
  });
}

function handlePlcDatabaseVerificationSubmit(event) {
  event?.preventDefault();

  const form = event?.currentTarget;
  const input = form?.querySelector(".plc-db-verification-input");
  const submittedAnswer = String(input?.value || "")
    .replace(/\s+/g, "")
    .toUpperCase();

  if (submittedAnswer === plcDatabaseVerificationAnswer) {
    writePlcDatabaseVerificationState();
    const activeCategory = getPlcDatabaseCategory();
    const activeEntry = activeCategory.entries[plcDatabaseActiveEntryIndex];
    const firstFragmentIndex = activeCategory.entries.findIndex(isPlcSecretFragmentEntry);
    const nextEntryIndex = isPlcDatabaseVerificationEntry(activeEntry) && firstFragmentIndex >= 0
      ? firstFragmentIndex
      : plcDatabaseActiveEntryIndex;

    renderPlcDatabaseEntryList();
    selectPlcDatabaseEntry(nextEntryIndex);
    return;
  }

  renderPlcDatabaseVerification(
    "\u9a8c\u8bc1\u5931\u8d25\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u3002",
    true
  );
}

function renderPlcDatabaseVerification(statusText = "", isError = false) {
  if (!plcDatabaseEntryContent) {
    return;
  }

  plcDatabaseEntryContent.replaceChildren();

  const section = document.createElement("section");
  section.className = "plc-db-verification";

  const kicker = document.createElement("span");
  kicker.className = "plc-db-verification-kicker";
  kicker.textContent = "IDENTITY CHECK";

  const message = document.createElement("p");
  message.className = "plc-db-verification-message";
  message.textContent = "[PLC\u8ba1\u5212\u6570\u636e\u5e93\u6df1\u5c42\u4fdd\u5bc6\u6570\u636e\uff0c\u67e5\u9605\u8bf7\u9a8c\u8bc1\u8eab\u4efd\u3002]";

  const form = document.createElement("form");
  form.className = "plc-db-verification-form";
  form.setAttribute("aria-label", "PLC database verification");

  const input = document.createElement("input");
  input.className = "plc-db-verification-input";
  input.type = "text";
  input.inputMode = "text";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.maxLength = 16;
  input.placeholder = "ACCESS CODE";
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^a-z0-9]/gi, "").toUpperCase();
  });

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "\u9a8c\u8bc1";

  form.append(input, submitButton);
  form.addEventListener("submit", handlePlcDatabaseVerificationSubmit);

  section.append(kicker, message, form);

  if (statusText) {
    const status = document.createElement("p");
    status.className = "plc-db-verification-status";
    status.classList.toggle("is-error", isError);
    status.textContent = statusText;
    section.appendChild(status);
  }

  plcDatabaseEntryContent.appendChild(section);
  window.setTimeout(() => {
    input.focus({ preventScroll: true });
  }, 30);
}

function renderPlcDatabaseEntryContent(body = "") {
  if (!plcDatabaseEntryContent) {
    return;
  }

  plcDatabaseEntryContent.replaceChildren();
  String(body).split(/\n{2,}/).forEach((block) => {
    const paragraph = document.createElement("p");
    const lines = block.split("\n");

    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) {
        paragraph.appendChild(document.createElement("br"));
      }

      paragraph.appendChild(document.createTextNode(line));
    });

    plcDatabaseEntryContent.appendChild(paragraph);
  });
}

function clearFirstLayerTerminalTimers() {
  firstLayerTerminalTimers.forEach((timer) => window.clearTimeout(timer));
  firstLayerTerminalTimers = [];
}

function appendFirstLayerTerminalLine(text) {
  if (!firstLayerTerminalLog) {
    return;
  }

  const line = document.createElement("p");
  line.textContent = text;
  firstLayerTerminalLog.appendChild(line);
  firstLayerTerminalLog.scrollTop = firstLayerTerminalLog.scrollHeight;
}

function showPlcRestoreToast() {
  if (!plcRestoreToast) {
    return;
  }

  window.clearTimeout(plcRestoreToastTimer);
  plcRestoreToast.classList.add("is-visible");
  plcRestoreToast.setAttribute("aria-hidden", "false");

  plcRestoreToastTimer = window.setTimeout(() => {
    plcRestoreToast.classList.remove("is-visible");
    plcRestoreToast.setAttribute("aria-hidden", "true");
  }, 3600);
}

function applyFirstLayerFragmentOneState() {
  const unlocked = readFirstLayerFragmentOneState();
  firstLayerEchoSection?.classList.toggle("is-fragment-one-open", unlocked);

  if (firstLayerOffsetButton) {
    firstLayerOffsetButton.textContent = unlocked ? "-18420s" : "--";
    firstLayerOffsetButton.disabled = unlocked;
    firstLayerOffsetButton.setAttribute(
      "aria-label",
      unlocked ? "同步偏移已写入" : "输入同步偏移"
    );
  }

  if (firstLayerNextAnalysis) {
    firstLayerNextAnalysis.textContent = unlocked ? "残片 #7 已开启" : "等待回声稳定";
  }

  if (firstLayerFragmentOne) {
    firstLayerFragmentOne.setAttribute("aria-hidden", unlocked ? "false" : "true");
  }

  if (openFragmentSevenRiftButton) {
    openFragmentSevenRiftButton.disabled = !unlocked;
    openFragmentSevenRiftButton.setAttribute("aria-disabled", unlocked ? "false" : "true");
  }

  const status = firstLayerEchoSection?.querySelector(".final-art-status");
  if (status) {
    status.textContent = unlocked ? "LAYER 01 // FRAGMENT 07" : "LAYER 01 // SEALED";
  }
}

function resetFirstLayerTerminal() {
  clearFirstLayerTerminalTimers();
  firstLayerTerminalLog?.replaceChildren();

  if (firstLayerTerminalInput) {
    firstLayerTerminalInput.value = "";
    firstLayerTerminalInput.disabled = false;
  }

  const submitButton = firstLayerTerminalForm?.querySelector("button");
  if (submitButton) {
    submitButton.disabled = false;
  }

  if (firstLayerTerminalStatus) {
    firstLayerTerminalStatus.textContent = "";
    firstLayerTerminalStatus.classList.remove("is-error", "is-complete");
  }
}

function openFirstLayerTerminal(event) {
  event?.preventDefault();

  if (!firstLayerTerminal || readFirstLayerFragmentOneState()) {
    return;
  }

  resetFirstLayerTerminal();
  firstLayerTerminal.classList.add("is-open");
  firstLayerTerminal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.setTimeout(() => {
    firstLayerTerminalInput?.focus({ preventScroll: true });
  }, 40);
}

function closeFirstLayerTerminal() {
  if (!firstLayerTerminal?.classList.contains("is-open")) {
    return;
  }

  clearFirstLayerTerminalTimers();
  firstLayerTerminal.classList.remove("is-open");
  firstLayerTerminal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function normalizeFragmentSevenAnswer(value = "") {
  return String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/[-_]/g, "")
    .toLowerCase();
}

function clearFragmentSevenDialogueTimers() {
  fragmentSevenDialogueTimers.forEach((timer) => window.clearTimeout(timer));
  fragmentSevenDialogueTimers = [];
}

function hideFragmentSevenDialogueStage() {
  clearFragmentSevenDialogueTimers();
  fragmentSevenDialogueStage?.classList.remove("is-active");
  fragmentSevenDialogueStage?.setAttribute("aria-hidden", "true");
  fragmentSevenDialogueStack?.replaceChildren();
}

function appendFragmentSevenDialogue(text) {
  if (!fragmentSevenDialogueStack) {
    return;
  }

  fragmentSevenDialogueStack.querySelectorAll(".boot-text-card").forEach((card) => {
    card.classList.remove("is-entering");
    card.classList.add("is-exiting");
  });

  const card = document.createElement("div");
  card.className = "boot-text-card is-entering";
  card.textContent = text;
  fragmentSevenDialogueStack.prepend(card);

  window.setTimeout(() => {
    fragmentSevenDialogueStack.querySelectorAll(".boot-text-card.is-exiting").forEach((item) => {
      item.remove();
    });
  }, 860);
}

function finishFragmentSevenIntro() {
  writeFragmentSevenIntroCache();
  hideFragmentSevenDialogueStage();
  openFragmentSevenRift(null, {
    forceWindow: true
  });
}

function startFragmentSevenIntroSequence() {
  if (!fragmentSevenDialogueStage || !fragmentSevenDialogueStack) {
    finishFragmentSevenIntro();
    return;
  }

  clearFragmentSevenDialogueTimers();
  fragmentSevenDialogueStack.replaceChildren();
  fragmentSevenDialogueStage.classList.add("is-active");
  fragmentSevenDialogueStage.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  fragmentSevenDialogueTexts.forEach((text, index) => {
    const timer = window.setTimeout(() => {
      appendFragmentSevenDialogue(text);
    }, index * fragmentSevenDialogueIntervalMs);
    fragmentSevenDialogueTimers.push(timer);
  });

  const finishTimer = window.setTimeout(
    finishFragmentSevenIntro,
    fragmentSevenDialogueTexts.length * fragmentSevenDialogueIntervalMs + 900
  );
  fragmentSevenDialogueTimers.push(finishTimer);
}

function revealFragmentSevenAnswer({ fromCache = false } = {}) {
  fragmentSevenRift?.classList.add("is-fragment-solved");

  if (fragmentSevenResult) {
    fragmentSevenResult.textContent = "BPM：195";
    fragmentSevenResult.setAttribute("aria-hidden", "false");
  }

  if (fragmentSevenAnswerInput) {
    fragmentSevenAnswerInput.value = "Retribution";
    fragmentSevenAnswerInput.disabled = true;
  }

  if (fragmentSevenAnswerSubmit) {
    fragmentSevenAnswerSubmit.disabled = true;
  }

  if (fragmentSevenAnswerStatus) {
    fragmentSevenAnswerStatus.textContent = fromCache
      ? "ARCHIVE RESTORED."
      : "ARCHIVE KEY ACCEPTED.";
    fragmentSevenAnswerStatus.classList.remove("is-failed");
    fragmentSevenAnswerStatus.classList.add("is-complete");
  }
}

function openFragmentSevenRift(event, { forceWindow = false } = {}) {
  event?.preventDefault();

  if (
    !fragmentSevenRift ||
    !readFirstLayerFragmentOneState() ||
    openFragmentSevenRiftButton?.disabled
  ) {
    return;
  }

  if (!forceWindow && !readFragmentSevenIntroCache()) {
    startFragmentSevenIntroSequence();
    return;
  }

  loadDeferredImages(fragmentSevenRift);
  window.clearTimeout(fragmentSevenRiftCloseTimer);
  fragmentSevenRiftLastFocusedElement = document.activeElement;
  fragmentSevenRift.classList.remove("is-closing", "is-failed");
  fragmentSevenRift.classList.add("is-open");
  fragmentSevenRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (readFragmentSevenAnswerCache()) {
    revealFragmentSevenAnswer({
      fromCache: true
    });
  }

  const focusTarget = fragmentSevenAnswerInput?.disabled
    ? fragmentSevenRift.querySelector(".signal-rift-close")
    : fragmentSevenAnswerInput;
  if (focusTarget && typeof focusTarget.focus === "function") {
    focusTarget.focus();
  }
}

function closeFragmentSevenRift() {
  if (!fragmentSevenRift?.classList.contains("is-open")) {
    return;
  }

  fragmentSevenRift.classList.add("is-closing");
  fragmentSevenRift.classList.remove("is-open");
  fragmentSevenRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  fragmentSevenRiftCloseTimer = window.setTimeout(() => {
    fragmentSevenRift.classList.remove("is-closing", "is-failed");

    if (
      fragmentSevenRiftLastFocusedElement &&
      typeof fragmentSevenRiftLastFocusedElement.focus === "function"
    ) {
      fragmentSevenRiftLastFocusedElement.focus();
    }
  }, 340);
}

function handleFragmentSevenAnswerSubmit(event) {
  event?.preventDefault();

  if (!fragmentSevenAnswerInput || readFragmentSevenAnswerCache()) {
    return;
  }

  const answer = normalizeFragmentSevenAnswer(fragmentSevenAnswerInput.value);

  if (answer === fragmentSevenAnswer) {
    writeFragmentSevenAnswerCache();
    revealFragmentSevenAnswer();
    return;
  }

  if (fragmentSevenAnswerStatus) {
    fragmentSevenAnswerStatus.textContent = "ARCHIVE KEY REJECTED.";
    fragmentSevenAnswerStatus.classList.remove("is-complete");
    fragmentSevenAnswerStatus.classList.add("is-failed");
  }
}

function completeFirstLayerTerminalRun() {
  writeFirstLayerFragmentOneState();
  applyFirstLayerFragmentOneState();

  if (firstLayerTerminalStatus) {
    firstLayerTerminalStatus.textContent = "FRAGMENT 07 OPENED. CLOSING TERMINAL...";
    firstLayerTerminalStatus.classList.remove("is-error");
    firstLayerTerminalStatus.classList.add("is-complete");
  }

  const closeTimer = window.setTimeout(() => {
    closeFirstLayerTerminal();
  }, 620);
  firstLayerTerminalTimers.push(closeTimer);
}

function runFirstLayerTerminalSequence() {
  if (!firstLayerTerminalForm || !firstLayerTerminalInput) {
    return;
  }

  firstLayerTerminalInput.disabled = true;
  const submitButton = firstLayerTerminalForm.querySelector("button");
  if (submitButton) {
    submitButton.disabled = true;
  }

  if (firstLayerTerminalStatus) {
    firstLayerTerminalStatus.textContent = "RUNNING DECRYPTION...";
    firstLayerTerminalStatus.classList.remove("is-error");
    firstLayerTerminalStatus.classList.add("is-complete");
  }

  const lines = [
    "SYNC OFFSET ACCEPTED: 18420 SECONDS.",
    "BOOTING LAYER-01 FRAGMENT DECRYPTOR...",
    "MOUNTING ECHO BUFFER // READ ONLY.",
    "SAMPLING SEALED ARTIFACT EDGES...",
    "REMOVING FALSE SILENCE FROM THE FIRST LAYER.",
    "REBUILDING FRAGMENT 07 FROM RESIDUAL PHASE.",
    "CHECKSUM STABILIZED: FRAGMENT 07 CAN BE OPENED.",
    "WRITING ACCESS FLAG: LAYER01.FRAGMENT07 = TRUE."
  ];

  lines.forEach((line, index) => {
    const timer = window.setTimeout(() => {
      appendFirstLayerTerminalLine(line);
    }, index * 560);
    firstLayerTerminalTimers.push(timer);
  });

  const completeTimer = window.setTimeout(completeFirstLayerTerminalRun, 5000);
  firstLayerTerminalTimers.push(completeTimer);
}

function handleFirstLayerTerminalSubmit(event) {
  event?.preventDefault();

  if (!firstLayerTerminalInput || readFirstLayerFragmentOneState()) {
    return;
  }

  const value = firstLayerTerminalInput.value.replace(/\D/g, "");

  if (value !== "18420") {
    if (firstLayerTerminalStatus) {
      firstLayerTerminalStatus.textContent = "OFFSET REJECTED. EXPECTED SECONDS.";
      firstLayerTerminalStatus.classList.remove("is-complete");
      firstLayerTerminalStatus.classList.add("is-error");
    }
    return;
  }

  runFirstLayerTerminalSequence();
}

function hideFirstLayerEcho() {
  document.body.classList.remove(
    "first-layer-echo-unlocked",
    "first-layer-echo-awakening",
    "first-layer-echo-transition"
  );
  firstLayerEchoSection?.classList.remove("is-revealed");
  firstLayerEchoSection?.setAttribute("aria-hidden", "true");
}

function revealFirstLayerEcho({ animate = true, scroll = true } = {}) {
  if (!firstLayerEchoSection) {
    return;
  }

  document.body.classList.add("first-layer-echo-unlocked");
  document.body.classList.toggle("first-layer-echo-awakening", animate);
  firstLayerEchoSection.classList.add("is-revealed");
  firstLayerEchoSection.setAttribute("aria-hidden", "false");
  loadDeferredImages(firstLayerEchoSection);
  applyFirstLayerFragmentOneState();

  if (animate) {
    window.setTimeout(() => {
      document.body.classList.remove("first-layer-echo-awakening");
    }, 1800);
  }

  if (scroll) {
    window.setTimeout(() => {
      firstLayerEchoSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, animate ? 260 : 60);
  }
}

function scheduleFirstLayerEchoRestore() {
  if (!readPlcDatabaseReplayState() || !readFirstLayerEchoState()) {
    hideFirstLayerEcho();
    return;
  }

  window.setTimeout(() => {
    if (!readPlcDatabaseReplayState() || !readFirstLayerEchoState()) {
      hideFirstLayerEcho();
      return;
    }

    revealFirstLayerEcho({
      animate: true,
      scroll: false
    });
  }, 2200);
}

function startFirstLayerEchoSequence() {
  const isFirstUnlock = !readFirstLayerEchoState();
  writeFirstLayerEchoState();
  updatePlcDatabaseProgress();
  closePlcDatabase();
  document.body.classList.add("first-layer-echo-unlocked", "first-layer-echo-transition");

  if (isFirstUnlock) {
    showPlcRestoreToast();
  }

  window.setTimeout(() => {
    finalSignalSection?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 80);

  window.setTimeout(() => {
    document.body.classList.remove("first-layer-echo-transition");
    revealFirstLayerEcho({
      animate: true,
      scroll: true
    });
  }, 1450);
}

function appendPlcDatabaseStartButton() {
  if (!plcDatabaseEntryContent) {
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "plc-db-start-button";
  button.textContent = "START";
  button.addEventListener("click", startFirstLayerEchoSequence);

  plcDatabaseEntryContent.appendChild(button);
}

function selectPlcDatabaseEntry(index = 0) {
  const activeCategory = getPlcDatabaseCategory();
  const entry = activeCategory.entries[index];

  if (!entry) {
    plcDatabaseActiveEntryIndex = 0;

    if (plcDatabaseEntryTitle) {
      plcDatabaseEntryTitle.textContent = activeCategory.title;
    }

    if (plcDatabaseEntryTime) {
      plcDatabaseEntryTime.textContent = "--";
    }

    if (plcDatabaseEntryKeeper) {
      plcDatabaseEntryKeeper.textContent = "等待追加";
    }

    if (plcDatabaseEntryLevel) {
      plcDatabaseEntryLevel.textContent = "--";
    }

    if (plcFolderTitle) {
      plcFolderTitle.textContent = activeCategory.label;
    }

    if (plcDatabaseEntryCount) {
      plcDatabaseEntryCount.textContent = "0/0";
    }

    applyPlcPlanHiddenLetter(activeCategory.key, null, 0);
    renderPlcDatabaseEntryContent("内容稍后添加。");
    updatePlcDatabaseProgress();
    return;
  }

  if (
    activeCategory.key === "secret" &&
    isPlcSecretFragmentFourEntry(entry) &&
    !readPlcSecretFragmentFourState()
  ) {
    const fallbackIndex = getPlcDatabaseEntryIndexByTitle("secret", plcSecretFragmentThreeTitle);
    selectPlcDatabaseEntry(fallbackIndex >= 0 ? fallbackIndex : 0);
    return;
  }

  plcDatabaseActiveEntryIndex = index;

  if (plcDatabaseEntryTitle) {
    plcDatabaseEntryTitle.textContent = entry.title;
  }

  if (plcDatabaseEntryTime) {
    plcDatabaseEntryTime.textContent = entry.collectedAt;
  }

  if (plcDatabaseEntryKeeper) {
    plcDatabaseEntryKeeper.textContent = entry.keeper;
  }

  if (plcDatabaseEntryLevel) {
    plcDatabaseEntryLevel.textContent = entry.level;
  }

  if (plcFolderTitle) {
    plcFolderTitle.textContent = activeCategory.label;
  }

  if (plcDatabaseEntryCount) {
    const visibleCount = getPlcDatabaseVisibleEntryCount(activeCategory, index);
    plcDatabaseEntryCount.textContent = visibleCount.current + "/" + visibleCount.total;
  }

  applyPlcPlanHiddenLetter(activeCategory.key, entry, index);

  if (shouldRenderPlcDatabaseVerification(activeCategory.key)) {
    renderPlcDatabaseVerification();

    if (isPlcDatabaseVerificationEntry(entry)) {
      markPlcDatabaseEntrySeen(index);
    } else {
      updatePlcDatabaseProgress();
    }

    renderPlcDatabaseEntryList();
    return;
  }

  renderPlcDatabaseEntryContent(entry.body);
  if (activeCategory.key === "secret" && isPlcSecretFragmentFourEntry(entry)) {
    appendPlcDatabaseStartButton();
  }
  markPlcDatabaseEntrySeen(index);
  if (activeCategory.key === "secret" && isPlcSecretFragmentThreeEntry(entry)) {
    preparePlcSecretSignalGate();
  }
  renderPlcDatabaseEntryList();
}

function showPlcDatabaseHome() {
  if (!plcDatabase) {
    return;
  }

  plcDatabase.classList.add("is-open");
  plcDatabase.setAttribute("aria-hidden", "false");
  plcDatabaseHome?.classList.add("is-active");
  plcDatabaseHome?.setAttribute("aria-hidden", "false");
  plcDatabaseDetail?.classList.remove("is-active");
  plcDatabaseDetail?.setAttribute("aria-hidden", "true");
  document.body.classList.add("modal-open", "plc-database-open");
  updatePlcDatabaseProgress();
}

function showPlcDatabaseDetail(categoryKey = "first") {
  if (!plcDatabase) {
    return;
  }

  plcDatabaseActiveCategoryKey = getPlcDatabaseCategory(categoryKey).key;
  plcDatabaseActiveEntryIndex = 0;
  plcDatabase.classList.add("is-open");
  plcDatabase.setAttribute("aria-hidden", "false");
  plcDatabaseHome?.classList.remove("is-active");
  plcDatabaseHome?.setAttribute("aria-hidden", "true");
  plcDatabaseDetail?.classList.add("is-active");
  plcDatabaseDetail?.setAttribute("data-category", plcDatabaseActiveCategoryKey);
  plcDatabaseDetail?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open", "plc-database-open");
  renderPlcDatabaseEntryList();
  selectPlcDatabaseEntry(plcDatabaseActiveEntryIndex);
}

function closePlcDatabase() {
  if (!plcDatabase || !plcDatabase.classList.contains("is-open")) {
    return;
  }

  plcDatabase.classList.remove("is-open");
  plcDatabase.setAttribute("aria-hidden", "true");
  plcDatabaseHome?.classList.remove("is-active");
  plcDatabaseDetail?.classList.remove("is-active");
  document.body.classList.remove("modal-open", "plc-database-open");
}

function enterPlcDatabaseAfterSimulation() {
  if (saturnSimulationLoader) {
    saturnSimulationLoader.classList.remove(
      "is-open",
      "is-booting",
      "is-reading",
      "is-near-complete",
      "is-success",
      "is-warning",
      "is-failed",
      "is-dimming"
    );
    saturnSimulationLoader.setAttribute("aria-hidden", "true");
  }

  document.body.classList.remove("modal-open", "simulation-loader-open", "plc-database-open");
  if (startSimulationButton) {
    startSimulationButton.disabled = false;
  }
  showPlcDatabaseHome();
}

function clearSaturnSimulationTimers() {
  saturnSimulationTimers.forEach((timer) => window.clearTimeout(timer));
  saturnSimulationTimers = [];
}

function clearMobileLandscapeNoticeTimers() {
  mobileLandscapeNoticeTimers.forEach((timer) => window.clearTimeout(timer));
  mobileLandscapeNoticeTimers = [];
}

function shouldShowMobileLandscapeNotice() {
  const hasTouchInput = navigator.maxTouchPoints > 0
    || window.matchMedia?.("(pointer: coarse)")?.matches;
  const mobileSizedScreen = window.matchMedia?.("(max-width: 900px)")?.matches
    || Math.min(window.innerWidth, window.innerHeight) <= 640;

  return Boolean(hasTouchInput && mobileSizedScreen);
}

function closeMobileLandscapeNotice() {
  clearMobileLandscapeNoticeTimers();
  mobileLandscapeNotice?.classList.remove("is-open");
  mobileLandscapeNotice?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open", "landscape-notice-open");
}

function showMobileLandscapeNotice(onComplete) {
  if (!mobileLandscapeNotice) {
    onComplete();
    return;
  }

  clearMobileLandscapeNoticeTimers();
  closeFragmentFiveRift();
  closePlcDatabase();

  let remainingSeconds = 5;
  if (mobileLandscapeCountdown) {
    mobileLandscapeCountdown.textContent = String(remainingSeconds);
  }

  mobileLandscapeNotice.classList.add("is-open");
  mobileLandscapeNotice.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open", "landscape-notice-open");

  if (startSimulationButton) {
    startSimulationButton.disabled = true;
  }

  const tickTimer = window.setInterval(() => {
    remainingSeconds -= 1;
    if (mobileLandscapeCountdown) {
      mobileLandscapeCountdown.textContent = String(Math.max(remainingSeconds, 0));
    }
  }, 1000);
  mobileLandscapeNoticeTimers.push(tickTimer);

  const finishTimer = window.setTimeout(() => {
    closeMobileLandscapeNotice();
    onComplete();
  }, 5000);
  mobileLandscapeNoticeTimers.push(finishTimer);
}

function handleStartSimulationButtonClick(event) {
  event?.preventDefault();

  if (!shouldShowMobileLandscapeNotice()) {
    startSaturnSimulationLoader(event);
    return;
  }

  showMobileLandscapeNotice(() => {
    startSaturnSimulationLoader();
  });
}

function setSaturnSimulationStage(stage) {
  if (!saturnSimulationLoader) {
    return;
  }

  saturnSimulationLoader.classList.remove(
    "is-booting",
    "is-reading",
    "is-near-complete",
    "is-success",
    "is-warning",
    "is-failed",
    "is-dimming"
  );
  saturnSimulationLoader.classList.add(stage.className);

  if (saturnLoaderStatus) {
    saturnLoaderStatus.textContent = stage.status;
  }

  if (saturnLoaderCode) {
    saturnLoaderCode.textContent = stage.code || "";
  }

  if (saturnLoaderProgress) {
    saturnLoaderProgress.style.setProperty("--simulation-progress", stage.progress + "%");
  }
}

function startSaturnSimulationLoader(event, { forceFull = false } = {}) {
  event?.preventDefault();

  if (!forceFull && readPlcDatabaseFullLoaderCache()) {
    startDatabaseQuickLoader(event);
    return;
  }

  if (!saturnSimulationLoader) {
    return;
  }

  clearSaturnSimulationTimers();
  closeFragmentFiveRift();
  closePlcDatabase();

  saturnSimulationLoader.classList.remove(
    "is-booting",
    "is-reading",
    "is-near-complete",
    "is-success",
    "is-warning",
    "is-failed",
    "is-dimming"
  );
  saturnSimulationLoader.classList.add("is-open");
  saturnSimulationLoader.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open", "simulation-loader-open");

  if (startSimulationButton) {
    startSimulationButton.disabled = true;
  }

  const stages = [
    {
      delay: 0,
      className: "is-booting",
      status: "正在加载PLC终端档案库...",
      code: "",
      progress: 0
    },
    {
      delay: 4300,
      className: "is-reading",
      status: "正在读取文件目录...",
      code: "//18%",
      progress: 18
    },
    {
      delay: 6900,
      className: "is-reading",
      status: "正在读取文件目录...",
      code: "//75%",
      progress: 78
    },
    {
      delay: 9300,
      className: "is-near-complete",
      status: "正在读取文件目录...",
      code: "//94%",
      progress: 94
    },
    {
      delay: 11100,
      className: "is-failed",
      status: "正在还原文件目录...",
      code: "//E0019 - 部分文件还原失败，即将进入档案库",
      progress: 100
    }
  ];

  stages.forEach((stage) => {
    const timer = window.setTimeout(() => {
      setSaturnSimulationStage(stage);
    }, stage.delay);
    saturnSimulationTimers.push(timer);
  });

  const dimTimer = window.setTimeout(() => {
    saturnSimulationLoader.classList.add("is-dimming");
  }, 12400);
  saturnSimulationTimers.push(dimTimer);

  const databaseTimer = window.setTimeout(() => {
    writePlcDatabaseFullLoaderCache();
    enterPlcDatabaseAfterSimulation();
  }, 14050);
  saturnSimulationTimers.push(databaseTimer);
}

function startDatabaseQuickLoader(event) {
  event?.preventDefault();

  if (!saturnSimulationLoader) {
    showPlcDatabaseHome();
    return;
  }

  clearSaturnSimulationTimers();
  closeFragmentFiveRift();
  closePlcDatabase();

  saturnSimulationLoader.classList.remove(
    "is-booting",
    "is-reading",
    "is-near-complete",
    "is-success",
    "is-warning",
    "is-failed",
    "is-dimming"
  );
  saturnSimulationLoader.classList.add("is-open");
  saturnSimulationLoader.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open", "simulation-loader-open");

  const stages = [
    {
      delay: 0,
      className: "is-booting",
      status: "正在访问资料库索引...",
      code: "",
      progress: 0
    },
    {
      delay: 520,
      className: "is-reading",
      status: "正在读取已恢复目录...",
      code: "//42%",
      progress: 42
    },
    {
      delay: 1120,
      className: "is-near-complete",
      status: "正在同步档案缓存...",
      code: "//88%",
      progress: 88
    },
    {
      delay: 1840,
      className: "is-warning",
      status: "仍有部分数据未被还原。",
      code: "//W0040 - 部分文件等待解析",
      progress: 100
    }
  ];

  stages.forEach((stage) => {
    const timer = window.setTimeout(() => {
      setSaturnSimulationStage(stage);
    }, stage.delay);
    saturnSimulationTimers.push(timer);
  });

  const dimTimer = window.setTimeout(() => {
    saturnSimulationLoader.classList.add("is-dimming");
  }, 2550);
  saturnSimulationTimers.push(dimTimer);

  const databaseTimer = window.setTimeout(() => {
    enterPlcDatabaseAfterSimulation();
  }, 3180);
  saturnSimulationTimers.push(databaseTimer);
}

function startPlcDatabaseReplayToggle(event) {
  event?.preventDefault();
  const nextReplayState = !readPlcDatabaseReplayState();
  startPlcDatabaseReplayLoader(nextReplayState);
}

function startPlcDatabaseReplayLoader(enableReplay) {
  if (!saturnSimulationLoader) {
    writePlcDatabaseReplayState(enableReplay);
    applyPlcDatabaseReplayState(enableReplay);
    showPlcDatabaseHome();
    return;
  }

  clearSaturnSimulationTimers();
  closeFragmentFiveRift();
  closePlcDatabase();

  if (plcDatabaseReplayButton) {
    plcDatabaseReplayButton.disabled = true;
  }

  saturnSimulationLoader.classList.remove(
    "is-booting",
    "is-reading",
    "is-near-complete",
    "is-success",
    "is-warning",
    "is-failed",
    "is-dimming"
  );
  saturnSimulationLoader.classList.add("is-open");
  saturnSimulationLoader.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open", "simulation-loader-open");

  const stages = enableReplay
    ? [
      {
        delay: 0,
        className: "is-booting",
        status: "正在重演模拟记录...",
        code: "",
        progress: 0
      },
      {
        delay: 4400,
        className: "is-reading",
        status: "正在读取深层档案索引...",
        code: "//18%",
        progress: 18
      },
      {
        delay: 7800,
        className: "is-reading",
        status: "正在展开隐秘目录...",
        code: "//52%",
        progress: 52
      },
      {
        delay: 11300,
        className: "is-near-complete",
        status: "正在校验隐藏分类...",
        code: "//86%",
        progress: 86
      },
      {
        delay: 14500,
        className: "is-near-complete",
        status: "正在写入分类权限...",
        code: "//96%",
        progress: 96
      },
      {
        delay: 16200,
        className: "is-success",
        status: "隐秘分类已解锁",
        code: "//S0007 - HIDDEN CATEGORY UNLOCKED",
        progress: 100
      }
    ]
    : [
      {
        delay: 0,
        className: "is-booting",
        status: "正在关闭重演索引...",
        code: "",
        progress: 0
      },
      {
        delay: 620,
        className: "is-reading",
        status: "正在收回隐秘目录...",
        code: "//48%",
        progress: 48
      },
      {
        delay: 1420,
        className: "is-near-complete",
        status: "正在同步资料库主页...",
        code: "//88%",
        progress: 88
      },
      {
        delay: 2260,
        className: "is-reading",
        status: "隐秘分类已隐藏。",
        code: "//OFF",
        progress: 100
      }
    ];

  stages.forEach((stage) => {
    const timer = window.setTimeout(() => {
      setSaturnSimulationStage(stage);
    }, stage.delay);
    saturnSimulationTimers.push(timer);
  });

  const dimDelay = enableReplay ? 17400 : 2860;
  const enterDelay = enableReplay ? 18400 : 3500;

  const dimTimer = window.setTimeout(() => {
    saturnSimulationLoader.classList.add("is-dimming");
  }, dimDelay);
  saturnSimulationTimers.push(dimTimer);

  const databaseTimer = window.setTimeout(() => {
    writePlcDatabaseReplayState(enableReplay);
    applyPlcDatabaseReplayState(enableReplay);

    if (plcDatabaseReplayButton) {
      plcDatabaseReplayButton.disabled = false;
    }

    enterPlcDatabaseAfterSimulation();
  }, enterDelay);
  saturnSimulationTimers.push(databaseTimer);
}

async function loadTips() {
  if (!tipsRoller) {
    return;
  }

  if (tips.length > 1) {
    tipIndex = Math.floor(Math.random() * tips.length);
    setTip(tips[tipIndex]);
  }

  try {
    const response = await fetch("./assets/tips.yaml", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Tips request failed");
    }

    const parsedTips = parseTipsYaml(await response.text());

    if (parsedTips.length > 0) {
      tips = parsedTips;
      tipIndex = Math.floor(Math.random() * tips.length);
      setTip(tips[tipIndex]);
    }
  } catch (error) {
    if (tips.length <= 1) {
      setTip(tips[0]);
    }
  }
}

if (openTracksButton) {
  openTracksButton.addEventListener("click", openTracksModal);
}

if (openSignalRiftButton) {
  openSignalRiftButton.addEventListener("click", openSignalRift);
}

if (openRetryPuzzleButton) {
  openRetryPuzzleButton.addEventListener("click", openRetryPuzzle);
}

if (openQualifierRankingButton) {
  openQualifierRankingButton.addEventListener("click", openQualifierRankingRift);
}

fragmentFiveEntryTargets.forEach((target) => {
  target.addEventListener("click", openFragmentFiveRift);
  target.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      openFragmentFiveRift(event);
    }
  });
});

fragmentHitboxTargets.forEach((target) => {
  target.addEventListener("click", openFragmentFromHitbox);
  target.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      openFragmentFromHitbox(event);
    }
  });
});

if (fragmentFiveAnswerForm) {
  fragmentFiveAnswerForm.addEventListener("submit", handleFragmentFiveAnswerSubmit);
}

if (fragmentFiveAnswerSubmit) {
  fragmentFiveAnswerSubmit.addEventListener("click", handleFragmentFiveAnswerSubmit);
}

if (fragmentFiveAnswerInput) {
  fragmentFiveAnswerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleFragmentFiveAnswerSubmit(event);
    }
  });
}

if (startSimulationButton) {
  startSimulationButton.addEventListener("click", handleStartSimulationButtonClick);
}

if (quickDatabaseButton) {
  quickDatabaseButton.addEventListener("click", startDatabaseQuickLoader);
}

if (firstLayerOffsetButton) {
  firstLayerOffsetButton.addEventListener("click", openFirstLayerTerminal);
}

if (openFragmentSevenRiftButton) {
  openFragmentSevenRiftButton.addEventListener("click", openFragmentSevenRift);
}

if (fragmentSevenAnswerForm) {
  fragmentSevenAnswerForm.addEventListener("submit", handleFragmentSevenAnswerSubmit);
}

if (fragmentSevenAnswerSubmit) {
  fragmentSevenAnswerSubmit.addEventListener("click", handleFragmentSevenAnswerSubmit);
}

if (fragmentSevenAnswerInput) {
  fragmentSevenAnswerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleFragmentSevenAnswerSubmit(event);
    }
  });
}

if (firstLayerTerminalForm) {
  firstLayerTerminalForm.addEventListener("submit", handleFirstLayerTerminalSubmit);
}

firstLayerTerminalCloseTargets.forEach((target) => {
  target.addEventListener("click", closeFirstLayerTerminal);
});

fragmentSevenRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeFragmentSevenRift);
});

if (plcDatabaseReplayButton) {
  plcDatabaseReplayButton.addEventListener("click", startPlcDatabaseReplayToggle);
}

if (plcOpenFirstCategory) {
  plcOpenFirstCategory.addEventListener("click", () => {
    showPlcDatabaseDetail("first");
  });
}

if (plcOpenSecondCategory) {
  plcOpenSecondCategory.addEventListener("click", () => {
    showPlcDatabaseDetail("second");
  });
}

if (plcOpenSecretCategory) {
  plcOpenSecretCategory.addEventListener("click", () => {
    showPlcDatabaseDetail("secret");
  });
}

if (plcDatabaseBack) {
  plcDatabaseBack.addEventListener("click", showPlcDatabaseHome);
}

plcDatabaseCloseTargets.forEach((target) => {
  target.addEventListener("click", closePlcDatabase);
});

if (qualifierRankingForm) {
  qualifierRankingForm.addEventListener("submit", handleQualifierRankingSubmit);
  qualifierRankingForm.addEventListener("input", writeQualifierRankingDraft);
  qualifierRankingForm.addEventListener("change", writeQualifierRankingDraft);
  getQualifierDraftInputs().forEach((input) => {
    input.addEventListener("input", writeQualifierRankingDraft);
    input.addEventListener("change", writeQualifierRankingDraft);
  });
  window.addEventListener("pagehide", writeQualifierRankingDraft);
  window.addEventListener("beforeunload", writeQualifierRankingDraft);
}

if (bootSequenceButton) {
  bootSequenceButton.addEventListener("click", startBootSequence);
}

if (openPhasePlateButton) {
  openPhasePlateButton.addEventListener("click", openPhasePlateRift);
}

openSettlementPlateButtons.forEach((button) => {
  button.addEventListener("click", openSettlementRift);
});

openPalacePlateButtons.forEach((button) => {
  button.addEventListener("click", openPalaceRift);
});

openReleaseRiftButtons.forEach((button) => {
  button.addEventListener("click", openReleaseRift);
});

retryPulseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleRetryPulseInput(button);
  });
});

artistPulseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleArtistPulseInput(button);
  });
});

if (openFragmentRiftButton) {
  openFragmentRiftButton.addEventListener("click", openFragmentRift);
}

if (openFragmentTwoRiftButton) {
  openFragmentTwoRiftButton.addEventListener("click", openFragmentTwoRift);
}

if (openFragmentThreeRiftButton) {
  openFragmentThreeRiftButton.addEventListener("click", openFragmentThreeRift);
}

if (openFragmentFourRiftButton) {
  openFragmentFourRiftButton.addEventListener("click", openFragmentFourRift);
}

if (palaceGateForm) {
  palaceGateForm.addEventListener("submit", handlePalaceGateSubmit);
}

if (palaceGateSubmit) {
  palaceGateSubmit.addEventListener("click", handlePalaceGateSubmit);
}

if (palaceGateInput) {
  palaceGateInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handlePalaceGateSubmit(event);
    }
  });
}

if (multisourceGateForm) {
  multisourceGateForm.addEventListener("submit", handleMultisourceGateSubmit);
}

if (multisourceGateSubmit) {
  multisourceGateSubmit.addEventListener("click", handleMultisourceGateSubmit);
}

if (multisourceGateInput) {
  multisourceGateInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleMultisourceGateSubmit(event);
    }
  });
}

if (playMultisourceAudioButton) {
  playMultisourceAudioButton.addEventListener("click", playMultisourceAudio);
}

if (fragmentAnswerForm) {
  fragmentAnswerForm.addEventListener("submit", handleFragmentAnswerSubmit);
}

if (fragmentAnswerSubmit) {
  fragmentAnswerSubmit.addEventListener("click", handleFragmentAnswerSubmit);
}

if (fragmentAnswerInput) {
  fragmentAnswerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleFragmentAnswerSubmit(event);
    }
  });
}

if (fragmentTwoAnswerForm) {
  fragmentTwoAnswerForm.addEventListener("submit", handleFragmentTwoAnswerSubmit);
}

if (fragmentTwoAnswerSubmit) {
  fragmentTwoAnswerSubmit.addEventListener("click", handleFragmentTwoAnswerSubmit);
}

if (fragmentTwoAnswerInput) {
  fragmentTwoAnswerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleFragmentTwoAnswerSubmit(event);
    }
  });
}

if (fragmentThreeAnswerForm) {
  fragmentThreeAnswerForm.addEventListener("submit", handleFragmentThreeAnswerSubmit);
}

if (fragmentThreeAnswerSubmit) {
  fragmentThreeAnswerSubmit.addEventListener("click", handleFragmentThreeAnswerSubmit);
}

if (fragmentThreeAnswerInput) {
  fragmentThreeAnswerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleFragmentThreeAnswerSubmit(event);
    }
  });
}

if (fragmentFourAnswerForm) {
  fragmentFourAnswerForm.addEventListener("submit", handleFragmentFourAnswerSubmit);
}

if (fragmentFourAnswerSubmit) {
  fragmentFourAnswerSubmit.addEventListener("click", handleFragmentFourAnswerSubmit);
}

if (fragmentFourAnswerInput) {
  fragmentFourAnswerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleFragmentFourAnswerSubmit(event);
    }
  });
}

if (noteGateForm) {
  noteGateForm.addEventListener("submit", handleNoteGateSubmit);
}

if (noteGateSubmit) {
  noteGateSubmit.addEventListener("click", handleNoteGateSubmit);
}

if (noteGateInput) {
  noteGateInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleNoteGateSubmit(event);
    }
  });
}

signalGateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleSignalGateInput(button);
  });
});

if (resetSignalGateButton) {
  resetSignalGateButton.addEventListener("click", () => {
    if (signalGateStatus) {
      signalGateStatus.classList.remove("is-complete");
    }
    resetSignalGate();
  });
}

modalCloseTargets.forEach((target) => {
  target.addEventListener("click", closeTracksModal);
});

signalRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeSignalRift);
});

fragmentRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeFragmentRift);
});

fragmentTwoRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeFragmentTwoRift);
});

fragmentThreeRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeFragmentThreeRift);
});

fragmentFourRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeFragmentFourRift);
});

phasePlateCloseTargets.forEach((target) => {
  target.addEventListener("click", closePhasePlateRift);
});

settlementRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeSettlementRift);
});

palaceRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closePalaceRift);
});

releaseRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeReleaseRift);
});

dateRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeDateRift);
});

finalDateRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeFinalDateRift);
});

qualifierRankingCloseTargets.forEach((target) => {
  target.addEventListener("click", closeQualifierRankingRift);
});

fragmentFiveRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeFragmentFiveRift);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (fragmentSevenDialogueStage?.classList.contains("is-active")) {
      finishFragmentSevenIntro();
      return;
    }

    closeFragmentSevenRift();
    closeFirstLayerTerminal();
    closePlcDatabase();
    closeFragmentFiveRift();
    closeQualifierRankingRift();
    closeFinalDateRift();
    closeDateRift();
    closeReleaseRift();
    closePalaceRift();
    closeSettlementRift();
    closePhasePlateRift();
    closeFragmentFourRift();
    closeFragmentThreeRift();
    closeFragmentTwoRift();
    closeFragmentRift();
    closeSignalRift();
    closeTracksModal();
  }
});

updateSelectionCountdown();
setInterval(updateSelectionCountdown, 1000 * 60);

if (readSignalGateCache()) {
  completeSignalGate({
    fromCache: true
  });
} else {
  updateSignalGateProgress();
}

if (readFragmentAnswerCache()) {
  revealFragmentAnswer({
    fromCache: true
  });
}

if (readArtistGateCache()) {
  revealShardTwo({
    fromCache: true
  });
}

if (readFragmentTwoAnswerCache()) {
  revealFragmentTwoAnswer({
    fromCache: true
  });
}

if (readPalaceGateCache()) {
  revealMultisourceGate({
    fromCache: true
  });
}

if (readMultisourceGateCache()) {
  revealShardThree({
    fromCache: true
  });
}

if (readFragmentThreeAnswerCache()) {
  revealFragmentThreeAnswer({
    fromCache: true
  });
}

if (readNoteGateCache()) {
  revealNoteGateSolved({
    fromCache: true
  });
}

if (readFragmentFourAnswerCache()) {
  revealFragmentFourAnswer({
    fromCache: true
  });
}

if (readFinalOffsetCache()) {
  restoreFinalOffsetProgress();
} else if (readFinalBootDialogueCache()) {
  enterReverseReplayMode();
}

restoreQualifierRankingDraft();
updatePlcDatabaseProgress();
applyPlcDatabaseReplayState(readPlcDatabaseReplayState(), {
  restoreFirstLayer: false
});
if (!lockPlcSecretSignalGateSelection({ fromCache: true })) {
  preparePlcSecretSignalGate();
}

scheduleFirstLayerEchoRestore();

runWhenIdle(loadTips);
setInterval(showNextTip, 5000);

observeRankingPreview();
