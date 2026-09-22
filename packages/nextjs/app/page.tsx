import Image from "next/image";

export default function Home() {
  return (
    <div className="flex grow">
      <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <section className="hero rounded-2xl hedera-gradient text-white shadow-lg overflow-hidden">
          <div className="hero-content w-full flex-col md:flex-row items-start md:items-center justify-between gap-6 py-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-3">
                Scaffold-HBAR Template
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight m-0">Proof Anchor</h1>
              <p className="text-white/90 mt-4 mb-0 max-w-2xl text-lg">
                A reusable Hedera architecture for artifact integrity, decentralized retrieval, consensus anchoring, and
                independent verification.
              </p>
            </div>

            <Image
              src="/Hedera-Icon-White.svg"
              alt="Hedera"
              width={72}
              height={72}
              className="hidden sm:block opacity-90"
            />
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4 mt-8" aria-label="Proof Anchor architecture">
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Artifact integrity</h2>
              <p className="text-base-content/70">
                Exact artifact bytes are identified independently from their storage representation.
              </p>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Hedera consensus</h2>
              <p className="text-base-content/70">
                Hedera Consensus Service provides the durable consensus boundary for accepted proof records.
              </p>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Decentralized retrieval</h2>
              <p className="text-base-content/70">
                Content-addressed storage remains separate from canonical artifact identity.
              </p>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Independent verification</h2>
              <p className="text-base-content/70">
                Verification will reproduce evidence rather than trust the original creation session.
              </p>
            </div>
          </div>
        </section>

        <div className="alert mt-8 border border-base-300 bg-base-100">
          <span>
            Repository foundation only. Protocol behavior is introduced in later bounded phases and is not simulated
            here.
          </span>
        </div>
      </div>
    </div>
  );
}
