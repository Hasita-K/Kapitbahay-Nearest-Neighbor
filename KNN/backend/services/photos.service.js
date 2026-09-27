// backend/services/photos.service.js
//
// The actual file upload to Supabase Storage happens client-side (React
// Native, using supabase.storage.from('completion-photos').upload(...)).
// This service just records the resulting photo_url against the request.
// Path convention (frontend's responsibility): {request_id}/{photo_id}.jpg

async function recordPhoto(supabase, userId, requestId, photoUrl) {
  if (!photoUrl) throwHttp('photo_url is required', 400);

  // RLS already enforces requester-only + status='completed' on INSERT,
  // but checking here first gives a clear message instead of a raw
  // Postgres RLS-denial error bubbling up.
  const { data: request, error: reqError } = await supabase
    .from('food_request')
    .select('requester_id, status')
    .eq('food_request_id', requestId)
    .single();
  if (reqError) throwHttp('Request not found', 404);
  if (request.requester_id !== userId) throwHttp('Only the requester can upload the completion photo', 403);
  if (request.status !== 'completed') throwHttp('Photo can only be added to a completed request', 409);

  const { data, error } = await supabase
    .from('photos')
    .insert({ request_id: requestId, uploader_id: userId, photo_url: photoUrl })
    .select()
    .single();
  if (error) throwHttp(error.message, 400);
  return data;
}

async function getPhoto(supabase, requestId) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('request_id', requestId)
    .single();
  if (error) throwHttp('No photo found for this request', 404);
  return data;
}

async function listMine(supabase, userId) {
  const { data, error } = await supabase.from('photos')
    .select('photo_id,request_id,uploader_id,photo_url,created_at')
    .eq('uploader_id', userId).order('created_at', { ascending: false });
  if (error) throwHttp(error.message, 400);
  return data;
}

function throwHttp(message, status) {
  const e = new Error(message);
  e.status = status;
  throw e;
}

module.exports = { recordPhoto, getPhoto, listMine };
