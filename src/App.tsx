import { useState } from 'react'
import tw, { css, styled } from 'twin.macro'

import logo from './assets/logo.svg'
import './assets/App.css'
import CocoPreview from './Coco'

/* twin.macro styled component */
const RedText = tw.p`text-red-400`

/* emotion styled component wrapping twin.macro component */
const CodeRedText = styled(RedText)`
  code {
    ${tw`text-green-400`}
  }
`

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Hello Vite + React!</p>
        <p>
          <button type='button' onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates!
        </p>
        {/*mix of tw & css properties*/}
        <CodeRedText
          tw='font-bold'
          css={css`
            code {
              font-style: italic;
            }
          `}
        >
          This line uses all major features of <code>twin.macro</code>!
        </CodeRedText>
        <p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
          {' | '}
          <a
            className='App-link'
            href='https://vitejs.dev/guide/features.html'
            target='_blank'
            rel='noopener noreferrer'
          >
            Vite Docs
          </a>
        </p>
      </header>
      <CocoPreview />
    </div>
  )
}

export default App
