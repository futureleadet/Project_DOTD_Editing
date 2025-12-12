import React, { useState, useEffect } from 'react';

// 페르소나별 데이터
const PERSONAS = {
  beginner: {
    id: 'beginner',
    name: '패션 초보자',
    emoji: '👶',
    tagline: '"뭘 입어야 덜 어색해 보일까?"',
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    description: '기본템으로 실패 없는 스타일링',
    situations: [
      { id: 'work', label: '출근/회의', icon: '💼' },
      { id: 'casual', label: '일상/캐주얼', icon: '☕' },
      { id: 'date', label: '소개팅/약속', icon: '💕' },
      { id: 'interview', label: '면접', icon: '📋' },
      { id: 'wedding', label: '결혼식 하객', icon: '💒' },
      { id: 'family', label: '가족모임', icon: '👨‍👩‍👧' },
    ],
    bodyTypes: [
      { id: 'slim', label: '마른 체형' },
      { id: 'standard', label: '보통 체형' },
      { id: 'muscular', label: '근육질' },
      { id: 'curvy', label: '통통한 체형' },
    ],
    concerns: [
      { id: 'shoulder', label: '어깨가 좁아요' },
      { id: 'belly', label: '뱃살 커버' },
      { id: 'legs', label: '다리가 짧아 보여요' },
      { id: 'basic', label: '기본템 조합을 모르겠어요' },
      { id: 'color', label: '색 매칭이 어려워요' },
    ],
    styleGoal: '깔끔하고 무난하게',
    promptStyle: 'warm, approachable, lifestyle'
  },
  ootd: {
    id: 'ootd',
    name: 'OOTD 중심',
    emoji: '👔',
    tagline: '"오늘은 어떤 무드로 보이고 싶을까?"',
    color: '#FF6B9D',
    gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C44FE2 100%)',
    description: '매일 다른 스타일, 인스타 감성',
    situations: [
      { id: 'cafe', label: '카페/브런치', icon: '🥐' },
      { id: 'street', label: '거리/스트릿', icon: '🚶' },
      { id: 'office', label: '출근룩', icon: '🏢' },
      { id: 'date', label: '데이트', icon: '💗' },
      { id: 'travel', label: '여행', icon: '✈️' },
      { id: 'party', label: '파티/모임', icon: '🎉' },
    ],
    moods: [
      { id: 'minimal', label: '미니멀', emoji: '⬜' },
      { id: 'casual', label: '캐주얼', emoji: '😎' },
      { id: 'elegant', label: '우아한', emoji: '✨' },
      { id: 'street', label: '스트릿', emoji: '🛹' },
      { id: 'romantic', label: '로맨틱', emoji: '🌸' },
      { id: 'chic', label: '시크', emoji: '🖤' },
    ],
    colorVibes: [
      { id: 'warm', label: '웜톤', color: '#E8985E' },
      { id: 'cool', label: '쿨톤', color: '#7B9ED9' },
      { id: 'neutral', label: '뉴트럴', color: '#C4B8A5' },
      { id: 'bold', label: '비비드', color: '#FF4757' },
      { id: 'pastel', label: '파스텔', color: '#DDA0DD' },
      { id: 'mono', label: '모노톤', color: '#4A4A4A' },
    ],
    styleGoal: '트렌디하고 인스타그래머블',
    promptStyle: 'stylish, instagram-worthy, trendy'
  },
  trendsetter: {
    id: 'trendsetter',
    name: '트렌드세터',
    emoji: '💎',
    tagline: '"트렌드를 따르지 않고, 만든다"',
    color: '#1a1a1a',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #434343 100%)',
    description: '하이패션, 에디토리얼 무드',
    situations: [
      { id: 'editorial', label: '에디토리얼', icon: '📸' },
      { id: 'runway', label: '런웨이 무드', icon: '👠' },
      { id: 'gallery', label: '갤러리/전시', icon: '🖼️' },
      { id: 'rooftop', label: '루프탑/야경', icon: '🌃' },
      { id: 'street', label: '하이 스트릿', icon: '🏙️' },
      { id: 'concept', label: '컨셉추얼', icon: '🎭' },
    ],
    trendKeywords: [
      { id: 'oversize', label: '오버사이즈' },
      { id: 'layering', label: '레이어링' },
      { id: 'quietlux', label: '조용한 럭셔리' },
      { id: 'avantgarde', label: '아방가르드' },
      { id: 'deconstructed', label: '해체주의' },
      { id: 'retrofuture', label: '레트로퓨처' },
    ],
    editorialMoods: [
      { id: 'vogue', label: 'Vogue', desc: '클래식 에디토리얼' },
      { id: 'id', label: 'i-D', desc: '실험적/아방가르드' },
      { id: 'wmagazine', label: 'W', desc: '드라마틱/아트' },
      { id: 'dazed', label: 'Dazed', desc: '서브컬처/엣지' },
    ],
    styleGoal: '패션 포워드, 경계를 넘는',
    promptStyle: 'high-fashion, editorial, dramatic'
  }
};

