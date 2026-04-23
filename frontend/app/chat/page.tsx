'use client'

import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../lib/api'

interface Contact {
  id: number
  phone: string
  name?: string
  last_message?: string
  unread_count?: number
  last_seen?: string
}

interface Message {
  id: number | string
  content: string
  sender: 'customer' | 'agent' | string
  timestamp?: string
  is_read?: boolean
  status?: 'sending' | 'sent' | 'delivered' | 'read'
}

type ConnectionState = 'connecting' | 'online' | 'offline' | 'error'

const AVATAR_COLORS = ['#d32f2f','#6a1b9a','#283593','#1565c0','#00695c','#2e7d32','#e65100','#37474f']

const getAvatarColor = (str: string) => {
  let h = 0
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

const getInitials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

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

const SingleTick = () => (
  <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
    <path d="M1 5.5L4 8.5L11 1.5" stroke="#8696a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const DoubleTick = ({ blue }: { blue?: boolean }) => (
  <svg
    width="16" height="11" viewBox="0 0 16 11"
    fill={blue ? "#53bdeb" : "#8696a0"}
    className={blue ? "transition-all duration-500 ease-in-out scale-110" : "transition-all duration-300"}
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

const Avatar = memo(({ name, size = 'w-10 h-10' }: { name: string; size?: string }) => (
  <div
    className={`${size} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
    style={{ background: getAvatarColor(name) }}
  >
    {getInitials(name)}
  </div>
))
Avatar.displayName = 'Avatar'

const MessageBubble = memo(({ msg }: { msg: Message }) => {
  const isOut = msg.sender !== 'customer'
  const isSending = String(msg.id).startsWith('temp-')
  return (
    <div className={`flex ${isOut ? 'justify-end' : 'justify-start'} mb-1 animate-in fade-in slide-in-from-bottom-1`}>
      <div className={`max-w-[65%] min-w-[85px] px-3 pt-1.5 pb-6 relative rounded-lg shadow text-[14.5px] text-[#e9edef]
        ${isOut ? 'bg-[#005c4b] rounded-tr-none' : 'bg-[#202c33] rounded-tl-none'}
        ${isSending ? 'opacity-70' : 'opacity-100'} transition-opacity duration-200`}
      >
        {msg.content}
        <span className="absolute bottom-1.5 right-2 text-[10.5px] text-white/40 flex items-center gap-1 select-none">
          {formatTime(msg.timestamp)}
          <MessageStatus msg={msg} />
        </span>
      </div>
    </div>
  )
})
MessageBubble.displayName = 'MessageBubble'

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
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-[#8696a0]"
          style={{ animation: 'typing-bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  </div>
)

const UnreadBadge = ({ count }: { count?: number }) => {
  if (!count || count === 0) return null
  return (
    <span className="bg-[#00a884] text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shrink-0">
      {count > 99 ? '99+' : count}
    </span>
  )
}

const ConnectionBadge = ({ state, isTyping, lastSeen }: {
  state: ConnectionState
  isTyping: boolean
  lastSeen?: string
}) => {
  if (isTyping) return <p className="text-[12px] font-medium text-[#00a884] animate-pulse">typing...</p>
  const config = {
    connecting: { color: 'text-yellow-400', text: 'connecting...' },
    online:     { color: 'text-[#00a884]',  text: 'online' },
    offline:    { color: 'text-gray-400',   text: lastSeen ? `last seen ${formatLastSeen(lastSeen)}` : 'offline' },
    error:      { color: 'text-red-400',    text: 'connection error' },
  }
  const { color, text } = config[state]
  return <p className={`text-[12px] font-medium ${color}`}>{text}</p>
}

const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center bg-[#111b21] text-[#8696a0] select-none">
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#25d366] to-[#128c7e] flex items-center justify-center font-bold text-white text-4xl shadow-2xl mb-6 opacity-80">
      N
    </div>
    <h3 className="text-2xl font-light text-[#e9edef] mb-2">NexusAI for Stallionagro</h3>
    <p className="text-sm opacity-50">Select a contact to begin chatting</p>
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
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [lastSeen, setLastSeen] = useState<string | undefined>()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = useCallback((force = false) => {
    if (force || isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isAtBottom])

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return
    const { scrollTop, scrollHeight, clientHeight } = container
    setIsAtBottom(scrollHeight - scrollTop - clientHeight < 50)
  }, [])

  const updateContactLocally = useCallback((phone: string, lastMessage: string, isIncoming = false) => {
    setContacts(prev => {
      const contactIndex = prev.findIndex(c => c.phone === phone)
      if (contactIndex === -1) return prev
      const updatedContacts = [...prev]
      const [contact] = updatedContacts.splice(contactIndex, 1)
      updatedContacts.unshift({
        ...contact,
        last_message: lastMessage,
        unread_count: isIncoming ? (contact.unread_count || 0) + 1 : contact.unread_count
      })
      return updatedContacts
    })
  }, [])

  const selectContact = useCallback((contact: Contact) => {
    setSelected(contact)
    setContacts(prev =>
      prev.map(c => c.phone === contact.phone ? { ...c, unread_count: 0 } : c)
    )
    // Optional: api.post('/read', { phone: contact.phone }).catch(() => {})
  }, [])

  const fetchContacts = useCallback(async () => {
    try {
      const { data } = await api.get('/contacts')
      const contactList = Array.isArray(data) ? data : []
      setContacts(contactList)
      if (contactList.length > 0 && !selected) setSelected(contactList[0])
    } catch (err) {
      console.error('Contacts error', err)
    }
  }, [selected])

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) { router.push('/login'); return }
    setIsAuthed(true)
    fetchContacts()
  }, [router, fetchContacts])

  useEffect(() => {
    const phone = selected?.phone
    if (!phone) return

    let alive = true
    let retry = 0
    let reconnectTimer: NodeJS.Timeout | null = null

    setMessages([])
    setConnectionState('connecting')
    setIsTyping(false)
    setLastSeen(undefined)

    const loadMessages = async () => {
      try {
        const { data } = await api.get('/messages', { params: { phone } })
        if (!alive) return
        const msgs = Array.isArray(data) ? data : data?.messages || []
        setMessages(msgs)
        setTimeout(() => scrollToBottom(true), 100)
      } catch (err) {
        console.error('Messages error', err)
      }
    }

    loadMessages()

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://nexsai-production.up.railway.app'

    const connectWS = () => {
      if (!alive) return

      // ✅ पुराना socket बंद करें पहले
      if (socketRef.current) {
        socketRef.current.onclose = null
        socketRef.current.close()
      }

      const socket = new WebSocket(`${WS_URL}/ws/${phone}`)
      socketRef.current = socket

      socket.onopen = () => {
        console.log('WS Connected')
        setConnectionState('online')
        retry = 0 // ✅ success पर retry reset
      }

      socket.onerror = () => {
        console.log('WS Error')
        setConnectionState('error')
        socket.close() // ✅ onclose trigger होगा → reconnect loop चलेगा
      }

      socket.onclose = () => {
        console.log('WS Closed')
        if (!alive) return

        // ✅ flicker fix — सिर्फ तभी offline दिखाएं जब actually बंद हो
        if (socket.readyState !== WebSocket.OPEN) {
          setConnectionState('offline')
          setLastSeen(new Date().toISOString())
        }

        // ✅ Exponential backoff: 3s → 6s → 9s ... max 15s
        retry++
        const delay = Math.min(3000 * retry, 15000)
        console.log(`Reconnecting in ${delay}ms (attempt ${retry})`)
        reconnectTimer = setTimeout(() => connectWS(), delay)
      }

      socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data)
          // 🔥 ignore heartbeat ping
          if (data.type === "ping") return
          // ✅ Race condition — दूसरे contact का message ignore
          if (data.phone && data.phone !== phone) return

          if (data.type === 'typing') {
            setIsTyping(true)
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
            typingTimerRef.current = setTimeout(() => setIsTyping(false), 3000)
            return
          }

          if (data.type === 'typing_stop') { setIsTyping(false); return }

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

          setMessages(prev => {
            const tempIndex = prev.findIndex(
              m => String(m.id).startsWith('temp-') &&
                m.content === data.content && m.sender === data.sender
            )
            if (tempIndex !== -1) {
              const updated = [...prev]
              updated[tempIndex] = data
              return updated
            }
            if (prev.some(m => String(m.id) === String(data.id))) return prev
            return [...prev, data]
          })

          setIsTyping(false)
          if (data.sender === 'customer') updateContactLocally(phone, data.content, true)
          scrollToBottom(false) // ✅ user scroll disturb नहीं होगा
        } catch (e) {
          console.error('WS parse error:', e)
        }
      }
    }

    connectWS()

    // ✅ Clean cleanup — ghost connections नहीं बनेंगी
    return () => {
      alive = false

      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)

      if (socketRef.current) {
        socketRef.current.onclose = null // ✅ reconnect loop रोकें
        socketRef.current.close()
        socketRef.current = null
      }
    }
  }, [selected?.phone, scrollToBottom, updateContactLocally])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = async () => {
    if (!input.trim() || !selected) return

    const tempId = `temp-${Date.now()}`
    const content = input.trim()

    const tempMsg: Message = {
      id: tempId,
      content,
      sender: 'agent',
      timestamp: new Date().toISOString(),
      is_read: false,
      status: 'sending'
    }

    setMessages(prev => [...prev, tempMsg])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    scrollToBottom(true)

    try {
      const { data } = await api.post('/send', { phone: selected.phone, message: content })
      setMessages(prev =>
        prev.map(m => m.id === tempId
          ? { ...m, id: data?.id || tempId, status: 'sent', is_read: false }
          : m
        )
      )
      updateContactLocally(selected.phone, content, false)
    } catch (err) {
      console.error('Send failed', err)
      setMessages(prev => prev.filter(m => m.id !== tempId))
    }
  }

  if (!isAuthed) return null

  const filteredContacts = contacts.filter((c) =>
    (c.name || c.phone).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-screen flex bg-[#111b21] text-white overflow-hidden" style={{ fontFamily: 'Nunito, sans-serif' }}>

      {/* SIDEBAR */}
      <aside className="w-[360px] min-w-[300px] flex flex-col border-r border-[#2a3942] bg-[#202c33] z-20">
        <header className="flex items-center justify-between px-4 py-2.5 bg-[#202c33] border-b border-[#2a3942]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25d366] to-[#128c7e] flex items-center justify-center font-bold text-white shadow-lg">N</div>
            <span className="text-lg font-bold text-[#e9edef]">NexusAI</span>
          </div>
          <div className={`w-2 h-2 rounded-full transition-colors ${
            connectionState === 'online'  ? 'bg-[#00a884]' :
            connectionState === 'error'   ? 'bg-red-400' :
            connectionState === 'offline' ? 'bg-gray-400' : 'bg-yellow-400'
          }`} />
        </header>

        <div className="px-3 py-2">
          <div className="flex items-center gap-2 bg-[#2a3942] rounded-lg px-3 py-1.5 border border-transparent focus-within:border-[#00a884]/50">
            <svg width="16" height="16" fill="none" stroke="#8696a0" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#8696a0]"
              placeholder="Search or start new chat"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredContacts.length === 0 ? (
            <p className="text-center text-[#8696a0] text-sm mt-10 opacity-50">No contacts found</p>
          ) : filteredContacts.map((c) => (
            <div
              key={c.id}
              onClick={() => selectContact(c)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[#2a3942]/30 transition-colors
                ${selected?.id === c.id ? 'bg-[#2a3942]' : 'hover:bg-[#2a3942]/50'}`}
            >
              <Avatar name={c.name || c.phone} size="w-12 h-12" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-[15px] truncate text-[#e9edef]">{c.name || c.phone}</span>
                  <span className="text-[11px] text-[#8696a0] shrink-0 ml-2">{c.last_seen ? formatTime(c.last_seen) : ''}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div className="text-[13px] text-[#8696a0] truncate">{c.last_message || 'Start chatting...'}</div>
                  <UnreadBadge count={c.unread_count} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* CHAT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0b141a] relative">
        {selected ? (
          <>
            <header className="flex items-center gap-3 px-4 py-2.5 bg-[#202c33] border-b border-[#2a3942] z-10 shadow-sm">
              <Avatar name={selected.name || selected.phone} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[15px] text-[#e9edef] truncate">{selected.name || selected.phone}</p>
                <ConnectionBadge state={connectionState} isTyping={isTyping} lastSeen={lastSeen} />
              </div>
            </header>

            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto custom-scrollbar relative"
            >
              <div
                className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
                style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundRepeat: 'repeat' }}
              />
              <div className="relative z-10 px-[7%] py-4 flex flex-col">
                {messages.map((m, i) => {
                  const prevMsg = messages[i - 1]
                  const showDate = !prevMsg ||
                    new Date(m.timestamp ?? '').toDateString() !== new Date(prevMsg.timestamp ?? '').toDateString()
                  return (
                    <React.Fragment key={m.id}>
                      {showDate && <DateSeparator timestamp={m.timestamp} />}
                      <MessageBubble msg={m} />
                    </React.Fragment>
                  )
                })}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} className="h-2" />
              </div>
            </div>

            <footer className="flex items-end gap-2 px-4 py-3 bg-[#202c33] border-t border-[#2a3942]">
              <div className="flex-1 flex items-center bg-[#2a3942] rounded-2xl px-4 py-1 gap-3 min-h-[46px]">
                <span className="text-xl cursor-pointer select-none">😊</span>
                <textarea
                  ref={textareaRef}
                  className="flex-1 bg-transparent outline-none text-[14.5px] resize-none py-2.5 max-h-32 overflow-y-auto custom-scrollbar placeholder:text-[#8696a0]"
                  placeholder="Type a message"
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (input.trim()) handleSendMessage()
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="w-12 h-12 rounded-full bg-[#00a884] flex items-center justify-center hover:bg-[#00c99e] active:scale-90 transition-all shadow-xl disabled:bg-[#3b4a54] disabled:cursor-not-allowed"
              >
                <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </footer>
          </>
        ) : (
          <EmptyState />
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