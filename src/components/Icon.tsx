import type { ReactNode } from 'react';
import './Icon.css'

function Icon({ iconClass, children }: { iconClass: string; children: ReactNode }) {
  return (
    <div className='icon-line'><div className='icon'><div><i className={iconClass} /></div></div>{children}</div>
  )
}

export default Icon
