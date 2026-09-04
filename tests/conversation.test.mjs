import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getOtherUser, displayName, avatarUrl } from '../utils/conversation.js';

const u1 = { id: 'a', name: 'Asha', profile: { avatarUrl: 'https://img/a.png' } };
const u2 = { id: 'b', name: 'Ravi', profile: { avatarUrl: null } };
const convo = { id: 'c1', user1: u1, user2: u2, messages: [] };

test('returns the other participant, not me', () => {
  assert.equal(getOtherUser(convo, 'a'), u2);
  assert.equal(getOtherUser(convo, 'b'), u1);
});

test('falls back to user1 when myId unknown', () => {
  assert.equal(getOtherUser(convo, ''), u1);
  assert.equal(getOtherUser(convo, null), u1);
});

test('returns null for missing conversation', () => {
  assert.equal(getOtherUser(null, 'a'), null);
});

test('displayName falls back to "User"', () => {
  assert.equal(displayName(u1), 'Asha');
  assert.equal(displayName({}), 'User');
  assert.equal(displayName(null), 'User');
});

test('avatarUrl prefers profile avatar, else ui-avatars', () => {
  assert.equal(avatarUrl(u1, 'Asha'), 'https://img/a.png');
  const fb = avatarUrl(u2, 'Ravi');
  assert.match(fb, /ui-avatars\.com/);
  assert.match(fb, /Ravi/);
});
