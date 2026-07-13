# 팩트체크 편집국 MVP 구현 계획

**목표:** 초등 5~6학년 학생이 교육용 가상 기사 속 확인 가능한 주장을 찾아내고, 합성 출처 자료의 작성 주체·날짜·수집 방법·범위를 점검한 뒤 근거에 맞는 판정과 과장 없는 정확한 제목을 만드는 서버 없는 교과 융합 웹앱을 구현합니다.

**아키텍처:** 별도 저장소 `fact-check-newsroom`에 Vite, React, TypeScript 기반 정적 앱을 구성합니다. 공통 검증 엔진은 교과 지식을 하드코딩하지 않고 `FactCheckPack` 계약만 처리하며, 국어·매체, 과학·자료, 수학·통계, 사회·매체 사건은 독립 콘텐츠 팩으로 분리합니다. 모든 사건과 출처는 앱에 포함된 합성 자료이고 판정은 검수된 규칙으로 결정되므로 서버, 실제 웹 검색, 외부 AI가 필요하지 않습니다.

**기술 스택:** Vite, React, TypeScript, CSS, SVG, Vitest, React Testing Library, Playwright, Node.js

**현재 상태:** 이 문서는 구현 계획만 정의합니다. 별도 구현 요청 전에는 새 저장소 생성, 패키지 설치, 코드 작성, 테스트 실행, 커밋, 배포, HVC 등록을 하지 않습니다.

## 1. 확인 자료와 교육과정 근거

### 확인 자료

- 기존 앱 비교: [`docs/vibehong-webapp-catalog.md`](../../vibehong-webapp-catalog.md), 2026-07-11 기준 56개
- 성취기준 원문: `★(초)2022개정교육과정에따른성취수준(3~4학년군).pdf`
- 성취기준 원문: `★(초)2022개정교육과정에따른성취수준(5~6학년군).pdf`
- 페이지 번호는 PDF 뷰어에 표시되는 파일 쪽수를 기준으로 합니다.

### MVP의 핵심·직접 연결 성취기준

| 역할 | 성취기준 | 앱에서 지원하는 활동 | 원문 위치 |
|---|---|---|---|
| 핵심 | `[6국06-02] 뉴스 및 각종 정보 매체 자료의 신뢰성을 평가한다.` | 합성 뉴스·정보 카드의 작성 주체, 원자료, 날짜, 방법, 범위를 비교하고 신뢰성의 근거를 설명합니다. | 5~6학년군 PDF 27쪽 |
| 핵심 | `[6국02-03] 글이나 자료를 읽고 내용의 타당성과 표현의 적절성을 평가한다.` | 주장과 근거의 관계, 과장된 범위 표현, 자료가 허용하는 결론을 평가합니다. | 5~6학년군 PDF 23쪽 |
| 보조 | `[6국03-02] 적절한 근거를 사용하고 인용의 출처를 밝히며 주장하는 글을 쓴다.` | 선택한 근거와 출처를 밝힌 짧은 팩트체크 결과 카드를 완성합니다. | 5~6학년군 PDF 24쪽 |

### 콘텐츠 팩의 부분 연결 성취기준

| 교과 팩 | 성취기준 | 연결 범위 | 과도한 주장 방지 | 원문 위치 |
|---|---|---|---|---|
| 수학·통계 | `[6수04-03] 탐구 문제를 설정하고, 그에 맞는 자료를 수집, 정리하여 적절한 그래프로 나타내고 해석할 수 있다.` | 제공된 설문 표·그래프의 표본, 분모, 범위를 읽고 제목이 자료와 맞는지 해석합니다. | 학생이 직접 수집·정리·그래프 작성까지 하지 않으므로 `해석` 요소만 부분 지원한다고 명시합니다. | 5~6학년군 PDF 78쪽 |
| 과학·자료 | `[6과13-02] 계절에 따른 태양의 남중 고도와 낮의 길이 사이의 관계를 자료에 근거하여 추론할 수 있다.` | 계절별 합성 관측 자료를 대조해 `정확히 절반`, `항상` 같은 표현이 근거에 맞는지 판단합니다. | 계절 변화 내용에 한정하며 과학 전 분야의 팩트체크 능력이나 실제 관찰 수행 전체를 충족한다고 하지 않습니다. | 5~6학년군 PDF 126쪽 |
| 사회·매체 | `[6사08-03] 민주주의에서 미디어의 의미와 역할을 이해하고, 여러 가지 미디어의 내용을 비판적으로 분석하여 올바르게 이용하는 태도를 기른다.` | 원기록의 작성 목적과 후대 재게시문의 선택·생략·프레이밍을 비교합니다. | 미디어 내용의 비판적 분석 요소만 부분 지원하며 민주주의에서 미디어의 의미·역할이나 시민 참여까지 모두 다룬다고 하지 않습니다. | 5~6학년군 PDF 42쪽 |

### 3~4학년군 후속 기초 팩 근거

아래 성취기준은 수직적 확장 가능성을 보여 주는 근거이며 MVP에는 별도 기초 모드를 구현하지 않습니다.

| 성취기준 | 후속 활동 | 원문 위치 |
|---|---|---|
| `[4국02-04] 글에 나타난 사실과 의견을 구분하고 필자와 자신의 의견을 비교한다.` | 사실·의견·섞인 문장을 구분하고 의견을 거짓으로 판정하지 않는 기초 활동 | 3~4학년군 PDF 23쪽 |
| `[4국02-05] 글이나 자료의 출처가 믿을 만한지 판단한다.` | 작성자, 작성일, 근거 제시 여부, 목적을 살피는 출처 점검 활동 | 3~4학년군 PDF 23쪽 |
| `[4국06-01] 인터넷에서 학습에 필요한 다양한 자료를 탐색하고 목적에 맞게 자료를 선택한다.` | 검증 질문에 맞는 검색어와 가상 검색 결과를 선택하는 모의 탐색 활동 | 3~4학년군 PDF 27쪽 |
| `[4국06-03] 매체 소통 윤리를 고려하여 매체 자료를 활용하고 공유한다.` | 출처 표시, 개인정보 제거, 존중하는 표현을 확인하는 후속 모의 공유 전 점검 | 3~4학년군 PDF 27쪽 |

### 교육과정 연결 원칙

- `[6국06-02]`와 `[6국02-03]`을 MVP의 핵심 성취기준으로 삼습니다.
- `[6국03-02]`는 짧은 구조화 카드 작성만 지원하므로 주장하는 글 전체를 완성한다고 과장하지 않습니다.
- 실제 정보 검색 도구를 사용하지 않으므로 `[6국06-01]`을 MVP 핵심 근거로 주장하지 않습니다.
- 결과 카드는 앱 안에서만 보이는 읽기 전용 학습 산출물입니다. 공개 공유가 없으므로 `[6국06-03]` 전체를 충족한다고 하지 않습니다.
- 수학·과학·사회 성취기준은 해당 콘텐츠 팩에서 다루는 제한된 자료 해석·추론·미디어 분석 요소에만 연결합니다.
- 성취수준 A·B·C는 학생용 점수나 등급으로 표시하지 않고 교사용 지원 수준을 설계하는 근거로만 사용합니다.
- 출처 수, 읽기 속도, 글 길이를 학습 성취로 평가하지 않습니다.

## 2. 제품 접근 비교와 결정

| 접근 | 방식 | 장점 | 위험 | 결정 |
|---|---|---|---|---|
| 사건 파일형 편집국 + 교과 콘텐츠 팩 | 합성 주장과 출처 카드를 검토해 판정·정확한 제목을 완성 | 오프라인, 안전, 결정적 테스트, 교과 팩 확장이 쉬움 | 사건 데이터의 교육적 검수가 필요 | **MVP 채택** |
| 출처 신뢰도 점수 퀴즈 | 출처 카드마다 신뢰 점수를 맞힘 | 구현이 빠르고 규칙이 단순함 | 유명 기관은 항상 참이라는 오개념, 맥락·날짜·범위 무시 | 보조 활동으로도 사용하지 않음 |
| 실제 웹 검색형 편집국 | 학생이 실시간 뉴스와 웹 문서를 검색 | 현실성이 높음 | 정치·의료·재난 노출, 링크 소멸, 광고·개인정보·저작권, 네트워크와 필터링 필요 | MVP 제외 |

### 추천안의 핵심 이유

- 교과가 바뀌어도 `주장 분석 → 출처 점검 → 근거 관계 분류 → 판정 → 결과 정리`의 학습 순환을 재사용할 수 있습니다.
- UI와 판정 엔진을 수정하지 않고 콘텐츠 팩 한 폴더와 레지스트리 항목만 추가하여 교과를 확장할 수 있습니다.
- 실제 뉴스의 현재성이나 외부 사이트 상태와 무관하게 교사가 검수한 동일 자료로 수업하고 테스트할 수 있습니다.
- 출처의 이름이나 카드 수가 아니라 주장과의 관련성, 날짜, 방법, 범위를 판단하게 할 수 있습니다.
- 모든 결과가 입력과 검수 규칙에 의해 결정되어 AI가 진실을 대신 판정한다는 오개념을 막습니다.

## 3. 기존 56개 앱과의 차별화

카탈로그 56개에는 자연어 주장을 분해하고 여러 출처의 근거 범위를 교차 확인한 뒤 판정하고 정확한 제목으로 정리하는 직접 중복 앱이 없습니다. 다음 경계를 지키지 않으면 기존 앱과 비슷해질 수 있습니다.

| 기존 앱·유형 | 겹칠 수 있는 요소 | 팩트체크 편집국의 차별화 기준 |
|---|---|---|
| 초록 지구 구출 대작전: 우리 반 환경 리포터 | 뉴스 형식의 조사·작성·공유 | 자유 기사·뉴스레터 제작이 아니라 이미 주어진 주장 검증과 짧은 결과 카드에 집중합니다. 환경은 후속 교과 팩 중 하나일 뿐입니다. |
| 신호등 토론방 | 의견 카드, 찬반 선택 | 찬성·반대, 다수결, 실시간 의견 비율이 아니라 자료와 주장의 관계로 판정합니다. |
| LinkEffect | 카드 사이 관계 찾기 | 원인·결과 사슬이 아니라 주장을 원자 단위로 나누고 각 근거를 `지지·반박·제한·무관`으로 검토합니다. |
| 우리 반 통계청 | 설문 수집과 그래프 생성 | 학생 투표나 그래프 제작 없이 제공된 표본·분모·축·조사 범위를 읽어 어디까지 말할 수 있는지 판단합니다. |
| 디지털 역사 연표 | 사건·연도를 입력하고 흐름 구성 | 연표를 만들지 않고 날짜·작성자·자료 유형의 모순과 한계를 검토합니다. |
| 과학 탐구·시뮬레이션 앱 | 현상 조작과 실험 결과 확인 | 자유 실험이 아니라 사전 검수된 관측 기록에서 관찰 사실과 가능한 결론을 구분합니다. |
| 단어 망원경·문화유산 지도 | 정보 탐색과 설명 | 백과 탐색이 아니라 한 주장을 검증하는 데 필요한 자료를 선별하고 이유를 설명합니다. |
| AI 데이터 품질검사소 계획 | 오류·누락·편향 자료 처리 | 데이터 품질검사소는 레코드를 유지·수정·보류·제외하고, 본 앱은 자연어 주장과 출처의 관계를 판정해 더 정확한 제목으로 정리합니다. CSV 행 검사와 결측·중복 처리를 넣지 않습니다. |

### 차별화 검수 규칙

