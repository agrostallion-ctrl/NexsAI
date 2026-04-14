'use client'

import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import api from "../../lib/api"

interface Contact { id: number; phone: string; name?: string; last_message?: string; unread?: number }
interface Message { id: number | string; content: string; sender: 'customer' | 'agent'; timestamp?: string ,is_read?: boolean}

const AVATAR_COLORS = ['#d32f2f', '#6a1b9a', '#283593', '#1565c0', '#00695c', '#2e7d32', '#e65100', '#37474f']
const getAvatarColor = (str: string) => {
  let h = 0; for (const c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
const formatTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

const Avatar = memo(({ name, size = "w-10 h-10" }: { name: string, size?: string }) => (
  <div className={`${size} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
    style={{ background: getAvatarColor(name) }}>
    {getInitials(name)}
  </div>
))
Avatar.displayName = 'Avatar'

const MessageBubble = memo(({ msg }: { msg: Message }) => {
  const isOut = msg.sender !== 'customer'

  return (
    <div className={`flex ${isOut ? 'justify-end' : 'justify-start'} mb-1`}>
      <div
        className={`max-w-[65%] min-w-[85px] px-3 pt-1.5 pb-6 relative rounded-lg shadow text-[14.5px] text-[#e9edef]
        ${isOut ? 'bg-[#005c4b] rounded-tr-none' : 'bg-[#202c33] rounded-tl-none'}`}
      >
        {/* Message Text */}
        {msg.content}

        {/* Time + Tick */}
        <span className="absolute bottom-1.5 right-2 text-[10.5px] text-white/40 flex items-center gap-1 select-none">
          {msg.timestamp || formatTime()}

          {/* ✅ Tick Logic */}
          {isOut && (
            msg.is_read ? (
              // 🔵 READ → Double blue tick
              <svg width="16" height="11" viewBox="0 0 16 11" fill="#53bdeb">
                <path d="M11.071.653a.45.45 0 01.749 0l.424.604a.45.45 0 01-.074.602l-5.47 4.7a.45.45 0 01-.613-.02L3.22 3.684a.45.45 0 01.012-.637l.437-.42a.45.45 0 01.628.013l1.923 1.96L11.071.652zm-1.43 5.15l.438-.42a.45.45 0 01.628.013l1.923 1.96 4.051-4.703a.45.45 0 01.749 0l.424.604a.45.45 0 01-.074.602l-5.47 4.7a.45.45 0 01-.613-.02L9.629 6.182a.45.45 0 01.012-.38z"/>
              </svg>
            ) : (
              // ⚪ SENT → Single tick
              <span className="text-white/50 text-xs">✔</span>
            )
          )}
        </span>
      </div>
    </div>
  )
})

MessageBubble.displayName = 'MessageBubble'

export default function ChatPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selected, setSelected] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const socketRef = useRef<WebSocket | null>(null)

  // ✅ Token check
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/login")
      return
    }
    setIsAuthed(true)
    fetchContacts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchContacts = useCallback(async () => {
    try {
      const { data } = await api.get("/contacts") // ✅ sirf "/contacts"
      setContacts(data)
      if (data.length > 0) setSelected(data[0])
    } catch (err) { console.error("Contacts error", err) }
  }, [])

  const fetchMessages = useCallback(async (phone: string) => {
    try {
      const { data } = await api.get("/messages", { params: { phone } }) // ✅ fix
      setMessages(data)
    } catch (err) { console.error("Messages error", err) }
  }, [])

  useEffect(() => {
    if (!selected) return;
    fetchMessages(selected.phone);

    const WS_URL = "wss://nexsai-production.up.railway.app"
    const socket = new WebSocket(`${WS_URL}/ws/${selected.phone}`);

socketRef.current = socket;

socket.onopen = () => {
  console.log("✅ WS CONNECTED:", selected.phone);
};

socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  console.log("🔥 NEW MSG:", msg);

  setMessages(prev => {
    const exists = prev.some(m =>
      m.id === msg.id ||
      (m.content === msg.content &&
       m.sender === msg.sender &&
       m.id.toString().startsWith('temp-'))
    );
    if (exists) return prev;
    return [...prev, msg];
  });
};

socket.onerror = (err) => {
  console.log("❌ WS ERROR:", err);
};

socket.onclose = () => {
  console.log("⚠️ WS CLOSED");
};

    return () => { socket.close(); socketRef.current = null; };
  }, [selected, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSendMessage = async () => {
    if (!input.trim() || !selected) return

    const tempId = `temp-${Date.now()}`
    const tempMsg: Message = {
      id: tempId,
      content: input.trim(),
      sender: 'agent',
      timestamp: formatTime()
    }



    setMessages(prev => [...prev, tempMsg])
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      await api.post("/send", null, { // ✅ fix
        params: { phone: selected.phone, message: tempMsg.content }
      })
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        
      }
    } catch (err) {
      console.error("Send failed")
      setMessages(prev => prev.filter(m => m.id !== tempId))
    }
  }


  if (!isAuthed) return null

  const filteredContacts = contacts.filter(c => (c.name || c.phone).toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="h-screen flex bg-[#111b21] text-white overflow-hidden" style={{ fontFamily: 'Nunito, sans-serif' }}>

      <aside className="w-[360px] min-w-[300px] flex flex-col border-r border-[#2a3942] bg-[#202c33] z-20">
        <header className="flex items-center justify-between px-4 py-2.5 bg-[#202c33] border-b border-[#2a3942]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25d366] to-[#128c7e] flex items-center justify-center font-bold text-white shadow-lg">N</div>
            <span className="text-lg font-bold text-[#e9edef]">NexusAI</span>
          </div>
        </header>

        <div className="px-3 py-2">
          <div className="flex items-center gap-4 bg-[#2a3942] rounded-lg px-3 py-1.5 border border-transparent focus-within:border-[#00a884]/50">
            <svg width="16" height="16" fill="none" stroke="#8696a0" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#8696a0]"
              placeholder="Search or start new chat" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredContacts.map(c => (
            <div key={c.id} onClick={() => setSelected(c)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[#2a3942]/30 transition-colors
                ${selected?.id === c.id ? 'bg-[#2a3942]' : 'hover:bg-[#2a3942]/50'}`}>
              <Avatar name={c.name || c.phone} size="w-12 h-12" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-[15px] truncate">{c.name || c.phone}</span>
                  <span className="text-[11px] text-[#8696a0]">{formatTime()}</span>
                </div>
                <div className="text-[13px] text-[#8696a0] truncate">{c.last_message || 'Start chatting...'}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0b141a] relative">
        {selected ? (
          <>
            <header className="flex items-center gap-3 px-4 py-2.5 bg-[#202c33] border-b border-[#2a3942] z-10 shadow-sm">
              <Avatar name={selected.name || selected.phone} />
              <div className="flex-1">
                <p className="font-semibold text-[15px]">{selected.name || selected.phone}</p>
                <p className="text-[12px] text-[#00a884] animate-pulse font-medium">online</p>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto relative">
              <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
                   style={{ backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`, backgroundRepeat: 'repeat' }} />
              <div className="relative z-10 px-[7%] py-4 flex flex-col">
                <div className="flex justify-center mb-4"><span className="bg-[#182229] text-[#8696a0] text-[11px] font-bold px-3 py-1 rounded uppercase tracking-wider">Today</span></div>
                {messages.map(m => <MessageBubble key={m.id} msg={m} />)}
                {isTyping && <div className="text-gray-500 text-xs ml-2 italic">typing...</div>}
                <div ref={messagesEndRef} className="h-2" />
              </div>
            </div>

            <footer className="flex items-end gap-2 px-4 py-3 bg-[#202c33] border-t border-[#2a3942]">
              <div className="flex-1 flex items-center bg-[#2a3942] rounded-2xl px-4 py-1 gap-3 min-h-[46px]">
                <span className="text-xl cursor-pointer">😊</span>
                <textarea ref={textareaRef}
                  className="flex-1 bg-transparent outline-none text-[14.5px] resize-none py-2.5 max-h-32 placeholder:text-[#8696a0]"
                  placeholder="Type a message" rows={1} value={input}
                  onChange={e => { setInput(e.target.value); e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight, 128)+'px' }}
                  onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault(); handleSendMessage()} }}
                />
              </div>
              <button onClick={handleSendMessage} disabled={!input.trim()}
                className="w-12 h-12 rounded-full bg-[#00a884] flex items-center justify-center hover:bg-[#00c99e] active:scale-90 transition-all shadow-xl disabled:bg-[#3b4a54]">
                <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#111b21] text-[#8696a0]">
            <h3 className="text-2xl font-light text-[#e9edef] mb-2">NexusAI for Stallionagro</h3>
            <p className="text-sm opacity-60">Select a contact to begin chatting</p>
          </div>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374045; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  )
}