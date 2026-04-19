const mongoose = require("mongoose");
require("dotenv").config();
const Problem = require("./models/Problem");

const problems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    tags: ["Array", "Hash Map"],
    source: "LeetCode",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hint: "Use a HashMap to store each number and its index. For each element, check if (target - element) exists in the map.",
    approach: "Brute Force: O(n²) — check all pairs. Optimal: Single pass HashMap — store visited numbers, check complement exists in O(1)."
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "You are given an array prices where prices[i] is the price of a stock on the ith day. Maximize your profit by choosing a single day to buy and a single day to sell.",
    tags: ["Array", "Sliding Window"],
    source: "LeetCode",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hint: "Track the minimum price seen so far. At each step, calculate profit = current - minPrice.",
    approach: "One pass: Keep track of minPrice and maxProfit. For each price, update minPrice if smaller, else update maxProfit = max(maxProfit, price - minPrice)."
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Given an integer array nums, find the subarray with the largest sum and return its sum. (Kadane's Algorithm)",
    tags: ["Array", "Dynamic Programming"],
    source: "LeetCode",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hint: "At each index, decide: extend previous subarray or start fresh. currentSum = max(num, currentSum + num).",
    approach: "Kadane's Algorithm: currentSum = max(nums[i], currentSum + nums[i]). maxSum = max(maxSum, currentSum). Reset when currentSum goes negative."
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    tags: ["String", "Stack"],
    source: "LeetCode",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hint: "Use a stack. Push opening brackets. For closing brackets, check if top of stack matches.",
    approach: "Stack approach: Push '(', '{', '[' onto stack. For ')', '}', ']' — pop from stack and check if it's the matching opener. At end, stack must be empty."
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    tags: ["String", "Sliding Window", "Hash Map"],
    source: "LeetCode",
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m,n))",
    hint: "Use sliding window with two pointers. Move right pointer, if char repeats move left pointer past the previous occurrence.",
    approach: "Sliding Window + HashMap: Store last seen index of each char. When duplicate found, move left = max(left, lastSeen[char] + 1). Window size = right - left + 1."
  },
  {
    title: "Merge Intervals",
    difficulty: "Medium",
    description: "Given an array of intervals, merge all overlapping intervals.",
    tags: ["Array", "Sorting"],
    source: "LeetCode",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    hint: "Sort intervals by start time. Then iterate and merge if current start <= previous end.",
    approach: "Sort by start time O(n log n). Iterate: if intervals overlap (curr.start <= prev.end), merge by updating end = max(prev.end, curr.end). Else add to result."
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description: "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.",
    tags: ["Array", "Two Pointers", "Stack"],
    source: "LeetCode",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hint: "Water at index i = min(maxLeft, maxRight) - height[i]. Use two pointers to avoid extra space.",
    approach: "Two Pointer: left=0, right=n-1. Track leftMax, rightMax. If leftMax < rightMax: water += leftMax - height[left], move left++. Else: water += rightMax - height[right], move right--."
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    description: "Given an integer array nums, return all triplets that sum to zero.",
    tags: ["Array", "Two Pointers", "Sorting"],
    source: "LeetCode",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    hint: "Sort array. Fix one element, use two pointers for the remaining pair. Skip duplicates.",
    approach: "Sort array O(n log n). For each i, use two pointers l=i+1, r=n-1. If sum<0: l++. If sum>0: r--. If sum==0: add triplet, skip duplicates. Total: O(n²)."
  },
  {
    title: "Reverse a Linked List",
    difficulty: "Easy",
    description: "Given the head of a singly linked list, reverse the list and return the reversed list.",
    tags: ["Linked List", "Recursion"],
    source: "LeetCode",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hint: "Use three pointers: prev=null, curr=head, next. At each step: save next, point curr to prev, move forward.",
    approach: "Iterative: prev=null, curr=head. While curr: next=curr.next, curr.next=prev, prev=curr, curr=next. Return prev. Recursive: reverse(head.next), head.next.next=head, head.next=null."
  },
  {
    title: "LRU Cache",
    difficulty: "Medium",
    description: "Design a data structure that follows LRU cache constraints. Implement get and put in O(1).",
    tags: ["Linked List", "Hash Map", "Design"],
    source: "LeetCode",
    timeComplexity: "O(1) for get and put",
    spaceComplexity: "O(capacity)",
    hint: "Combine HashMap + Doubly Linked List. HashMap gives O(1) access, DLL gives O(1) insertion/deletion.",
    approach: "HashMap stores key→node. DLL maintains order (MRU at head, LRU at tail). On get: move node to head. On put: add at head, if over capacity remove tail. Both O(1)."
  },
  {
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    description: "Return the maximum path sum of any non-empty path in a binary tree.",
    tags: ["Tree", "DFS", "Dynamic Programming"],
    source: "LeetCode",
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    hint: "At each node, max path through it = node.val + max(0, leftGain) + max(0, rightGain). Update global max.",
    approach: "DFS postorder. For each node: leftGain = max(0, dfs(left)), rightGain = max(0, dfs(right)). Update maxSum = max(maxSum, node.val + leftGain + rightGain). Return node.val + max(leftGain, rightGain) to parent."
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    description: "Given coin denominations and a total amount, return fewest coins needed. Return -1 if not possible.",
    tags: ["Dynamic Programming", "BFS"],
    source: "LeetCode",
    timeComplexity: "O(amount × coins)",
    spaceComplexity: "O(amount)",
    hint: "dp[i] = minimum coins to make amount i. For each amount, try all coins.",
    approach: "Bottom-up DP: dp[0]=0, dp[i]=INF. For each amount i from 1 to amount: for each coin c: if c<=i, dp[i] = min(dp[i], dp[i-c]+1). Answer is dp[amount] or -1 if INF."
  },
  {
    title: "Number of Islands",
    difficulty: "Medium",
    description: "Given a 2D binary grid, return the number of islands using DFS/BFS.",
    tags: ["Graph", "DFS", "BFS", "Union Find"],
    source: "LeetCode",
    timeComplexity: "O(M × N)",
    spaceComplexity: "O(M × N)",
    hint: "For each unvisited '1', do DFS/BFS to mark all connected land as visited. Count how many times you start a DFS.",
    approach: "Iterate grid. When '1' found: increment count, DFS to mark all connected '1's as '0' (visited). DFS explores 4 directions. Time: O(M*N), each cell visited once."
  },
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "You can climb 1 or 2 steps. In how many distinct ways can you climb n stairs?",
    tags: ["Dynamic Programming", "Math"],
    source: "LeetCode",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hint: "This is Fibonacci! ways(n) = ways(n-1) + ways(n-2). You either came from step n-1 or n-2.",
    approach: "DP: dp[i] = dp[i-1] + dp[i-2]. Base: dp[1]=1, dp[2]=2. Optimize space: only keep last two values. Pattern: Fibonacci sequence."
  },
  {
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    description: "Given two strings, return the length of their longest common subsequence.",
    tags: ["Dynamic Programming", "String"],
    source: "LeetCode",
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
    hint: "If chars match: dp[i][j] = 1 + dp[i-1][j-1]. Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
    approach: "2D DP table. dp[i][j] = LCS of text1[0..i] and text2[0..j]. If text1[i]==text2[j]: dp[i][j]=1+dp[i-1][j-1]. Else: max(dp[i-1][j], dp[i][j-1]). Answer: dp[m][n]."
  },
  {
    title: "Binary Search",
    difficulty: "Easy",
    description: "Given a sorted array and a target, return index of target or -1.",
    tags: ["Array", "Binary Search"],
    source: "LeetCode",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    hint: "Divide search space in half each time. Compare mid element with target.",
    approach: "left=0, right=n-1. While left<=right: mid=(left+right)/2. If nums[mid]==target: return mid. If nums[mid]<target: left=mid+1. Else: right=mid-1. Each step halves search space → O(log n)."
  },
  {
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    description: "Given a rotated sorted array, find target in O(log n).",
    tags: ["Array", "Binary Search"],
    source: "LeetCode",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    hint: "One half is always sorted. Check which half is sorted, then decide which half to search.",
    approach: "Binary search with extra check. At mid: if left half sorted (nums[left]<=nums[mid]): check if target in [left,mid], else search right. If right half sorted: check if target in [mid,right], else search left."
  },
  {
    title: "Rain Collector Valleys",
    difficulty: "Medium",
    description: "Find total water trapped between terrain blocks after rain. Water at index i = min(leftMax, rightMax) - height[i].",
    tags: ["Array", "Two Pointers", "Dynamic Programming"],
    source: "Interview Pattern",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hint: "Two pointer approach: maintain leftMax and rightMax. Process from the side with smaller max.",
    approach: "Two Pointers: left=0, right=n-1. If leftMax<rightMax: water+=leftMax-height[left], left++. Else: water+=rightMax-height[right], right--. No extra array needed → O(1) space."
  },
  {
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    description: "Return total count of continuous subarrays whose sum equals k.",
    tags: ["Array", "Hash Map", "Prefix Sum"],
    source: "Interview Pattern",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    hint: "Use prefix sum. If prefixSum[j] - prefixSum[i] = k, then subarray [i+1..j] sums to k.",
    approach: "HashMap stores frequency of prefix sums. For each element: prefixSum += nums[i]. If (prefixSum - k) exists in map: count += map[prefixSum-k]. Add prefixSum to map. Single pass O(n)."
  },
  {
    title: "Task Scheduler with Cooldown",
    difficulty: "Hard",
    description: "Given tasks and cooldown n, find minimum intervals to finish all tasks.",
    tags: ["Greedy", "Heap", "Array"],
    source: "Interview Pattern",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    hint: "Most frequent task determines minimum time. Formula: (maxFreq-1)*(n+1) + countOfMaxFreq.",
    approach: "Count frequencies. maxFreq = highest frequency. countMax = tasks with maxFreq. Answer = max(tasks.length, (maxFreq-1)*(n+1)+countMax). Greedy: schedule most frequent first, fill gaps with others or idle."
  },
  {
    title: "Word Ladder Transformation",
    difficulty: "Hard",
    description: "Find shortest transformation sequence from beginWord to endWord changing one letter at a time.",
    tags: ["Graph", "BFS", "String", "Hash Map"],
    source: "Interview Pattern",
    timeComplexity: "O(M² × N)",
    spaceComplexity: "O(M² × N)",
    hint: "BFS gives shortest path. At each step, try changing each character to a-z and check if it's in wordList.",
    approach: "BFS from beginWord. For each word in queue: try all 26 chars at each position. If new word in wordSet: add to queue, remove from set (avoid revisit). Level = transformation count. M=word length, N=wordList size."
  },
  {
    title: "Maximum Profit with K Transactions",
    difficulty: "Hard",
    description: "Find maximum profit with at most k buy-sell transactions.",
    tags: ["Dynamic Programming", "Array", "Greedy"],
    source: "Interview Pattern",
    timeComplexity: "O(k × n)",
    spaceComplexity: "O(k × n)",
    hint: "dp[i][j] = max profit using at most i transactions up to day j. If k >= n/2, use greedy (unlimited transactions).",
    approach: "If k>=n/2: greedy sum of all positive differences. Else: dp[i][j] = max(dp[i][j-1], max over m<j of (prices[j]-prices[m]+dp[i-1][m])). Optimize with running max to reduce to O(kn)."
  },
  {
    title: "Minimum Window Substring",
    difficulty: "Hard",
    description: "Find minimum window in s containing all characters of t.",
    tags: ["String", "Sliding Window", "Hash Map", "Two Pointers"],
    source: "Interview Pattern",
    timeComplexity: "O(|s| + |t|)",
    spaceComplexity: "O(|s| + |t|)",
    hint: "Expand right until all chars found. Then shrink left to minimize. Track 'formed' count to know when window is valid.",
    approach: "Two pointers + frequency maps. Expand right: add char to window map, if freq matches t's freq increment 'formed'. When formed==required: try shrinking left. Update minWindow. Shrink until window invalid."
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Problem.deleteMany({});
    await Problem.insertMany(problems);
    console.log(`✅ ${problems.length} problems inserted with complexity & approach!`);
    process.exit(0);
  })
  .catch(err => { console.log(err); process.exit(1); });