- 핵심 순환은 `제보 주장 받기 → 확인 가능한 핵심 표시 → 출처·날짜·방법·범위 점검 → 근거 관계 분류 → 판정 → 정확한 제목 → 새 자료로 재검토`입니다.
- 학생은 새 기사를 자유 작성하지 않고, 검수된 어구 카드로 짧은 결과 제목을 만듭니다.
- 투표, 찬반, 좋아요, 댓글, 실시간 방, 순위, 타이머를 넣지 않습니다.
- 그래프 제작, 연표 제작, 과학 시뮬레이션이 주 활동이 되지 않게 합니다.
- `가짜뉴스 탐지기`, `AI 진실 판정`, `거짓말 점수`라는 표현을 사용하지 않습니다.

## 4. MVP 제품 계약

### 기본 정보

| 항목 | 결정 |
|---|---|
| 앱 이름 | 팩트체크 편집국 |
| 대상 | 초등 5~6학년, 개인 또는 2인 모둠 |
| 1회 활동 시간 | 사건 1개당 18~22분 |
| 한 세션 범위 | 네 교과 데스크 중 사건 하나를 선택해 재검토까지 완료 |
| 초기 콘텐츠 | 국어·매체, 과학·자료, 수학·통계, 사회·매체 사건 각 1개 |
| 사건 자료 | 사건당 합성 출처 카드 5개, 처음 4개와 후속 제보 1개 |
| 판정 | 자료로 확인됨, 일부만 확인됨, 제시된 자료와 맞지 않음, 근거 부족으로 판단 보류 |
| 최종 산출물 | 출처가 표시된 읽기 전용 `팩트체크 결과 카드` |
| 입력 | 버튼·카드 선택, 자유 장문 입력 없음 |
| 저장 | React 메모리만 사용하며 새로고침 시 초기화 |
| 네트워크 | 초기 정적 자원 외 API·외부 요청 없음 |
| 평가 | 점수·등급 없이 점검한 차원, 근거, 수정 과정을 요약 |

### 학습 목표

학생은 활동 후 다음을 할 수 있어야 합니다.

1. 기사 문장에서 확인 가능한 대상, 행동·사건, 수치, 시점, 범위, 관계 표현을 찾습니다.
2. 사실과 의견을 구분하고 의견을 거짓이라고 판정하지 않습니다.
3. 출처 이름만 보지 않고 누가, 언제, 어떻게, 어느 범위에서 만든 자료인지 확인합니다.
4. 자료가 주장을 지지하는지, 반박하는지, 범위를 제한하는지, 관련 없는지 구분합니다.
5. 자료가 없다는 것과 자료가 주장을 직접 반박하는 것을 구별합니다.
6. 같은 원자료를 베낀 재게시물 두 개를 독립된 근거 두 개로 세지 않습니다.
7. 근거가 허용하는 범위에 맞게 정확한 제목을 구성합니다.
8. 새 자료가 들어오면 첫 판정을 유지하거나 수정하고 이유를 설명합니다.

### 학생 활동 흐름

1. **편집 회의:** 네 교과 데스크 중 사건 하나를 선택합니다.
2. **주장 해부:** 문장을 대상·행동·사건·수치·시점·범위·관계 조각으로 나누어 검증할 핵심을 표시합니다.
3. **출처 데스크:** 출처 카드 4개의 작성 주체, 날짜, 수집 방법, 조사 범위를 확인합니다.
4. **근거 보드:** 확인 가능한 주장 조각을 하나씩 고르고 각 출처가 그 조각을 `지지`, `반박`, `범위 제한`, `관련 없음` 중 어떻게 다루는지 분류한 뒤 판정에 쓸 출처를 고릅니다.
5. **첫 판정 회의:** 판정과 이유 태그를 함께 선택합니다.
6. **후속 제보:** 새 출처 카드 1개를 받아 같은 네 가지 점검을 수행합니다.
7. **재검토:** 첫 판정과 새 자료를 비교해 유지 또는 수정합니다.
8. **제목 편집:** 대상, 근거가 허용하는 표현, 기간·표본·조건 어구를 조합해 정확한 제목을 만듭니다.
9. **결과 카드 완성:** 원래 주장, 핵심 근거, 최종 판정, 정확한 제목, 출처를 읽기 전용 한 장으로 확인합니다.

### MVP에서 제외

- 실제 뉴스 검색, 웹 크롤링, 학생이 URL을 입력하는 기능
- 생성형 AI의 진위 판정, 요약, 제목 생성, 가짜 기사 생성
- 실제 언론사·정당·정치인·학교·교사·학생·기업·브랜드 사례
- 정치·선거·정책 찬반, 의료·질병·약, 재난·범죄·실종, 전쟁·혐오·종교, 투자·가격 예측 소재
- 사진·PDF·음성·파일 업로드와 자유 기사 작성 자동 채점
- 로그인, 학급 코드, 교사 대시보드, 클라우드 저장, 분석 로그
- 실시간 협업, 댓글, 좋아요, 공개 갤러리, 점수, 배지, 타이머, 순위
- 교사용 콘텐츠 팩 제작기와 실제 인터넷 검색 훈련
- 배포, HVC 관리자 등록, 정적 갤러리 동기화

## 5. 판정과 피드백 계약

### 학생에게 보이는 네 판정

| 내부 값 | 학생 표현 | 사용할 조건 | 사용하지 말아야 할 경우 |
|---|---|---|---|
| `confirmed` | 자료로 확인됨 | 핵심 주장 조각이 적합한 자료로 지지되고 유효한 반박이 없음 | 출처가 유명하거나 카드가 많다는 이유만으로 선택하지 않음 |
| `partly-confirmed` | 일부만 확인됨 | 일부 핵심은 지지되지만 수치·기간·범위·원인 중 일부가 반박되거나 제한됨 | 단순히 마음에 들지 않는 표현에 사용하지 않음 |
| `contradicted` | 제시된 자료와 맞지 않음 | 해당 시점·대상에 맞는 직접 자료가 핵심 주장을 반박함 | 관련 자료가 없다는 이유만으로 선택하지 않음 |
| `insufficient` | 근거가 부족해 판단 보류 | 직접 자료 부족, 표본 부적합, 날짜 불일치, 독립 원자료 부족으로 판단할 수 없음 | 직접 반박 자료가 충분한데도 회피 판정으로 사용하지 않음 |

### 판정 원칙

- 판정은 세상 전체의 절대적 진실이 아니라 `이 사건 파일에 제시된 자료를 기준으로 한 검토 결과`임을 항상 표시합니다.
- 판정 이름만 맞히면 완료되지 않습니다. 사건별 허용 이유 태그 집합과 근거 역할을 함께 충족해야 하며 오개념 이유를 덧붙인 선택도 통과하지 않습니다.
- 교과 검수상 복수 판정이 필요한 후속 사건은 `acceptedDecisionPaths`에 판정별 허용 이유 집합을 따로 정의할 수 있습니다. 초기 네 사건은 학습 초점을 흐리지 않도록 체크포인트마다 판정 경로 하나만 일치하게 합니다.
- 같은 `originId`를 공유하는 원자료와 재게시물은 독립 근거 한 개로 계산합니다.
- 오래된 공식 자료, 최신이지만 무관한 자료, 범위가 좁지만 직접 관찰한 자료를 함께 두어 출처 종류만으로 판단하지 않게 합니다.
- `틀렸어요`, `가짜뉴스를 믿었어요`, `속았어요` 대신 빠진 점검 차원을 구체적으로 안내합니다.
- 같은 체크포인트에서 두 번 시도해도 막히면 `편집장 도움`으로 확인하지 않은 날짜·범위·원자료 중 하나를 알려 주고 점수는 깎지 않습니다. 첫 판정·최종 판정·출처×주장 조각 관계 시도 횟수는 서로 섞지 않습니다.

### 근거 관계

| 내부 값 | 학생 표현 | 의미 |
|---|---|---|
| `supports` | 주장을 지지해요 | 핵심 조각을 직접 뒷받침합니다. |
| `contradicts` | 주장과 다른 결과예요 | 같은 대상·시점에서 핵심 조각과 반대되는 결과를 보입니다. |
| `limits` | 말할 수 있는 범위를 줄여요 | 일부는 관련 있지만 표본·기간·조건 때문에 전체 결론으로 넓힐 수 없습니다. |
| `irrelevant` | 이 주장과는 관련이 적어요 | 출처가 좋아 보여도 현재 검증 질문에는 직접 도움이 되지 않습니다. |

관계는 카드 전체의 영구 등급이 아니라 현재 주장 조각과의 관계입니다. 같은 카드도 다른 주장에서는 다른 역할을 할 수 있습니다.

### 네 가지 출처 점검 렌즈

| 렌즈 | 학생 질문 | 확인 데이터 |
|---|---|---|
| 작성 주체 | 누가 만들었나요? 원자료인가요, 다시 옮긴 자료인가요? | `publisherLabel`, `sourceType`, `originId`, `derivedFromId` |
| 날짜 | 언제 관찰·기록했거나 언제부터 적용되나요? 언제 만들었나요? 주장 기간과 맞나요? | `temporalBasis.kind`, `temporalBasis.period`, `publishedAt`, 사건 기준일 |
| 방법 | 어떤 방법으로 확인·조사·관찰·기록했나요? | `methodSummary`, 공지·지도·기록·측정·설문 방식 |
| 범위 | 누구·어디·몇 명·어느 기간까지 말할 수 있나요? | `scopeSummary`, 표본, 장소, 기간, 단위 |

출처 카드에 신뢰 점수, 별점, 빨강·초록 등급을 붙이지 않습니다.

## 6. 초기 교과 콘텐츠 팩

모든 기관명·기록·수치는 교육용 합성 자료입니다. 학생 화면의 사건 제목과 출처 카드에 `가상 자료` 배지를 표시합니다. 초기 네 팩은 비수치 자료 확인, 계절 관측 해석, 표본 해석, 역사 기록·미디어 프레이밍을 서로 다른 핵심 활동으로 배치합니다.

### 데스크 A: 국어·매체 - 원문과 재게시문의 범위

| 항목 | 계약 |
|---|---|
| 제보 문장 | `반가운 소식! 가상 별빛도서관 안내에 따르면 2026년 6월 첫째 토요일에 어린이 열람실을 운영할 예정이다.` |
| 핵심 조각 | 의견=`반가운 소식`, 근거 틀=`도서관 안내에 따르면`, 대상=`어린이 열람실`, 기간=`2026년 6월 첫째 토요일`, 행동=`운영 예정` |
| 직접 자료 | 가상 별빛도서관의 2026년 6월 원문 안내: 첫째·셋째 토요일 10:00~14:00에 어린이 열람실 운영 |
| 주의 자료 | 원문을 `토요일마다 도서관 운영`으로 넓혀 옮긴 재게시문, 기간이 끝난 2025년 겨울 휴실 안내, 날짜 없는 이용자 의견 |
| 후속 제보 | 해당 날짜에 성인 열람실은 정비하지만 어린이 열람실은 운영한다는 독립 정비 안내 |
| 첫·최종 판정 | `confirmed` → `confirmed` |
| 필수 이유 | 의견 조각 제외, 원문 날짜·대상·예정 상태 일치, 재게시문의 `토요일마다·도서관 전체` 확대를 독립 근거로 세지 않음 |
| 정확한 제목 | `가상 별빛도서관 안내: 어린이 열람실, 2026년 6월 첫째 토요일 운영 예정` |

이 사건은 원문 인용의 생략·확대와 재게시 계보를 살피는 비수치형 매체 활동입니다. 팩트체크가 모든 주장을 틀렸다고 만드는 활동이 아님을 보여 주며, 의견 조각은 진위 판정에서 제외합니다.

### 데스크 B: 과학·자료 - 태양 고도와 낮 길이

