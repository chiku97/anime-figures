import { Mail, Phone, Clock, MessageSquare } from 'lucide-react';

const Instagram = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Contact = () => {
  return (
    <div className="min-h-screen bg-warm-white py-16 px-6 md:px-12 font-outfit text-left">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-sage/10 text-sage rounded-full">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-heading uppercase tracking-wider">
            Let's Connect
          </h1>
          <p className="text-sm text-secondary max-w-lg mx-auto">
            Have a question, feedback, or need assistance with your custom 3D design order? We are here to help!
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-sage/10 text-sage rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-heading text-sm uppercase tracking-wide">Email Us</h3>
            <a href="mailto:hello@formorastudio.com" className="text-xs text-accent hover:underline font-semibold break-all">
              hello@formorastudio.com
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-sage/10 text-sage rounded-lg">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-heading text-sm uppercase tracking-wide">WhatsApp</h3>
            <a href="https://wa.me/910000000000" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline font-semibold">
              +91-XXXXXXXXXX
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-2.5 bg-sage/10 text-sage rounded-lg">
              <Instagram className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-heading text-sm uppercase tracking-wide">Instagram</h3>
            <a href="https://instagram.com/_formora_studio" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline font-semibold">
              @_formora_studio
            </a>
          </div>
        </div>

        {/* Support Note */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center space-y-3 shadow-sm max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage bg-sage/10 px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" /> Response Time
          </div>
          <p className="text-sm text-body leading-relaxed">
            Our support team typically responds within <strong className="text-heading">24–48 business hours</strong>. Thank you for your patience!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
