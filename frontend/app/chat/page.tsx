'use client'

import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../lib/api'

interface Contact {
  id: number; phone: string; name?: string; last_message?: string;
  unread_count?: number; last_seen?: string;
}

interface Message {
  id: number | string; content: string; sender: 'customer' | 'agent' | string;
  timestamp?: string; is_read?: boolean; status?: 'sending' | 'sent' | 'delivered' | 'read';
}

type ConnectionState = 'connecting' | 'online' | 'offline' | 'error'

const AVATAR_COLORS = ['#d32f2f','#6a1b9a','#283593','#1565c0','#00695c','#2e7d32','#e65100','#37474f']

const getAvatarColor = (str: string) => {
  let h = 0
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

const formatTime = (timestamp?: string) => {
  const d = timestamp ? new Date(timestamp) : new Date()
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

const formatLastSeen = (date?: string) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `today at ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
  return `yesterday at ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
}

const formatDateSeparator = (timestamp?: string) => {
  if (!timestamp) return 'Today'
  const d = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

const Avatar = memo(({ name, size = 'w-10 h-10' }: { name: string; size?: string }) => (
  <div
    className={`${size} rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-inner`}
    style={{ background: getAvatarColor(name) }}
  >
    {getInitials(name)}
  </div>
))
Avatar.displayName = 'Avatar'

// ── Tick Icons ─────────────────────────────────────────
const SingleTick = () => (
  <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
    <path d="M1 5.5L4 8.5L11 1.5" stroke="#8696a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const DoubleTick = ({ blue }: { blue?: boolean }) => (
  <svg width="16" height="11" viewBox="0 0 16 11"
    fill={blue ? '#53bdeb' : '#8696a0'}
    style={blue ? { filter: 'drop-shadow(0 0 3px #53bdeb)' } : {}}
  >
    <path d="M11.071.653a.45.45 0 01.749 0l.424.604a.45.45 0 01-.074.602l-5.47 4.7a.45.45 0 01-.613-.02L3.22 3.684a.45.45 0 01.012-.637l.437-.42a.45.45 0 01.628.013l1.923 1.96L11.071.652zm-1.43 5.15l.438-.42a.45.45 0 01.628.013l1.923 1.96 4.051-4.703a.45.45 0 01.749 0l.424.604a.45.45 0 01-.074.602l-5.47 4.7a.45.45 0 01-.613-.02L9.629 6.182a.45.45 0 01.012-.38z"/>
  </svg>
)

const MessageStatus = ({ msg }: { msg: Message }) => {
  if (msg.sender === 'customer') return null
  if (String(msg.id).startsWith('temp-')) return <SingleTick />
  if (msg.is_read) return <DoubleTick blue />
  return <DoubleTick />
}

const DateSeparator = ({ timestamp }: { timestamp?: string }) => (
  <div className="flex justify-center my-4">
    <span className="bg-[#182229] text-[#8696a0] text-[11px] font-bold px-3 py-1 rounded uppercase tracking-wider">
      {formatDateSeparator(timestamp)}
    </span>
  </div>
)

const TypingIndicator = () => (
  <div className="flex justify-start mb-1">
    <div className="bg-[#202c33] rounded-lg rounded-tl-none px-4 py-3 flex items-center gap-1">
      {[0,1,2].map(i => (
        <div key={i} className="w-2 h-2 rounded-full bg-[#8696a0]"
          style={{ animation: 'typing-bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  </div>
)

export default function ChatPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selected, setSelected] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)
  const [activeTab, setActiveTab] = useState<'chats' | 'groups' | 'status'>('chats')
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const [isTyping, setIsTyping] = useState(false)
  const [lastSeen, setLastSeen] = useState<string | undefined>()

  const socketRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)
  // ✅ useRef — re-render पर reset नहीं होगा
  const retryRef = useRef(0)
  // ✅ phone को ref में रखें — closure safety के लिए
  const phoneRef = useRef<string | null>(null)

  // ── Auth ───────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) { router.push('/login'); return }
    setIsAuthed(true)
  }, [router])

  // ── Load Contacts ──────────────────────────────────
  useEffect(() => {
    if (!isAuthed) return
    api.get('/contacts').then(({ data }) => {
      const list = Array.isArray(data) ? data : []
      setContacts(list)
    }).catch(err => console.error('Contacts error', err))
  }, [isAuthed])

  // ── Sidebar update — contact top पर + unread ───────
  const updateSidebar = useCallback((phone: string, text: string, isIncoming: boolean) => {
    setContacts(prev => {
      const idx = prev.findIndex(c => c.phone === phone)
      if (idx === -1) return prev
      const arr = [...prev]
      const [contact] = arr.splice(idx, 1)
      arr.unshift({
        ...contact,
        last_message: text,
        // ✅ सिर्फ incoming और currently not selected हो तो unread बढ़े
        unread_count: isIncoming && phoneRef.current !== phone
          ? (contact.unread_count || 0) + 1
          : contact.unread_count
      })
      return arr
    })
  }, [])

  // ── Select Contact — unread clear ─────────────────
  const selectContact = useCallback((contact: Contact) => {
    setSelected(contact)
    phoneRef.current = contact.phone
    setContacts(prev =>
      prev.map(c => c.phone === contact.phone ? { ...c, unread_count: 0 } : c)
    )
  }, [])

  // ── WebSocket + Message History ────────────────────
  useEffect(() => {
    const phone = selected?.phone
    if (!phone) return

    // ✅ alive flag — cleanup के बाद कुछ नहीं चलेगा
    let alive = true
    let reconnectTimer: NodeJS.Timeout | null = null

    retryRef.current = 0
    setMessages([])
    setConnectionState('connecting')
    setIsTyping(false)
    setLastSeen(undefined)

    // Load history
    api.get('/messages', { params: { phone } }).then(({ data }) => {
      if (!alive) return
      const msgs = Array.isArray(data) ? data : data?.messages || []
      setMessages(msgs)
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }).catch(err => console.error('Messages error', err))

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://nexsai-production.up.railway.app'

    const connectWS = () => {
      if (!alive) return

      // ✅ duplicate connection रोकें
      if (socketRef.current?.readyState === WebSocket.OPEN) return

      if (socketRef.current) {
        socketRef.current.onclose = null
        socketRef.current.close()
      }

      const socket = new WebSocket(`${WS_URL}/ws/${phone}`)
      socketRef.current = socket

      socket.onopen = () => {
        console.log('WS Connected')
        setConnectionState('online')
        retryRef.current = 0 // ✅ success पर reset
      }

      socket.onerror = (err) => {
        console.log('WS Error', err)
        setConnectionState('error')
        socket.close() // ✅ onclose trigger → reconnect चलेगा
      }

      socket.onclose = () => {
        console.log('WS Closed')
        if (!alive) return

        // ✅ readyState check — flicker नहीं होगा
        if (socket.readyState !== WebSocket.OPEN) {
          setConnectionState('offline')
          setLastSeen(new Date().toISOString())
        }

        // ✅ Exponential backoff — 3s → 6s → ... max 15s
        retryRef.current++
        const delay = Math.min(3000 * retryRef.current, 15000)
        console.log(`Reconnecting in ${delay}ms (attempt ${retryRef.current})`)
        // ✅ reconnect timer save करें cleanup के लिए
        reconnectTimer = setTimeout(() => connectWS(), delay)
      }

      socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data)

          // ✅ ping/pong — server alive रखें
          if (data.type === 'ping') {
            socket.send(JSON.stringify({ type: 'pong' }))
            return
          }

          // ✅ दूसरे contact का message ignore करें — closure से phone compare
          if (data.phone && data.phone !== phone) return

          // ✅ typing indicator
          if (data.type === 'typing') {
            setIsTyping(true)
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
            typingTimerRef.current = setTimeout(() => setIsTyping(false), 3000)
            return
          }

          if (data.type === 'typing_stop') {
            setIsTyping(false)
            return
          }

          // ✅ status update
          if (data.status) {
            setMessages(prev =>
              prev.map(msg =>
                String(msg.id) === String(data.id)
                  ? { ...msg, status: data.status, is_read: data.status === 'read' }
                  : msg
              )
            )
            return
          }

          // ✅ normal message — temp replace या duplicate skip
          setMessages(prev => {
            const tempIdx = prev.findIndex(
              m => String(m.id).startsWith('temp-') &&
                m.content === data.content && m.sender === data.sender
            )
            if (tempIdx !== -1) {
              const updated = [...prev]
              updated[tempIdx] = data
              return updated
            }
            if (prev.some(m => String(m.id) === String(data.id))) return prev
            return [...prev, data]
          })

          setIsTyping(false)
          if (data.sender === 'customer') updateSidebar(phone, data.content, true)
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
        } catch (e) {
          console.error('WS parse error:', e)
        }
      }
    }

    connectWS()

    // ✅ Clean cleanup — ghost connections नहीं बनेंगी
    return () => {
      alive = false
      if (reconnectTimer) clearTimeout(reconnectTimer) // ✅ pending reconnect cancel
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      if (socketRef.current) {
        socketRef.current.onclose = null // ✅ reconnect loop रोकें
        socketRef.current.close()
        socketRef.current = null
      }
    }
  }, [selected?.phone, updateSidebar])

  // ── Send Message ───────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || !selected) return
    const content = input.trim()
    const tempId = `temp-${Date.now()}`

    setMessages(prev => [...prev, {
      id: tempId, content, sender: 'agent',
      timestamp: new Date().toISOString(), status: 'sending'
    }])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = '45px'
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

    try {
      const { data } = await api.post('/send', { phone: selected.phone, message: content })
      setMessages(prev =>
        prev.map(m => m.id === tempId ? { ...m, id: data?.id || tempId, status: 'sent' } : m)
      )
      updateSidebar(selected.phone, content, false) // ✅ outgoing — unread नहीं बढ़ेगा
    } catch (err) {
      console.error('Send failed', err)
      setMessages(prev => prev.filter(m => m.id !== tempId))
    }
  }

  const filteredContacts = useMemo(() =>
    contacts.filter(c => (c.name || c.phone).toLowerCase().includes(search.toLowerCase())),
  [contacts, search])

  if (!isAuthed) return null

  return (
    <div className="h-screen flex bg-[#111b21] text-[#e9edef] overflow-hidden antialiased font-sans">

      {/* ── SIDEBAR ──────────────────────────────────── */}
      <aside className="w-[420px] border-r border-[#2a3942] flex flex-col bg-[#202c33]">
        <header className="p-4 flex justify-between items-center bg-[#202c33]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25d366] to-[#128c7e] flex items-center justify-center font-bold text-white shadow-lg">N</div>
            <h1 className="text-xl font-bold text-white">360NexusAI</h1>
          </div>
          {/* ✅ Connection dot */}
          <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
            connectionState === 'online'  ? 'bg-[#00a884]' :
            connectionState === 'error'   ? 'bg-red-400' :
            connectionState === 'offline' ? 'bg-gray-400' : 'bg-yellow-400'
          }`} />
        </header>

        {/* Search */}
        <div className="px-4 py-2 bg-[#111b21]">
          <div className="bg-[#202c33] flex items-center px-4 py-1.5 rounded-lg border border-transparent focus-within:border-[#00a884]/40">
            <svg className="mr-3 shrink-0" width="16" height="16" fill="none" stroke="#8696a0" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className="bg-transparent w-full text-sm outline-none placeholder-[#8696a0]"
              placeholder="Search StallionAgro contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex text-[13px] font-medium border-b border-[#2a3942] text-[#8696a0] bg-[#111b21]">
          {(['chats', 'groups', 'status'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 uppercase tracking-wider transition-all ${activeTab === tab ? 'text-[#00a884] border-b-2 border-[#00a884]' : 'hover:text-[#e9edef]'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredContacts.length === 0 ? (
            <p className="text-center text-[#8696a0] text-sm mt-10 opacity-50">No contacts found</p>
          ) : filteredContacts.map(c => (
            <div key={c.id} onClick={() => selectContact(c)}
              className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors ${selected?.id === c.id ? 'bg-[#2a3942]' : 'hover:bg-[#2a3942]/60'}`}
            >
              <Avatar name={c.name || c.phone} size="w-12 h-12" />
              <div className="flex-1 border-b border-[#2a3942] pb-3 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[16px] text-[#e9edef] truncate">{c.name || c.phone}</span>
                  <span className="text-[11px] text-[#8696a0] shrink-0 ml-2">
                    {c.last_seen ? formatTime(c.last_seen) : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1 gap-2">
                  <p className="text-sm text-[#8696a0] truncate">{c.last_message || 'Start chatting...'}</p>
                  {!!c.unread_count && c.unread_count > 0 && (
                    <span className="bg-[#00a884] text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shrink-0">
                      {c.unread_count > 99 ? '99+' : c.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── CHAT AREA ────────────────────────────────── */}
      <main className="flex-1 flex flex-col bg-[#0b141a] relative">
        {selected ? (
          <>
            <header className="h-[60px] bg-[#202c33] px-4 flex items-center justify-between z-20 shadow-md">
              <div className="flex items-center gap-4">
                <Avatar name={selected.name || selected.phone} />
                <div>
                  <h2 className="font-bold text-[16px] leading-tight truncate">{selected.name || selected.phone}</h2>
                  <span className={`text-[12px] font-medium ${
                    isTyping ? 'text-[#00a884] animate-pulse' :
                    connectionState === 'online' ? 'text-[#00a884]' :
                    connectionState === 'offline' ? 'text-gray-400' :
                    connectionState === 'error' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {isTyping ? 'typing...' :
                     connectionState === 'offline' && lastSeen ? `last seen ${formatLastSeen(lastSeen)}` :
                     connectionState}
                  </span>
                </div>
              </div>
              <div className="flex gap-5 text-[#aebac1] text-lg">
                <button className="hover:text-white transition-colors">🔍</button>
                <button className="hover:text-white transition-colors">⋮</button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-10 py-6 custom-scrollbar relative"
              style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundRepeat: 'repeat', backgroundSize: 'auto' }}
            >
              {/* bg overlay */}
              <div className="absolute inset-0 bg-[#0b141a]/94 pointer-events-none" />

              <div className="relative z-10 flex flex-col space-y-1">
                {messages.map((m, i) => {
                  const prev = messages[i - 1]
                  const showDate = !prev ||
                    new Date(m.timestamp ?? '').toDateString() !== new Date(prev.timestamp ?? '').toDateString()
                  const isOut = m.sender !== 'customer'
                  const isSending = String(m.id).startsWith('temp-')

                  return (
                    <React.Fragment key={m.id}>
                      {showDate && <DateSeparator timestamp={m.timestamp} />}
                      <div className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[65%] min-w-[85px] px-3 pt-1.5 pb-6 relative rounded-lg text-[14.5px] shadow-sm
                          ${isOut ? 'bg-[#005c4b] rounded-tr-none' : 'bg-[#202c33] rounded-tl-none'}
                          ${isSending ? 'opacity-60' : 'opacity-100'} transition-opacity duration-200`}
                        >
                          {m.content}
                          <span className="absolute bottom-1.5 right-2 text-[10.5px] text-white/40 flex items-center gap-1 select-none">
                            {formatTime(m.timestamp)}
                            <MessageStatus msg={m} />
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  )
                })}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#202c33] px-4 py-2 flex items-end gap-3 min-h-[62px]">
              <button className="p-2 text-[#8696a0] text-2xl hover:text-white transition-colors select-none">😊</button>
              <button className="p-2 text-[#8696a0] text-2xl hover:text-white transition-colors select-none">📎</button>
              <textarea
                ref={textareaRef}
                className="flex-1 bg-[#2a3942] rounded-lg px-4 py-2.5 outline-none text-sm resize-none custom-scrollbar placeholder-[#8696a0]"
                placeholder="Type a message"
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  e.target.style.height = '45px'
                  e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (input.trim()) handleSend()
                  }
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-[#00a884] p-3 rounded-full hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#8696a0] select-none">
            <div className="w-32 h-32 bg-gradient-to-br from-[#25d366] to-[#128c7e] rounded-full flex items-center justify-center text-white text-6xl font-bold mb-6 shadow-2xl opacity-80">
              N
            </div>
            <h2 className="text-3xl font-light text-[#e9edef]">360NexusAI for StallionAgro</h2>
            <p className="mt-4 text-sm max-w-sm text-center opacity-60">
              Connect with farmers and suppliers instantly. Real-time agricultural commerce powered by 360NexusAI.
            </p>
          </div>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374045; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}