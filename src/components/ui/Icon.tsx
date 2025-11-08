import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  /** Boxicons adını daxil edin, məsələn: 'bx-user' və ya 'bxs-user' (solid) */
  name: string;
}

/**
 * Boxicons dəstindən bir ikonu render edir.
 * @param name - İkonun tam adı (məsələn, 'bxs-lock-open').
 * @param className - Əlavə Tailwind sinifləri.
 */
const Icon = ({ name, className, ...props }: IconProps) => {
  return <i className={`bx ${name} ${className}`} {...props} />;
};

export { Icon };
