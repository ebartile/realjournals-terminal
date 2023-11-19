import { useSelector } from 'react-redux';
import { get } from 'lodash';

export function useTestimonials() {
  const { data, loading } = useSelector((state) => {
    return get(state, 'global.testimonials');
  });
  return { testimonials: data, loading };
}