| 항목 | 계약 |
|---|---|
| 주장 | `가상 하늘관측소에서는 계절에 따라 태양의 남중 고도가 낮을수록 낮 길이도 짧았고, 12월 낮은 6월의 정확히 절반이었다.` |
| 핵심 조각 | 대상=`남중 고도와 낮 길이`, 기간=`봄·여름·가을·겨울`, 관계=`두 값이 함께 변함`, 수치=`12월은 6월의 정확히 절반` |
| 처음 직접 자료 | 합성 관측표: 3월 56도·12시간 20분, 6월 74도·14시간 42분, 9월 48도·11시간 35분. 12월 값은 아직 없음 |
| 주의 자료 | 같은 표를 옮긴 인포그래픽, 한낮 사진 한 장, 다른 지역의 날짜 불명 자료 |
| 후속 제보 | 같은 관측 방법으로 기록한 12월 직접 자료: 남중 고도 29도·낮 길이 9시간 38분 |
| 첫·최종 판정 | `insufficient` → `partly-confirmed` |
| 필수 이유 | 처음에는 12월 직접 값이 없어 보류하고, 후속 자료 뒤에는 계절별 두 값의 동반 변화는 지지하되 `정확히 절반`은 반박함 |
| 정확한 제목 | `합성 계절 관측에서 남중 고도와 낮 길이는 함께 달라졌지만 12월 낮은 6월의 절반은 아니었다` |

실제 지역의 천문 수치로 오해하지 않도록 모든 표에 `관계 탐구를 위한 합성 자료`를 표시합니다. 자료에서 두 값이 함께 변한 관계만 말하며 `남중 고도가 낮아서 낮이 짧다`라는 인과관계로 바꾸지 않습니다. 이 사건은 후속 직접 자료에 따라 첫 판정이 실제로 바뀌는 MVP 대표 사례입니다.

### 데스크 C: 수학·통계 - 작은 표본의 일반화

| 항목 | 계약 |
|---|---|
| 주장 | `가상 새봄초 5학년 대부분은 아침 독서를 원한다.` |
| 핵심 조각 | 대상=`5학년 전체`, 비율=`대부분`, 조사 범위=`응답자` |
| 직접 자료 | 독서동아리 12명 설문에서 찬성 10명, 반대 2명 |
| 주의 자료 | 같은 설문의 83% 인포그래픽, 교사 한 명의 의견, 응답자가 표시되지 않은 게시물 |
| 후속 제보 | 가상 5학년 전체는 120명이며 설문 응답자는 독서동아리만이었다는 표본 메모 |
| 첫·최종 판정 | `insufficient` → `insufficient` |
| 필수 이유 | 10/12는 독서동아리 결과이고 5학년 전체를 대표한다고 볼 근거가 부족함 |
| 정확한 제목 | `독서동아리 12명 중 10명은 원했지만 5학년 전체 의견은 아직 알 수 없다` |

그래프는 원자료 표와 함께 제공하고 축, 분모, 응답자 범위를 숨기지 않습니다.

### 데스크 D: 사회·매체 - 옛 우물 기록의 출처 계보

| 항목 | 계약 |
|---|---|
| 주장 | `가상 가온마을의 옛 우물은 1998년에 처음 만들어졌다.` |
| 핵심 조각 | 대상=`옛 우물`, 시점=`1998년`, 사건=`처음 만들어짐` |
| 직접 자료 | 우물이 이미 표시된 1978년 가상 마을 지도와 `옛 우물 보수 작업 완료`라고 적힌 1998년 수리 기록 |
| 주의 자료 | 수리 완료 기록을 건설 기록으로 잘못 요약한 2026년 마을 소식 재게시문, 날짜가 없는 옛 그림엽서 |
| 후속 제보 | 1982년에 우물 덮개를 손봤다고 적힌 독립 유지보수 영수증 |
| 첫·최종 판정 | `contradicted` → `contradicted` |
| 필수 이유 | 1998년 자료의 목적은 건설이 아니라 완료된 수리 기록이며, 1978년 지도와 1982년 기록이 그보다 앞선 존재를 직접 보여 줌 |
| 정확한 제목 | `가상 가온마을 옛 우물, 1978년 지도에 이미 표시되고 1998년 수리 완료 기록이 남음` |

정확한 건설 연도는 알 수 없으므로 `1978년에 만들어짐`이라고 바꾸지 않습니다. 원기록의 `수리 완료`를 재게시문이 `처음 건설`로 바꾼 선택·생략·프레이밍을 비교하여 `[6사08-03]`의 미디어 비판적 분석 요소에 부분 연결합니다. 연표 입력·제작 기능은 넣지 않습니다.

### 사건별 출처 카드 구성

각 사건에는 카드 5개를 두되 모든 사건에 똑같은 출처 역할을 강제하지 않습니다. 사건별 `DecisionPath`가 필요한 원자 주장, 관계, 최소 근거 수, 최소 독립 원자료 수를 명시합니다.

1. 처음 공개하는 카드 4개에는 적어도 하나의 직접 원자료를 포함합니다.
2. 초기 네 팩에는 같은 원자료를 옮긴 재게시·파생 자료를 적어도 하나 두어 출처 계보를 확인하게 합니다.
3. 날짜·대상·방법·범위가 맞지 않거나 현재 주장과 무관한 자료를 섞되, 단순히 `공식/비공식`으로 정답이 갈리지 않게 합니다.
4. 독립 확인 자료가 필요한 판정 경로는 해당 사건에 실제로 다른 `originId` 자료를 제공하고 `minimumIndependentOrigins`를 일치시킵니다.
5. 다섯 번째 카드는 첫 판정 후 공개합니다. 과학 사건에서는 판정을 `판단 보류`에서 `일부만 확인됨`으로 바꾸고, 나머지 사건에서는 기존 판정의 범위·근거를 더 명확히 합니다.

각 체크포인트에는 오직 하나의 판정 경로만 일치하게 하고, 사건마다 같은 의미의 정확한 제목 조합을 적어도 두 개 둡니다. 복수 판정 경로 스키마는 향후 교육적 검수로 필요한 경우에만 사용합니다.

## 7. 반드시 막을 오개념과 콘텐츠 안전

| 오개념·위험 | 앱에서 막는 방법 |
|---|---|
| 의견은 사실이 아니므로 거짓이다. | 사실·의견 구분과 사실 판정을 분리하고 의견에는 진위 판정 버튼을 주지 않습니다. |
| 공식 기관이나 전문가가 말하면 항상 참이다. | 작성 주체 외에도 날짜, 방법, 범위, 주장과의 관련성을 모두 확인하게 합니다. |
| 자료 카드가 많을수록 강한 근거다. | 같은 `originId`의 재게시물은 한 원자료로 계산하고 중복 안내를 표시합니다. |
| 근거가 없으면 거짓이다. | `insufficient`와 `contradicted`를 별도 판정으로 두고 직접 반박 자료 조건을 검사합니다. |
| 그래프가 함께 있으면 주장이 증명된다. | 원자료 표, 축, 분모, 표본, 기간을 함께 보여 주고 그래프는 보조 표현으로만 사용합니다. |
| 상관관계는 원인을 증명한다. | 원인 조각이 있는 사건은 방법·비교 조건이 없으면 확인 판정을 허용하지 않습니다. |
| 최신 자료면 언제나 더 좋다. | 최신이지만 대상이 다른 자료와 오래되었지만 해당 시점의 직접 자료를 비교합니다. |
| 팩트체크는 상대를 거짓말쟁이로 만드는 일이다. | 사람을 평가하지 않고 주장과 자료의 관계만 검토합니다. |
| 앱 판정은 실제 세상의 최종 진실이다. | 모든 화면에 `교육용 가상 사건의 제시 자료 기준 결과`를 표시합니다. |
| AI가 진위를 자동 판정한다. | 규칙 기반 교육 활동임을 밝히고 AI 기능·표현을 넣지 않습니다. |

### 콘텐츠 금지 기준

- 정치인, 정당, 선거, 실제 정책 찬반을 사건 소재로 사용하지 않습니다.
- 질병, 치료, 약, 식품 안전처럼 잘못된 판정이 건강 행동에 영향을 줄 수 있는 소재를 사용하지 않습니다.
- 재난, 사고, 범죄, 실종, 전쟁, 분쟁, 혐오, 차별, 종교 논쟁을 사용하지 않습니다.
- 투자, 가격 예측, 법률 판단, 실제 기업·상품 평가를 사용하지 않습니다.
- 실제 학생·교사·학교에 관한 소문이나 개인 정보를 사용하지 않습니다.
- 실제 기사 문장, 기사 캡처, 언론사 로고, 사진, URL을 포함하지 않습니다.
- 가상 기관명에는 항상 `가상` 표기를 붙이고 실제 기관과 유사한 로고를 만들지 않습니다.
- 금지 키워드 검사는 보조 장치로만 사용하며 사람의 콘텐츠 검수를 반드시 거칩니다.

## 8. 화면과 상호작용 설계

### 공통 앱 셸

- 상단 왼쪽에 앱 이름과 현재 단계, 오른쪽에 작은 `업데이트 내역` 버튼을 둡니다.
- 상단 또는 제목 아래에 `교육용 가상 사건·합성 자료` 배지를 모든 화면에서 보이게 합니다.
- 진행 표시는 `1. 주장 해부 → 2. 출처 점검 → 3. 근거 분류 → 4. 판정 → 5. 결과 정리`로 구성합니다.
- 현재 단계는 번호, 글자 굵기, 아이콘, `aria-current="step"`으로 표시합니다.
- 본문에는 한 번에 하나의 핵심 작업과 최대 다섯 개의 출처 카드만 보여 줍니다.
- 하단에는 `이 판정은 화면에 제시된 가상 자료를 기준으로 합니다.`를 고정 안내합니다.
- 별도 라우터 없이 메모리 상태로 화면을 전환하여 브라우저 URL과 학생 정보를 만들지 않습니다.

### 화면별 계약

| 화면 | 핵심 콘텐츠 | 학생 행동 | 완료 조건 |
|---|---|---|---|
| 시작 | 앱 목적, 가상 자료 안내, 팩트체크 한계, 업데이트 내역 | `편집 회의 시작` | 안내 확인 |
| 편집 회의 | 네 교과 데스크와 사건 예상 시간 | 사건 하나 선택 | 팩·사건 선택 |
| 주장 해부 | 분절된 주장 문장, 사실·의견 안내 | 검증에 필요한 원자 조각 선택 | 필수 조각 확인 |
| 출처 데스크 | 처음 출처 카드 4개, 작성 주체·날짜·방법·범위 | 각 렌즈 펼쳐 확인 | 필수 카드와 렌즈 확인 |
| 근거 보드 | 주장 조각 탭, 출처 카드, 네 관계 버튼, `판정 근거로 사용` 선택 | 조각별 관계를 분류하고 후보 출처를 1~3개 선택 | 필수 조각의 관계와 후보 근거 확정 |
| 첫 판정 회의 | 네 판정과 이유 태그 | 판정·이유 함께 선택 | 허용 경로 또는 차원별 피드백 확인 |
| 후속 제보 | 새 출처 1개와 원자료 연결 | 네 렌즈 확인·근거 관계 분류 | 후속 자료 점검 완료 |
| 재검토 | 첫 판정과 새 자료 비교 | 판정 유지 또는 수정·이유 선택 | 최종 경로 충족 |
| 제목 편집 | 대상·근거 표현·기간·표본·조건 어구 | 세 슬롯으로 정확한 제목 조합 | 허용 제목 조합 완성 |
| 결과 카드 | 원 주장, 첫·최종 판정, 근거, 출처, 정확한 제목 | 읽기 전용 결과를 소리 내어 설명하거나 다른 사건 시작 | 세션 완료 |
| 업데이트 내역 | 개발·개선 날짜와 요약 | 닫기 | 이전 화면으로 초점 복귀 |

### 카드 상호작용