// 날씨 옵션
const WEATHER_OPTIONS = [
  { id: 'sunny', label: '맑음', icon: '☀️', temp: '따뜻함' },
  { id: 'cloudy', label: '흐림', icon: '☁️', temp: '선선함' },
  { id: 'rainy', label: '비', icon: '🌧️', temp: '습함' },
  { id: 'cold', label: '추움', icon: '❄️', temp: '쌀쌀함' },
  { id: 'hot', label: '더움', icon: '🔥', temp: '더움' },
];

// 생성 타입
const OUTPUT_TYPES = [
  { id: 'images', label: '이미지 3장', icon: '🖼️', desc: '다양한 앵글의 착장 이미지' },
  { id: 'video', label: '8초 영상', icon: '🎬', desc: '다이나믹한 OOTD 영상' },
  { id: 'both', label: '이미지 + 영상', icon: '✨', desc: '풀 패키지' },
];

// 메인 컴포넌트
export default function DOTDPromptGenerator() {
  const [step, setStep] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [userInputs, setUserInputs] = useState({
    situation: null,
    mood: null,
    weather: null,
    bodyType: null,
    concerns: [],
    colorVibe: null,
    trendKeyword: null,
    editorialMood: null,
    freeText: '',
    outputType: 'both',
  });
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 스텝 정의
  const getSteps = () => {
    if (!selectedPersona) return ['페르소나 선택'];
    
    const baseSteps = ['페르소나 선택', '상황 선택', '날씨'];
    
    if (selectedPersona.id === 'beginner') {
      return [...baseSteps, '체형 & 고민', '출력 타입', '프롬프트 생성'];
    } else if (selectedPersona.id === 'ootd') {
      return [...baseSteps, '무드 & 컬러', '출력 타입', '프롬프트 생성'];
    } else {
      return [...baseSteps, '트렌드 키워드', '에디토리얼 무드', '출력 타입', '프롬프트 생성'];
    }
  };

  const steps = getSteps();

  // 프롬프트 생성 로직
  const generatePrompt = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const prompt = buildPrompt();
      setGeneratedPrompt(prompt);
      setIsGenerating(false);
    }, 1500);
  };

  const buildPrompt = () => {
    const persona = selectedPersona;
    const { situation, mood, weather, bodyType, concerns, colorVibe, trendKeyword, editorialMood, freeText } = userInputs;
    
    // 상황 라벨 찾기
    const situationLabel = persona.situations?.find(s => s.id === situation)?.label || '';
    const weatherLabel = WEATHER_OPTIONS.find(w => w.id === weather)?.label || '';
    
    if (persona.id === 'beginner') {
      return {
        korean: {
          image: `[유저_얼굴_이미지] ${situationLabel} 상황에 어울리는 깔끔한 기본 코디를 입은 한국 [남성/여성], ${bodyType === 'slim' ? '마른 체형을 보완하는' : bodyType === 'curvy' ? '체형을 자연스럽게 커버하는' : '균형잡힌'} 실루엣의 의상, ${weatherLabel} 날씨에 맞는 레이어링, 자연스럽고 편안한 자세로 서있는, 친근한 미소의 부드러운 표정, 눈높이 전신샷, ${situationLabel === '출근/회의' ? '모던 오피스 로비' : situationLabel === '소개팅/약속' ? '밝은 카페 인테리어' : '깔끔한 도시 거리'} 배경, 부드러운 자연광, 웜 뉴트럴 컬러 팔레트, 얕은 심도 f/2.8, 프로페셔널 라이프스타일 사진, 8K 해상도, 단정하면서도 편안해 보이는 의상${freeText ? `, 추가 요청: ${freeText}` : ''}`,
          video: `패션 입문자를 위한 8초 OOTD 영상, ${situationLabel} 상황에 맞는 실패 없는 기본 코디를 입은 한국 [남성/여성],

[0-2초] 오프닝: 미디엄샷으로 시작, ${situationLabel === '출근/회의' ? '밝은 오피스 로비' : '깔끔한 카페 앞'}에 자연스럽게 서있는 피사체, 카메라 살짝 옆 보다가 눈 맞추며 부드러운 미소, 부드러운 아침 빛

[2-5초] 움직임: 편안하고 자신감 있는 걸음으로 카메라 향해 자연스럽게 걷기, 의상 디테일 보이며 피스들이 어떻게 조화되는지 보여주기, ${weatherLabel === '추움' ? '코트 자연스럽게 여밈' : '미묘한 재킷 움직임'}, 한 손은 캐주얼하게 가방끈 조정하거나 커피컵 들기

[5-7초] 멈춤 & 디테일: 무게 이동하며 잠시 멈춤, 카메라 부드럽게 전환하며 의상 조합 하이라이트, 자연스러운 제스처(옷깃 정리, 시계 확인), 조용한 자신감 보여주는 표정

[7-8초] 클로징: 살짝 돌아 의상 측면 프로필 보여주기, 진심 어린 따뜻한 미소

스타일: 라이프스타일 다큐 느낌, 따뜻하고 초대하는 컬러 그레이딩, 메시지: "기본템으로도 이렇게 깔끔하게"${freeText ? `\n추가 요청: ${freeText}` : ''}`
        },
        english: {
          image: `[USER_FACE_IMAGE] Korean [man/woman] wearing clean basic outfit suitable for ${situationLabel}, ${bodyType === 'slim' ? 'silhouette that complements slim frame' : bodyType === 'curvy' ? 'silhouette that naturally flatters curves' : 'balanced silhouette'}, layering appropriate for ${weatherLabel} weather, standing naturally with relaxed confident posture, soft genuine smile with approachable expression, eye-level full body shot, ${situationLabel === '출근/회의' ? 'modern office lobby' : situationLabel === '소개팅/약속' ? 'bright cafe interior' : 'clean urban street'} background, soft natural daylight, warm neutral color palette, shallow depth of field f/2.8, professional lifestyle photography, 8K resolution${freeText ? `, additional request: ${freeText}` : ''}`,
          video: `8-second fashion OOTD video for fashion beginner, Korean [man/woman] wearing fail-proof basic outfit for ${situationLabel},

[0-2s] OPENING: Medium shot start, subject standing naturally in ${situationLabel === '출근/회의' ? 'bright office lobby' : 'clean cafe front'}, gentle smile looking slightly off-camera then eye contact, soft morning light

[2-5s] MOVEMENT: Natural walking toward camera with relaxed confident stride, showing outfit details and how pieces work together, ${weatherLabel === '추움' ? 'naturally closing coat' : 'subtle jacket movement'}, one hand casually adjusting bag strap or holding coffee

[5-7s] PAUSE & DETAIL: Weight shift pause, camera smoothly transitions to highlight outfit combination, natural gesture (fixing collar, checking watch), expression showing quiet confidence

[7-8s] CLOSING: Slight turn showing side profile, genuine warm smile

STYLE: Lifestyle documentary feel, warm inviting color grade, message: "Basic items, perfectly put together"${freeText ? `\nAdditional request: ${freeText}` : ''}`
        }
      };
    } else if (persona.id === 'ootd') {
      const moodLabel = persona.moods?.find(m => m.id === mood)?.label || '';
      const colorLabel = persona.colorVibes?.find(c => c.id === colorVibe)?.label || '';
      
      return {
        korean: {
          image: `[유저_얼굴_이미지] ${moodLabel} 무드의 ${situationLabel} 코디를 입은 한국 [남성/여성], ${colorLabel} 컬러 팔레트의 트렌디한 스타일링, 인스타그램 감성 OOTD 전신샷, 미묘한 S커브와 자신감 있는 포즈, 고개 살짝 기울인 쿨한 표정, ${situationLabel === '카페/브런치' ? '성수동 감성 카페 앞 벽돌벽' : situationLabel === '거리/스트릿' ? '가로수길' : '트렌디한 도시 배경'}, ${weatherLabel} 날씨 분위기, 골든아워 따뜻한 조명으로 머리카락에 림라이트, 85mm f/1.4 크리미한 보케, 하이패션과 스트릿 스타일의 만남, 소셜미디어 업로드 준비 완료, 8K 에디토리얼 퀄리티${freeText ? `, 추가 요청: ${freeText}` : ''}`,
          video: `스타일 의식 있는 유저를 위한 8초 트렌디 OOTD 영상, ${moodLabel} 무드의 ${situationLabel} 코디를 입은 한국 [남성/여성],

[0-2초] 훅 오프닝: 핵심 의상 피스(신발/가방/액세서리) 클로즈업으로 시작, 카메라 뒤로 빠지며 전체 의상 드러내기, 아는 미소로 카메라 향해 돌기, ${situationLabel === '카페/브런치' ? '성수동 감성 카페' : '가로수길'} 배경

[2-4초] 시그니처 워킹: 카메라 향해 자신감 있고 스타일리시한 워킹, 런웨이 영감이지만 자연스러운, 걸음마다 아름답게 흐르는 의상, "내가 멋있는 거 알아" 표정, 골든아워 역광

[4-6초] 포즈 모먼트: 시그니처 포즈 - 머리 넘기기/선글라스 조정/감성 벽에 기대기, 카메라 살짝 돌며 다이나믹 앵글

[6-8초] 머니샷: 카메라 직접 아이컨택, 살짝 씩 웃음, 천천히 돌리인하여 미디엄 클로즈업

스타일: 인스타 릴스/틱톡 준비 완료, ${colorLabel} 컬러 그레이딩, 메시지: "오늘의 나, 완벽한 ${moodLabel} 무드"${freeText ? `\n추가 요청: ${freeText}` : ''}`
        },
        english: {
          image: `[USER_FACE_IMAGE] Korean [man/woman] wearing ${moodLabel} mood ${situationLabel} outfit, trendy styling in ${colorLabel} color palette, instagram-worthy OOTD full body shot, confident stylish pose with subtle S-curve, head slightly tilted with effortlessly cool expression, ${situationLabel === '카페/브런치' ? 'Seongsu-dong cafe brick wall' : situationLabel === '거리/스트릿' ? 'Garosugil' : 'trendy urban'} background, ${weatherLabel} weather atmosphere, golden hour warm lighting creating rim light on hair, 85mm f/1.4 creamy bokeh, high fashion meets street style, social media ready, 8K editorial quality${freeText ? `, additional request: ${freeText}` : ''}`,
          video: `8-second trendy OOTD video for style-conscious user, Korean [man/woman] wearing ${moodLabel} mood ${situationLabel} outfit,

[0-2s] HOOK OPENING: Close-up on key outfit piece start, camera pulls back revealing full outfit, turning to camera with knowing smile, ${situationLabel === '카페/브런치' ? 'Seongsu cafe' : 'Garosugil'} background

[2-4s] SIGNATURE WALK: Confident stylish walk toward camera, runway-inspired but natural, outfit flowing beautifully, "I know I look good" expression, golden hour backlighting

[4-6s] POSE MOMENT: Signature pose - hair flip/sunglasses adjust/casual wall lean, camera orbits for dynamic angle

[6-8s] MONEY SHOT: Direct camera eye contact, slight smirk, slow dolly in to medium close-up

STYLE: Instagram Reels/TikTok ready, ${colorLabel} color grading, message: "Today's me, perfect ${moodLabel} mood"${freeText ? `\nAdditional request: ${freeText}` : ''}`
        }
      };
    } else {
      // 트렌드세터
      const trendLabel = persona.trendKeywords?.find(t => t.id === trendKeyword)?.label || '';
      const editorialLabel = persona.editorialMoods?.find(e => e.id === editorialMood)?.label || '';
      
      return {
        korean: {
          image: `[유저_얼굴_이미지] ${trendLabel} 트렌드를 반영한 ${situationLabel} 스타일링을 입은 한국 [남성/여성], ${editorialLabel} 매거진 감성의 하이패션 에디토리얼 포트레이트, 건축적인 바디라인의 파워풀한 포즈, 카메라 직시하는 날카롭고 강렬한 시선, ${situationLabel === '에디토리얼' ? '콘크리트 벽과 기하학적 그림자' : situationLabel === '갤러리/전시' ? '화이트 갤러리 공간' : '도시 루프탑 스카이라인'} 배경, 의상 실루엣 강조하는 드라마틱한 방향성 조명, 135mm f/2.0 압축된 시점, 패션 포워드하고 열망적인, 8K 울트라 디테일 에디토리얼 퀄리티${freeText ? `, 추가 요청: ${freeText}` : ''}`,
          video: `트렌드세터를 위한 8초 하이패션 OOTD 영상, ${trendLabel} 트렌드의 ${situationLabel} 스타일링을 입은 한국 [남성/여성],

[0-2초] 드라마틱 오프닝: 의상 디테일 익스트림 클로즈업으로 시작, 샤프한 풀 포커스로 ${situationLabel === '에디토리얼' ? '콘크리트 벽' : '갤러리 화이트'} 앞 파워풀한 스탠스 드러내기, 강렬한 시선, 볼드한 그림자의 드라마틱 조명

[2-4초] 런웨이 모먼트: 당당한 워킹 시작, 과장된 자신감 있는 걸음의 풀 런웨이 에너지, 드라마틱하게 흐르는 ${trendLabel} 실루엣, 강렬하고 에디토리얼한 표정

[4-6초] 아트 디렉션: 피사체 주위 오빗 또는 드라마틱 앵글 시프트, 파워풀한 포즈 홀드, 빛과 그림자 상호작용, 짧은 슬로모션

[6-8초] 아이코닉 클로징: 어깨 너머 강렬한 시선 또는 직접적 대면 시선, 드라마틱한 조명 시프트, ${editorialLabel} 매거진 커버 가치 있는 프레임

스타일: 하이패션 필름 감성, 시네마틱 컬러 그레이딩, 메시지: "트렌드를 따르지 않고, 만든다"${freeText ? `\n추가 요청: ${freeText}` : ''}`
        },
        english: {
          image: `[USER_FACE_IMAGE] Korean [man/woman] wearing ${situationLabel} styling reflecting ${trendLabel} trend, ${editorialLabel} magazine aesthetic high fashion editorial portrait, powerful pose with architectural body lines, sharp fierce gaze directly into camera, ${situationLabel === '에디토리얼' ? 'concrete wall with geometric shadows' : situationLabel === '갤러리/전시' ? 'white gallery space' : 'urban rooftop skyline'} background, dramatic directional lighting emphasizing outfit silhouette, 135mm f/2.0 compressed perspective, fashion forward and aspirational, 8K ultra detailed editorial quality${freeText ? `, additional request: ${freeText}` : ''}`,
          video: `8-second high-fashion OOTD video for trendsetter, Korean [man/woman] wearing ${situationLabel} styling with ${trendLabel} trend,

[0-2s] DRAMATIC OPENING: Extreme close-up on outfit detail start, sharp pull-focus revealing powerful stance against ${situationLabel === '에디토리얼' ? 'concrete wall' : 'gallery white'}, intense gaze, dramatic lighting with bold shadows

[2-4s] RUNWAY MOMENT: Commanding walk begins, full runway energy with exaggerated confident stride, dramatically flowing ${trendLabel} silhouette, fierce editorial expression

[4-6s] ART DIRECTION: Orbit around subject or dramatic angle shift, powerful pose hold, light and shadow interaction, brief slow-motion

[6-8s] ICONIC CLOSING: Over-shoulder fierce look or direct confrontational gaze, dramatic lighting shift, ${editorialLabel} magazine cover-worthy frame

STYLE: High fashion film aesthetic, cinematic color grading, message: "Don't follow trends, create them"${freeText ? `\nAdditional request: ${freeText}` : ''}`
        }
      };
    }
  };

  // 선택 핸들러
  const handleSelect = (key, value) => {
    setUserInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleConcernToggle = (concernId) => {
    setUserInputs(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concernId)
        ? prev.concerns.filter(c => c !== concernId)
        : [...prev.concerns, concernId]
    }));
  };

  // 다음 스텝 가능 여부
  const canProceed = () => {
    if (step === 0) return selectedPersona !== null;
    if (step === 1) return userInputs.situation !== null;
    if (step === 2) return userInputs.weather !== null;
    if (step === 3) {
      if (selectedPersona?.id === 'beginner') return userInputs.bodyType !== null;
      if (selectedPersona?.id === 'ootd') return userInputs.mood !== null && userInputs.colorVibe !== null;
      if (selectedPersona?.id === 'trendsetter') return userInputs.trendKeyword !== null;
    }
    if (step === 4) {
      if (selectedPersona?.id === 'trendsetter') return userInputs.editorialMood !== null;
      return userInputs.outputType !== null;
    }
    if (step === 5 && selectedPersona?.id === 'trendsetter') return userInputs.outputType !== null;
    return true;
  };

  // 리셋
  const handleReset = () => {
    setStep(0);
    setSelectedPersona(null);
    setUserInputs({
      situation: null,
      mood: null,
      weather: null,
      bodyType: null,
      concerns: [],
      colorVibe: null,
      trendKeyword: null,
      editorialMood: null,
      freeText: '',
      outputType: 'both',
    });
    setGeneratedPrompt(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#ffffff',
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* 헤더 */}
      <header style={{
        padding: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF6B9D 0%, #C44FE2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>
            👔
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>DOTD</h1>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>오늘 뭐입동?</p>
          </div>
        </div>
        {step > 0 && (
          <button
            onClick={handleReset}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#fff',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            처음으로
          </button>
        )}
      </header>

      {/* 프로그레스 바 */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '8px',
        }}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: '3px',
                borderRadius: '2px',
                background: idx <= step 
                  ? selectedPersona?.gradient || 'linear-gradient(135deg, #FF6B9D 0%, #C44FE2 100%)'
                  : 'rgba(255,255,255,0.1)',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>
        <p style={{ 
          fontSize: '12px', 
          color: 'rgba(255,255,255,0.5)',
          margin: 0,
        }}>
          {step + 1} / {steps.length} · {steps[step]}
        </p>
      </div>

      {/* 메인 콘텐츠 */}
      <main style={{ padding: '0 20px 100px' }}>
        
        {/* Step 0: 페르소나 선택 */}
        {step === 0 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              marginBottom: '8px',
              lineHeight: '1.3',
            }}>
              당신은 어떤 스타일러인가요?
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255,255,255,0.6)', 
              marginBottom: '32px',
              lineHeight: '1.5',
            }}>
              맞춤 OOTD를 위해<br/>가장 가까운 유형을 선택해주세요
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.values(PERSONAS).map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona)}
                  style={{
                    background: selectedPersona?.id === persona.id 
                      ? persona.gradient 
                      : 'rgba(255,255,255,0.05)',
                    border: selectedPersona?.id === persona.id 
                      ? 'none' 
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '24px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: selectedPersona?.id === persona.id ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '32px' }}>{persona.emoji}</span>
                    <div>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '700', 
                        color: '#fff',
                        margin: 0,
                      }}>
                        {persona.name}
                      </h3>
                      <p style={{ 
                        fontSize: '12px', 
                        color: 'rgba(255,255,255,0.7)',
                        margin: '4px 0 0',
                        fontStyle: 'italic',
                      }}>
                        {persona.tagline}
                      </p>
                    </div>
                  </div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: 'rgba(255,255,255,0.8)',
                    margin: 0,
                    lineHeight: '1.4',
                  }}>
                    {persona.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: 상황 선택 */}
        {step === 1 && selectedPersona && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              어떤 상황인가요?
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
              오늘의 일정에 맞는 스타일을 추천해드릴게요
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '12px' 
            }}>
              {selectedPersona.situations.map((situation) => (
                <button
                  key={situation.id}
                  onClick={() => handleSelect('situation', situation.id)}
                  style={{
                    background: userInputs.situation === situation.id 
                      ? selectedPersona.gradient 
                      : 'rgba(255,255,255,0.05)',
                    border: userInputs.situation === situation.id 
                      ? 'none' 
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '20px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>
                    {situation.icon}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                    {situation.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: 날씨 */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              오늘 날씨는요?
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
              날씨에 맞는 레이어링을 추천해드릴게요
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {WEATHER_OPTIONS.map((weather) => (
                <button
                  key={weather.id}
                  onClick={() => handleSelect('weather', weather.id)}
                  style={{
                    background: userInputs.weather === weather.id 
                      ? selectedPersona.gradient 
                      : 'rgba(255,255,255,0.05)',
                    border: userInputs.weather === weather.id 
                      ? 'none' 
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{weather.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#fff', display: 'block' }}>
                      {weather.label}
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      {weather.temp}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: 페르소나별 추가 옵션 */}
        {step === 3 && selectedPersona?.id === 'beginner' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              체형 & 고민
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              더 잘 맞는 스타일을 찾아드릴게요
            </p>

            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'rgba(255,255,255,0.8)' }}>
              체형 선택
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '24px' }}>
              {selectedPersona.bodyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelect('bodyType', type.id)}
                  style={{
                    background: userInputs.bodyType === type.id 
                      ? selectedPersona.gradient 
                      : 'rgba(255,255,255,0.05)',
                    border: userInputs.bodyType === type.id 
                      ? 'none' 
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '14px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#fff',
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'rgba(255,255,255,0.8)' }}>
              고민 선택 (복수 선택 가능)
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedPersona.concerns.map((concern) => (
                <button
                  key={concern.id}
                  onClick={() => handleConcernToggle(concern.id)}
                  style={{
                    background: userInputs.concerns.includes(concern.id) 
                      ? selectedPersona.color 
                      : 'rgba(255,255,255,0.05)',
                    border: userInputs.concerns.includes(concern.id) 
                      ? 'none' 
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#fff',
                  }}
                >
                  {concern.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && selectedPersona?.id === 'ootd' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              무드 & 컬러
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              오늘의 기분을 스타일로 표현해요
            </p>

            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'rgba(255,255,255,0.8)' }}>
              무드 선택
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
              {selectedPersona.moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleSelect('mood', mood.id)}
                  style={{
                    background: userInputs.mood === mood.id 
                      ? selectedPersona.gradient 
                      : 'rgba(255,255,255,0.05)',
                    border: userInputs.mood === mood.id 
                      ? 'none' 
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '16px 10px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>{mood.emoji}</span>
                  <span style={{ fontSize: '13px', color: '#fff' }}>{mood.label}</span>
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'rgba(255,255,255,0.8)' }}>
              컬러 바이브
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {selectedPersona.colorVibes.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleSelect('colorVibe', color.id)}
                  style={{
                    background: userInputs.colorVibe === color.id 
                      ? 'rgba(255,255,255,0.15)' 
                      : 'rgba(255,255,255,0.05)',
                    border: userInputs.colorVibe === color.id 
                      ? `2px solid ${color.color}` 
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '14px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: color.color,
                  }} />
                  <span style={{ fontSize: '13px', color: '#fff' }}>{color.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && selectedPersona?.id === 'trendsetter' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              트렌드 키워드
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              이번 시즌 당신의 키워드는?
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {selectedPersona.trendKeywords.map((trend) => (
                <button
                  key={trend.id}
                  onClick={() => handleSelect('trendKeyword', trend.id)}
                  style={{
                    background: userInputs.trendKeyword === trend.id 
                      ? selectedPersona.gradient 
                      : 'rgba(255,255,255,0.05)',
                    border: userInputs.trendKeyword === trend.id 
                      ? 'none' 
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '18px 14px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#fff',
                  }}
                >
                  {trend.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: 트렌드세터 에디토리얼 무드 */}
        {step === 4 && selectedPersona?.id === 'trendsetter' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              에디토리얼 무드
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              어떤 매거진 커버를 장식하고 싶나요?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedPersona.editorialMoods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleSelect('editorialMood', mood.id)}
                  style={{
                    background: userInputs.editorialMood === mood.id 
                      ? selectedPersona.gradient 
                      : 'rgba(255,255,255,0.05)',
                    border: userInputs.editorialMood === mood.id 
                      ? 'none' 
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#fff', display: 'block' }}>
                    {mood.label}
                  </span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                    {mood.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 출력 타입 선택 */}
        {((step === 4 && selectedPersona?.id !== 'trendsetter') || 
          (step === 5 && selectedPersona?.id === 'trendsetter')) && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              무엇을 만들까요?
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
              원하는 결과물 형식을 선택하세요
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {OUTPUT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelect('outputType', type.id)}
                  style={{
                    background: userInputs.outputType === type.id 
                      ? selectedPersona.gradient 
                      : 'rgba(255,255,255,0.05)',
                    border: userInputs.outputType === type.id 
                      ? 'none' 
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '32px' }}>{type.icon}</span>
                  <div>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#fff', display: 'block' }}>
                      {type.label}
                    </span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                      {type.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'rgba(255,255,255,0.8)' }}>
              추가 요청사항 (선택)
            </h3>
            <textarea
              value={userInputs.freeText}
              onChange={(e) => handleSelect('freeText', e.target.value)}
              placeholder="예: 청바지 활용해줘, 밝은 색 위주로, 키 작아보이지 않게..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '16px',
                color: '#fff',
                fontSize: '14px',
                resize: 'none',
                height: '100px',
                outline: 'none',
              }}
            />
          </div>
        )}

        {/* 프롬프트 생성 결과 */}
        {((step === 5 && selectedPersona?.id !== 'trendsetter') || 
          (step === 6 && selectedPersona?.id === 'trendsetter')) && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            {isGenerating ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: selectedPersona.gradient,
                  margin: '0 auto 24px',
                  animation: 'pulse 1.5s infinite',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}>
                  {selectedPersona.emoji}
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                  프롬프트 생성 중...
                </h2>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                  맞춤 스타일을 찾고 있어요
                </p>
              </div>
            ) : generatedPrompt ? (
              <div>
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '32px',
                  padding: '24px',
                  background: selectedPersona.gradient,
                  borderRadius: '20px',
                }}>
                  <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>✨</span>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
                    프롬프트 생성 완료!
                  </h2>
                  <p style={{ fontSize: '14px', opacity: 0.9 }}>
                    아래 프롬프트로 이미지/영상을 생성하세요
                  </p>
                </div>

                {/* 이미지 프롬프트 */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    🖼️ 이미지 프롬프트
                  </h3>
                  
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                  }}>
                    <p style={{ 
                      fontSize: '11px', 
                      color: selectedPersona.color, 
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}>
                      🇰🇷 한국어
                    </p>
                    <p style={{ 
                      fontSize: '13px', 
                      lineHeight: '1.6', 
                      color: 'rgba(255,255,255,0.9)',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {generatedPrompt.korean.image}
                    </p>
                  </div>

                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}>
                    <p style={{ 
                      fontSize: '11px', 
                      color: selectedPersona.color, 
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}>
                      🇺🇸 English
                    </p>
                    <p style={{ 
                      fontSize: '13px', 
                      lineHeight: '1.6', 
                      color: 'rgba(255,255,255,0.9)',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {generatedPrompt.english.image}
                    </p>
                  </div>
                </div>

                {/* 영상 프롬프트 */}
                {(userInputs.outputType === 'video' || userInputs.outputType === 'both') && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      🎬 영상 프롬프트 (8초)
                    </h3>
                    
                    <div style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '12px',
                    }}>
                      <p style={{ 
                        fontSize: '11px', 
                        color: selectedPersona.color, 
                        marginBottom: '8px',
                        fontWeight: '600',
                      }}>
                        🇰🇷 한국어
                      </p>
                      <p style={{ 
                        fontSize: '13px', 
                        lineHeight: '1.6', 
                        color: 'rgba(255,255,255,0.9)',
                        whiteSpace: 'pre-wrap',
                      }}>
                        {generatedPrompt.korean.video}
                      </p>
                    </div>

                    <div style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                    }}>
                      <p style={{ 
                        fontSize: '11px', 
                        color: selectedPersona.color, 
                        marginBottom: '8px',
                        fontWeight: '600',
                      }}>
                        🇺🇸 English
                      </p>
                      <p style={{ 
                        fontSize: '13px', 
                        lineHeight: '1.6', 
                        color: 'rgba(255,255,255,0.9)',
                        whiteSpace: 'pre-wrap',
                      }}>
                        {generatedPrompt.english.video}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '16px',
                  }}
                >
                  새로운 프롬프트 만들기
                </button>
              </div>
            ) : null}
          </div>
        )}
      </main>

      {/* 하단 네비게이션 */}
      {!generatedPrompt && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px',
          background: 'linear-gradient(to top, #0a0a0a 80%, transparent)',
          display: 'flex',
          gap: '12px',
        }}>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                flex: '0 0 auto',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 24px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              이전
            </button>
          )}
          <button
            onClick={() => {
              if (step === steps.length - 1) {
                generatePrompt();
              } else {
                setStep(step + 1);
              }
            }}
            disabled={!canProceed()}
            style={{
              flex: 1,
              background: canProceed() 
                ? (selectedPersona?.gradient || 'linear-gradient(135deg, #FF6B9D 0%, #C44FE2 100%)')
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              opacity: canProceed() ? 1 : 0.5,
            }}
          >
            {step === steps.length - 1 ? '프롬프트 생성' : '다음'}
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        textarea::placeholder { color: rgba(255,255,255,0.4); }
      `}</style>
    </div>
  );
}
