"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ArrowUpRight, Terminal, Network, ShieldCheck, Activity } from "lucide-react";

type ArchNode = {
  label: string;
  x: number;
  y: number;
};

type Project = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  color: string;
  hoverColor: string;
  stats: {
    status: string;
    uptime: string;
    commits: string;
    response: string;
  };
  arch: {
    nodes: ArchNode[];
    connections: [number, number][]; // Indexes of nodes
  };
  logs: string[];
};

const projectsData: Project[] = [
  {
    id: "project-1",
    number: "01",
    title: "Multi-Agent AI Analytics",
    subtitle: "Cooperative intelligence orchestrator.",
    description: "An enterprise platform where dynamic networks of multi-agent AI work cooperatively to execute complex tasks, run predictive analytics, and stream insights.",
    tags: ["Python", "LangChain", "FastAPI", "React", "Docker"],
    image: "/images/project1.png",
    color: "rgba(16,185,129,0.12)",
    hoverColor: "#10B981",
    stats: {
      status: "Active / Online",
      uptime: "99.98%",
      commits: "1,240",
      response: "180ms",
    },
    arch: {
      nodes: [
        { label: "Client", x: 20, y: 50 },
        { label: "Router", x: 45, y: 50 },
        { label: "LLM Agent", x: 70, y: 30 },
        { label: "VectorDB", x: 70, y: 70 },
        { label: "Output", x: 92, y: 50 },
      ],
      connections: [
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 4],
      ],
    },
    logs: [
      "> python main.py --agent-orchestrate",
      "[SYSTEM] Loading Llama-3-70B model...",
      "[SYSTEM] Core memory buffers loaded successfully.",
      "[AGENT] Query: 'Optimize database indexes'",
      "[PLANNER] Query split: 1. Fetch metrics, 2. Run PCA.",
      "[DATABASE] Reading schema index statistics...",
      "[ANALYZER] Variance detected on key index table_id.",
      "[AGENT] Formulating recommendation plan...",
      "[SUCCESS] Optimization plan generated in 420ms.",
    ],
  },
  {
    id: "project-2",
    number: "02",
    title: "Cloud-Native Infrastructure Monitor",
    subtitle: "Real-time telemetry at scale.",
    description: "A centralized dashboard monitoring cluster topologies, resource distributions, and microservice traffic patterns, featuring automated anomaly alerts.",
    tags: ["Go", "Kubernetes", "Terraform", "Next.js", "Redis"],
    image: "/images/project2.png",
    color: "rgba(245,158,11,0.12)",
    hoverColor: "#F59E0B",
    stats: {
      status: "Deallocated / Testing",
      uptime: "99.92%",
      commits: "890",
      response: "45ms",
    },
    arch: {
      nodes: [
        { label: "Pods", x: 18, y: 30 },
        { label: "Node Exporter", x: 18, y: 70 },
        { label: "Prometheus", x: 48, y: 50 },
        { label: "Redis DB", x: 76, y: 30 },
        { label: "Grafana", x: 76, y: 70 },
      ],
      connections: [
        [0, 2],
        [1, 2],
        [2, 3],
        [2, 4],
      ],
    },
    logs: [
      "> ./telemetry-agent --scrape-interval=10s",
      "[KUBE] Scraping metrics from namespace 'production'...",
      "[KUBE] Active nodes: 12. Unhealthy pods: 0.",
      "[PROMETHEUS] Memory allocation: 4.2GB / 8GB.",
      "[TELEMETRY] CPU spikes detected on pod-nginx-84f9.",
      "[ALERT] Automated replication factor scale triggered.",
      "[REDIS] Cache hit ratio: 94.2%. Flush executed.",
      "[SYSTEM] Dashboard graphs updated successfully.",
    ],
  },
  {
    id: "project-3",
    number: "03",
    title: "Blockchain Explorer & Ledger",
    subtitle: "High-throughput smart contract audit.",
    description: "A secure blockchain ledger auditing suite displaying transaction streams, smart contract invocations, and live verification graphs.",
    tags: ["TypeScript", "Solidity", "Hardhat", "PostgreSQL", "Tailwind"],
    image: "/images/project3.png",
    color: "rgba(139,92,246,0.12)",
    hoverColor: "#8B5CF6",
    stats: {
      status: "Mainnet Stable",
      uptime: "100.00%",
      commits: "640",
      response: "12ms",
    },
    arch: {
      nodes: [
        { label: "Web App", x: 20, y: 50 },
        { label: "Ethers.js", x: 45, y: 50 },
        { label: "EVM Node", x: 70, y: 30 },
        { label: "Postgres", x: 70, y: 70 },
        { label: "Block", x: 92, y: 50 },
      ],
      connections: [
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 4],
      ],
    },
    logs: [
      "> npx hardhat node --fork mainnet",
      "[LEDGER] Connecting to RPC endpoint https://eth.mainnet...",
      "[BLOCK] Scraped Block #20149021. Tx count: 184.",
      "[AUDIT] Scanning contract bytecode at 0x71C88...",
      "[AUDIT] Function call validated: transferFrom().",
      "[DATABASE] Transferred record indexing triggered.",
      "[EXPLORER] UI connection established with WebSockets.",
      "[SUCCESS] Transaction verified & archived.",
    ],
  },
];

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const logIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll pinning and active index trigger using GSAP ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      const pinTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=250%",
        pin: scrollRef.current,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.33) {
            setActiveIndex(0);
          } else if (progress >= 0.33 && progress < 0.66) {
            setActiveIndex(1);
          } else {
            setActiveIndex(2);
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Terminal log typing simulator
  useEffect(() => {
    if (logIntervalRef.current) {
      clearInterval(logIntervalRef.current);
    }

    const fullLogs = projectsData[activeIndex].logs;
    setVisibleLogs([fullLogs[0]]); // Seed first log

    let currentLogIndex = 1;
    logIntervalRef.current = setInterval(() => {
      if (currentLogIndex < fullLogs.length) {
        setVisibleLogs((prev) => [...prev, fullLogs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        if (logIntervalRef.current) clearInterval(logIntervalRef.current);
      }
    }, 700);

    return () => {
      if (logIntervalRef.current) clearInterval(logIntervalRef.current);
    };
  }, [activeIndex]);

  const activeProject = projectsData[activeIndex];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#090909] text-white border-t border-white/5"
      style={{
        // 3 projects scroll sequence height
        height: "350vh",
      }}
    >
      {/* ── STICKY WORKSPACE VIEWPORT ── */}
      <div
        ref={scrollRef}
        className="w-full h-screen flex flex-col justify-center items-center px-6 lg:px-8 box-sizing"
      >
        {/* Top Header */}
        <div className="w-full max-w-7xl mx-auto mb-8 flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#9bb88f] font-sans">
              Interactive Workspace
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight font-sans">
              Featured Engineering Projects
            </h2>
          </div>
          {/* Quick indicators */}
          <div className="hidden md:flex items-center gap-6">
            {projectsData.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => {
                  // Scroll to corresponding percentage position
                  const trigger = ScrollTrigger.getById(containerRef.current as any);
                  const scrollPos =
                    ScrollTrigger.create({
                      trigger: containerRef.current,
                      start: "top top",
                    }).start +
                    (idx === 0 ? 10 : idx === 1 ? window.innerHeight * 1.2 : window.innerHeight * 2.3);

                  window.scrollTo({
                    top: scrollPos,
                    behavior: "smooth",
                  });
                }}
                className="flex items-center gap-2 group cursor-pointer transition-colors duration-300"
                style={{
                  color: activeIndex === idx ? proj.hoverColor : "rgba(255,255,255,0.3)",
                }}
              >
                <span className="text-xs font-bold font-sans">0{idx + 1}</span>
                <span className="text-sm font-semibold tracking-wide font-sans group-hover:text-white">
                  {proj.title.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── BENTO GRID WORKSPACE ── */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 h-[75vh]">
          
          {/* 1. Main Project Metadata & Details */}
          <div className="lg:col-span-4 flex flex-col justify-between p-7 rounded-3xl border border-white/5 bg-[#121212] relative overflow-hidden transition-colors duration-500">
            {/* Background Glow */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none transition-all duration-700"
              style={{
                background: `radial-gradient(circle at 10% 10%, ${activeProject.hoverColor}, transparent 75%)`,
              }}
            />

            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex justify-between items-start">
                <span className="text-5xl font-black text-white/5 font-sans">
                  {activeProject.number}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold tracking-wider font-sans border border-white/10"
                  style={{
                    color: activeProject.hoverColor,
                    borderColor: `${activeProject.hoverColor}30`,
                    background: `${activeProject.hoverColor}10`,
                  }}
                >
                  Project Spec
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-2xl lg:text-3xl font-black font-sans leading-tight">
                  {activeProject.title}
                </h3>
                <p className="text-xs font-bold tracking-wider text-[#9bb88f] uppercase font-sans">
                  {activeProject.subtitle}
                </p>
              </div>

              <p className="text-sm text-white/60 leading-relaxed font-sans mt-1">
                {activeProject.description}
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-6 mt-6">
              {/* Tech Pills */}
              <div className="flex flex-wrap gap-2">
                {activeProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-bold font-sans border border-white/10 bg-white/5 text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* View Project Button */}
              <div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 group/btn px-5 py-3 rounded-full text-xs font-black tracking-widest uppercase border border-white/20 bg-transparent transition-all duration-300 font-sans cursor-pointer"
                  style={{
                    borderColor: activeProject.hoverColor,
                    boxShadow: `0 0 15px ${activeProject.hoverColor}20`,
                  }}
                >
                  <span>Explore Architecture</span>
                  <ArrowUpRight
                    className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                    style={{
                      color: activeProject.hoverColor,
                    }}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* 2. Main Mockup Viewport */}
          <div className="lg:col-span-5 rounded-3xl border border-white/5 bg-[#121212] overflow-hidden relative group/mockup flex items-center justify-center">
            {/* Project Image */}
            <div className="w-full h-full relative">
              {projectsData.map((project, idx) => (
                <div
                  key={project.id}
                  className="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
                  style={{
                    opacity: idx === activeIndex ? 1 : 0,
                    zIndex: idx === activeIndex ? 10 : 0,
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Dark Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                </div>
              ))}
            </div>

            {/* Glowing Brand overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700 mix-blend-color z-20"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${activeProject.hoverColor}30, transparent 80%)`,
              }}
            />
          </div>

          {/* Right Column: 3. Architecture & 4. Terminal (Stacked) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            {/* 3. System Architecture Card */}
            <div className="flex-1 p-5 rounded-3xl border border-white/5 bg-[#121212] flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Network className="w-4 h-4 text-[#9bb88f]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/50 font-sans">
                  Active Node topology
                </span>
              </div>

              {/* Architecture SVG canvas */}
              <div className="flex-1 relative w-full h-full flex items-center justify-center">
                <svg
                  className="w-full h-full min-h-[140px]"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {/* Glowing Connection Paths */}
                  {activeProject.arch.connections.map(([start, end], idx) => {
                    const startNode = activeProject.arch.nodes[start];
                    const endNode = activeProject.arch.nodes[end];
                    return (
                      <g key={idx}>
                        {/* Background connection line */}
                        <line
                          x1={startNode.x}
                          y1={startNode.y}
                          x2={endNode.x}
                          y2={endNode.y}
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="1"
                        />
                        {/* Glowing pulse line */}
                        <line
                          x1={startNode.x}
                          y1={startNode.y}
                          x2={endNode.x}
                          y2={endNode.y}
                          stroke={activeProject.hoverColor}
                          strokeWidth="1.2"
                          strokeDasharray="4 6"
                          style={{
                            animation: "dash 1.2s linear infinite",
                          }}
                        />
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  {activeProject.arch.nodes.map((node, idx) => (
                    <g key={idx}>
                      {/* Outer pulse */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="3"
                        fill={activeProject.hoverColor}
                        opacity="0.2"
                      >
                        <animate
                          attributeName="r"
                          values="3;6;3"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </g>
                      {/* Core circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="2.2"
                        fill="#090909"
                        stroke={activeProject.hoverColor}
                        strokeWidth="1"
                      />
                      {/* Label */}
                      <text
                        x={node.x}
                        y={node.y - 5}
                        fill="rgba(255,255,255,0.6)"
                        fontSize="3.2"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {node.label}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Inline stylesheet for stroke offset animation */}
                <style jsx global>{`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                `}</style>
              </div>
            </div>

            {/* 4. Live Command Terminal Card */}
            <div className="flex-1 p-5 rounded-3xl border border-white/5 bg-[#090909] flex flex-col gap-3 relative overflow-hidden font-mono text-[10px] md:text-[11px] text-emerald-400/90 leading-relaxed shadow-inner">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Console Logs
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/70" />
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
                </div>
              </div>

              {/* Logs area */}
              <div className="flex-1 flex flex-col justify-end overflow-hidden pb-1 select-none">
                {visibleLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300"
                    style={{
                      color: log.startsWith(">")
                        ? activeProject.hoverColor
                        : log.startsWith("[SUCCESS]")
                        ? "#10B981"
                        : log.startsWith("[ALERT]")
                        ? "#F59E0B"
                        : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {log}
                  </div>
                ))}
                {/* Typing cursor */}
                <div className="flex items-center gap-1 mt-0.5 text-white/50">
                  <span>$</span>
                  <span className="w-1.5 h-3 bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Stats Row */}
        <div className="w-full max-w-7xl mx-auto mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl border border-white/5 bg-[#121212] flex items-center gap-4">
            <Activity className="w-5 h-5 text-white/30" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-sans">
                Status
              </span>
              <span
                className="text-xs font-extrabold font-sans transition-colors duration-300"
                style={{ color: activeProject.hoverColor }}
              >
                {activeProject.stats.status}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/5 bg-[#121212] flex items-center gap-4">
            <Activity className="w-5 h-5 text-white/30" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-sans">
                Uptime rate
              </span>
              <span className="text-xs font-extrabold text-white/80 font-sans">
                {activeProject.stats.uptime}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/5 bg-[#121212] flex items-center gap-4">
            <ShieldCheck className="w-5 h-5 text-white/30" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-sans">
                Commits count
              </span>
              <span className="text-xs font-extrabold text-white/80 font-sans">
                {activeProject.stats.commits}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/5 bg-[#121212] flex items-center gap-4">
            <Terminal className="w-5 h-5 text-white/30" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-sans">
                Response Time
              </span>
              <span className="text-xs font-extrabold text-white/80 font-sans">
                {activeProject.stats.response}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
