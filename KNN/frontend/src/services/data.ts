import { apiDelete, apiGet, apiPatch, apiPost } from './api';

export type Profile = {
  id: string;
  username: string;
  phone_number: string | null;
  unique_friend_code: string | null;
};

export type ProfileStats = { deals_completed: number; thank_you_count: number };
export type Village = {
  villages_id: string;
  name: string;
  owner_id: string;
  created_at: string;
  members?: Array<{ user_id: string; username: string; member_id?: string }>;
};
export type FridgeItem = {
  fridge_items_id: string;
  owner_id: string;
  icon: string | null;
  name: string;
  count: number;
  created_at: string;
};
export type RequestItem = { request_id: string; item_id: string; qty: number; item?: Pick<FridgeItem, 'name' | 'icon' | 'count'> | null };
export type FoodRequest = {
  food_request_id: string;
  requester_id: string;
  receiver_id: string;
  status: 'pending' | 'countered' | 'accepted' | 'rejected' | 'completed';
  awaiting_response_from: string | null;
  created_at: string;
  completed: boolean;
  thanked: boolean;
  requested_food_items: RequestItem[];
  offered_items: RequestItem[];
  requester?: Profile;
  receiver?: Profile;
};
export type Photo = { photo_id: string; request_id: string; uploader_id: string; photo_url: string; created_at: string };

export const getMyProfile = () => apiGet<Profile>('/profiles/me');
export const getMyProfileStats = () => apiGet<ProfileStats>('/profiles/me/stats');
export const getVillages = () => apiGet<Village[]>('/villages');
export const createVillage = (name: string) => apiPost<Village>('/villages', { name });
export const lookupVillager = (code: string) => apiGet<Profile>('/villages/lookup', { params: { code } });
export const addVillageMember = (villageId: string, friendUserId: string) =>
  apiPost('/villages/' + encodeURIComponent(villageId) + '/members', { friend_user_id: friendUserId });
export const removeVillageMember = (villageId: string, memberId: string) =>
  apiDelete(`/villages/${encodeURIComponent(villageId)}/members/${encodeURIComponent(memberId)}`);

export const getFridgeItems = (ownerId?: string) =>
  apiGet<FridgeItem[]>(ownerId ? `/fridge-items/${encodeURIComponent(ownerId)}` : '/fridge-items');
export const createFridgeItem = (item: { name: string; count: number; icon?: string }) =>
  apiPost<FridgeItem>('/fridge-items', item);
export const updateFridgeItem = (id: string, updates: Partial<Pick<FridgeItem, 'name' | 'count' | 'icon'>>) =>
  apiPatch<FridgeItem>(`/fridge-items/${encodeURIComponent(id)}`, updates);
export const deleteFridgeItem = (id: string) => apiDelete(`/fridge-items/${encodeURIComponent(id)}`);

export const getFoodRequests = () => apiGet<FoodRequest[]>('/food-requests');
export const createFoodRequest = (input: { receiver_id: string; requested_items: Array<{ item_id: string; qty: number }>; offered_items: Array<{ item_id: string; qty: number }> }) =>
  apiPost<FoodRequest>('/food-requests', input);
export const acceptFoodRequest = (id: string) => apiPost<FoodRequest>(`/food-requests/${encodeURIComponent(id)}/accept`);
export const rejectFoodRequest = (id: string) => apiPost<FoodRequest>(`/food-requests/${encodeURIComponent(id)}/reject`);
export const counterFoodRequest = (id: string) => apiPost<FoodRequest>(`/food-requests/${encodeURIComponent(id)}/counter`);
export const updateFoodOffer = (id: string, offered_items: Array<{ item_id: string; qty: number }>) =>
  apiPatch<FoodRequest>(`/food-requests/${encodeURIComponent(id)}/offer`, { offered_items });
export const completeFoodRequest = (id: string) => apiPost<FoodRequest>(`/food-requests/${encodeURIComponent(id)}/complete`);
export const thankFoodRequest = (id: string) => apiPost<FoodRequest>(`/food-requests/${encodeURIComponent(id)}/thank-you`);

export const getRequestPhoto = (requestId: string) =>
  apiGet<Photo>(`/photos/${encodeURIComponent(requestId)}`).catch(() => null);
export const getMyPhotos = () => apiGet<Photo[]>('/photos/mine');
export const saveRequestPhoto = (requestId: string, photo_url: string) =>
  apiPost<Photo>(`/photos/${encodeURIComponent(requestId)}`, { photo_url });
