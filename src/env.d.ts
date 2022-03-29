/// <reference types="vite/client" />

import 'twin.macro'
import { css as cssImport } from '@emotion/react'
import { CSSInterpolation } from '@emotion/serialize'
import styledImport from '@emotion/styled'

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport
  const css: typeof cssImport
}

declare module 'react' {
  // The css prop
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSInterpolation
    tw?: string
  }
  // The inline svg css prop
  interface SVGProps<T> extends SVGProps<SVGSVGElement> {
    css?: CSSInterpolation
    tw?: string
  }
}

// https://github.com/microsoft/onnxruntime-web-demo/issues/15
// workaround: use external script version & include types into global namespace
import 'onnxruntime-web'
declare global {
  export * as ort from 'onnxruntime-web'
}
