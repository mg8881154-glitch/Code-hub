const mongoose = require("mongoose");
require("dotenv").config();
const Problem = require("./models/Problem");

const problems = [
  // ===== ARRAYS =====
  {
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
    tags: ["Array", "Hash Map"],
    source: "LeetCode"
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize your profit by choosing a single day to buy and a single day to sell.",
    tags: ["Array", "Sliding Window"],
    source: "LeetCode"
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Given an integer array nums, find the subarray with the largest sum and return its sum. (Kadane's Algorithm)",
    tags: ["Array", "Dynamic Programming"],
    source: "LeetCode"
  },
  {
    title: "Merge Intervals",
    difficulty: "Medium",
    description: "Given an array of intervals, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    tags: ["Array", "Sorting"],
    source: "LeetCode"
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    tags: ["Array", "Two Pointers", "Stack"],
    source: "LeetCode"
  },
  {
    title: "3Sum",
    difficulty: "Medium",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0.",
    tags: ["Array", "Two Pointers", "Sorting"],
    source: "LeetCode"
  },

  // ===== STRINGS =====
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    tags: ["String", "Stack"],
    source: "LeetCode"
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Given a string s, find the length of the longest substring without repeating characters using sliding window technique.",
    tags: ["String", "Sliding Window", "Hash Map"],
    source: "LeetCode"
  },
  {
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    description: "Given a string s, return the longest palindromic substring in s. Use expand around center approach for O(n^2) solution.",
    tags: ["String", "Dynamic Programming"],
    source: "LeetCode"
  },
  {
    title: "Anagram Check",
    difficulty: "Easy",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. Two strings are anagrams if they contain the same characters.",
    tags: ["String", "Hash Map", "Sorting"],
    source: "HackerRank"
  },
  {
    title: "Reverse Words in a String",
    difficulty: "Medium",
    description: "Given an input string s, reverse the order of the words. A word is defined as a sequence of non-space characters.",
    tags: ["String", "Two Pointers"],
    source: "LeetCode"
  },

  // ===== LINKED LIST =====
  {
    title: "Reverse a Linked List",
    difficulty: "Easy",
    description: "Given the head of a singly linked list, reverse the list and return the reversed list. Must be done iteratively and recursively.",
    tags: ["Linked List", "Recursion"],
    source: "LeetCode"
  },
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description: "You are given the heads of two sorted linked lists. Merge the two lists into one sorted list and return the head of the merged list.",
    tags: ["Linked List", "Recursion"],
    source: "LeetCode"
  },
  {
    title: "Detect Cycle in Linked List",
    difficulty: "Easy",
    description: "Given head of a linked list, determine if the linked list has a cycle in it using Floyd's Tortoise and Hare algorithm.",
    tags: ["Linked List", "Two Pointers"],
    source: "LeetCode"
  },
  {
    title: "LRU Cache",
    difficulty: "Medium",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get and put operations in O(1) time.",
    tags: ["Linked List", "Hash Map", "Design"],
    source: "LeetCode"
  },
  {
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    description: "You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.",
    tags: ["Linked List", "Heap", "Divide and Conquer"],
    source: "LeetCode"
  },

  // ===== TREES =====
  {
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    description: "Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from root to leaf.",
    tags: ["Tree", "DFS", "BFS"],
    source: "LeetCode"
  },
  {
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). Each node must satisfy BST property for all ancestors.",
    tags: ["Tree", "DFS", "BST"],
    source: "LeetCode"
  },
  {
    title: "Level Order Traversal",
    difficulty: "Medium",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    tags: ["Tree", "BFS", "Queue"],
    source: "GFG"
  },
  {
    title: "Lowest Common Ancestor",
    difficulty: "Medium",
    description: "Given a binary search tree, find the lowest common ancestor (LCA) of two given nodes in the BST.",
    tags: ["Tree", "BST", "Recursion"],
    source: "LeetCode"
  },
  {
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. Return the maximum path sum of any non-empty path.",
    tags: ["Tree", "DFS", "Dynamic Programming"],
    source: "LeetCode"
  },

  // ===== DYNAMIC PROGRAMMING =====
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    tags: ["Dynamic Programming", "Math"],
    source: "LeetCode"
  },
  {
    title: "0/1 Knapsack Problem",
    difficulty: "Medium",
    description: "Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value. Each item can only be used once.",
    tags: ["Dynamic Programming", "Array"],
    source: "GFG"
  },
  {
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    description: "Given two strings text1 and text2, return the length of their longest common subsequence. A subsequence is a sequence derived by deleting some characters.",
    tags: ["Dynamic Programming", "String"],
    source: "LeetCode"
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    description: "Given an array of coin denominations and a total amount, return the fewest number of coins needed to make up that amount. Return -1 if not possible.",
    tags: ["Dynamic Programming", "BFS"],
    source: "LeetCode"
  },
  {
    title: "Word Break",
    difficulty: "Medium",
    description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of dictionary words.",
    tags: ["Dynamic Programming", "Hash Map", "Trie"],
    source: "LeetCode"
  },

  // ===== GRAPHS =====
  {
    title: "Number of Islands",
    difficulty: "Medium",
    description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands using DFS/BFS.",
    tags: ["Graph", "DFS", "BFS", "Union Find"],
    source: "LeetCode"
  },
  {
    title: "Course Schedule",
    difficulty: "Medium",
    description: "There are numCourses courses to take. Given prerequisites, determine if you can finish all courses. This is a cycle detection problem in directed graph.",
    tags: ["Graph", "Topological Sort", "DFS"],
    source: "LeetCode"
  },
  {
    title: "Dijkstra's Shortest Path",
    difficulty: "Hard",
    description: "Given a weighted graph, find the shortest path from source to all vertices using Dijkstra's algorithm with a priority queue.",
    tags: ["Graph", "Heap", "Greedy"],
    source: "GFG"
  },

  // ===== SEARCHING & SORTING =====
  {
    title: "Binary Search",
    difficulty: "Easy",
    description: "Given an array of integers nums sorted in ascending order, and an integer target, write a function to search target in nums. Return index or -1.",
    tags: ["Array", "Binary Search"],
    source: "LeetCode"
  },
  {
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    description: "Given a rotated sorted array and a target, return the index of target if found, else return -1. Must be O(log n) time complexity.",
    tags: ["Array", "Binary Search"],
    source: "LeetCode"
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    description: "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    source: "LeetCode"
  },

  // ===== STACK & QUEUE =====
  {
    title: "Next Greater Element",
    difficulty: "Easy",
    description: "Given a circular integer array nums, return the next greater number for every element. The next greater number of a number x is the first greater number.",
    tags: ["Stack", "Array", "Monotonic Stack"],
    source: "LeetCode"
  },
  {
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    description: "Given an array nums and a sliding window of size k, return the max values in each window position as the window slides from left to right.",
    tags: ["Array", "Queue", "Sliding Window", "Monotonic Queue"],
    source: "LeetCode"
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Problem.deleteMany({});
    await Problem.insertMany(problems);
    console.log(`✅ ${problems.length} problems inserted successfully!`);
    process.exit(0);
  })
  .catch(err => { console.log(err); process.exit(1); });
