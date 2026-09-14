import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import {
  FileText,
  Lightbulb,
  BookOpen,
  MessageSquare,
  Star,
  Mic,
  CheckCircle2,
  Cpu,
  Clock,
  Save,
  Play,
  Send,
  Terminal,
  Sliders,
  Sparkles,
  Award,
  ArrowLeft,
  RefreshCw,
  Zap,
  Check
} from 'lucide-react'
import api from '../api'
import Discussion from '../components/Discussion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const starterCode = {
  JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) {
            return [map.get(comp), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
  'C++': `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); i++) {
            int comp = target - nums[i];
            if (mp.count(comp)) return {mp[comp], i};
            mp[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    cout << "Ready for execution" << endl;
    return 0;
}`,
  Python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            comp = target - num
            if comp in seen:
                return [seen[comp], i]
            seen[num] = i
        return []`,
  Java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return new int[] { map.get(comp), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`
}

const LANG_IDS = { JavaScript: 63, 'C++': 54, Python: 71, Java: 62 }
const MONACO_LANG = { JavaScript: 'javascript', 'C++': 'cpp', Python: 'python', Java: 'java' }

const diffStyle = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
}

const diffDot = {
  Easy: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  Hard: 'bg-rose-400',
}

export default function ProblemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const { dark } = useTheme()

  const [problem, setProblem] = useState(null)
  const [lang, setLang] = useState('JavaScript')
  const [code, setCode] = useState(starterCode['JavaScript'])
  const [stdin, setStdin] = useState('')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [leftTab, setLeftTab] = useState('description')
  const [bottomTab, setBottomTab] = useState('output')
  const [bookmarked, setBookmarked] = useState(false)
  const [note, setNote] = useState('')
  const [noteSaving, setNoteSaving] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)
  const [newBadges, setNewBadges] = useState([])
  const [solved, setSolved] = useState(false)

  // Fetch Problem Details & User State
  useEffect(() => {
    setLoading(true)
    api.get(`/problems/${id}`)
      .then(res => {
        setProblem(res.data)
      })
      .catch(err => {
        console.error('Error fetching problem details:', err)
      })
      .finally(() => setLoading(false))

    if (token) {
      api.get('/user/bookmarks')
        .then(res => {
          const isB = res.data.some(b => (b._id || b) === id)
          setBookmarked(isB)
        })
        .catch(() => {})

      api.get(`/user/note/${id}`)
        .then(res => {
          setNote(res.data.note || '')
        })
        .catch(() => {})
    }
  }, [id, token])

  const handleLangChange = (newLang) => {
    setLang(newLang)
    setCode(starterCode[newLang] || '// Write your solution here')
  }

  const toggleBookmark = async () => {
    if (!token) {
      navigate('/login')
      return
    }
    try {
      const res = await api.post(`/user/bookmark/${id}`)
      setBookmarked(prev => !prev)
      if (res.data.newBadges?.length) {
        setNewBadges(res.data.newBadges)
      }
    } catch (err) {
      console.error('Bookmark error:', err)
    }
  }

  const saveNote = async () => {
    if (!token) {
      navigate('/login')
      return
    }
    setNoteSaving(true)
    try {
      await api.post(`/user/note/${id}`, { note })
      setNoteSaved(true)
      setTimeout(() => setNoteSaved(false), 2500)
    } catch (err) {
      console.error('Note save error:', err)
    } finally {
      setNoteSaving(false)
    }
  }

  const handleRun = async () => {
    setRunning(true)
    setBottomTab('output')
    setOutput(null)
    try {
      const res = await api.post('/api/execute', {
        code,
        language: lang,
        language_id: LANG_IDS[lang],
        stdin
      })
      setOutput(res.data)
    } catch (err) {
      setOutput({
        status: 'Execution Error',
        stderr: err.response?.data?.details || err.message || 'Execution failed'
      })
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
    setRunning(true)
    setBottomTab('output')
    setOutput(null)
    try {
      const execRes = await api.post('/api/execute', {
        code,
        language: lang,
        language_id: LANG_IDS[lang],
        stdin
      })
      setOutput(execRes.data)

      if (token && (execRes.data.statusId === 3 || execRes.data.status === 'Accepted')) {
        await api.post('/api/submission', {
          problemId: id,
          code,
          language: lang,
          status: execRes.data.status || 'Accepted',
          runtime: execRes.data.time || '45ms',
          memory: execRes.data.memory || '14.2 MB'
        })

        const solveRes = await api.post(`/user/solve/${id}`)
        setSolved(true)
        if (solveRes.data.newBadges?.length) {
          setNewBadges(solveRes.data.newBadges)
        }
      }
    } catch (err) {
      setOutput({
        status: 'Submission Error',
        stderr: err.response?.data?.details || err.message || 'Submission failed'
      })
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return (
      <div className={`pt-20 min-h-screen flex items-center justify-center ${dark ? 'bg-[#090d16] text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading problem environment...</p>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className={`pt-24 min-h-screen text-center ${dark ? 'bg-[#090d16] text-white' : 'bg-slate-50 text-slate-900'}`}>
        <h2 className="text-2xl font-bold mb-2">Problem Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">The requested problem could not be loaded from repository.</p>
        <Link to="/problems" className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-sm shadow-md shadow-cyan-500/20">
          Back to Problems Hub
        </Link>
      </div>
    )
  }

  const tabs = [
    { id: 'description', label: 'Problem', icon: FileText },
    { id: 'approach', label: 'Hints & Approach', icon: Lightbulb },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'discussion', label: 'Discussion', icon: MessageSquare },
  ]

  return (
    <div className={`pt-16 min-h-screen flex flex-col transition-colors duration-200 ${dark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f4f6f8] text-slate-900'}`}>
      
      {/* Badge Notification Modal */}
      {newBadges.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className={`border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-bounce-short ${
            dark ? 'bg-slate-900 border-cyan-500/50' : 'bg-white border-cyan-400'
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-cyan-500/30">
              {newBadges[0].icon || '🏆'}
            </div>
            <h3 className="text-xl font-black">Badge Unlocked!</h3>
            <p className="text-cyan-400 font-bold text-base mt-1">{newBadges[0].name}</p>
            <p className={`text-xs mt-2 leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{newBadges[0].description}</p>
            <button
              onClick={() => setNewBadges([])}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95"
            >
              Continue Solving 🚀
            </button>
          </div>
        </div>
      )}

      {/* Main Dual Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 max-w-[1750px] w-full mx-auto">
        
        {/* Left Side: Problem Detail & Tabs */}
        <div className={`lg:col-span-5 rounded-3xl border flex flex-col h-[calc(100vh-5.2rem)] overflow-hidden shadow-sm ${
          dark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Top Bar Tabs */}
          <div className={`flex items-center justify-between border-b px-3 pt-2 ${
            dark ? 'border-slate-800 bg-[#0d1322]/80' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map(t => {
                const IconComponent = t.icon
                const isActive = leftTab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setLeftTab(t.id)}
                    className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'text-cyan-400 border-cyan-400 bg-slate-900'
                        : 'text-slate-400 border-transparent hover:text-slate-200'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Bookmark & AI Interview buttons */}
            <div className="flex items-center gap-1.5 pb-1.5">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-xl border transition-all ${
                  bookmarked
                    ? 'bg-amber-400/10 text-amber-400 border-amber-400/40'
                    : dark ? 'text-slate-400 border-slate-800 hover:text-white' : 'text-slate-500 border-slate-200 hover:text-slate-800'
                }`}
                title={bookmarked ? 'Remove bookmark' : 'Bookmark problem'}
              >
                <Star className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
              <Link
                to="/interview"
                state={{ problem }}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500 hover:text-white transition flex items-center gap-1"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Mock AI</span>
              </Link>
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-6 text-sm">
            {leftTab === 'description' && (
              <div>
                {/* Difficulty & Source */}
                <div className="flex items-center gap-2 mb-3.5">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 ${diffStyle[problem.difficulty] || diffStyle.Medium}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${diffDot[problem.difficulty] || 'bg-amber-400'}`} />
                    <span>{problem.difficulty}</span>
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${
                    dark ? 'border-slate-800 text-slate-400 bg-slate-800/60' : 'border-slate-200 text-slate-600 bg-slate-100'
                  }`}>
                    {problem.source || 'LeetCode'}
                  </span>
                  {solved && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Solved</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-black mb-4 tracking-tight">{problem.title}</h1>

                <div className={`prose prose-sm max-w-none mb-6 leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {problem.description}
                </div>

                {/* Complexity Specs */}
                <div className={`grid grid-cols-2 gap-3 p-4 rounded-2xl border mb-6 ${
                  dark ? 'bg-[#0d1322] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>Target Time Complexity</span>
                    </span>
                    <span className="text-xs font-bold font-mono text-cyan-400">{problem.timeComplexity || 'O(n)'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold mb-1 flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-purple-400" />
                      <span>Target Space Complexity</span>
                    </span>
                    <span className="text-xs font-bold font-mono text-purple-400">{problem.spaceComplexity || 'O(1)'}</span>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Associated Concepts & Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {problem.tags?.map(t => (
                      <span key={t} className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                        dark ? 'bg-[#0d1322] text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {leftTab === 'approach' && (
              <div className="space-y-4">
                <div className={`p-5 rounded-2xl border ${dark ? 'bg-[#0d1322] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" />
                    <span>Algorithmic Hint</span>
                  </h3>
                  <p className={`text-xs leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {problem.hint || 'Identify redundant computations and explore using an associative lookup table (Hash Map) to store past seen values.'}
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border ${dark ? 'bg-[#0d1322] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>Optimal Strategy</span>
                  </h3>
                  <p className={`text-xs leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {problem.approach || 'Use a Single-Pass Hash Map lookup approach to find complements in O(1) time per element, achieving overall O(n) linear complexity.'}
                  </p>
                </div>
              </div>
            )}

            {leftTab === 'notes' && (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Personal Engineering Notes</span>
                  </h3>
                  {noteSaved && <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Saved</span>}
                </div>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Record edge case observations, potential pitfalls, and code insights..."
                  className={`flex-1 w-full min-h-[260px] p-3.5 text-xs rounded-2xl border focus:outline-none transition-all resize-none font-mono ${
                    dark ? 'bg-[#0d1322] border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600'
                  }`}
                />
                <button
                  onClick={saveNote}
                  disabled={noteSaving}
                  className="mt-3.5 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 hover:opacity-95 transition flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{noteSaving ? 'Saving Notes...' : 'Save Notes'}</span>
                </button>
              </div>
            )}

            {leftTab === 'discussion' && (
              <Discussion problemId={id} />
            )}
          </div>
        </div>

        {/* Right Side: Monaco Code Editor & Execution Panel */}
        <div className={`lg:col-span-7 rounded-3xl border flex flex-col h-[calc(100vh-5.2rem)] overflow-hidden shadow-sm ${
          dark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Editor Header Bar */}
          <div className={`flex items-center justify-between px-4 py-2.5 border-b ${
            dark ? 'border-slate-800 bg-[#0d1322]/90' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Language:</span>
              <select
                value={lang}
                onChange={e => handleLangChange(e.target.value)}
                className={`text-xs font-bold py-1.5 px-3 rounded-xl border focus:outline-none transition-all ${
                  dark ? 'bg-slate-900 border-slate-700 text-cyan-400' : 'bg-white border-slate-300 text-cyan-600'
                }`}
              >
                <option value="JavaScript">JavaScript (Node.js)</option>
                <option value="C++">C++ (GCC 14)</option>
                <option value="Python">Python 3.12</option>
                <option value="Java">Java (OpenJDK)</option>
              </select>
            </div>

            {/* Run & Submit Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={running}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 disabled:opacity-50 ${
                  dark
                    ? 'border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white'
                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>Run Code</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={running}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-95 shadow-md shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Solution</span>
              </button>
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 min-h-[280px]">
            <Editor
              height="100%"
              language={MONACO_LANG[lang] || 'javascript'}
              value={code}
              onChange={val => setCode(val || '')}
              theme={dark ? 'vs-dark' : 'light'}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                roundedSelection: true,
                automaticLayout: true,
                tabSize: 2,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
          </div>

          {/* Bottom Execution / Test Panel */}
          <div className={`border-t flex flex-col h-56 transition-colors ${
            dark ? 'border-slate-800 bg-[#090d16]' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className={`flex items-center justify-between border-b px-4 py-1.5 ${
              dark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBottomTab('output')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    bottomTab === 'output'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Execution Output</span>
                </button>
                <button
                  onClick={() => setBottomTab('customInput')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    bottomTab === 'customInput'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Custom Stdin</span>
                </button>
              </div>

              {output?.time && (
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-emerald-400"><Clock className="w-3 h-3" /> {output.time}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-cyan-400"><Cpu className="w-3 h-3" /> {output.memory || '12.4 MB'}</span>
                </span>
              )}
            </div>

            <div className="flex-1 p-3.5 overflow-y-auto font-mono text-xs">
              {bottomTab === 'customInput' && (
                <textarea
                  value={stdin}
                  onChange={e => setStdin(e.target.value)}
                  placeholder="Enter custom standard input values for test execution..."
                  className={`w-full h-full p-2 bg-transparent focus:outline-none resize-none font-mono ${
                    dark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                />
              )}

              {bottomTab === 'output' && (
                <div>
                  {!output && !running && (
                    <p className="text-slate-500 italic py-2">Click "Run Code" or "Submit Solution" to test against testcases.</p>
                  )}
                  {running && (
                    <div className="flex items-center gap-2 text-cyan-400 py-3">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="font-semibold">Compiling in sandbox and evaluating testcases...</span>
                    </div>
                  )}
                  {output && (
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className={`font-bold px-2.5 py-0.5 rounded text-xs border ${
                          output.status === 'Accepted'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        }`}>
                          {output.status || 'Finished'}
                        </span>
                      </div>
                      {output.stdout && (
                        <pre className="text-emerald-400 whitespace-pre-wrap mb-2 leading-relaxed bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">{output.stdout}</pre>
                      )}
                      {output.stderr && (
                        <pre className="text-rose-400 whitespace-pre-wrap leading-relaxed bg-rose-500/5 p-3 rounded-xl border border-rose-500/20">{output.stderr}</pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

