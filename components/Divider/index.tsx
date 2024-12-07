'use client'

export const Divider = ({ animate = false }) => (
  <div
    style={{
      width: '150px',
      height: '2px',
      margin: '10px auto 10px',
      position: 'relative',
      backgroundColor: 'black',
      overflow: 'hidden'
    }}
  >
    {animate && (
      <div
        style={{
          position: 'absolute',
          width: '20px',
          height: '100%',
          backgroundColor: 'white',
          animation: 'moveWhiteLine 5s linear infinite',
        }}
      />
    )}
    <style jsx>{`
      @keyframes moveWhiteLine {
        0% {
          left: -20px;
        }
        25% {
          left: 150px;
        }
        50% {
          left: 150px;
        }
        75% {
          left: -20px;
        }
        100% {
          left: -20px;
        }
      }
    `}</style>
  </div>
)