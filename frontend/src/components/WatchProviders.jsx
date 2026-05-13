import { useEffect, useState } from "react";
import { getWatchProviders } from "../services/api";

const LOGO_BASE = "https://image.tmdb.org/t/p/w45";

function ProviderLogo({ provider }) {
  return (
    <a href="#" title={provider.provider_name} className="provider-logo-wrap">
      <img
        src={`${LOGO_BASE}${provider.logo_path}`}
        alt={provider.provider_name}
        className="provider-logo"
        title={provider.provider_name}
      />
    </a>
  );
}

function ProviderRow({ label, icon, providers }) {
  if (!providers || providers.length === 0) return null;
  return (
    <div className="provider-row">
      <span className="provider-row-label">
        {icon} {label}
      </span>
      <div className="provider-logos">
        {providers.map((p) => (
          <ProviderLogo key={p.provider_id} provider={p} />
        ))}
      </div>
    </div>
  );
}

export default function WatchProviders({ tmdbId, mediaType = "movie" }) {
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!tmdbId) return;
    getWatchProviders(tmdbId, mediaType)
      .then((res) => {
        // Collect all unique providers across all regions
        const allResults = res.data;
        const seen = { flatrate: {}, rent: {}, buy: {} };

        Object.values(allResults).forEach((country) => {
          ["flatrate", "rent", "buy"].forEach((type) => {
            (country[type] || []).forEach((p) => {
              if (!seen[type][p.provider_id]) {
                seen[type][p.provider_id] = p;
              }
            });
          });
        });

        // Sort by display_priority
        const sort = (obj) =>
          Object.values(obj).sort(
            (a, b) => a.display_priority - b.display_priority,
          );

        setProviders({
          flatrate: sort(seen.flatrate).slice(0, 12),
          rent: sort(seen.rent).slice(0, 8),
          buy: sort(seen.buy).slice(0, 8),
        });
      })
      .catch(() => setProviders(null))
      .finally(() => setLoading(false));
  }, [tmdbId, mediaType]);

  const hasAny =
    providers &&
    (providers.flatrate.length > 0 ||
      providers.rent.length > 0 ||
      providers.buy.length > 0);

  if (loading)
    return (
      <div className="watch-providers-wrap">
        <div className="wp-loading">Loading providers...</div>
      </div>
    );

  if (!hasAny)
    return (
      <div className="watch-providers-wrap">
        <p className="wp-empty">No streaming providers found.</p>
      </div>
    );

  return (
    <div className="watch-providers-wrap">
      <button className="wp-toggle" onClick={() => setExpanded((v) => !v)}>
        🎬 Where to Watch {expanded ? "▲" : "▼"}
      </button>

      {expanded && (
        <div className="wp-body">
          <ProviderRow
            label="Stream"
            icon="🟢"
            providers={providers.flatrate}
          />
          <ProviderRow label="Rent" icon="🟡" providers={providers.rent} />
          <ProviderRow label="Buy" icon="🔴" providers={providers.buy} />
          <p className="wp-credit">Powered by JustWatch via TMDB</p>
        </div>
      )}
    </div>
  );
}
