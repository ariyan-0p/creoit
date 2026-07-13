// Liquid-glass primitives — based on https://codepen.io/wprod/pen/raVpwJL
// 4-layer stack: filter (backdrop blur + SVG displacement) / overlay (tint) /
// specular (rim highlight) / content. Drop <LensFilterDefs /> once at the root.

export function Glass({ as: Tag = 'div', className = '', shape = 'card', children, ...rest }) {
  return (
    <Tag className={`glass-container glass-container--${shape} ${className}`} {...rest}>
      <div className="glass-filter" />
      <div className="glass-overlay" />
      <div className="glass-specular" />
      <div className="glass-content">{children}</div>
    </Tag>
  )
}

export function LensFilterDefs() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', width: 0, height: 0 }}
      aria-hidden
    >
      <defs>
        <filter id="lensFilter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feComponentTransfer in="SourceAlpha" result="alpha">
            <feFuncA type="identity" />
          </feComponentTransfer>
          <feGaussianBlur in="alpha" stdDeviation="50" result="blur" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blur"
            scale="50"
            xChannelSelector="A"
            yChannelSelector="A"
          />
        </filter>
      </defs>
    </svg>
  )
}
