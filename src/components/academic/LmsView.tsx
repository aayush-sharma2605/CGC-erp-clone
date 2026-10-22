"use client";

import { useState, useMemo } from "react";
import {
  PlayCircle,
  FileText,
  Download,
  CheckCircle,
  Clock,
  BookOpen,
  Search,
  Layers,
  Sparkles,
  ExternalLink,
  Code2,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseItem {
  id: string;
  name: string;
  code: string;
  category?: string;
  courseNo?: string;
}

interface LmsViewProps {
  courses: CourseItem[];
  role: string;
}

interface LectureItem {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
}

interface ResourceItem {
  id: string;
  name: string;
  size: string;
}

interface ModuleItem {
  title: string;
  lectures: LectureItem[];
  resources: ResourceItem[];
}

// Knowledge base of rich courseware modules mapped to subjects
function getModulesForCourse(course: CourseItem): ModuleItem[] {
  const name = course.name.toLowerCase();
  const code = course.code.toLowerCase();

  if (name.includes("python") && !name.includes("lab")) {
    return [
      {
        title: "Module 1: Python Core Foundations & Data Structures",
        lectures: [
          { id: "py-1", title: "1.1 Python Architecture, Dynamic Typing & Memory Model", duration: "44 min", videoUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", completed: true },
          { id: "py-2", title: "1.2 Deep Dive: Lists, Tuples, Dictionaries & Set Comprehensions", duration: "52 min", videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8", completed: true },
          { id: "py-3", title: "1.3 Generators, Iterators & itertools in High-Performance Code", duration: "38 min", videoUrl: "https://www.youtube.com/watch?v=bD05uGo_sVI", completed: false },
        ],
        resources: [
          { id: "res-py-1", name: "Python 3.12 Reference Guide & Idiomatic Patterns.pdf", size: "3.8 MB" },
          { id: "res-py-2", name: "Worksheet 1 — Advanced Data Structures & Time Complexity.pdf", size: "1.4 MB" },
        ],
      },
      {
        title: "Module 2: Object-Oriented Design & Metaprogramming",
        lectures: [
          { id: "py-4", title: "2.1 Classes, Dunder Methods & Operator Overloading", duration: "48 min", videoUrl: "https://www.youtube.com/watch?v=JeznW_7DlB0", completed: false },
          { id: "py-5", title: "2.2 Multiple Inheritance, MRO & Composition Patterns", duration: "41 min", videoUrl: "https://www.youtube.com/watch?v=RSl87lqOXDE", completed: false },
        ],
        resources: [
          { id: "res-py-3", name: "OOP Architecture & Design Patterns in Python.pdf", size: "2.6 MB" },
        ],
      },
      {
        title: "Module 3: Scientific Computing (NumPy & Pandas) & Data Pipelines",
        lectures: [
          { id: "py-6", title: "3.1 Vectorized Computations & Broadcasting with NumPy", duration: "56 min", videoUrl: "https://www.youtube.com/watch?v=QUT1VHiLmmI", completed: false },
          { id: "py-7", title: "3.2 Data Wrangling, GroupBy & Pivot Tables with Pandas", duration: "62 min", videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg", completed: false },
        ],
        resources: [
          { id: "res-py-4", name: "Data Science with Python — NumPy & Pandas Handbook.pdf", size: "5.1 MB" },
        ],
      },
    ];
  }

  if (name.includes("artificial intelligence") && !name.includes("lab")) {
    return [
      {
        title: "Module 1: Foundations of Intelligent Agents & State Space Search",
        lectures: [
          { id: "ai-1", title: "1.1 Agent Architectures, Rationality & PEAS Framework", duration: "45 min", videoUrl: "https://www.youtube.com/watch?v=J8Eh7RqggsU", completed: true },
          { id: "ai-2", title: "1.2 Uninformed Search: BFS, DFS, Uniform Cost & Iterative Deepening", duration: "50 min", videoUrl: "https://www.youtube.com/watch?v=dRMvK76xQJI", completed: true },
          { id: "ai-3", title: "1.3 Informed Search: Heuristics, Greedy Best-First & A* Optimality", duration: "58 min", videoUrl: "https://www.youtube.com/watch?v=tvahDXbl3p4", completed: false },
        ],
        resources: [
          { id: "res-ai-1", name: "Russell & Norvig — AI A Modern Approach Chapter Summary.pdf", size: "4.2 MB" },
          { id: "res-ai-2", name: "Search Algorithms Benchmark & Proofs.pdf", size: "2.1 MB" },
        ],
      },
      {
        title: "Module 2: Adversarial Search & Constraint Satisfaction Problems (CSPs)",
        lectures: [
          { id: "ai-4", title: "2.1 Minimax Algorithm & Alpha-Beta Pruning Optimization", duration: "52 min", videoUrl: "https://www.youtube.com/watch?v=l-hh51ncgDI", completed: false },
          { id: "ai-5", title: "2.2 CSPs, Backtracking, Forward Checking & AC-3 Algorithm", duration: "46 min", videoUrl: "https://www.youtube.com/watch?v=lCrHYt52pAA", completed: false },
        ],
        resources: [
          { id: "res-ai-3", name: "Game Theory & Constraint Satisfaction Handout.pdf", size: "3.0 MB" },
        ],
      },
      {
        title: "Module 3: Knowledge Representation & Probabilistic Reasoning",
        lectures: [
          { id: "ai-6", title: "3.1 Propositional Logic, First-Order Logic & Resolution", duration: "49 min", videoUrl: "https://www.youtube.com/watch?v=1-SvuFIQjK8", completed: false },
          { id: "ai-7", title: "3.2 Bayesian Networks, Conditional Independence & Inference", duration: "54 min", videoUrl: "https://www.youtube.com/watch?v=TuG8Jms_3iY", completed: false },
        ],
        resources: [
          { id: "res-ai-4", name: "Bayesian Reasoning in Artificial Intelligence.pdf", size: "3.5 MB" },
        ],
      },
    ];
  }

  if (name.includes("data base") || name.includes("database") || name.includes("dbms")) {
    return [
      {
        title: "Module 1: Relational Data Model & Advanced SQL Engineering",
        lectures: [
          { id: "db-1", title: "1.1 Relational Algebra, Tuple Relational Calculus & Schema Design", duration: "48 min", videoUrl: "https://www.youtube.com/watch?v=HXV3zeRR3h4", completed: true },
          { id: "db-2", title: "1.2 Complex Joins, Window Functions & CTEs in Modern PostgreSQL", duration: "54 min", videoUrl: "https://www.youtube.com/watch?v=ztHopE5Wnpc", completed: false },
        ],
        resources: [
          { id: "res-db-1", name: "Relational Algebra to SQL Translation Guide.pdf", size: "2.8 MB" },
          { id: "res-db-2", name: "Advanced SQL Queries — Production Scenarios.pdf", size: "1.9 MB" },
        ],
      },
      {
        title: "Module 2: Normalization & Functional Dependencies",
        lectures: [
          { id: "db-3", title: "2.1 Functional Dependencies, Attribute Closure & Minimal Cover", duration: "45 min", videoUrl: "https://www.youtube.com/watch?v=px72yTNEk8Y", completed: false },
          { id: "db-4", title: "2.2 1NF, 2NF, 3NF & Boyce-Codd Normal Form (BCNF) Decompositions", duration: "52 min", videoUrl: "https://www.youtube.com/watch?v=GFQaEYEc8_8", completed: false },
        ],
        resources: [
          { id: "res-db-3", name: "Database Normalization Algorithms & Practice Problems.pdf", size: "3.1 MB" },
        ],
      },
      {
        title: "Module 3: Storage Engine, Indexing & Transaction Concurrency",
        lectures: [
          { id: "db-5", title: "3.1 B+ Trees, Hash Indexes & Disk Storage Internals", duration: "50 min", videoUrl: "https://www.youtube.com/watch?v=aZjYr87r1b8", completed: false },
          { id: "db-6", title: "3.2 ACID Guarantees, Two-Phase Locking (2PL) & MVCC", duration: "47 min", videoUrl: "https://www.youtube.com/watch?v=yWbE3a4_wV0", completed: false },
        ],
        resources: [
          { id: "res-db-4", name: "Transactions, Isolation Levels & MVCC Internals.pdf", size: "3.4 MB" },
        ],
      },
    ];
  }

  if (name.includes("automata") || name.includes("formal language") || name.includes("flat")) {
    return [
      {
        title: "Module 1: Finite Automata & Regular Languages",
        lectures: [
          { id: "flat-1", title: "1.1 Deterministic Finite Automata (DFA) Formal Specification", duration: "46 min", videoUrl: "https://www.youtube.com/watch?v=48yN4V9I_xU", completed: true },
          { id: "flat-2", title: "1.2 NFA to DFA Subset Construction & Epsilon Transitions", duration: "51 min", videoUrl: "https://www.youtube.com/watch?v=taClnxU-nao", completed: false },
          { id: "flat-3", title: "1.3 Regular Expressions & Pumping Lemma for Regular Languages", duration: "55 min", videoUrl: "https://www.youtube.com/watch?v=Ty9QvG_eH5w", completed: false },
        ],
        resources: [
          { id: "res-flat-1", name: "Automata Theory — State Diagrams & Conversion Notes.pdf", size: "4.1 MB" },
          { id: "res-flat-2", name: "Pumping Lemma Proof Templates & Practice Sets.pdf", size: "1.8 MB" },
        ],
      },
      {
        title: "Module 2: Context-Free Grammars (CFG) & Pushdown Automata (PDA)",
        lectures: [
          { id: "flat-4", title: "2.1 Derivations, Parse Trees, Ambiguity & CNF Normal Form", duration: "48 min", videoUrl: "https://www.youtube.com/watch?v=5_k9C1f8yis", completed: false },
          { id: "flat-5", title: "2.2 Pushdown Automata: Acceptance by Final State vs Empty Stack", duration: "53 min", videoUrl: "https://www.youtube.com/watch?v=kYJc7B0e33Y", completed: false },
        ],
        resources: [
          { id: "res-flat-3", name: "CFG to PDA Transformations & Language Recognition.pdf", size: "2.9 MB" },
        ],
      },
      {
        title: "Module 3: Turing Machines & Decidability Limits",
        lectures: [
          { id: "flat-6", title: "3.1 Standard Turing Machine Model & Multi-Tape Equivalences", duration: "50 min", videoUrl: "https://www.youtube.com/watch?v=5a1n3M4uL40", completed: false },
          { id: "flat-7", title: "3.2 Church-Turing Thesis, Halting Problem & Undecidable Languages", duration: "44 min", videoUrl: "https://www.youtube.com/watch?v=92WHN-pAFCs", completed: false },
        ],
        resources: [
          { id: "res-flat-4", name: "Computability & Complexity Essentials.pdf", size: "3.2 MB" },
        ],
      },
    ];
  }

  if (name.includes("tableau") || name.includes("visualization")) {
    return [
      {
        title: "Module 1: Visual Analytics Principles & Tableau Environment",
        lectures: [
          { id: "tab-1", title: "1.1 Data Preparation, Connecting to Data Sources & Data Modeling", duration: "42 min", videoUrl: "https://www.youtube.com/watch?v=aHaOIvR00So", completed: true },
          { id: "tab-2", title: "1.2 Building Core Visualizations: Heatmaps, Tree Maps & Dual Axes", duration: "49 min", videoUrl: "https://www.youtube.com/watch?v=TPMlJxwyXXE", completed: false },
        ],
        resources: [
          { id: "res-tab-1", name: "Tableau 2024 Visual Guide & Dataset Packs.pdf", size: "6.2 MB" },
        ],
      },
      {
        title: "Module 2: Advanced Calculations & Level of Detail (LOD) Expressions",
        lectures: [
          { id: "tab-3", title: "2.1 Table Calculations, Window Functions & Dynamic Parameters", duration: "46 min", videoUrl: "https://www.youtube.com/watch?v=Xb0p11m37yE", completed: false },
          { id: "tab-4", title: "2.2 FIXED, INCLUDE & EXCLUDE Level of Detail (LOD) Expressions", duration: "52 min", videoUrl: "https://www.youtube.com/watch?v=kR2t1e4V8j0", completed: false },
        ],
        resources: [
          { id: "res-tab-2", name: "LOD Expressions Masterclass & Top 15 Use Cases.pdf", size: "3.4 MB" },
        ],
      },
    ];
  }

  if (name.includes("statistical computing") || name.includes(" r ")) {
    return [
      {
        title: "Module 1: R Programming Foundations & Vectorized Analysis",
        lectures: [
          { id: "r-1", title: "1.1 Vectors, Matrices, Lists, Data Frames & apply Family", duration: "45 min", videoUrl: "https://www.youtube.com/watch?v=_V8eKsto3Ug", completed: true },
          { id: "r-2", title: "1.2 Data Manipulation with dplyr & tidyr", duration: "50 min", videoUrl: "https://www.youtube.com/watch?v=aywZrzNaKjs", completed: false },
        ],
        resources: [
          { id: "res-r-1", name: "R for Data Science Summary & Cheatsheet.pdf", size: "4.5 MB" },
        ],
      },
      {
        title: "Module 2: Hypothesis Testing, ANOVA & Statistical Modeling",
        lectures: [
          { id: "r-3", title: "2.1 Parametric & Non-Parametric Tests (t-test, Wilcoxon, Chi-Square)", duration: "48 min", videoUrl: "https://www.youtube.com/watch?v=0oc49DyA3hU", completed: false },
          { id: "r-4", title: "2.2 One-Way & Two-Way ANOVA with Diagnostic Residual Plots", duration: "53 min", videoUrl: "https://www.youtube.com/watch?v=2eYfN-N-w6c", completed: false },
        ],
        resources: [
          { id: "res-r-2", name: "Statistical Inference & Experimental Design in R.pdf", size: "3.8 MB" },
        ],
      },
    ];
  }

  if (name.includes("lab") || name.includes("practical")) {
    return [
      {
        title: "Laboratory Experiments & Practical Assignments",
        lectures: [
          { id: "lab-1", title: "Lab 01: Environment Configuration, Toolchain Setup & Hello World", duration: "35 min", videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8", completed: true },
          { id: "lab-2", title: "Lab 02: Experiment Implementation, Test Cases & Validation", duration: "40 min", videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg", completed: false },
          { id: "lab-3", title: "Lab 03: Final Viva Voce Prep & Capstone Practical Evaluation", duration: "30 min", videoUrl: "https://www.youtube.com/watch?v=ztHopE5Wnpc", completed: false },
        ],
        resources: [
          { id: "res-lab-1", name: `${course.name} — Official Laboratory Manual (2026).pdf`, size: "4.8 MB" },
          { id: "res-lab-2", name: "Weekly Experiment Submission Template & Rubrics.pdf", size: "1.1 MB" },
        ],
      },
    ];
  }

  if (name.includes("java")) {
    return [
      {
        title: "Module 1: Enterprise Java Architecture & Concurrency",
        lectures: [
          { id: "java-1", title: "1.1 JVM Architecture: ClassLoaders, Garbage Collection & JIT", duration: "50 min", videoUrl: "https://www.youtube.com/watch?v=grEKMHGYyns", completed: true },
          { id: "java-2", title: "1.2 Thread Lifecycle, Synchronized Blocks & java.util.concurrent", duration: "54 min", videoUrl: "https://www.youtube.com/watch?v=eQk5xeqKk6U", completed: false },
          { id: "java-3", title: "1.3 Modern Java: Streams API, Lambdas & Functional Interfaces", duration: "47 min", videoUrl: "https://www.youtube.com/watch?v=t1-YZ6bF-g0", completed: false },
        ],
        resources: [
          { id: "res-java-1", name: "Core Java Complete Reference & Coding Standards.pdf", size: "5.2 MB" },
        ],
      },
    ];
  }

  if (name.includes("aptitude") || name.includes("technical") || name.includes("verbal")) {
    return [
      {
        title: "Placement Readiness & Comprehensive Assessment Modules",
        lectures: [
          { id: "prep-1", title: "Session 1: Quantitative Problem Solving Speed Strategies", duration: "45 min", videoUrl: "https://www.youtube.com/watch?v=sBgzZ87Vw7A", completed: true },
          { id: "prep-2", title: "Session 2: Logical Reasoning, Data Interpretation & Caselets", duration: "48 min", videoUrl: "https://www.youtube.com/watch?v=Qh_B5x7g7d0", completed: false },
          { id: "prep-3", title: "Session 3: Technical Coding Interviews, Algorithms & Mock Tests", duration: "55 min", videoUrl: "https://www.youtube.com/watch?v=BBpAmxU_NQo", completed: false },
        ],
        resources: [
          { id: "res-prep-1", name: `${course.name} — Practice Question Bank & Answer Keys.pdf`, size: "3.6 MB" },
          { id: "res-prep-2", name: "Campus Placement Interview Guide & Mock Tests.pdf", size: "2.4 MB" },
        ],
      },
    ];
  }

  // Default dynamic module generator for any other course
  return [
    {
      title: `Module 1: Core Concepts & Theoretical Principles of ${course.name}`,
      lectures: [
        { id: "gen-1", title: `1.1 Introduction to ${course.name} Curriculum & Scope`, duration: "42 min", videoUrl: "https://www.youtube.com/watch?v=vRwi_U99q_A", completed: true },
        { id: "gen-2", title: `1.2 Foundational Theories, Models & Systematic Methodologies`, duration: "48 min", videoUrl: "https://www.youtube.com/watch?v=jDM6_TnYIuE", completed: false },
      ],
      resources: [
        { id: "res-gen-1", name: `${course.name} — Lecture Notes & Course Syllabus.pdf`, size: "3.5 MB" },
        { id: "res-gen-2", name: "Recommended Reading & Question Bank.pdf", size: "1.8 MB" },
      ],
    },
    {
      title: `Module 2: Advanced Topics & Real-world Applications`,
      lectures: [
        { id: "gen-3", title: `2.1 Advanced Implementations & Industry Case Studies`, duration: "52 min", videoUrl: "https://www.youtube.com/watch?v=aZjYr87r1b8", completed: false },
      ],
      resources: [
        { id: "res-gen-3", name: "Case Studies & Assignment Problems.pdf", size: "2.7 MB" },
      ],
    },
  ];
}

export function LmsView({ courses, role }: LmsViewProps) {
  const [selectedCourseCode, setSelectedCourseCode] = useState(courses[0]?.code || "");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Determine currently selected course
  const currentCourse = useMemo(() => {
    return courses.find((c) => c.code === selectedCourseCode) || courses[0];
  }, [courses, selectedCourseCode]);

  // Categories present
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      const cat = c.category || (c.name.toLowerCase().includes("lab") ? "Practical" : "Theory");
      set.add(cat);
    });
    return Array.from(set);
  }, [courses]);

  // Filtered course tabs
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase());
      const cat = c.category || (c.name.toLowerCase().includes("lab") ? "Practical" : "Theory");
      const matchCat = categoryFilter === "ALL" || cat === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [courses, search, categoryFilter]);

  // Modules for the selected course
  const modules = useMemo(() => {
    if (!currentCourse) return [];
    return getModulesForCourse(currentCourse);
  }, [currentCourse]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page Header ── */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Learning Management System</h1>
          <p className="page-subtitle">
            Video lectures, interactive courseware, and downloadable study material for your registered subjects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
            {courses.length} Registered Courses
          </span>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
            />
            <input
              className="input pl-9 w-full text-xs sm:text-sm"
              placeholder="Search your registered subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {categories.length > 0 && (
            <select
              className="input text-xs sm:text-sm"
              style={{ maxWidth: "180px" }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Course Types</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── Course Selector Tabs ── */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-white/5 scrollbar-thin">
        {filteredCourses.map((c) => {
          const isSelected = (currentCourse?.code || "") === c.code;
          return (
            <button
              key={c.code}
              onClick={() => {
                setSelectedCourseCode(c.code);
                setActiveVideo(null);
              }}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0",
                isSelected
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-white/5 hover:border-white/10"
              )}
            >
              <span className="font-mono text-[11px] opacity-75">[{c.code}]</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* ── Active Video Player ── */}
      {activeVideo && (
        <div className="card p-4 border-violet-500/30 bg-violet-950/20 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-violet-300">
              <PlayCircle size={18} />
              <span>Embedded Lecture Stream</span>
            </div>
            <button
              onClick={() => setActiveVideo(null)}
              className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded bg-slate-800 transition-colors"
            >
              Close Player
            </button>
          </div>
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/60 flex items-center justify-center border border-white/10">
            <iframe
              src={activeVideo.replace("watch?v=", "embed/")}
              title="Lecture Player"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ── Course Header Banner ── */}
      {currentCourse && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/30 to-slate-900/40 border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {currentCourse.code}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {currentCourse.category || (currentCourse.name.toLowerCase().includes("lab") ? "Practical" : "Theory")}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1">
              {currentCourse.name}
            </h2>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span>{modules.length} Modules</span>
            <span>•</span>
            <span>
              {modules.reduce((acc, m) => acc + m.lectures.length, 0)} Lectures
            </span>
            <span>•</span>
            <span>
              {modules.reduce((acc, m) => acc + m.resources.length, 0)} Resources
            </span>
          </div>
        </div>
      )}

      {/* ── Modules & Content ── */}
      <div className="space-y-6">
        {modules.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen size={36} className="mx-auto text-slate-500 mb-3" />
            <h3 className="text-base font-semibold text-slate-300">
              No LMS modules uploaded yet
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Course faculty will post lectures and resources shortly.
            </p>
          </div>
        ) : (
          modules.map((m, idx) => (
            <div key={idx} className="card p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-violet-600/20 text-violet-400 text-xs flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                {m.title}
              </h3>

              {/* Lecture list */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Video Lectures & Interactive Classes
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {m.lectures.map((lec) => (
                    <div
                      key={lec.id}
                      onClick={() => setActiveVideo(lec.videoUrl)}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-violet-500/30 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors flex-shrink-0">
                          <PlayCircle size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-200 group-hover:text-violet-300 transition-colors truncate">
                            {lec.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <Clock size={11} />
                            <span>{lec.duration}</span>
                          </div>
                        </div>
                      </div>
                      {lec.completed && (
                        <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Course Materials & Handouts
                </p>
                <div className="flex flex-wrap gap-2">
                  {m.resources.map((res) => (
                    <div
                      key={res.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/40 border border-white/5 text-xs text-slate-300 hover:border-violet-500/30 transition-colors"
                    >
                      <FileText size={14} className="text-violet-400 flex-shrink-0" />
                      <span className="truncate max-w-[260px]">{res.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                        ({res.size})
                      </span>
                      <button
                        className="text-slate-400 hover:text-slate-200 ml-1 p-1"
                        title="Download"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Initiating download for ${res.name}`);
                        }}
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