- 카드를 끌어 놓지 않아도 주장 조각을 고른 뒤 관계 버튼으로 분류할 수 있게 합니다.
- 각 출처의 `지지`, `반박`, `범위 제한`, `관련 없음`은 현재 선택한 주장 조각에 대한 실제 `button` 또는 라디오 그룹으로 구현합니다.
- 한 출처가 수치 조각은 반박하고 방향 조각은 지지할 수 있으므로 카드 전체에 관계 하나만 고정하지 않습니다.
- 모바일에서는 주장 조각 하나씩 순서대로 분류하고, 넓은 화면에서는 같은 내용을 출처×주장 조각 행렬로 요약합니다.
- 선택 상태는 색뿐 아니라 테두리, 체크 아이콘, `선택됨` 텍스트, `aria-pressed` 또는 `aria-checked`로 알립니다.
- 출처 점검 렌즈는 한 번에 하나씩 펼칠 수 있지만 키보드와 스크린리더에서 모든 내용을 순서대로 읽을 수 있어야 합니다.
- 차트는 시각 보조이며 같은 값을 시맨틱 표와 한 문장 요약으로 함께 제공합니다.
- `다음` 대신 `이 자료로 첫 판정하기`, `새 자료를 반영해 다시 판단하기`처럼 행동을 구체적으로 적습니다.
- 동적 피드백은 `aria-live="polite"`로 제공하고 자동으로 초점을 이동해 사용자의 위치를 빼앗지 않습니다.

### 반응형·접근성 기준

- 모든 클릭·터치 대상은 최소 44×44px로 만듭니다.
- 기본 본문 글자는 모바일에서 17px 이상, 카드 핵심 수치와 판정 버튼은 18px 이상을 목표로 합니다.
- 320px와 375px에서는 단일 열, 768px 이상에서는 출처와 점검 패널을 두 열로 표시합니다.
- 200% 확대에서도 가로 스크롤, 잘린 표, 겹친 판정 버튼이 없어야 합니다.
- 표는 화면이 좁아져도 열 제목과 셀 관계가 유지되도록 카드형 대체 뷰와 접근 가능한 원본 표를 함께 제공합니다.
- 색상만으로 지지·반박을 구분하지 않고 아이콘과 텍스트를 함께 사용합니다.
- 400ms를 넘는 필수 애니메이션을 사용하지 않고 `prefers-reduced-motion`에서는 즉시 상태를 바꿉니다.
- 업데이트 내역과 초기화 확인은 이름 있는 모달, Escape 닫기, 초점 가두기, 호출 버튼으로 초점 복귀를 지원합니다.

### 시각 방향

- 차분한 뉴스룸 작업대, 제보함, 출처 파일, 편집 도장, 교정지를 활용한 시각 언어를 사용합니다.
- 실제 언론사 로고·속보 그래픽·자극적인 빨강 배너를 모방하지 않습니다.
- 판정은 도장 형태로 보여 주되 `거짓`, `가짜` 같은 낙인 표현을 사용하지 않습니다.
- 자료 유형은 표, 짧은 기록, 메모, 단순 그래프 등으로 구분하고 모두 로컬 HTML·SVG로 렌더링합니다.
- 장식 이미지는 보조기기에서 숨기고 의미 있는 표·아이콘에는 텍스트 이름을 제공합니다.

## 9. 데이터·도메인·상태 계약

### 주요 타입

```ts
type SubjectDeskId = string;

type ClaimAtomKind =
  | 'subject'
  | 'attribution'
  | 'measure'
  | 'time'
  | 'scope'
  | 'cause'
  | 'event'
  | 'relation'
  | 'opinion';

type EvidenceRelation =
  | 'supports'
  | 'contradicts'
  | 'limits'
  | 'irrelevant';

type SourceCheckDimension =
  | 'publisher'
  | 'date'
  | 'method'
  | 'scope';

type Verdict =
  | 'confirmed'
  | 'partly-confirmed'
  | 'contradicted'
  | 'insufficient';

type DecisionCheckpoint = 'initial' | 'final';

type NewsroomStage =
  | 'start'
  | 'desk-pick'
  | 'claim-analysis'
  | 'source-check'
  | 'evidence-board'
  | 'initial-verdict'
  | 'late-source'
  | 'final-verdict'
  | 'headline'
  | 'result-card';

interface ClaimAtom {
  id: string;
  kind: ClaimAtomKind;
  text: string;
  checkable: boolean;
  required: boolean;
}

interface HeadlineSlot {
  id: string;
  label: string;
  phraseOptions: { id: string; text: string }[];
}

interface AcceptedHeadlineCombination {
  phraseIds: string[];
  validForDecisionPathIds: string[];
}

interface ReasonOption {
  id: string;
  label: string;
  explanation: string;
}

interface FeedbackEntry {
  id: string;
  dimension: SourceCheckDimension | 'evidence' | 'reason';
  studentMessage: string;
}

interface FactCheckPack {
  schemaVersion: 1;
  id: SubjectDeskId;
  subjectLabel: string;
  shortDescription: string;
  displayOrder: number;
  iconToken: string;
  accentToken: string;
  gradeBand: '5-6';
  standardRefs: string[];
  learningGoals: string[];
  cases: FactCheckCase[];
  sources: SourceCard[];
}

interface FactCheckCase {
  id: string;
  synthetic: true;
  referenceDate: string;
  claimText: string;
  claimAtoms: ClaimAtom[];
  initialSourceIds: readonly [string, string, string, string];
  lateSourceId: string;
  acceptedDecisionPaths: DecisionPath[];
  reasonOptions: ReasonOption[];
  headlineSlots: HeadlineSlot[];
  acceptedHeadlineCombinations: AcceptedHeadlineCombination[];
  misconceptionFeedback: FeedbackEntry[];
  teacherNotes: string[];
}

interface DateRange {
  start: string;
  end: string;
}

interface TemporalBasis {
  kind: 'observation' | 'effective' | 'record';
  period: DateRange | null;
}

interface SourceAtomAssessment {
  relation: EvidenceRelation;
  blockingDimensions: SourceCheckDimension[];
  feedbackId: string;
}

interface SourceCard {
  id: string;
  caseId: string;
  synthetic: true;
  originId: string;
  derivedFromId?: string;
  publisherLabel: string;
  sourceType: string;
  temporalBasis: TemporalBasis;
  publishedAt: string | null;
  methodSummary: string;
  scopeSummary: string;
  excerpt: string;
  atomAssessments: Record<string, SourceAtomAssessment>;
  accessibleSummary: string;
}

interface AtomEvidenceRequirement {
  atomId: string;
  acceptedRelations: EvidenceRelation[];
  forbiddenRelations: EvidenceRelation[];
  minimumEvidenceCount: number;
  minimumIndependentOrigins: number;
}

interface DecisionPath {
  id: string;
  validAtCheckpoints: DecisionCheckpoint[];
  verdict: Verdict;
  atomRequirements: AtomEvidenceRequirement[];
  minimumIndependentOrigins: number;
  acceptedReasonTagSets: string[][];
}

type ClassifiedRelations = Readonly<Record<
  string,
  Readonly<Partial<Record<string, EvidenceRelation>>>
>>;

interface DecisionDraft {
  selectedSourceIds: readonly string[];
  verdict: Verdict | null;
  reasonTags: readonly string[];
}

interface DecisionSnapshot {
  readonly checkpoint: DecisionCheckpoint;
  readonly selectedSourceIds: readonly string[];
  readonly classifiedRelations: ClassifiedRelations;
  readonly verdict: Verdict;
  readonly reasonTags: readonly string[];
  readonly matchedPathId: string;
}

type SaturatingAttemptCount = 0 | 1 | 2;

interface AttemptsByCheckpoint {
  verdict: Readonly<Record<DecisionCheckpoint, SaturatingAttemptCount>>;
  evidenceBySourceAtom: Readonly<
    Record<string, Readonly<Record<string, SaturatingAttemptCount>>>
  >;
}

interface EvidenceEvaluation {
  uncheckedDimensions: SourceCheckDimension[];
  inapplicableDimensions: SourceCheckDimension[];
  missingAtomRequirementIds: string[];
  feedbackId: string;
}

interface NewsroomState {
  stage: NewsroomStage;
  packId: SubjectDeskId | null;
  caseId: string | null;
  selectedAtomIds: string[];
  activeAtomId: string | null;
  inspectedDimensions: Record<string, SourceCheckDimension[]>;
  classifiedRelations: ClassifiedRelations;
  decisionDraft: DecisionDraft;
  initialDecision: DecisionSnapshot | null;
  lateSourceReviewed: boolean;
  finalDecision: DecisionSnapshot | null;
  headlineSelection: Record<string, string>;
  attemptsByCheckpoint: AttemptsByCheckpoint;
}
```

### 콘텐츠 팩 검증 규칙

- 팩 ID는 비어 있지 않은 kebab-case 문자열이어야 하며 팩 ID, 사건 ID, 주장 조각 ID, 출처 ID, 원자료 ID, 판정 경로 ID, 이유 ID, 어구 ID가 각 범위에서 고유해야 합니다.
- 범용 검증기는 유효한 팩 한 개 이상과 팩별 사건 한 개 이상을 허용합니다. 초기 출시 회귀 테스트만 `korean-media`, `science-data`, `math-statistics`, `social-data` 네 ID와 사건 각 1개가 있는지 검사하며, 유효한 다섯 번째 팩을 거부하지 않습니다.
- `displayOrder`, `shortDescription`, `iconToken`, `accentToken`을 팩 데이터가 소유하고 아이콘·색 토큰은 로컬 허용 목록 안에서만 선택합니다. `DeskPicker`는 레지스트리를 정렬해 동적으로 렌더링하고 팩 ID 분기문을 갖지 않습니다.
- 각 사건에는 주장 조각 3~5개, 처음 출처 4개, 후속 출처 1개가 있어야 합니다.
- 모든 사건과 출처에 `synthetic: true`가 있어야 하며 외부 URL 필드를 허용하지 않습니다.
- 알려진 날짜는 사건 기준일과 비교 가능한 `YYYY-MM-DD` 절대 날짜로 저장하며 기간이 `null`이 아닐 때 `temporalBasis.period.start <= temporalBasis.period.end`를 검사합니다. 날짜가 없는 자료는 필드를 생략하지 않고 `null`로 명시하며 해당 원자 평가에 `blockingDimensions: ['date']`를 포함합니다. 관찰·기록 자료는 기간과 발행일이 모두 알려졌을 때 기간 종료 뒤 발행되도록 검사하지만, 사전 운영 안내처럼 `effective` 자료는 적용 기간보다 먼저 발행될 수 있습니다.
- `referenceDate`는 사건 데이터에 고정된 교육용 기준일이며 시스템 현재 시각으로 계산하지 않습니다. 따라서 같은 사건은 언제 실행해도 같은 날짜 판정을 냅니다.
- 모든 출처에 작성 주체, 자료 유형, 관찰·적용·기록 기간 정보, 발행일 정보, 방법, 범위, 짧은 본문, 접근 가능한 요약이 있어야 하며 날짜가 없으면 학생 화면에도 `날짜 표시 없음`을 숨기지 않습니다.
- 모든 `checkable: true` 주장 조각과 출처 조합에 `relation`, `blockingDimensions`, `feedbackId`가 정확히 하나 있어야 합니다. 모든 `feedbackId`는 사건의 피드백 항목을 참조합니다. `supports`·`contradicts`는 차단 차원이 없어야 하고, 직접 적용할 수 없는 자료는 `limits` 또는 `irrelevant`로 작성하며, `limits`는 적어도 한 차단 차원을 가져야 합니다. 날짜·방법·범위 적합성은 이 구조화 메타데이터로 판단하고 한국어 표시 문자열을 파싱하지 않습니다.
- 전체 사건 중 적어도 하나에는 `checkable: false`인 의견 조각이 있어야 하며 의견 조각에는 진위 판정 경로를 연결하지 않습니다.
- 같은 `originId`의 재게시물을 독립 근거로 두 번 세는 판정 경로를 허용하지 않습니다.
- 판정 경로의 `atomRequirements`는 원자 주장별 허용 관계·금지 관계·최소 근거 수·최소 독립 원자료 수를 함께 묶어야 하며 다른 원자에서 얻은 관계로 대신 충족할 수 없습니다. 같은 관계가 허용·금지 목록에 동시에 들어가면 구조 오류입니다.
- 각 체크포인트의 모든 판정 경로는 사건의 `required && checkable` 원자를 빠짐없이 정확히 한 번씩 포함해야 합니다. 같은 원자를 중복하거나 하나라도 생략하면 실패하며, 초기 과학 사건처럼 아직 직접 자료가 없는 원자도 `limits` 요구로 명시합니다.
- 사건의 학생용 `reasonOptions`에는 정답·오개념 선택지를 모두 두고, 판정 경로의 `acceptedReasonTagSets`는 존재하는 이유 ID로 구성된 허용 집합을 가져야 합니다. 학생 선택은 허용 집합 하나와 정확히 일치해야 하며 정답 이유에 오개념 이유를 덧붙여 통과할 수 없습니다.
- 제목 조합은 존재하는 어구와 최종 판정 경로만 참조해야 하며 최종 경로마다 같은 뜻의 검수된 조합이 2개 이상 있어야 합니다.
- 초기·최종 체크포인트마다 학생 선택과 일치하는 경로가 최대 하나여야 합니다. 초기 네 사건의 회귀 테스트는 네 판정 유형을 모두 포함하고 최종 `confirmed` 사건이 적어도 하나인지 별도로 검사합니다.
- 과장 표현 `무조건`, `전부`, `완벽`, `충격`, `100%`는 원래 주장·오개념 예시에만 허용하고 정확한 제목 어구에는 허용하지 않습니다.
- 실제 기관·인물·언론사·URL과 금지 소재 키워드가 없는지 자동 경고와 사람 검수를 모두 통과해야 합니다.
- 학생용 출처 본문은 카드당 120자 안팎으로 제한하고 교사용 해설은 별도 필드에 둡니다.
- 모든 성취기준 참조는 팩 설명에 연결 범위와 한계를 함께 가져야 합니다.

