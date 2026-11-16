import 'yet-another-react-lightbox/styles.css';

import { ChevronLeft, X } from 'lucide-react';
import YARL, { LightboxExternalProps } from 'yet-another-react-lightbox';

type Props = LightboxExternalProps;

const Lightbox = ({ render, ...props }: Props) => {
  return (
    <YARL
      render={{
        iconClose: () => <X size={24} className="text-white drop-shadow" />,
        iconPrev: () =>
          (props.slides?.length || 0) > 1 ? (
            <ChevronLeft size={32} className="text-white drop-shadow" />
          ) : null,
        iconNext: () =>
          (props.slides?.length || 0) > 1 ? (
            <ChevronLeft className="rotate-180 text-white drop-shadow" size={32} />
          ) : null,
        ...render,
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
      {...props}
    />
  );
};

export default Lightbox;
