import banner from '../assets/banner.png'
import './TitleBanner.css'

export function TitleBanner() {
  return (
    <header className="tree-banner">
      <img className="tree-banner__frame" src={banner} alt="" draggable={false} />
      <div className="tree-banner__plate">
        <h1 className="tree-banner__title">Family Tree</h1>
      </div>
    </header>
  )
}
