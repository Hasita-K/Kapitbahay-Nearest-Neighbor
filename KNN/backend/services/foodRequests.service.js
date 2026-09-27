// backend/services/foodRequests.service.js
//
// State machine recap:
//   pending  (awaiting = receiver)   -> receiver: accept | reject | counter
//   countered (awaiting = requester) -> requester: reject | updateOffer (resend)
//   countered (awaiting = receiver)  -> receiver: accept | reject | counter   [loops]
//   accepted -> requester: complete
//   completed -> requester: thankYou (once)
//
// The ask (requested_food_items) is written ONCE at creation and never
// touched again by any function below. Only offered_items ever changes,
// and only updateOffer() ever writes to it.

const profileStatsService = require('./profileStats.service');

async function createRequest(supabase, requesterId, { receiver_id, requested_items, offered_items }) {
  if (!receiver_id) throwHttp('receiver_id is required', 400);
  if (!Array.isArray(requested_items) || requested_items.length === 0) {
    throwHttp('requested_items must be a non-empty array', 400);
  }

  const { data: request, error: requestError } = await supabase
    .from('food_request')
    .insert({
      requester_id: requesterId,
      receiver_id,
      status: 'pending',
      awaiting_response_from: receiver_id, // receiver goes first
      completed: false,
      thanked: false,
    })
    .select()
    .single();
  if (requestError) throwHttp(requestError.message, 400);

  const requestedRows = requested_items.map((item) => ({
    request_id: request.food_request_id,
    item_id: item.item_id,
    qty: item.qty,
  }));
  const { error: reqItemsError } = await supabase.from('requested_food_items').insert(requestedRows);
  if (reqItemsError) throwHttp(reqItemsError.message, 400);

  if (Array.isArray(offered_items) && offered_items.length > 0) {
    const offeredRows = offered_items.map((item) => ({
      request_id: request.food_request_id,
      item_id: item.item_id,
      qty: item.qty,
    }));
    const { error: offerError } = await supabase.from('offered_items').insert(offeredRows);
    if (offerError) throwHttp(offerError.message, 400);
  }

  return getRequestWithItems(supabase, request.food_request_id);
}

async function getRequestWithItems(supabase, requestId) {
  const { data, error } = await supabase
    .from('food_request')
    .select('*, requested_food_items(*), offered_items(*)')
    .eq('food_request_id', requestId)
    .single();
  if (error) throwHttp('Request not found', 404);
  return data;
}

async function listForUser(supabase, userId) {
  const { data, error } = await supabase
    .from('food_request')
    .select('*, requested_food_items(*), offered_items(*)')
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);
  if (error) throwHttp(error.message, 400);
  return data;
}

async function accept(supabase, userId, requestId) {
  const request = await getRequestWithItems(supabase, requestId);
  assertOpen(request);
  if (userId !== request.receiver_id) throwHttp('Only the receiver can accept a request', 403);
  assertTurn(request, userId);

  return updateStatus(supabase, requestId, { status: 'accepted', awaiting_response_from: null });
}

async function reject(supabase, userId, requestId) {
  const request = await getRequestWithItems(supabase, requestId);
  assertOpen(request);
  // Either party can reject — assertTurn already restricts this to
  // whoever's turn it currently is, since awaiting_response_from
  // alternates between requester_id and receiver_id.
  assertTurn(request, userId);

  return updateStatus(supabase, requestId, { status: 'rejected', awaiting_response_from: null });
}

async function counter(supabase, userId, requestId) {
  const request = await getRequestWithItems(supabase, requestId);
  assertOpen(request);
  if (userId !== request.receiver_id) throwHttp('Only the receiver can counter', 403);
  assertTurn(request, userId);

  return updateStatus(supabase, requestId, {
    status: 'countered',
    awaiting_response_from: request.requester_id,
  });
}

async function updateOffer(supabase, userId, requestId, offeredItems) {
  const request = await getRequestWithItems(supabase, requestId);
  if (request.status !== 'countered') throwHttp('Offer can only be changed while a request is countered', 409);
  if (userId !== request.requester_id) throwHttp('Only the requester can change the offer', 403);
  assertTurn(request, userId);
  if (!Array.isArray(offeredItems)) throwHttp('offered_items must be an array (can be empty)', 400);

  // Replace the offer wholesale: delete old rows, insert new ones.
  const { error: deleteError } = await supabase.from('offered_items').delete().eq('request_id', requestId);
  if (deleteError) throwHttp(deleteError.message, 400);

  if (offeredItems.length > 0) {
    const rows = offeredItems.map((item) => ({ request_id: requestId, item_id: item.item_id, qty: item.qty }));
    const { error: insertError } = await supabase.from('offered_items').insert(rows);
    if (insertError) throwHttp(insertError.message, 400);
  }

  // Resending flips the turn back to the receiver; status stays 'countered'.
  return updateStatus(supabase, requestId, { awaiting_response_from: request.receiver_id });
}

async function complete(supabase, userId, requestId) {
  const request = await getRequestWithItems(supabase, requestId);
  if (request.status !== 'accepted') throwHttp('Only an accepted request can be completed', 409);
  if (userId !== request.requester_id) throwHttp('Only the requester can mark a request completed', 403);

  const updated = await updateStatus(supabase, requestId, { status: 'completed', completed: true });

  // Isolated in its own service — this is the only call in this file that
  // ever touches the service-role admin client (indirectly, via profileStats.service.js).
  await profileStatsService.incrementDealsCompleted([request.requester_id, request.receiver_id]);

  return updated;
}

async function thankYou(supabase, userId, requestId) {
  const request = await getRequestWithItems(supabase, requestId);
  if (request.status !== 'completed') throwHttp('Thank-you is only available after completion', 409);
  if (userId !== request.requester_id) throwHttp('Only the requester can send a thank-you', 403);
  if (request.thanked) throwHttp('This request has already been thanked', 409);

  const updated = await updateStatus(supabase, requestId, { thanked: true });
  await profileStatsService.incrementThankYouCount(request.receiver_id);

  return updated;
}

// --- internal helpers ---

async function updateStatus(supabase, requestId, fields) {
  const { data, error } = await supabase
    .from('food_request')
    .update(fields)
    .eq('food_request_id', requestId)
    .select()
    .single();
  if (error) throwHttp(error.message, 400);
  return data;
}

function assertTurn(request, userId) {
  if (request.awaiting_response_from !== userId) throwHttp('It is not your turn on this request', 403);
}

function assertOpen(request) {
  if (!['pending', 'countered'].includes(request.status)) {
    throwHttp(`Request is already ${request.status} and can no longer be acted on`, 409);
  }
}

function throwHttp(message, status) {
  const e = new Error(message);
  e.status = status;
  throw e;
}

module.exports = {
  createRequest,
  listForUser,
  getRequestWithItems,
  accept,
  reject,
  counter,
  updateOffer,
  complete,
  thankYou,
};
