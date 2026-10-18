import type { ReactNode, SVGProps } from 'react'

export type SvgIconProps = Omit<
  SVGProps<SVGSVGElement>,
  'role' | 'aria-label' | 'aria-hidden' | 'focusable' | 'children'
> & {
  /**
   * What the icon says, when nothing else says it: the only content of a button, or the only
   * signal of a state. Leave it out for an icon beside visible text or inside a labelled control.
   */
  readonly label?: string
  readonly children: ReactNode
}

/**
 * An inline SVG icon that either has an accessible name (`role="img"` and `aria-label`) or is
 * hidden from assistive technology (`aria-hidden`, and `focusable="false"` for old Edge/IE), never
 * both and never neither. Every inline icon in this package goes through it, so the choice is one
 * prop at the call site instead of attributes repeated, or forgotten, on each <svg>.
 */
export function SvgIcon({ label, children, ...props }: SvgIconProps) {
  if (label) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" {...props} role="img" aria-label={label}>
        {children}
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}
