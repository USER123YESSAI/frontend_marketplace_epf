import { resolveMediaUrl } from '../../services/api';

export default function ProductImage({ src, alt = '', className, style, ...props }) {
  const resolved = resolveMediaUrl(src);

  if (!resolved) return null;

  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      {...props}
    />
  );
}