### 판정 엔진 규칙

- `evaluateDecision`은 사건의 `acceptedDecisionPaths`와 학생의 근거·이유 선택을 비교하는 순수 함수입니다.
- 판정 엔진은 교과명, 사건 문구, 출처 이름을 조건문으로 하드코딩하지 않습니다.
- 판정에 쓸 수 있는 근거 연결은 `출처가 후보로 선택됨`, `필수 네 렌즈를 모두 확인함`, `학생이 고른 출처×원자 관계가 검수된 atomAssessment.relation과 일치함`을 모두 충족해야 합니다. 이 `eligibleEdge`만 경로 계산에 사용합니다.

```ts
const eligibleEdge =
  draft.selectedSourceIds.includes(sourceId) &&
  inspectedAllRequiredDimensions(sourceId) &&
  isAssessmentWellFormed(source.atomAssessments[atomId]) &&
  classifiedRelations[sourceId]?.[atomId] ===
    source.atomAssessments[atomId].relation;
```

- 경로 평가 전에 현재 공개된 모든 출처와 `required && checkable` 원자의 학생 분류가 검수 관계와 일치하는지 확인합니다. 한 쌍이라도 다르면 관계 피드백을 먼저 주고 판정 경로를 평가하지 않습니다.
- 후보 출처는 리듀서에서 1~3개로 제한합니다. 선택한 출처는 적어도 하나의 허용 관계로 실제 기여해야 하므로 무관한 카드를 채워 넣는 방식은 통과하지 않습니다.
- 원자별 최소 근거·독립 원자료 수를 충족하더라도 현재 공개·점검한 자료 중 `forbiddenRelations`가 하나라도 있으면 경로를 거부합니다. 예를 들어 `confirmed` 경로는 직접 반박 자료를 후보에서 빼는 방식으로 통과할 수 없습니다.
- 이유 선택은 `acceptedReasonTagSets` 중 하나와 정렬 순서와 무관하게 정확히 일치해야 합니다. 필요한 이유와 모든 오개념 이유를 함께 고르는 방식은 실패합니다.
- 같은 입력에는 항상 같은 `matched`, `uncheckedDimensions`, `inapplicableDimensions`, `missingAtomRequirementIds`, `feedbackId`를 반환하며 자연어 문장을 해석하지 않습니다.
- `uncheckedDimensions`는 아직 열어 보지 않은 렌즈, `inapplicableDimensions`는 확인했지만 날짜·방법·범위가 주장에 맞지 않는 차원, `missingAtomRequirementIds`는 아직 충분한 적합 근거가 없는 주장 조각입니다. 이미 확인한 날짜가 맞지 않는 경우 다시 `날짜를 확인하세요`라고 안내하지 않습니다.
- 출처 카드 수가 아니라 고유 `originId`, 정확한 출처×원자 주장 관계, 원자별 최소 근거 수, 정확히 일치하는 이유 집합을 검사합니다.
- 직접 반박이 없고 근거만 부족한 상태를 `contradicted`로 바꾸지 않습니다.
- 핵심 주장 조각 하나가 해결되지 않으면 `confirmed`를 허용하지 않습니다.
- 복수 판정 경로를 추가하더라도 체크포인트와 최종 경로별 허용 이유 집합을 충족할 때만 인정합니다.
- 이유 태그가 허용 집합과 다르거나 다른 원자에 올바른 관계를 붙인 경우, 다른 판정 경로 전용 제목 어구를 고른 경우에는 완료를 허용하지 않습니다.
- 처음 판정과 최종 판정은 불변 `DecisionSnapshot`으로 따로 저장하고 새 자료가 들어와도 첫 판단을 덮어쓰지 않습니다.
- 판정 경로가 없거나 둘 이상 모순되게 일치하면 임의 선택하지 않고 개발·테스트 단계에서 오류를 냅니다.

### 제목 엔진 규칙

- 제목은 `대상`, `근거가 허용하는 표현`, `시간·표본·조건` 세 슬롯으로 구성하고 학생 화면에서는 공통으로 `정확한 제목 만들기`라고 부릅니다.
- 자유 문장을 자동 채점하지 않고 사건별 검수된 어구와 허용 조합만 사용합니다.
- 판정에 필요한 기간, 표본, 조건을 빠뜨린 제목은 어떤 단어가 필요한지 알려 주고 다시 선택하게 합니다.
- 같은 의미의 제목 조합을 적어도 두 개 허용하여 하나의 문장만 정답으로 만들지 않습니다.
- 출처 표시는 제목에 억지로 넣지 않고 최종 카드의 근거 목록에 원자료 단위로 표시합니다.

### 상태 전이 규칙

- `RESET`만 어느 단계에서든 시작 화면으로 전체 상태를 초기화할 수 있습니다.
- 필수 주장 조각을 확인하기 전에는 출처 점검으로 이동할 수 없습니다.
- 출처 카드의 필수 네 렌즈를 확인하기 전에는 해당 카드를 판정 근거로 확정할 수 없습니다.
- 처음 출처 4개의 필수 점검과 필수 주장 조각별 관계 분류가 끝나기 전에는 첫 판정 회의를 열 수 없습니다.
- 근거 관계 선택은 항상 `activeAtomId`에 한정해 저장하며 다른 주장 조각의 관계를 덮어쓰지 않습니다.
- 판정 근거 후보를 바꾸면 현재 판정·이유 초안만 초기화하고 출처 점검과 관계 분류는 보존합니다.
- 첫 판정은 유효한 초기 경로를 충족한 순간에만 스냅샷으로 남기고 후속 제보를 연 뒤 수정하지 않습니다. 실패 시도는 스냅샷을 만들지 않으며 도움 사용 여부는 성공한 스냅샷의 판정 값을 바꾸지 않습니다.
- 후속 출처의 네 렌즈와 관계를 확인해야 최종 판정을 제출할 수 있습니다.
- 최종 판정 경로가 충족된 뒤에만 제목 편집으로 이동합니다.
- 실패 시도는 `verdict.initial`, `verdict.final`, `evidenceBySourceAtom[sourceId][atomId]`에 분리해 0·1·2로 포화 누적하고 값이 2이면 이후 시도에서도 해당 체크포인트의 도움을 계속 표시합니다.
- 유효한 첫 판정 스냅샷을 만들 때 선택 배열과 중첩 관계 맵을 깊은 복사해 읽기 전용으로 보존합니다. 후속 출처 분류와 결과 카드 선택자는 첫 스냅샷이나 원본 상태를 변경하지 않습니다.
- 사건이나 팩을 바꾸면 그 아래의 주장·출처·판정·제목 상태를 모두 초기화합니다.
- `localStorage`, `sessionStorage`, 쿠키, 서버 전송을 사용하지 않습니다.

## 10. 예정 파일 구조

구현 승인 후 아래 독립 저장소를 새 Codex 작업공간으로 열어 작성합니다.

```text
fact-check-newsroom/
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── scripts/
│   └── check-file-lengths.mjs
├── docs/
│   └── authoring-subject-pack.md
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── newsroom-reducer.ts
│   │   └── newsroom-selectors.ts
│   ├── components/
│   │   ├── AppErrorBoundary.tsx
│   │   ├── AppHeader.tsx
│   │   ├── FactCheckResultCard.tsx
│   │   ├── ClaimAnalyzer.tsx
│   │   ├── DeskPicker.tsx
│   │   ├── EditorHint.tsx
│   │   ├── EvidenceBoard.tsx
│   │   ├── HeadlineComposer.tsx
│   │   ├── ResetDialog.tsx
│   │   ├── SourceCard.tsx
│   │   ├── SourceCheckPanel.tsx
│   │   ├── StartScreen.tsx
│   │   ├── StepProgress.tsx
│   │   ├── UpdateHistoryDialog.tsx
│   │   └── VerdictConference.tsx
│   ├── content/
│   │   ├── content-policy.ts
│   │   ├── registry.ts
│   │   └── packs/
│   │       ├── korean-media/
│   │       │   ├── case.ts
│   │       │   ├── index.ts
│   │       │   └── sources.ts
│   │       ├── math-statistics/
│   │       │   ├── case.ts
│   │       │   ├── index.ts
│   │       │   └── sources.ts
│   │       ├── science-data/
│   │       │   ├── case.ts
│   │       │   ├── index.ts
│   │       │   └── sources.ts
│   │       └── social-data/
│   │           ├── case.ts
│   │           ├── index.ts
│   │           └── sources.ts
│   ├── data/
│   │   └── changelog.ts
│   ├── domain/
│   │   ├── decision-feedback.ts
│   │   ├── evidence-evaluator.ts
│   │   ├── headline-engine.ts
│   │   ├── pack-validator.ts
│   │   ├── types.ts
│   │   └── verdict-engine.ts
│   ├── styles/
│   │   ├── components.css
│   │   ├── layout.css
│   │   └── tokens.css
│   └── test/
│       └── setup.ts
├── tests/
│   ├── components/
│   │   ├── ClaimAnalyzer.test.tsx
│   │   ├── EvidenceBoard.test.tsx
│   │   ├── FactCheckResultCard.test.tsx
│   │   ├── SourceCheckPanel.test.tsx
│   │   ├── UpdateHistoryDialog.test.tsx
│   │   └── VerdictConference.test.tsx
│   ├── content/
│   │   └── packs.test.ts
│   ├── domain/
│   │   ├── evidence-evaluator.test.ts
│   │   ├── headline-engine.test.ts
│   │   ├── pack-validator.test.ts
│   │   └── verdict-engine.test.ts
│   └── state/
│       └── newsroom-reducer.test.ts
└── e2e/
    ├── accessibility.spec.ts
    ├── no-external-network.spec.ts
    └── subject-pack-flows.spec.ts
```

### 파일 크기 원칙

