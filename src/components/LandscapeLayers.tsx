export function LandscapeLayers() {
  return (
    <>
      <div className="landscape__sky" aria-hidden="true" />
      <div className="landscape__atmosphere" aria-hidden="true" />

      <div className="landscape__horizon landscape__horizon--far" aria-hidden="true">
        <span className="ridge ridge--a" />
        <span className="ridge ridge--b" />
        <span className="ridge ridge--c" />
      </div>

      <div className="landscape__horizon landscape__horizon--mid" aria-hidden="true">
        <span className="ridge ridge--d" />
        <span className="ridge ridge--e" />
        <span className="ridge ridge--f" />
        <span className="tree-line tree-line--left" />
        <span className="tree-line tree-line--right" />
      </div>

      <div className="landscape__cloudbank" aria-hidden="true">
        <span className="cloud cloud--1" />
        <span className="cloud cloud--2" />
        <span className="cloud cloud--3" />
      </div>

      <div className="landscape__terrain" aria-hidden="true">
        <span className="terrain-contour contour--a" />
        <span className="terrain-contour contour--b" />
        <span className="terrain-contour contour--c" />
        <span className="terrain-rock rock--a" />
        <span className="terrain-rock rock--b" />
        <span className="terrain-rock rock--c" />
      </div>

      <div className="landscape__moisture" aria-hidden="true" />

      <div className="landscape__weather" aria-hidden="true">
        <span className="weather weather--1" />
        <span className="weather weather--2" />
        <span className="weather weather--3" />
        <span className="weather weather--4" />
        <span className="weather weather--5" />
      </div>

      <div className="landscape__foreground" aria-hidden="true">
        <span className="foreground-silhouette fg--left" />
        <span className="foreground-silhouette fg--center" />
        <span className="foreground-silhouette fg--right" />
      </div>
    </>
  );
}
