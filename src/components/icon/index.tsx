/**
 * 图标组件
 */
import cla from 'classnames'
type Props = {
  type: string
  className?: string
  onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}
function Icon({ type, className, onClick }: Props) {
  return (
    <svg
      onClick={onClick}
      className={cla('icon', className)}
      aria-hidden="true"
    >
      {/* 使用时，只需要将此处的 iconbtn_like_sel 替换为 icon 的名称即可*/}
      <use xlinkHref={`#${type}`}></use>
    </svg>
  )
}

export default Icon