- TypeScript, TSX, CSS, MJS 코드 파일은 모두 500줄 미만으로 유지합니다.
- 컴포넌트와 도메인 파일은 250~300줄을 넘기기 전에 역할별로 분리합니다.
- `App.tsx`는 화면 조립과 상태 연결만 담당하고 200줄 미만을 목표로 합니다.
- 사건 본문과 출처 카드는 교과 팩별 `case.ts`, `sources.ts`로 분리합니다.
- 48개 이상의 관계 행으로 한 팩 파일이 길어지면 출처별 데이터 파일로 추가 분리합니다.
- `scripts/check-file-lengths.mjs`가 코드 파일 500줄 이상을 발견하면 품질 게이트를 실패 처리합니다.

## 11. 구현 작업 계획

아래 명령과 변경은 모두 **구현 승인을 받은 뒤** 독립 저장소에서 실행합니다.

### Task 1: 정적 앱 뼈대와 품질 도구 구성

**Files:**

- Create: `/Users/kimhongnyeon/Dev/codex/fact-check-newsroom/package.json`
- Create: `/Users/kimhongnyeon/Dev/codex/fact-check-newsroom/vite.config.ts`
- Create: `/Users/kimhongnyeon/Dev/codex/fact-check-newsroom/vitest.config.ts`
- Create: `/Users/kimhongnyeon/Dev/codex/fact-check-newsroom/playwright.config.ts`
- Create: `/Users/kimhongnyeon/Dev/codex/fact-check-newsroom/scripts/check-file-lengths.mjs`
- Create: `/Users/kimhongnyeon/Dev/codex/fact-check-newsroom/src/test/setup.ts`

- [ ] **1.1 별도 작업공간에서 Vite React TypeScript 앱을 만들고 Git 저장소를 초기화합니다.**

```bash
cd /Users/kimhongnyeon/Dev/codex
npm create vite@latest fact-check-newsroom -- --template react-ts
cd fact-check-newsroom
git init
```

- [ ] **1.2 React Testing Library, Vitest, Playwright, ESLint 개발 의존성을 설치합니다.**
- [ ] **1.3 `test=vitest run`, `test:watch=vitest`, `pretest:e2e=npm run build`, `test:e2e=playwright test`, `preview=vite preview`와 lint·typecheck·build·check:lines·check 스크립트를 정의합니다.**
- [ ] **1.4 Playwright `webServer`는 빌드 후 `npm run preview -- --host 127.0.0.1 --port 4173`을 실행하고 `reuseExistingServer: false`로 정적 결과를 검사합니다.**
- [ ] **1.5 `check-file-lengths.mjs`가 `src`, `tests`, `e2e`, `scripts`의 코드 파일에서 500줄 이상을 발견하면 파일명과 줄 수를 출력하고 실패하게 합니다.**
- [ ] **1.6 생성 예제 카운터·로고·스타일을 제거하고 빈 앱 셸이 빌드되는지 확인합니다.**
- [ ] **1.7 초기 품질 명령을 통과시키고 첫 커밋을 만듭니다.**

Run: `npm run lint && npm run typecheck && npm run build && npm run check:lines`

Expected: 모든 명령이 종료 코드 0이고 코드 파일이 500줄 미만입니다.

Commit: `chore: scaffold fact check newsroom`

### Task 2: 도메인 타입과 콘텐츠 팩 검증기

**Files:**

- Create: `src/domain/types.ts`
- Create: `src/domain/pack-validator.ts`
- Create: `src/content/content-policy.ts`
- Test: `tests/domain/pack-validator.test.ts`

- [ ] **2.1 9절의 팩, 사건, 주장 조각, 출처, 관계, 판정 경로, 제목, 평가 결과, 포화 시도 카운터, 읽기 전용 스냅샷 타입을 정의합니다.**
- [ ] **2.2 팩 검증기의 실패 테스트를 작성합니다.**

필수 테스트 이름:

1. `accepts the four initial packs and an additional valid pack`
2. `requires four initial sources and one late source per case`
3. `requires a structured assessment for every source and checkable atom pair`
4. `rejects supports or contradicts assessments with blocking dimensions`
5. `does not satisfy an atom with a relation classified on another atom`
6. `requires accepted and forbidden relation sets for every atom requirement`
7. `rejects overlapping relation sets and invalid accepted reason tag sets`
8. `requires every required checkable atom exactly once in each path`
9. `rejects duplicate ids broken references and invalid date ranges`
10. `allows a notice published before its effective period and limits an expired notice`
11. `requires explicit null dates and a date blocker for undated sources`
12. `rejects external urls real entities and missing synthetic flags`
13. `does not count derived sources as independent origins`
14. `rejects missing reason options and cross-path headline combinations`
15. `requires atom-specific evidence and independent-origin constraints`
16. `allows at most one matching path at each checkpoint`
17. `covers all four final verdict types including one confirmed case in the initial release`
18. `keeps opinion atoms outside truth verdict paths`
19. `warns on prohibited topics and overclaiming result phrases`

- [ ] **2.3 모듈이 없어 테스트가 실패하는지 확인합니다.**

Run: `npm test -- pack-validator`

Expected: 모듈 또는 계약 부재로 실패합니다.

- [ ] **2.4 문자열 팩 ID, 표시 순서·설명·아이콘·색 토큰, 관찰/적용/기록 기간, 원자별 허용·금지 근거 요구, 구조화된 출처 적합성, 정확 일치 이유 집합, 경로별 제목 조합을 포함한 스키마와 콘텐츠 정책 상수를 최소 구현합니다.**
- [ ] **2.5 `validatePackRegistry`가 구조·참조·관계 완전성·날짜 범위·독립 원자료·체크포인트별 단일 경로·안전 정책·접근성 요약·성취기준 한계를 검사하게 합니다. 범용 검증기는 추가 팩을 허용합니다.**
- [ ] **2.6 금지 키워드는 자동 거부가 아니라 검수 경고로 분리하고 구조 오류만 빌드를 실패하게 합니다.**
- [ ] **2.7 테스트와 타입 검사를 통과시키고 커밋합니다.**

Run: `npm test -- pack-validator && npm run typecheck`

Expected: 19 tests pass, 0 fail.

Commit: `feat: define subject pack contracts`

### Task 3: 네 교과 팩과 합성 사건 데이터

**Files:**

- Create: `src/content/registry.ts`
- Create: `src/content/packs/korean-media/case.ts`
- Create: `src/content/packs/korean-media/sources.ts`
- Create: `src/content/packs/korean-media/index.ts`
- Create: `src/content/packs/science-data/case.ts`
- Create: `src/content/packs/science-data/sources.ts`
- Create: `src/content/packs/science-data/index.ts`
- Create: `src/content/packs/math-statistics/case.ts`
- Create: `src/content/packs/math-statistics/sources.ts`
- Create: `src/content/packs/math-statistics/index.ts`
- Create: `src/content/packs/social-data/case.ts`
- Create: `src/content/packs/social-data/sources.ts`
- Create: `src/content/packs/social-data/index.ts`
- Test: `tests/content/packs.test.ts`

- [ ] **3.1 초기 네 팩의 정확한 주장, 주장 조각, 출처 역할, 체크포인트별 판정 경로, 이유 선택지, 정확한 제목을 표 기반 실패 테스트로 먼저 작성합니다.**
- [ ] **3.2 국어·매체 팩에 2026년 6월 첫째·셋째 토요일 어린이 열람실 운영 예정 원문, 범위를 넓힌 재게시문, 기간이 끝난 안내, 날짜 없는 의견, 후속 정비 안내를 작성합니다. 실제 운영 완료로 확대하지 않습니다.**
- [ ] **3.3 과학·자료 팩에 3월·6월·9월의 남중 고도와 낮 길이 합성 표, 파생 인포그래픽, 범위 제한 자료, 12월 후속 관측을 작성하여 `insufficient → partly-confirmed` 전환을 검증합니다. 초기 경로에도 12월 원자를 `limits` 요구로 빠짐없이 명시합니다.**
- [ ] **3.4 수학·통계 팩에 독서동아리 12명 설문, 5학년 120명 범위, 파생 83% 카드, 후속 표본 메모를 작성합니다.**
- [ ] **3.5 사회·매체 팩에 1978년 마을 지도, 1998년 수리 완료 기록, 수리를 건설로 바꾼 2026년 재게시문, 날짜 없는 그림엽서, 1982년 후속 유지보수 영수증을 작성합니다.**
- [ ] **3.6 모든 기관명 앞에 `가상`을 붙이고 관찰·적용·기록 기간의 종류, 발행일, 방법, 범위, 출처 계보, 원자별 차단 차원을 구조화해 학생 화면에서 숨기지 않습니다.**
- [ ] **3.7 각 카드의 본문을 120자 안팎으로 다듬고 표·그래프에는 동일 값의 시맨틱 표와 텍스트 요약을, 기록 자료에는 자료 유형·작성 목적의 접근 가능한 요약을 작성합니다.**
- [ ] **3.8 팩 검증기와 콘텐츠 테스트를 통과시키고 커밋합니다.**

Run: `npm test -- packs pack-validator && npm run check:lines`

Expected: 초기 팩 4개, 사건 4개, 출처 20개가 검증되고 추가 유효 팩도 허용되며 모든 코드 파일이 500줄 미만입니다.

Commit: `feat: add four synthetic fact check packs`

### Task 4: 근거 평가와 결정적 판정 엔진

**Files:**

- Create: `src/domain/evidence-evaluator.ts`
- Create: `src/domain/verdict-engine.ts`
- Create: `src/domain/decision-feedback.ts`
- Test: `tests/domain/evidence-evaluator.test.ts`
- Test: `tests/domain/verdict-engine.test.ts`

- [ ] **4.1 출처 계보와 근거 관계 평가의 실패 테스트를 작성합니다.**

필수 사례:

1. 같은 `originId`의 원자료와 재게시물은 독립 근거 하나입니다.
2. 날짜가 주장 기간과 다른 자료는 직접 지지를 강화하지 못합니다.
3. 최신이지만 무관한 자료는 판정 근거가 되지 않습니다.
4. 범위가 좁은 직접 자료는 해당 표본만 지지하고 전체 주장은 제한합니다.
5. 핵심 주장 조각마다 해결·미해결 상태를 반환합니다.
6. 올바른 관계를 다른 주장 조각에 붙이면 해당 원자의 요구 조건을 충족하지 못합니다.
7. 날짜·방법·범위 차단 여부는 구조화된 평가 데이터로 계산하고 표시 문자열이 달라져도 결과가 같습니다.
8. 같은 원자에서 학생 관계가 검수 관계와 다르면 선택된 출처여도 적합 근거 연결이 되지 않습니다.
9. 날짜 렌즈를 확인한 뒤의 날짜 불일치는 `uncheckedDimensions`가 아니라 `inapplicableDimensions`에 들어갑니다.
10. 차단 차원이 잘못 붙은 `supports`·`contradicts` 평가는 방어적으로 적합 근거에서 제외됩니다.

- [ ] **4.2 판정 엔진의 실패 테스트를 작성합니다.**

필수 사례:

1. 도서관 사건은 원문 날짜·대상·행동을 확인하고 재게시 확대를 배제하면 `confirmed`입니다.
2. 과학 사건은 12월 직접 자료가 없을 때 `insufficient`입니다.
3. 과학 사건은 후속 12월 자료 뒤 관계는 지지되고 `정확히 절반`은 반박되어 `partly-confirmed`로 바뀝니다.
4. 수학 사건은 동아리 표본만으로 5학년 전체를 판단하지 않아 `insufficient`입니다.
5. 사회 사건은 1978년 지도와 1998년 수리 완료 기록으로 `처음 만들어짐`을 `contradicted`로 판정하되 정확한 건설 연도를 추측하지 않습니다.
6. 근거 부족을 직접 반박으로 바꾸지 않습니다.
7. `confirmed`에 같은 원자의 직접 반박 자료가 공개·점검되어 있으면 후보에서 빼도 최소 조건을 채워도 실패합니다.
8. 필요한 이유에 오개념 이유를 모두 덧붙인 선택은 허용 이유 집합과 다르므로 실패합니다.
9. 판정만 맞고 허용 이유 집합과 다르거나 다른 체크포인트의 경로를 쓰면 충족하지 않습니다.
10. 같은 입력은 같은 피드백 ID, 미확인 차원, 부적합 차원, 미충족 원자 요구를 반환합니다.
11. 데이터·학생 선택 객체를 변경하지 않습니다.

