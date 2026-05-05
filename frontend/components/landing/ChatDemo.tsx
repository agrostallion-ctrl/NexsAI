const MESSAGES = [
  {
    out: false,
    text:
      'Hi, is the product available? Please send price details.'
  },
  {
    out: true,
    text:
      'Yes! The product is available. Pricing and catalog have been shared on WhatsApp.'
  },
  {
    out: false,
    text:
      'Have to place the order.'
  },
  {
    out: true,
    text:
      '✅ Order confirmed! Payment link sent.'
  },
]

export default function ChatDemo() {
  return (
    <div className="nx-chat-demo">
      {MESSAGES.map(
        (message) => (
          <div
            key={message.text}
            className={`nx-chat-msg${
              message.out
                ? ' nx-chat-msg--out'
                : ''
            }`}
          >
            <div
              className={`nx-bubble${
                message.out
                  ? ' nx-bubble--out'
                  : ' nx-bubble--in'
              }`}
            >
              {message.text}
            </div>
          </div>
        )
      )}
    </div>
  )
}