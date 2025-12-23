# 📘 DIVE API 명세서

프론트엔드 개발을 위한 백엔드 API 안내서입니다.
Base URL: `http://localhost:3000/api`

---

## 1. 🤖 테마 분석 및 장소 추천

사용자가 입력한 테마와 지역을 기반으로 AI가 장소를 추천해줍니다.

- **Endpoint:** `POST /theme/analyze`
- **Content-Type:** `application/json`

### Request Body

```json
{
  "theme": "케이온 성지순례",
  "location": "일본 교토"
}
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "name": "토요사토 초등학교",
      "description": "애니메이션 속 사쿠라가오카 고등학교의 실제 모델이 된 장소입니다.",
      "address": "Shiga, Toyosato",
      "tags": ["성지순례", "학교", "케이온"]
    },
    {
      "name": "JEUGIA 산조 본점",
      "description": "유이가 기타를 샀던 악기점의 실제 모델입니다.",
      "address": "Kyoto, Nakagyo Ward",
      "tags": ["악기점", "쇼핑"]
    }
  ]
}
```

---

## 2. ✈️ 여행 일정 생성 (저장)

프론트엔드에서 편집한 여행 일정을 DB에 저장합니다.

- **Endpoint:** `POST /itinerary`
- **Content-Type:** `application/json`

### Request Body

```json
{
  "userId": "user_uuid_1234",
  "title": "유이와 함께하는 교토 여행",
  "theme": "케이온 성지순례",
  "items": [
    {
      "place_name": "토요사토 초등학교",
      "day": 1,
      "order": 1,
      "lat": 35.1234,
      "lng": 136.1234,
      "memo": "거북이 계단 꼭 찍기!"
    },
    {
      "place_name": "JEUGIA 산조 본점",
      "day": 1,
      "order": 2,
      "lat": 35.5678,
      "lng": 135.5678,
      "memo": "기타 구경하기"
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "itinerary_uuid_new",
    "title": "유이와 함께하는 교토 여행",
    "created_at": "2023-12-25T..."
  }
}
```

---

## 3. 📅 여행 일정 조회

저장된 여행 일정을 불러옵니다. (공유 페이지 등에서 사용)

- **Endpoint:** `GET /itinerary/:id`

### Response

```json
{
  "success": true,
  "data": {
    "id": "itinerary_uuid_1234",
    "title": "유이와 함께하는 교토 여행",
    "theme": "케이온 성지순례",
    "itinerary_items": [
      {
        "place_name": "토요사토 초등학교",
        "day": 1,
        "order": 1,
        "lat": 35.1234,
        "lng": 136.1234,
        "memo": "거북이 계단 꼭 찍기!"
      }
      // ...
    ]
  }
}
```

---

## 4. ✅ 데이터 타입 (TypeScript)

프론트엔드에서 사용할 타입 정의입니다.

```typescript
export interface RecommendedPlace {
  name: string;
  description: string;
  address: string;
  tags: string[];
}

export interface ItineraryItem {
  place_name: string;
  day: number;
  order: number;
  lat?: number;
  lng?: number;
  memo?: string;
}
```

---

## 5. 🗓️ AI 일정 생성

테마와 기간을 입력하면 AI가 최적의 일정을 짜줍니다.

- **Endpoint:** `POST /theme/schedule`
- **Content-Type:** `application/json`

### Request Body

```json
{
  "theme": "케이온 성지순례",
  "location": "일본 교토",
  "duration": "2박 3일"
}
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "day": 1,
      "places": [
        {
          "name": "토요사토 초등학교",
          "description": "사쿠라가오카 고등학교 모델",
          "time": "10:00 AM"
        },
        {
          "name": "JEUGIA 산조 본점",
          "description": "유이가 기타 산 곳",
          "time": "02:00 PM"
        }
      ]
    },
    {
      "day": 2,
      "places": [...]
    }
  ]
}
```

---

## 6. ✅ 장소 팩트체크

특정 장소가 실제로 존재하고 운영 중인지 AI가 확인해줍니다.

- **Endpoint:** `POST /verify`
- **Content-Type:** `application/json`

### Request Body

```json
{
  "placeName": "토요사토 초등학교"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "exists": true,
    "verification_score": 95,
    "reason": "구글 지도 및 공식 웹사이트에서 확인됨"
  }
}
```

---

## 7. 🚗 경로 계산 (거리/시간)

두 지점 사이의 거리와 예상 소요 시간을 계산합니다.

- **Endpoint:** `POST /route/calculate`
- **Content-Type:** `application/json`

### Request Body

```json
{
  "start": {
    "lat": 35.1234,
    "lng": 136.1234
  },
  "end": {
    "lat": 35.5678,
    "lng": 135.5678
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "distance": "54.21km",
    "duration": "108분",
    "type": "direct_distance_mock"
  }
}
```
