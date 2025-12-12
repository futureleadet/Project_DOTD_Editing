# 📱 DOTD Prompt Generator UI

> **파일명:** DOTD_prompt_generator_ui.jsx  
> **역할:** 페르소나별 AI 이미지/영상 프롬프트 자동 생성 UI 컴포넌트  
> **기술 스택:** React (Hooks)

---

## 📋 목차

1. [데이터 구조](#1-데이터-구조)
2. [메인 컴포넌트](#2-메인-컴포넌트)
3. [프롬프트 생성 로직](#3-프롬프트-생성-로직)
4. [UI 렌더링](#4-ui-렌더링)
5. [전체 코드](#5-전체-코드)

---

## 1. 데이터 구조

### 1.1 페르소나 (PERSONAS)

3가지 유형의 사용자 페르소나를 정의합니다.

#### 👶 패션 초보자 (beginner)

```javascript
{
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
}
```

#### 👔 OOTD 중심 (ootd)

```javascript
{
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
}
```

#### 💎 트렌드세터 (trendsetter)

```javascript
{
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
```

### 1.2 날씨 옵션 (WEATHER_OPTIONS)

```javascript
const WEATHER_OPTIONS = [
  { id: 'sunny', label: '맑음', icon: '☀️', temp: '따뜻함' },
  { id: 'cloudy', label: '흐림', icon: '☁️', temp: '선선함' },
  { id: 'rainy', label: '비', icon: '🌧️', temp: '습함' },
  { id: 'cold', label: '추움', icon: '❄️', temp: '쌀쌀함' },
  { id: 'hot', label: '더움', icon: '🔥', temp: '더움' },
];
```

### 1.3 출력 타입 (OUTPUT_TYPES)

```javascript
const OUTPUT_TYPES = [
  { id: 'images', label: '이미지 3장', icon: '🖼️', desc: '다양한 앵글의 착장 이미지' },
  { id: 'video', label: '8초 영상', icon: '🎬', desc: '다이나믹한 OOTD 영상' },
  { id: 'both', label: '이미지 + 영상', icon: '✨', desc: '풀 패키지' },
];
```

---

## 2. 메인 컴포넌트

### 2.1 상태 관리

```javascript
const [step, setStep] = useState(0);
const [selectedPersona, setSelectedPersona] = useState(null);
const [userInputs, setUserInputs] = useState({
  situation: null,      // 상황 선택
  mood: null,           // 무드 (OOTD)
  weather: null,        // 날씨
  bodyType: null,       // 체형 (초보자)
  concerns: [],         // 고민 (초보자, 복수 선택)
  colorVibe: null,      // 컬러 바이브 (OOTD)
  trendKeyword: null,   // 트렌드 키워드 (트렌드세터)
  editorialMood: null,  // 에디토리얼 무드 (트렌드세터)
  freeText: '',         // 추가 요청사항
  outputType: 'both',   // 출력 타입
});
const [generatedPrompt, setGeneratedPrompt] = useState(null);
const [isGenerating, setIsGenerating] = useState(false);
```

### 2.2 스텝 정의

```javascript
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
```

### 2.3 스텝별 플로우

| 페르소나 | Step 0 | Step 1 | Step 2 | Step 3 | Step 4 | Step 5 | Step 6 |
|---------|--------|--------|--------|--------|--------|--------|--------|
| **초보자** | 페르소나 | 상황 | 날씨 | 체형&고민 | 출력타입 | 결과 | - |
| **OOTD** | 페르소나 | 상황 | 날씨 | 무드&컬러 | 출력타입 | 결과 | - |
| **트렌드** | 페르소나 | 상황 | 날씨 | 트렌드키워드 | 에디토리얼 | 출력타입 | 결과 |

---

## 3. 프롬프트 생성 로직

### 3.1 패션 초보자 프롬프트

#### 🖼️ 이미지 프롬프트 (한국어)

```
[유저_얼굴_이미지] {상황} 상황에 어울리는 깔끔한 기본 코디를 입은 한국 [남성/여성], 
{체형에 맞는 실루엣} 의상, {날씨}에 맞는 레이어링, 
자연스럽고 편안한 자세로 서있는, 친근한 미소의 부드러운 표정, 
눈높이 전신샷, {상황별 배경}, 부드러운 자연광, 
웜 뉴트럴 컬러 팔레트, 얕은 심도 f/2.8, 
프로페셔널 라이프스타일 사진, 8K 해상도
```

#### 🎬 영상 프롬프트 (한국어)

```
패션 입문자를 위한 8초 OOTD 영상

[0-2초] 오프닝: 미디엄샷으로 시작, {배경}에 자연스럽게 서있는 피사체
[2-5초] 움직임: 편안하고 자신감 있는 걸음으로 카메라 향해 자연스럽게 걷기
[5-7초] 멈춤 & 디테일: 무게 이동하며 잠시 멈춤, 의상 조합 하이라이트
[7-8초] 클로징: 살짝 돌아 의상 측면 프로필 보여주기, 진심 어린 따뜻한 미소

스타일: 라이프스타일 다큐 느낌, 메시지: "기본템으로도 이렇게 깔끔하게"
```

### 3.2 OOTD 중심 프롬프트

#### 🖼️ 이미지 프롬프트 (한국어)

```
[유저_얼굴_이미지] {무드} 무드의 {상황} 코디를 입은 한국 [남성/여성], 
{컬러} 컬러 팔레트의 트렌디한 스타일링, 인스타그램 감성 OOTD 전신샷, 
미묘한 S커브와 자신감 있는 포즈, 고개 살짝 기울인 쿨한 표정, 
{상황별 배경}, {날씨} 분위기, 
골든아워 따뜻한 조명으로 머리카락에 림라이트, 
85mm f/1.4 크리미한 보케, 소셜미디어 업로드 준비 완료, 8K 에디토리얼 퀄리티
```

#### 🎬 영상 프롬프트 (한국어)

```
스타일 의식 있는 유저를 위한 8초 트렌디 OOTD 영상

[0-2초] 훅 오프닝: 핵심 의상 피스 클로즈업, 카메라 뒤로 빠지며 전체 의상 드러내기
[2-4초] 시그니처 워킹: 런웨이 영감이지만 자연스러운, "내가 멋있는 거 알아" 표정
[4-6초] 포즈 모먼트: 머리 넘기기/선글라스 조정/감성 벽에 기대기
[6-8초] 머니샷: 카메라 직접 아이컨택, 살짝 씩 웃음, 천천히 돌리인

스타일: 인스타 릴스/틱톡 준비 완료, 메시지: "오늘의 나, 완벽한 {무드} 무드"
```

### 3.3 트렌드세터 프롬프트

#### 🖼️ 이미지 프롬프트 (한국어)

```
[유저_얼굴_이미지] {트렌드} 트렌드를 반영한 {상황} 스타일링을 입은 한국 [남성/여성], 
{에디토리얼} 매거진 감성의 하이패션 에디토리얼 포트레이트, 
건축적인 바디라인의 파워풀한 포즈, 카메라 직시하는 날카롭고 강렬한 시선, 
{상황별 배경}, 의상 실루엣 강조하는 드라마틱한 방향성 조명, 
135mm f/2.0 압축된 시점, 패션 포워드하고 열망적인, 8K 울트라 디테일 에디토리얼 퀄리티
```

#### 🎬 영상 프롬프트 (한국어)

```
트렌드세터를 위한 8초 하이패션 OOTD 영상

[0-2초] 드라마틱 오프닝: 의상 디테일 익스트림 클로즈업, 파워풀한 스탠스, 강렬한 시선
[2-4초] 런웨이 모먼트: 풀 런웨이 에너지, 드라마틱하게 흐르는 실루엣
[4-6초] 아트 디렉션: 피사체 주위 오빗, 파워풀한 포즈 홀드, 슬로모션
[6-8초] 아이코닉 클로징: 어깨 너머 강렬한 시선, {에디토리얼} 매거진 커버 가치

스타일: 하이패션 필름 감성, 메시지: "트렌드를 따르지 않고, 만든다"
```

---

## 4. UI 렌더링

### 4.1 컴포넌트 구조

```
┌─────────────────────────────────────────────┐
│ 📱 DOTDPromptGenerator                      │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ Header (로고 + 처음으로 버튼)            │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ Progress Bar (현재 스텝 표시)            │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ Main Content                            │ │
│ │                                         │ │
│ │ - Step 0: 페르소나 선택                  │ │
│ │ - Step 1: 상황 선택                      │ │
│ │ - Step 2: 날씨 선택                      │ │
│ │ - Step 3: 페르소나별 추가 옵션           │ │
│ │ - Step 4-5: 출력 타입 & 추가 요청        │ │
│ │ - Step 5-6: 프롬프트 생성 결과           │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ Bottom Navigation (이전/다음 버튼)       │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 4.2 스타일 테마

| 요소 | 값 |
|------|-----|
| 배경색 | `#0a0a0a` |
| 텍스트색 | `#ffffff` |
| 폰트 | Pretendard, -apple-system |
| 버튼 border-radius | `12px ~ 20px` |
| 카드 border-radius | `16px ~ 20px` |
| 그라디언트 (핑크) | `#FF6B9D → #C44FE2` |
| 그라디언트 (민트) | `#4ECDC4 → #44A08D` |
| 그라디언트 (다크) | `#1a1a1a → #434343` |

### 4.3 애니메이션

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}
```

---

## 5. 전체 코드

전체 코드는 `DOTD_prompt_generator_ui.jsx` 파일(1,133줄)에 포함되어 있습니다.

### 주요 함수 요약

| 함수명 | 역할 |
|-------|------|
| `getSteps()` | 페르소나별 스텝 배열 반환 |
| `generatePrompt()` | 프롬프트 생성 실행 (1.5초 딜레이) |
| `buildPrompt()` | 실제 프롬프트 텍스트 구성 |
| `handleSelect(key, value)` | 사용자 입력 상태 업데이트 |
| `handleConcernToggle(id)` | 고민 복수 선택 토글 |
| `canProceed()` | 다음 스텝 진행 가능 여부 체크 |
| `handleReset()` | 모든 상태 초기화 |

### 출력 결과 형식

```javascript
{
  korean: {
    image: "한국어 이미지 프롬프트...",
    video: "한국어 영상 프롬프트..."
  },
  english: {
    image: "English image prompt...",
    video: "English video prompt..."
  }
}
```

---

## 📎 관련 파일

| 파일명 | 설명 |
|--------|------|
| `DOTD_prompt_generator_ui.jsx` | 원본 React 컴포넌트 |
| `DOTD_full_app_with_logo.jsx` | 로고 적용된 전체 앱 프로토타입 |
| `DOTD_today_card_ui.jsx` | Today Card TPO 퀵칩 UI |

---

**문서 끝**

*이 문서는 DOTD 프롬프트 생성기 UI의 기술 문서입니다.*
