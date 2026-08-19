// Shared filter option data for the Problems page.
// Kept centralized so the sidebar, dropdowns, and page logic never drift apart.

export const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', dot: 'var(--ca-easy)' },
  { value: 'medium', label: 'Medium', dot: 'var(--ca-medium)' },
  { value: 'hard', label: 'Hard', dot: 'var(--ca-hard)' },
];

export const TOPICS = [
  'Array',
  'String',
  'Linked List',
  'Tree',
  'Graph',
  'Dynamic Programming',
  'Binary Search',
  'Stack',
  'Queue',
  'Greedy',
  'Backtracking',
];

// Normalizes a tag/topic string so values like "linkedList", "linked-list"
// and "Linked List" all compare equal.
export const normalizeTag = (value = '') =>
  value.toString().toLowerCase().replace(/[\s_-]+/g, '');

// Small local dataset used only when the backend hasn't returned any
// problems yet (e.g. offline preview). Not a replacement for the real API.
export const DUMMY_PROBLEMS = [
  { _id: 'd1', title: 'Two Sum', difficulty: 'easy', tags: 'Array' },
  { _id: 'd2', title: 'Add Two Numbers', difficulty: 'easy', tags: 'Linked List' },
  { _id: 'd3', title: 'Binary Search', difficulty: 'easy', tags: 'Binary Search' },
  { _id: 'd4', title: 'Merge Intervals', difficulty: 'medium', tags: 'Array' },
  { _id: 'd5', title: 'Word Search', difficulty: 'medium', tags: 'Backtracking' },
  { _id: 'd6', title: 'Valid Parentheses', difficulty: 'easy', tags: 'Stack' },
  { _id: 'd7', title: 'Maximum Subarray', difficulty: 'medium', tags: 'Dynamic Programming' },
  { _id: 'd8', title: 'Climbing Stairs', difficulty: 'easy', tags: 'Dynamic Programming' },
  { _id: 'd9', title: 'Reverse Linked List', difficulty: 'easy', tags: 'Linked List' },
  { _id: 'd10', title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', tags: 'String' },
];
