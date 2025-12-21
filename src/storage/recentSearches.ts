import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@recent_search_v1';
const MAX = 8;

/**
 * ✅ 최근 검색어 전체 조회
 */
export async function loadRecents(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * ✅ 최근 검색어 추가(중복 제거 + 최신 검색어가 앞에 오도록 + 최대 개수 제한)
 */
export async function addRecent(keyword: string): Promise<string[]> {
  const k = keyword.trim();
  if (!k) return loadRecents();

  const prev = await loadRecents();
  const next = [k, ...prev.filter(x => x !== k)].slice(0, MAX);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

/**
 * ✅ 특정 검색어 삭제
 */
export async function removeRecent(keyword: string): Promise<string[]> {
  const prev = await loadRecents();
  const next = prev.filter(x => x !== keyword);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
