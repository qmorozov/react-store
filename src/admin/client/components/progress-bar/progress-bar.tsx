import NProgress from 'nprogress';
import { useEffect, useState } from 'react';
import StyledProgressBar from './styles';
import { usePathname } from '../../routes/hooks/use-pathname';

export default function ProgressBar() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!visible) {
      NProgress.start();
      setVisible(true);
    }

    if (visible) {
      NProgress.done();
      setVisible(false);
    }

    if (!visible && mounted) {
      setVisible(false);
      NProgress.done();
    }

    return () => {
      NProgress.done();
    };
  }, [pathname, mounted]);

  if (!mounted) {
    return null;
  }

  return <StyledProgressBar />;
}
