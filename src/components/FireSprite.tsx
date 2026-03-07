export function FireSprite() {
  return (
    <div className="dhuni-fire" aria-hidden="true">
      <span className="dhuni-fire__aura" />
      <span className="dhuni-fire__groundlight" />

      <div className="dhuni-fire__pit">
        <span className="pit-stone s1" />
        <span className="pit-stone s2" />
        <span className="pit-stone s3" />
        <span className="pit-stone s4" />
        <span className="pit-stone s5" />
      </div>

      <div className="dhuni-fire__coals">
        <span className="coal c1" />
        <span className="coal c2" />
        <span className="coal c3" />
        <span className="coal c4" />
      </div>

      <div className="dhuni-fire__flames">
        <span className="flame flame--back" />
        <span className="flame flame--mid" />
        <span className="flame flame--front" />
        <span className="flame-pixel fp1" />
        <span className="flame-pixel fp2" />
        <span className="flame-pixel fp3" />
        <span className="flame-pixel fp4" />
      </div>

      <span className="dhuni-fire__ember e1" />
      <span className="dhuni-fire__ember e2" />
      <span className="dhuni-fire__ember e3" />
      <span className="dhuni-fire__ember e4" />
    </div>
  );
}
