import { permanentRedirect } from 'next/navigation';

export default function ReturnsPage() {
  permanentRedirect('/warranty');
}