- [ ] **4.3 테스트 실패를 확인합니다.**

Run: `npm test -- evidence-evaluator verdict-engine`

Expected: 공개 함수가 없어 실패합니다.

- [ ] **4.4 `getIndependentOrigins`, `summarizeAtomCoverage`, `evaluateEvidenceSelection`, `evaluateDecision`을 순수 함수로 구현하고 학생 관계와 검수 관계가 일치하는 적합 연결만 사용해 원자별 관계·근거 수·독립 출처 수를 따로 계산합니다.**
- [ ] **4.5 판정 엔진에는 교과명·사건 ID 조건문을 넣지 않고 `acceptedDecisionPaths`만 평가하게 합니다.**
- [ ] **4.6 `blockingDimensions`와 점검 상태를 사용해 미확인 차원, 확인했지만 부적합한 차원, 미충족 원자 요구를 분리하고 가장 먼저 해결할 한 항목의 피드백을 반환합니다. 한국어 표시 문자열 파싱은 금지합니다.**
- [ ] **4.7 전체 도메인 테스트를 통과시키고 커밋합니다.**

Run: `npm test -- tests/domain && npm run typecheck`

Expected: 도메인 테스트가 모두 통과하고 같은 입력의 결과가 결정적입니다.

Commit: `feat: add evidence and verdict engines`

### Task 5: 제목 엔진과 편집국 상태 흐름

**Files:**

- Create: `src/domain/headline-engine.ts`
- Create: `src/app/newsroom-reducer.ts`
- Create: `src/app/newsroom-selectors.ts`
- Test: `tests/domain/headline-engine.test.ts`
- Test: `tests/state/newsroom-reducer.test.ts`

- [ ] **5.1 제목 어구 조합의 실패 테스트를 작성합니다.**

필수 테스트 이름:

1. `accepts two reviewed headline combinations for the matched final path`
2. `requires time sample and condition phrases for limited claims`
3. `rejects unsupported certainty and sensational phrases`
4. `keeps source citations outside the headline text`
5. `rejects a headline combination for another decision path`

- [ ] **5.2 상태 전이의 실패 테스트를 작성합니다.**

필수 테스트 이름:

1. `starts without student identifiers or persisted data`
2. `prevents skipping claim atoms and source checks`
3. `requires all four source dimensions before first verdict`
4. `scopes a source relation to the active atom`
5. `keeps source by atom relations while resetting an invalid decision draft`
6. `stores the initial decision as an immutable snapshot`
7. `reveals exactly one late source after the first decision`
8. `preserves the first decision while revising the final decision`
9. `requires a valid final path before headline editing`
10. `opens only the initial hint after two initial verdict failures`
11. `keeps the same hint open after a third failure`
12. `keeps initial final and nested source-atom attempt counters separate`
13. `deep copies the initial snapshot before late-source relations change`
14. `derives result card data without mutating state`
15. `clears downstream state when the pack or case changes`
16. `resets without local or session storage`

- [ ] **5.3 실패를 확인하고 `validateHeadline`, `composeHeadline`을 구현합니다.**
- [ ] **5.4 판별 가능한 액션 유니언과 순수 리듀서를 구현합니다.**
- [ ] **5.5 `currentPack`, `currentCase`, `sourceProgress`, `decisionComparison`, `resultCardData`, `activeEditorHint`, `canContinue` 선택자를 구현합니다. 도움 표시와 결과 카드는 원본 상태를 바꾸지 않는 파생 값으로 만듭니다.**
- [ ] **5.6 제목·상태 테스트와 타입 검사를 통과시키고 커밋합니다.**

Run: `npm test -- headline-engine newsroom-reducer && npm run typecheck`

Expected: 제목 5개와 상태 16개 이상의 테스트가 통과합니다.

Commit: `feat: add headline and newsroom state flow`

### Task 6: 앱 셸, 편집 회의, 주장 해부

**Files:**

- Create: `src/app/App.tsx`
- Create: `src/components/AppErrorBoundary.tsx`
- Create: `src/components/AppHeader.tsx`
- Create: `src/components/StartScreen.tsx`
- Create: `src/components/StepProgress.tsx`
- Create: `src/components/DeskPicker.tsx`
- Create: `src/components/ClaimAnalyzer.tsx`
- Create: `src/components/ResetDialog.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/layout.css`
- Create: `src/styles/components.css`
- Test: `tests/components/ClaimAnalyzer.test.tsx`

- [ ] **6.1 가상 자료 배지, 앱 한계, 단계 표시, 업데이트 버튼을 역할 기반 쿼리로 찾는 실패 테스트를 작성합니다.**
- [ ] **6.2 앱 셸과 오류 경계를 구현하되 `App.tsx`에 사건 데이터나 판정 규칙을 넣지 않습니다.**
- [ ] **6.3 `DeskPicker`가 팩 레지스트리를 `displayOrder`로 정렬해 교과명, 한 줄 소개, 예상 시간, 허용된 아이콘·색 토큰, `가상 자료` 표시를 동적으로 제공합니다. 네 초기 ID를 switch 문으로 분기하지 않습니다.**
- [ ] **6.4 주장 문장을 시맨틱 버튼 조각으로 나누고 사건에 필요한 대상·행동·시점·수치·범위·관계 조각을 키보드로 선택하게 합니다.**
- [ ] **6.5 의견 조각에는 진위 판정이 아니라 `의견이라 자료로 참·거짓을 가리지 않아요`라는 설명을 제공합니다.**
- [ ] **6.6 초기화 버튼은 확인 모달을 거치며 취소·확인 후 초점이 예측 가능한 위치로 돌아오게 합니다.**
- [ ] **6.7 320px부터 1280px까지 단계·카드가 겹치지 않는 반응형 셸을 구현합니다.**
- [ ] **6.8 컴포넌트 테스트, 린트, 타입 검사를 통과시키고 커밋합니다.**

Run: `npm test -- ClaimAnalyzer && npm run lint && npm run typecheck`

Expected: 주장 해부 흐름과 접근 가능한 선택 상태가 통과합니다.

Commit: `feat: add newsroom intake and claim analysis`

### Task 7: 출처 점검과 근거 보드

**Files:**

- Create: `src/components/SourceCard.tsx`
- Create: `src/components/SourceCheckPanel.tsx`
- Create: `src/components/EvidenceBoard.tsx`
- Create: `src/components/EditorHint.tsx`
- Test: `tests/components/SourceCheckPanel.test.tsx`
- Test: `tests/components/EvidenceBoard.test.tsx`

- [ ] **7.1 출처 카드의 작성 주체·날짜·방법·범위와 접근 가능한 요약을 찾는 실패 테스트를 작성합니다.**
- [ ] **7.2 같은 원자료 재게시물 표시와 독립 근거 중복 방지 안내의 실패 테스트를 작성합니다.**
- [ ] **7.3 관계 선택이 현재 활성 주장 조각에만 기록되는지, 조각을 바꾸어도 출처별 기존 관계가 보존되는지, 관계 버튼의 선택·수정·키보드 조작과 `aria-pressed` 상태를 검증합니다.**
- [ ] **7.4 `SourceCard`는 별점·신뢰 점수 없이 메타데이터와 원자료 계보를 표시하도록 구현합니다.**
- [ ] **7.5 `SourceCheckPanel`은 네 렌즈를 모두 확인해야 완료되며 날짜·범위가 주장과 맞는지 학생용 질문을 제공합니다.**
- [ ] **7.6 `EvidenceBoard`는 드래그 없이 현재 주장 조각에 대한 네 관계 중 하나를 선택하고, 출처×주장 조각 행렬과 판정 근거 후보 1~3개 선택을 제공합니다. 네 번째 후보 선택은 리듀서와 UI 양쪽에서 막습니다.**
- [ ] **7.7 표와 그래프는 같은 수치의 시맨틱 표, 축·단위·분모, 텍스트 요약을 함께 제공합니다.**
- [ ] **7.8 같은 출처×주장 조각 관계에서 두 번 막히면 확인하지 않은 한 차원만 알려 주는 `편집장 도움`을 표시하고 판정 단계의 시도 횟수와 섞지 않습니다.**
- [ ] **7.9 컴포넌트 테스트와 200% 확대 수동 검사를 통과시키고 커밋합니다.**

Run: `npm test -- SourceCheckPanel EvidenceBoard && npm run build`

Expected: 출처·관계 테스트가 통과하고 외부 자산 없이 빌드됩니다.

Commit: `feat: add source checks and evidence board`

### Task 8: 판정·재검토·결과 카드와 업데이트 내역

**Files:**

- Create: `src/components/VerdictConference.tsx`
- Create: `src/components/HeadlineComposer.tsx`
- Create: `src/components/FactCheckResultCard.tsx`
- Create: `src/components/UpdateHistoryDialog.tsx`
- Create: `src/data/changelog.ts`
- Test: `tests/components/VerdictConference.test.tsx`
- Test: `tests/components/FactCheckResultCard.test.tsx`
- Test: `tests/components/UpdateHistoryDialog.test.tsx`

- [ ] **8.1 네 판정의 조건부 문구, 허용 이유 집합의 정확 일치, 미확인·부적합 차원별 피드백의 실패 테스트를 작성합니다.**
- [ ] **8.2 `insufficient`와 `contradicted`를 화면·아이콘·설명에서 명확히 구분하는 테스트를 작성합니다.**
- [ ] **8.3 첫 판정을 불변 카드로 보여 준 뒤 후속 제보를 공개하고 최종 판정과 나란히 비교합니다.**
- [ ] **8.4 과학 사건에서 첫 `insufficient`와 후속 `partly-confirmed`가 각 체크포인트의 이유 조건으로 완료되고 판정 변화가 설명되는지 컴포넌트 수준으로 검증합니다.**
- [ ] **8.5 `HeadlineComposer`는 `정확한 제목 만들기`라는 이름으로 세 슬롯과 최종 판정 경로에 연결된 두 개 이상의 허용 조합을 제공하고 과장 표현을 선택지에 넣지 않습니다.**
- [ ] **8.6 `FactCheckResultCard`에 원 주장, 첫·최종 판정, 핵심 근거, 고유 원자료 출처, 정확한 제목, `가상 자료` 안내를 읽기 전용으로 표시하고 편집·게시 컨트롤 부재를 컴포넌트 테스트로 고정합니다.**
- [ ] **8.7 저장·공유·인쇄 버튼은 MVP에 넣지 않고 `다른 사건 편집하기`로 메모리 상태만 초기화합니다.**
- [ ] **8.8 모든 화면의 `업데이트 내역` 버튼과 이름 있는 모달을 구현합니다. 버튼의 실제 터치 영역은 최소 44×44px입니다.**
- [ ] **8.9 첫 구현 날짜는 구현 당일의 KST 날짜로 확정하여 `첫 공개: 네 교과 팩의 주장 분석·출처 점검·재검토·결과 카드 흐름 추가`로 기록합니다. 이후 개선마다 같은 데이터 파일 맨 앞에 날짜와 요약을 추가합니다.**
- [ ] **8.10 모달은 Escape 닫기, 초점 가두기, 닫은 뒤 호출 버튼으로 초점 복귀를 지원합니다.**
- [ ] **8.11 컴포넌트 테스트와 접근성 확인을 통과시키고 커밋합니다.**

