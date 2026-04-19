const mongoose = require("mongoose");
require("dotenv").config();
const Problem = require("./models/Problem");

const newProblems = [
  {
    title: "Rain Collector Valleys",
    difficulty: "Medium",
    description: `You are given an array of integers representing the heights of terrain blocks. 
After heavy rain, water gets trapped between the blocks. 
Find the total units of water that can be collected.

Input Format:
- First line: integer N (number of blocks)
- Second line: N space-separated integers representing heights

Output Format:
- Single integer: total water collected

Constraints:
- 1 <= N <= 10^5
- 0 <= height[i] <= 10^4

Example Input:
6
0 1 0 2 1 0 1 3 2 1 2 1

Example Output:
6

Explanation:
Water is trapped between the taller blocks. Using left-max and right-max arrays, 
water at each index = min(leftMax, rightMax) - height[i].
Total = 6 units.

Edge Cases:
- All blocks same height → 0 water
- Strictly increasing/decreasing → 0 water`,
    tags: ["Array", "Two Pointers", "Dynamic Programming"],
    source: "Interview Pattern"
  },
  {
    title: "Zigzag Level Traversal",
    difficulty: "Medium",
    description: `Given the root of a binary tree, return the zigzag level order traversal 
of its nodes' values. Odd levels go left-to-right, even levels go right-to-left.

Input Format:
- Binary tree root node

Output Format:
- 2D array of integers representing zigzag traversal

Constraints:
- 0 <= Number of nodes <= 2000
- -100 <= Node.val <= 100

Example Input:
Tree: [3, 9, 20, null, null, 15, 7]

Example Output:
[[3], [20, 9], [15, 7]]

Explanation:
Level 1 (odd): [3] → left to right
Level 2 (even): [20, 9] → right to left
Level 3 (odd): [15, 7] → left to right

Edge Cases:
- Single node tree
- Completely skewed tree`,
    tags: ["Tree", "BFS", "Queue"],
    source: "Interview Pattern"
  },
  {
    title: "Minimum Cost Path in Grid",
    difficulty: "Medium",
    description: `You are given an M x N grid where each cell has a cost. 
Starting from top-left (0,0), reach bottom-right (M-1, N-1) 
with minimum total cost. You can only move right, down, or diagonally.

Input Format:
- First line: M N (dimensions)
- Next M lines: N space-separated integers (costs)

Output Format:
- Single integer: minimum cost to reach destination

Constraints:
- 1 <= M, N <= 100
- 1 <= cost[i][j] <= 1000

Example Input:
3 3
1 2 3
4 8 2
1 5 3

Example Output:
8

Explanation:
Path: (0,0)→(0,1)→(1,2)→(2,2) = 1+2+2+3 = 8

Edge Cases:
- 1x1 grid → return that cell's cost
- Single row/column`,
    tags: ["Dynamic Programming", "Array", "Grid"],
    source: "Interview Pattern"
  },
  {
    title: "Balanced Bracket Sequence Generator",
    difficulty: "Medium",
    description: `Given an integer N, generate all possible valid combinations of N pairs 
of parentheses. Return them in lexicographic order.

Input Format:
- Single integer N (number of pairs)

Output Format:
- List of all valid bracket combinations

Constraints:
- 1 <= N <= 8

Example Input:
3

Example Output:
["((()))", "(()())", "(())()", "()(())", "()()()"]

Explanation:
Use backtracking. At each step, add '(' if open count < N, 
add ')' if close count < open count.

Edge Cases:
- N=1 → ["()"]
- N=0 → [""]`,
    tags: ["Backtracking", "String", "Recursion"],
    source: "Interview Pattern"
  },
  {
    title: "Longest Consecutive Sequence in Stream",
    difficulty: "Hard",
    description: `Given an unsorted array of integers, find the length of the longest 
consecutive elements sequence. Must run in O(n) time complexity.

Input Format:
- First line: integer N
- Second line: N space-separated integers

Output Format:
- Single integer: length of longest consecutive sequence

Constraints:
- 0 <= N <= 10^5
- -10^9 <= nums[i] <= 10^9

Example Input:
6
100 4 200 1 3 2

Example Output:
4

Explanation:
Consecutive sequence: [1, 2, 3, 4] → length 4.
Use HashSet. For each num, check if num-1 exists. 
If not, it's the start of a sequence.

Edge Cases:
- Empty array → 0
- All duplicates → 1
- Single element → 1`,
    tags: ["Array", "Hash Map", "Union Find"],
    source: "Interview Pattern"
  },
  {
    title: "Task Scheduler with Cooldown",
    difficulty: "Hard",
    description: `You are given a list of CPU tasks labeled A-Z and a cooldown period n. 
Between two same tasks, there must be at least n intervals. 
Find the minimum number of intervals the CPU will take to finish all tasks.

Input Format:
- First line: tasks as space-separated characters
- Second line: integer n (cooldown)

Output Format:
- Single integer: minimum intervals needed

Constraints:
- 1 <= tasks.length <= 10^4
- 0 <= n <= 100
- Tasks are uppercase English letters

Example Input:
A A A B B B
2

Example Output:
8

Explanation:
A → B → idle → A → B → idle → A → B
Use max-heap with frequency count. 
Formula: max(tasks.length, (maxFreq-1)*(n+1) + countOfMaxFreq)

Edge Cases:
- n=0 → just tasks.length
- All same tasks`,
    tags: ["Greedy", "Heap", "Array"],
    source: "Interview Pattern"
  },
  {
    title: "Word Ladder Transformation",
    difficulty: "Hard",
    description: `Given a beginWord, endWord, and a wordList, find the length of the 
shortest transformation sequence from beginWord to endWord, such that 
only one letter can be changed at a time and each transformed word must 
exist in the wordList.

Input Format:
- Line 1: beginWord
- Line 2: endWord  
- Line 3: space-separated wordList

Output Format:
- Integer: length of shortest chain, or 0 if no path exists

Constraints:
- 1 <= wordLength <= 10
- 1 <= wordList.length <= 5000
- All words same length

Example Input:
hit
cog
hot dot dog lot log cog

Example Output:
5

Explanation:
hit → hot → dot → dog → cog (5 words = length 5)
Use BFS. At each step, try changing each character to a-z.

Edge Cases:
- endWord not in wordList → 0
- beginWord == endWord → 1`,
    tags: ["Graph", "BFS", "String", "Hash Map"],
    source: "Interview Pattern"
  },
  {
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    description: `Given an array of integers nums and an integer k, return the total number 
of continuous subarrays whose sum equals k.

Input Format:
- First line: integer N and integer k
- Second line: N space-separated integers

Output Format:
- Single integer: count of subarrays with sum = k

Constraints:
- 1 <= N <= 2*10^4
- -1000 <= nums[i] <= 1000
- -10^7 <= k <= 10^7

Example Input:
5 2
1 1 1 2 3

Example Output:
4

Explanation:
Subarrays: [1,1], [1,1] (starting at index 1), [2], [1,1] 
Use prefix sum + hashmap. prefixSum[i] - prefixSum[j] = k

Edge Cases:
- Negative numbers in array
- k = 0 (count subarrays summing to 0)`,
    tags: ["Array", "Hash Map", "Prefix Sum"],
    source: "Interview Pattern"
  },
  {
    title: "Clone Graph with Random Pointers",
    difficulty: "Hard",
    description: `Given a reference to a node in a connected undirected graph, 
return a deep copy (clone) of the graph. Each node contains a value, 
a list of neighbors, and a random pointer to any node in the graph.

Input Format:
- Adjacency list representation of graph
- Random pointer assignments

Output Format:
- Root of cloned graph (verified by structure comparison)

Constraints:
- 1 <= nodes <= 100
- 1 <= Node.val <= 100
- No repeated edges, no self-loops

Example Input:
Node 1: neighbors=[2,4], random=4
Node 2: neighbors=[1,3], random=1
Node 3: neighbors=[2,4], random=3
Node 4: neighbors=[1,3], random=2

Example Output:
Deep cloned graph with same structure

Explanation:
Use HashMap<OriginalNode, ClonedNode>. 
DFS/BFS to visit all nodes. For each node, 
create clone if not exists, then clone all neighbors and random pointer.

Edge Cases:
- Single node with self random pointer
- Disconnected components`,
    tags: ["Graph", "DFS", "Hash Map", "Design"],
    source: "Interview Pattern"
  },
  {
    title: "Maximum Profit with K Transactions",
    difficulty: "Hard",
    description: `You are given an integer array prices where prices[i] is the price of a 
stock on day i, and an integer k. Find the maximum profit you can achieve 
with at most k transactions. You must sell before buying again.

Input Format:
- First line: integer k
- Second line: N space-separated integers (prices)

Output Format:
- Single integer: maximum profit

Constraints:
- 0 <= k <= 100
- 0 <= prices.length <= 1000
- 0 <= prices[i] <= 1000

Example Input:
2
3 2 6 5 0 3

Example Output:
7

Explanation:
Buy at 2, sell at 6 (profit=4). Buy at 0, sell at 3 (profit=3). Total=7.
Use DP: dp[i][j] = max profit using at most i transactions up to day j.

Edge Cases:
- k >= n/2 → unlimited transactions (greedy)
- All decreasing prices → 0 profit
- k = 0 → 0 profit`,
    tags: ["Dynamic Programming", "Array", "Greedy"],
    source: "Interview Pattern"
  },
  {
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    description: `Design an algorithm to serialize and deserialize a binary tree. 
Serialization converts tree to string, deserialization reconstructs tree from string. 
There is no restriction on your serialization/deserialization algorithm.

Input Format:
- Binary tree root for serialization
- String for deserialization

Output Format:
- String (serialize) / Tree root (deserialize)

Constraints:
- 0 <= Number of nodes <= 10^4
- -1000 <= Node.val <= 1000

Example Input:
Tree: [1, 2, 3, null, null, 4, 5]

Example Output:
Serialized: "1,2,3,null,null,4,5"
Deserialized: original tree structure

Explanation:
Use BFS/preorder traversal. Mark null nodes with special character.
Split string by delimiter to reconstruct tree.

Edge Cases:
- Empty tree → serialize as ""
- Single node
- Tree with all null children`,
    tags: ["Tree", "DFS", "BFS", "Design", "String"],
    source: "Interview Pattern"
  },
  {
    title: "Minimum Window Substring",
    difficulty: "Hard",
    description: `Given two strings s and t, return the minimum window substring of s 
such that every character in t (including duplicates) is included in the window. 
If no such window exists, return empty string.

Input Format:
- Line 1: string s
- Line 2: string t

Output Format:
- String: minimum window containing all chars of t

Constraints:
- 1 <= s.length <= 10^5
- 1 <= t.length <= 10^4
- s and t consist of uppercase and lowercase English letters

Example Input:
ADOBECODEBANC
ABC

Example Output:
BANC

Explanation:
Use sliding window with two pointers. 
Expand right until all chars found, then shrink left to minimize window.
Track char frequencies with hashmap.

Edge Cases:
- t longer than s → ""
- s == t → return s
- Duplicate chars in t`,
    tags: ["String", "Sliding Window", "Hash Map", "Two Pointers"],
    source: "Interview Pattern"
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Problem.insertMany(newProblems);
    const total = await Problem.countDocuments();
    console.log(`✅ ${newProblems.length} new problems added! Total: ${total} problems`);
    process.exit(0);
  })
  .catch(err => { console.log(err); process.exit(1); });
