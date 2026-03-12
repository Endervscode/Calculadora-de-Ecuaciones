import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/solver', { replace: true });
  }, [navigate]);

  return null;
}