Run: `npm test -- VerdictConference FactCheckResultCard UpdateHistoryDialog && npm run typecheck`

Expected: 판정·재검토·읽기 전용 결과 카드·업데이트 내역 테스트가 통과합니다.

Commit: `feat: add verdict review and result card`

### Task 9: E2E, 접근성, 팩 작성 문서, 최종 품질 게이트

**Files:**

- Create: `e2e/subject-pack-flows.spec.ts`
- Create: `e2e/accessibility.spec.ts`
- Create: `e2e/no-external-network.spec.ts`
- Create: `docs/authoring-subject-pack.md`
- Update: `README.md`
- Update: 필요 시 앞 단계의 테스트·스타일 파일

- [ ] **9.1 Playwright로 네 교과 팩의 대표 전체 흐름을 작성합니다.**

필수 E2E 사례:

1. 국어·매체 사건에서 원문과 범위를 넓힌 재게시문을 구분하고 `confirmed` 결과 카드를 완성합니다.
2. 과학 사건의 처음 자료만으로 12월 값을 단정하지 않고 `insufficient`로 보류합니다.
3. 과학 사건의 후속 12월 자료 뒤 동반 변화와 정확히 절반을 나누어 `partly-confirmed`로 수정합니다.
4. 수학 사건에서 10/12를 5학년 전체로 일반화하지 않고 `insufficient`로 보류합니다.
5. 사회 사건에서 1978년 지도와 1998년 수리 완료 기록을 대조해 `contradicted` 결과를 완성합니다.
6. 사회 사건에서 2026년 재게시 요약을 1998년 원기록과 독립된 건설 증거로 세지 않습니다.
7. 학생 관계가 검수 관계와 다르거나 직접 반박 자료를 후보에서 뺀 상태에서는 판정·이유가 맞아도 실패하고, 날짜·방법·범위·관계 힌트를 받아 수정합니다.
8. 첫 판정이 후속 제보 뒤에도 보존되고 최종 판정과 비교됩니다.
9. 한 출처의 관계 선택은 현재 활성 주장 조각에만 적용되고 다른 조각의 관계를 바꾸지 않습니다.
10. 첫 판정에서 두 번 실패해도 최종 판정 도움은 열리지 않으며 각 시도 카운터가 분리됩니다.
11. 결과 카드는 읽기 전용이고 본문 작성·발행·공유·투표·방 코드·댓글·그래프 생성·연표 생성 컨트롤이 없습니다.
12. 모든 수치 차트에는 같은 값의 시맨틱 원자료 표와 텍스트 요약이 있습니다.
13. 키보드만으로 데스크 선택부터 결과 카드까지 완료합니다.
14. 업데이트 내역을 Escape로 닫으면 호출 버튼으로 초점이 돌아옵니다.
15. 320×568, 375×812, 768×1024에서 가로 스크롤·겹친 버튼·잘린 표가 없습니다.
16. 200% 확대와 감소된 움직임에서 내용 손실이나 필수 애니메이션 의존이 없습니다.
17. 동일 출처 정적 문서·스크립트·스타일·SVG만 허용하고 외부 출처, API형 `fetch`, XHR, WebSocket 요청이 없습니다.

- [ ] **9.2 `authoring-subject-pack.md`에 문자열 팩 ID와 표시 메타데이터, 출처 계보·관찰/적용/기록 기간·원자별 관계·차단 차원, 이유 선택지, 체크포인트별 판정 경로, 경로별 제목 조합, 안전 검수, 성취기준 연결 한계, 접근성 요약 작성법을 기록합니다.**
- [ ] **9.3 README에 대상, 18~22분 수업 흐름, 가상 자료 원칙, 실행·테스트 명령, 개인정보 비수집, 판정 한계, 파일 크기 기준을 기록합니다.**
- [ ] **9.4 실제 Chrome 계열 브라우저에서 320px, 375px, 768px, 1280px 화면을 수동 확인합니다.**
- [ ] **9.5 키보드 순서, 초점 표시, 표 머리글, 차트 대체 설명, 색상 외 구분, 모달 초점 복귀를 수동 점검합니다.**
- [ ] **9.6 네 사건을 다시 읽어 실제 기관 오인, 사람 낙인, 근거 부족과 반박 혼동, 인과 과장, 금지 소재가 없는지 교사 관점으로 검수합니다.**
- [ ] **9.7 새 교과 팩을 UI·도메인 엔진 수정 없이 폴더와 레지스트리 항목만 추가할 수 있는지 빈 테스트 팩으로 검증한 뒤 테스트 팩은 삭제합니다.**
- [ ] **9.8 전체 품질 게이트를 실행합니다.**

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run check:lines
git diff --check
git status --short
```

Expected:

- 린트·타입·단위·컴포넌트·E2E·정적 빌드가 모두 통과합니다.
- 단위·컴포넌트 테스트는 50개 이상, E2E는 17개 이상입니다.
- 모든 코드 파일이 500줄 미만입니다.
- 외부 요청, 저장된 학생 데이터, 콘솔 오류, 실제 기관·URL이 없습니다.
- 네 팩 모두 유효한 근거·판정·제목 경로를 가지고 있습니다.
- 계획과 구현에 필요한 파일만 변경되어 있습니다.

- [ ] **9.9 검수 결과와 알려진 제한을 README에 반영하고 구현 완료 커밋을 만듭니다.**

Commit: `docs: complete newsroom quality checks`

## 12. 구현 역할과 진행 규칙

- `gpt-5.6-sol`은 계획 확정, 작업 분할, 위험 판단, 최종 오케스트레이션에만 사용합니다.
- 실제 코드 작성, 테스트 실행, 구현 리뷰는 `gpt-5.6-terra`가 담당합니다.
- 구현·리뷰 과정에서 하위 에이전트를 구성하면 `gpt-5.6-luna`를 사용합니다.
- 구현자는 Task 1부터 순서대로 진행하며 한 Task의 테스트와 품질 확인이 끝나기 전 다음 Task로 넘어가지 않습니다.
- 현재 `vibecoding-lab` 저장소에는 이 계획 문서만 두고 실제 앱은 독립 저장소에서 구현합니다.
- 현재 작업공간의 쓰기 범위 밖에 새 저장소를 만들기 전 해당 경로를 별도 Codex 작업공간으로 열거나 명시적 권한을 확보합니다.
- 구현 중 제품·콘텐츠·성취기준 범위가 달라지는 결정이 생기면 계획 문서를 먼저 갱신하고 사용자 확인을 받습니다.
- 실제 뉴스나 외부 자료를 추가하려는 요구는 MVP 범위 변경으로 보고 별도 안전 검토를 거칩니다.
- 각 커밋 전 `git diff --check`, 관련 테스트, `npm run check:lines`를 실행합니다.
- 배포와 HVC 등록은 구현 완료와 별도의 승인 단계로 남깁니다.

## 13. 완료 조건

### 기능·교과 확장

- [ ] 초기 네 교과 팩 중 하나를 선택해 18~22분 안에 한 사건을 완료할 수 있습니다.
- [ ] 사건마다 주장 조각 3~5개, 처음 출처 4개, 후속 출처 1개가 제공됩니다.
- [ ] 작성 주체·날짜·방법·범위를 확인하고 네 근거 관계로 분류할 수 있습니다.
- [ ] 첫 판정과 최종 판정이 별도 스냅샷으로 보존됩니다.
- [ ] 네 최종 판정 유형이 초기 콘텐츠 전체에 모두 등장하며 근거 부족과 직접 반박이 구분됩니다.
- [ ] 과학 사건은 후속 직접 자료에 따라 첫 판정이 `insufficient`에서 최종 `partly-confirmed`로 실제 변경됩니다.
- [ ] 사건의 각 체크포인트에는 일치하는 판정 경로가 하나만 있고, 최종 경로마다 정확한 제목 조합이 두 개 이상입니다.
- [ ] 새 교과 팩은 UI·판정 엔진 변경 없이 팩 폴더와 레지스트리 항목만 추가할 수 있으며 다섯 번째 시험 팩 회귀 테스트가 이를 증명합니다.

### 교육·안전

- [ ] `[6국06-02]`, `[6국02-03]` 중심의 신뢰성·타당성 평가 활동이 분명합니다.
- [ ] 수학·과학 팩은 연결된 성취기준의 제한된 해석·추론 요소만 지원한다고 표시합니다.
- [ ] 의견을 거짓으로 판정하거나 출처 이름만으로 신뢰 점수를 매기지 않습니다.
- [ ] 같은 원자료의 재게시물을 독립 근거로 중복 계산하지 않습니다.
- [ ] `insufficient`를 `contradicted`로 바꾸지 않고 모든 판정을 제시 자료 기준으로 표현합니다.
- [ ] 모든 사건·출처에 가상·합성 자료임을 표시하고 실제 기관·인물·URL을 사용하지 않습니다.
- [ ] 정치·의료·재난·범죄·혐오·투자 등 금지 소재가 없습니다.
- [ ] 학생 이름·사진·음성·URL·파일을 입력하거나 저장하지 않습니다.

### 사용성·접근성

- [ ] 드래그 없이 터치와 키보드로 전체 활동을 완료할 수 있습니다.
- [ ] 모든 버튼이 44×44px 이상이고 선택·판정 상태가 색상 외 방식으로도 구분됩니다.
- [ ] 모든 차트에 동일 데이터를 담은 표와 텍스트 요약이 있습니다.
- [ ] 결과 카드는 읽기 전용이며 기사 본문 작성·발행·공유·투표·방·댓글·그래프·연표 제작 기능이 없습니다.
- [ ] 320px, 375px, 768px, 1280px, 200% 확대에서 내용 손실이나 가로 스크롤이 없습니다.
- [ ] 감소된 움직임 설정에서도 핵심 정보가 그대로 제공됩니다.
- [ ] 업데이트 내역과 초기화 모달의 키보드·초점 흐름이 올바릅니다.

### 기술·운영

- [ ] 서버, 외부 API, 런타임 CDN, 브라우저 저장소 없이 정적 빌드로 동작합니다.
- [ ] 단위·컴포넌트 테스트 50개 이상과 E2E 17개 이상이 통과합니다.
- [ ] TypeScript, ESLint, 정적 빌드, 파일 길이 검사, `git diff --check`가 통과합니다.
- [ ] 모든 코드 파일이 500줄 미만입니다.
- [ ] `업데이트 내역`에 실제 개발 날짜와 첫 공개 내용을 기록하고 개선할 때마다 최신순으로 추가할 수 있습니다.

## 14. 후속 확장 후보

아래 항목은 MVP 완료 후 별도 검토하며 현재 구현 범위에 넣지 않습니다.

1. **3~4학년 기초 편집국:** 사실·의견 구분, 출처 확인, 짧은 검증 보고서 중심의 단순 흐름
2. **생태 관찰 기록 팩:** 가상 계절 생물 기록의 관찰 시기·장소·방법을 비교하는 과학 팩
3. **가능성 제목 팩:** `반드시`, `절대` 표현을 가능성 자료에 맞게 바꾸는 수학 팩
4. **이미지 맥락 팩:** 잘린 축, 잘린 사진, 캡션 차이에 따른 의미 변화를 분석하는 미술·매체 팩
5. **모의 검색 데스크:** 실제 인터넷 없이 검색어, 기간, 자료 유형 필터를 연습하는 팩
6. **교사용 팩 제작 도구:** 별도 프로젝트에서 스키마 검증과 안전 검수를 거쳐 로컬 팩 파일을 만드는 기능
7. **인쇄용 결과 카드:** 개인정보 없이 사건 결과를 교실 토론 자료로 인쇄하는 기능

후속 확장도 `실제 웹 검색 없음`, `가상 자료`, `근거 부족과 반박 구분`, `출처 종류만으로 판단 금지`, `공통 팩 계약` 원칙을 유지해야 합니다.
